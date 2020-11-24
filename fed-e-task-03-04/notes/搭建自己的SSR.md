> **`vue-server-renderer`**

createRenderer() 创建实例 renderer

renderer.renderToString(vue实例app)





### 模板中使用外部数据

html模板body中写注释 <!--vue-ssr-outlet-->

代表要渲染的变量



{{{ meta }}} 不当成普通内容 而是当成标签渲染







# 构建配置



## 源码结构

==**源码架构图**==

![源码架构](/Users/superman285/Desktop/KKB&Lagou/SSR/源码架构.png)

### 目录结构

> ==**src/**==
>
> App.vue
>
> app.js  (同构应用通用启动入口)
>
> entry-client.js (客户端入口，$mount将app挂载到dom)
>
> entry-server (服务端入口，服务端路由、数据预取等逻辑)
>
>



## webpack配置

==webpack打包构建 支持同构==

### 安装依赖

###### 生产依赖

vue-server-renderer | cross-env(设置环境变量) | express



###### 开发依赖

webpack-merge | webpack-node-externals(排除node中模块) | ==rimraf(跨平台rm -rf工具)== 清除目录必备 好用

==friendly-errors-webpack-plugin(友好webpack错误提示)== 实用 下次项目使用

@babel/core | @babel/plugin-transform-runtime | @babel/preset-env babel-loader  babel相关

vue-loader | vue-template-compiler | file/css/url-loader   处理vue 各类文件



### webpack配置文件及打包命令

根据端区分打包配置

webpack.base.config.js 公共基础配置

webpack.client.config.js

webpack.server.config.js



💡注

- @babel/preset-env 和 @babel/plugin-transform-runtime(优雅语法转换后的代码) 作用不要混淆了

  https://www.cnblogs.com/zhansu/p/13339745.html



- webpack配置中的externals选项，不打包 node_modules 第三方包，而是保留require方式直接加载

  ```js
  const nodeExternals = require('webpack-node-externals')
  
  externals: [nodeExternals({
      // 白名单中资源依然正常打包
      allowlist: [/\.css$/]
  })]
  ```

- vue-server-renderer/server-plugin | vue-server-renderer/client-plugin 插件的作用

  分别是将服务端 | 客户端 的输出 构建为单个JSON文件

  文件名为 vue-ssr-server-bundle.json  |  vue-ssr-client-manifest.json



- 客户端打包生成js文件和json配置文件，服务端打包只生成一个json文件





##### ==hydrate== 注水(激活)

将静态html 激活为 动态的(响应式的，能响应后续数据变化)



### 配置高效开发模式 (自动刷新 自动打包)

**`监视文件变化方式`**

原生：   --  fs.watch  |  fs.watchFile

第三方(推荐)： chokidar

```js
templtePath = path.resolve(__dirname, '../index.template.html')
chokidar.watch(templatePath).on('change', ()=>{
    console.log('模板发生了变化')
})
```



💡Tips

- require有缓存 (require引入方式)  |  fs.readFileSync 没缓存

- 频繁操作fs 读取磁盘 比较耗时 可改为 将数据放在内存中
  - 法一：使用memfs，基于内存的文件操作系统 webpack的 custom file systems配置(手动配置，稍繁琐)
  - 法二：webpack-dev-middleware 集成了这个功能 更少配置
    - 集成了watch和将数据存在内存整套方案 也不需要配置watch了
    - 输出到内存后，就不在磁盘上产生dist目录了
    - devMiddleware实例.fileSystem.readFileSync (api同node的fs一样 不过是从内存读取)
- clientDevMiddleware需要挂载到Express服务上(server.use),否则express.static访问不到内存中的dist打包后资源(访问的是磁盘上的)



#### 热更新

更新完自动刷新，不需要刷新浏览器，

配置: new webpack.HotModuleReplacementPlugin() 不需要引入第三方库



# 编写通用代码

## 服务器上无数据响应式

还要避免数据响应式，因为响应式改造会带来的性能损耗

## 组件生命周期钩子

> 没有动态更新，只有beforeCreate和created会在SSR过程中比调用，其他所有生命周期钩子，只会在客户端执行。



## 访问特定平台API

仅在浏览器或仅在服务器 可用的 API 使用时要注意

axios是同构的应用 两端都用相同API

浏览器可用API，通常方式是==在纯客户端生命周期钩子函数中惰性访问==



## 自定义指令

自定义指令直接操作dom，在SSR过程会报错，两种解决方案:

- 使用组件作为抽象机制，运行在虚拟DOM层级

- 不好转换成组件，就在创建服务器renderer时使用directives属性配置 参数为vnode 虚拟节点

  即指令服务端版本





## 注意事项

- 路由模式，后端必须使用history模式



==Promise改造为async-await方式==

```js
export default context => {
return new Promise((resolve,reject)=>{
    const { app, router } = createApp()
    router.push(context.url)
    router.onReady(()=>{
        const matchedComponents = router.getMatchedComponents()
        if (!matchedComponents.length) {
            return reject({code: 404})
        }
        resolve(app)
    }, reject)
})
}

===> 改造后：
export default async context => {
    const { app, router } = createApp()
    router.push(context.url)
    await new Promise(router.onReady.bind(router))
    // 省去了一些匹配逻辑处理 因为前面已经处理了未匹配路由404
    // 写简单点就是 new Promise((resolve, reject)=>{router.onReady(resolve,reject)})
    return app
}

```



- 任何请求都应进入服务端路由(express路由) 不应设置为‘/’ 而是设置为 ‘*’



- 路由必须提前解析路由配置中的异步组件，才能正确地调用组件中可能存在的路由钩子。所以需要在onReady的回调中再执行$mount



- preload | prefetch 预加载，只是加载脚本，并不会去执行脚本内容





#### vue-meta [plugin]

> 第三方vue插件 不同页面 head内容管理 支持SSR



### 服务端渲染 created中的异步请求无效

```js
async created(){
    const {data} = await axios({
        method: "GET",
        url: 'https://cnodejs.org/api/v1/topics'
    })
    this.posts = data.data (响应式)
}
```

SSR只支持created和beforeCreate

`且`不会等待beforeCreate和created中的异步操作

`且`不支持响应式数据



### Vue SSR 特殊为服务端渲染提供的一个生命周期钩子

```js
seerverPrefetch() {
    // 发起 action 返回promise (dispatch 或者 mapActions)
    this.getPosts()
}
```

想办法把服务端渲染后填充到容器(store)的数据 同步到 客户端 让两端保持状态同步 防止前端数据丢失