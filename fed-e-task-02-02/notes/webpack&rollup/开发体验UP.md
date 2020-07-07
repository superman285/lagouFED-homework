> ### idea1. 以HTTP Server运行
>
> ### idea2. 自动编译 + 自动刷新
>
> ### idea3. 提供Source Map 支持 (更容易定位错误具体位置)
>
> ### idea4.



- 自动编译

  webpack --watch 监听文件变化 自动重新打包

- 自动刷新

  方式1：

  使用browser-sync (webpack写入磁盘，browser-sync再从磁盘读 效率低)

  方式2：

  webpack-dev-server 集成了自动编译 自动刷新 开启服务器 强大

  不是从磁盘读写，而是从内存中写读，非常快!! 



### dev-server

为devServer设置额外静态资源访问路径，因为开发环境中一般不会每次自动构建都重复复制大量静态资源(影响速度和效率)，所以要devServer可能读不到dist下的资源，需要额外指定能访问到资源的路径

```js
devServer: {
		contentBase: './public'
	},
```

> 会自动刷新浏览器，导致页面状态丢失，在开发阶段，并不是很好的方案
>
> 页面不刷新的前提下，模块内容也可以更新，那就更棒了👍！

开启热更新，两个方法

- 方法一:  启动参数 webpack-dev-server --hot

- 方法二:  配置

  ```js
  const webpack = require('webpack');
  
  module.exports = {
      devServer: {
      hot: true
  	},
      plugins: [
          new webpack.HotModuleReplacementPlugin()
      ]
  }
  
  ```



注意⚠️

CSS修改后 热更新有效，但修改JS后 浏览器还是做了自动刷新 没有热更新效果

样式文件的热更新开箱即用(因为style-loader做了样式热更新处理)，JS文件的不是开箱即用，需要做一些额外工作

通过框架脚手架(例如vue-cli / CRA)创建的项目 由于都遵循框架的规范 有一定规律可循，它们内部都集成好了HMR方案，所以开箱即用





```js
// 在主入口 main.js

// 第一个参数:依赖模块的路径，第二个参数:依赖路径更新后的处理函数
module.hot.accept('./editor',()=>{
    console.log('editor模块更新了，需要在这里手动处理热替换逻辑')
    // balabalabala 
})

```

添加这个处理后，修改JS不会再触发自动刷新了，若不添加，则JS修改还是会触发自动刷新



不同的业务逻辑，会有不同的处理方式，webpack也没办法提供通用的热替换方案，只能自己针对自己的项目手动处理

==editor处理demo==

```js
import background from './bg.png';
import ccreateEditor from './editor.js'

const editor = ccreateEditor();

const img = new Image();
img.src = background;

document.body.appendChild(editor);
document.body.appendChild(img);


// JS热替换逻辑 
let lastEditor = editor;
module.hot.accept('./editor',()=>{
    const oldValue = lastEditor.innerHTML;
    document.body.removeChild(lastEditor);
    const newEditor = createEditor();
    newEditor.innerHTML = oldValue;
    document.body.appendChild(newEditor);
    lastEdior = newEdior;
})

// 图片的热替换逻辑比较简单
module.hot.accept('./better.png',()=>{
    img.src = background;
    console.log(background);
})
```



## HMR的三个注意事项

### 1. devServer中配置hot:true , 若热替换逻辑代码发生错误, 会自动降级为自动刷新浏览器, 所以无法看到热替换错误位置, 解决方式是 

```js
devServer: {
    // hot: true
    hotOnly: true
}
```

### 2. module.hot 是 webpack.HotModuleReplacementPlugin()插件挂上的属性, 如果不开启插件, 是无法访问到module.hot属性的, 可以做一个处理

```js
if(module.hot) {
    module.hot.accept('./better.png',()=>{
    img.src = background;
    console.log(background);
	})
}
```

### 3. 不用担心热替换逻辑代码与业务无关, 会影响线上运行, 关闭HotModuleReplacementPlugin插件后, 热替换逻辑代码 打到bundle中就成了 if(false){} 到时一压缩 这个代码就没了





- 代理API 代理到本地开发服务器

  ```js
  devServer: {
      proxy: {
          '/api': {
              target: 'https://api.github.com',
              pathRewrite: {
              	'^/api': ''        
              },
  			changeOrigin: true
          }
          // 请求 http://localhost:8080/api/users 相当于请求
          // https://api.github.com/users
      }
  }
  ```


- Source Map 源代码地图 (映射 转换后的代码和源代码之间的关系)

  帮助开发者更容易调试和定位错误，对生产环境意义不是特别大

  //# sourceMappingURL = xxx.map



​	eval会运行在一个临时的虚拟机环境 所以在控制台看到右侧的来源是 VMxxx

​	可通过sourceURL改变所处环境路径的名称(表示) 实际还在虚拟机环境

```js
eval('console.log(123)');					// VM153:1 

eval('console.log(123) //# sourceURL=./foo/bar.js')				// ./foo/bar.js

```



> 两个子任务的用法 🐂

```js
module.exports = [
    {
        entry: './src/main1.js',
        output: {
            filename: 'a.js'
        }
    },
    {
        entry: './src/main2.js',
        output: {
            filename: 'b.js'
        }
    },
]
```

真正的多入口...



| devtool模式                  | 错误信息                                                     |
| ---------------------------- | ------------------------------------------------------------ |
| eval                         | 定位到错误文件                                               |
| eval-source-map              | 定位到错误文件，错误行和列 生成source-map，<br />行内嵌入source-map方式 类似inline-source-map |
| cheap-eval-source-map        | 定位到错误文件，错误行 生成source-map 没有列<br />看到的错误是加工转换后的代码(例如写的es6转成了es5的)<br />loader处理过后的代码 |
| cheap-module-eval-source-map | 定位到错误文件，错误行 生成source-map 没有列 <br />看到的出错误是手写的源码本身<br />loader出来前的代码 |
| cheap-source-map             | 没用eval方式执行模块代码，其他同cheap-eval-source-map        |
| cheap-module-source-map      | 没用eval方式执行模块代码，其他同cheap-module-eval-source-map |
| inline-source-map            | source-map文件不是以单独的物理文件形式存在(xxx.map)<br />而是以data-url的方式嵌入到了代码中 |
| hidden-source-map            | 生成了source-map，但是不在代码中引入hidden-source-map<br />一般第三方库可这么用，出现问题再手动引入或者其他方式<br />使用source-map，例如app响应头? |
| nosources-source-map         | 能看到错误出现位置行列信息，但是点进去看不到源代码<br />很有用!!!! 能保护我们的源代码不会被暴露 |
|                              |                                                              |
|                              |                                                              |
|                              |                                                              |
|                              |                                                              |



==SouceMap选择最佳实践==

### 开发环境：cheap-module-eval-source-map

- 定位到行信息就够了
- 代码经过loader转换后差异较大，所以选择有module的，能直接看到转换前源码错误位置
- 首次打包速度慢，但重新打包速度快，所以不会怎么影响开发体验

### 生产环境：none

- 会暴露源代码到生产环境，可能会被其他人复原源代码，有很大隐患
- 调试和找错是开发阶段的事情，而不是到生产环境再找错
- 如果实在要用，考虑使用nosources-source-map，不会直接暴露源码





## HMR 热更新





















