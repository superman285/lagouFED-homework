# Vue3.0

> - 源码组织方式变化 - 使用了monorepo方式
> - Composition API (90%兼容旧的Options API) 拆分和重用更方便
> - 性能大幅提升  重写响应式、重写虚拟dom、编译器优化
> - 开发工具Vite 开发阶段无需打包 更快



- `Performance`：性能更比Vue 2.0强。
- `Tree shaking support`：支持对无用模块的“剪枝”，实现按需打包
- `Composition API`：基于函数的组合式API
- `Fragment, Teleport, Suspense`：“碎片”，Teleport即Protal传送门，“悬念”
- `Better TypeScript support`：更优秀的Ts支持
- `Custom Renderer API`：暴露了自定义渲染API

## 源码组织方式

- 源码采用TS重写
- 项目结构管理方式 采用 Monorepo

packages下不同功能模块的包 单独发布



```js
packages |
    compiler-core/  平台无关编译器
	compiler-dom/ 浏览器下编译器
 	compiler-sfc/ 编译单文件组件 依赖于core和dom
    compilre-ssr/ 服务端渲染编译器 依赖于dom
    reactivity/ 数据响应式系统 可独立使用
	runtime-core/ 平台无关运行时
	runtime-dom/ 浏览器平台运行时 处理原生DOM API、事件等
	runtime-test/ 为测试编写的轻量运行时 
	server-renderer/ 服务端渲染
	shared/ vue内部使用的公共API
    size-check/ 私有包不发布NPM tree-shaking后检查包的大小
	template-explorer/ 浏览器运行的实时编译组件，输出编译函数
	vue/ 构建完整版的vue 依赖compiler和runtime
    global.d.ts 类型声明
```



## Vue3 不同构建版本

```js
packages/vue
	dist/
        
--- cjs (commonjs模块化方式)
vue.cjs.js	开发版
vue.cjs.prod.js	生产版 代码压缩

---global (有全局vue对象 )
vue.global.js 含编译器和运行时 开发版
vue.global.prod.js 含编译器和运行时 生产版
vue.runtime.global.js 只包含运行时的构建版本 开发版
vue.runtime.global.prod.js 只包含运行时 生产版

--browser (esmodule 浏览器的原生模块化方式)
vue.esm-browser.js    esmodule完整版 开发版
vue.esm-browser.prod.js
vue.runtime.esm-browser.js	esmodule运行时版本 开发版
vue.runtime.esm-broswser.prod.js

---bundler (未打包所有代码 需配合打包工具使用 ESM模块化方式 import导入了runtime-core)
vue.esm-bundler.js  完整版 导入了runtime和compiler
vue.runtime.esm-bundler.js runtime版 只导入了runtime 未导入编译器compiler

💡 脚手架创建的vue项目默认使用的是vue.runtime.esm-bundler.js vue的一个最小版本
项目开发完后打包只会打包使用到的代码 可以让项目体积更小


```



## Composition API

### RFC(Request For Comments)

https://github.com/vuejs/rfcs/tree/master/active-rfcs

(切换branch可以看别的提案)

例如最近讨论大火的 `ref-sugar` 和 `script-setup`

https://github.com/vuejs/rfcs/tree/ref-sugar

https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md 



可以到 https://github.com/vuejs/rfcs/issues

rfc的issues中 找感兴趣的提案



### Composition API RFC

https://composition-api.vuejs.org/zh/api.html#setup

https://composition-api.vuejs.org/





##### 💡 **vue3已经正式发布，最新API文档已经发布，见下**



Vue3 官方文档

https://v3.vuejs.org/guide/introduction.html#what-is-vue-js

Vue3 中文官方文档

https://v3.cn.vuejs.org/guide/introduction.html



> 设计动机

Options API开发复杂组件，同一个功能逻辑的代码可能会被拆分到不同选项中

例如分散到(data, methods, props)等选项中



举个🌰

```js
export default {
    data () {
        return {
            position: {
                x: 0,
                y: 0
            }
        }
    },
    created() {
        window.addEventListener('mousemove',this.handle)
    },
    destroyed() {
        window.addEventListener('mousemove',this.handle)
    },
    methods: {
        handle(e) {
            this.position.x = e.pageX
            this.positon.y = e.pageY
        }
    }
}
```



mixin的问题 命名冲突，数据来源不清晰甚至混乱



##### Composition API

- Vue3 新增API
- 一组基于函数(函数式)的API
- 可以更灵活地组织 组件或功能或模块 的逻辑



```js
// useMousePosition.js
import {reactive,omMounted,onUnmounted} from 'vue'

function useMousePosition() {
    const position = reactive({
        x: 0,
        y: 0
    })
    const update = e => {
        position.x = e.pageX
        position.y = e.pageY
    }
    onMounted(()=>{
        window.addEventListener('mousemove',update)
    })
    onUnmounted(()=>{
        window.addEventListener('mousemove',update)
    })
    return position
}

// componentA.vue
import {useMousePosition} from 'useMousePosition.js'

export default {
    setup () {
        const position = useMousePosition()
        return {
            position
        }
    }
}
```

将整个mouse功能提取到了一个模块文件中



避免 反复横跳

https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md



`优点概括`

避免选项式API的同一功能模块逻辑代码 分散在不同的选项中(例如data methods created computed等等)

可将同一功能模块的逻辑代码 提取到一个模块(甚至一个文件)中 方便管理组织 方便重用



## 性能提升

### 响应式系统升级

### 编译优化

### 源码体积优化



#### 响应式系统升级

- Vue2.x 响应式系统核心 defineProperty
  - 初始化时遍历data中所有成员，通过defineProperty将对象属性转换成getter和setter
  - 若data中属性是对象，还要递归处理每个子对象的属性，初始化时进行了处理，即使没使用也进行了处理

- Vue3 重写响应式系统 核心为Proxy
  - proxy性能优于 defineProperty，可以拦截更多操作
  - ==Proxy可以支持更多特殊数据结构的拦截，例如Map、Set，defineProperty是不支持的==
  - proxy不需要像vue2那般初始化时就遍历所有属性，若有多层属性嵌套，只有访问到那个属性时才会递归处理下一级属性，避免初始化时的性能浪费
  - 可以监听动态新增的属性(vue2监听不到)
  - 可以监听删除的属性(vue2监听不到)
  - 可以监听数组的索引和length属性(vue2监听不到)



#### 编译优化

- Vue2 中通过标记静态根节点，优化diff过程，但是静态节点也需要diff 这个过程未被优化

  Vue3重写虚拟DOM

- Vue3 中标记和提升所有静态节点，diff时只需要对比动态节点内容，静态节点不需要再diff
  - Fragments 不再需要唯一根节点
  - 静态提升(静态元素提升到了render函数外 上方)后续可直接重用 不需要重复创建
  - Patch flag 标记动态节点大大提升diff性能 
  - 缓存事件处理函数 减少不必要的更新操作 `cacheHandlers` (事件侦听器缓存)



Patch Flag补丁标记

- 动态节点：diff时可忽略静态节点，只追踪对比带有PatchFlag的动态节点
- 动态属性：diff时可忽略不会变化的静态属性，只关注PatchFlag标记的可能发生变化的动态属性



```js
Patch Flag
e.g.

1 /* TEXT */
9 /* TEXT, PROPS */,['id']
```





具体参考:

https://www.jianshu.com/p/d6125639f000



vue3在线编译器

https://vue-next-template-explorer.netlify.app/



#### 优化打包体积

- Vue3 移除了一些不常用API 如 inline-templage、filter(可通过method、computed来实现)等
- 对Tree-shaking支持更好 内部很多API都是按需引入的 使用啥引入啥 (runtime-core和reactivity默认会引入)





## Vite 打包构建工具

```html
💡利用了ES Module原理
通过下面方式加载模块
<script type="module" src="xxx.js"></script>
默认延迟加载(类似script标签的defer效果)
文档解析完成Dom树🌲创建完毕之后，DOMCContentLoaded事件之前执行脚本
```



`Vite` V.S. `vue-cli`

- Vite在开发模式下不需要打包即可直接运行(浏览器原生支持的ESM模块加载)
- vue-cli开发模式下也需要对项目打包才可运行



- Vite生产模式使用Rollup打包，rollup基于ESM方式打包，不需要babel将import转成require不需要那么多辅助函数，打包体积更小
- vue-cli使用Webpack进行打包



### Vite特点

- 快速冷启动(因为不需打包)
- 按需编译(项目大时更明显)
- 模块热更新



举个🌰

App.vue请求 ，Vite开启的web服务器 会劫持.vue请求 ，将.vue文件解析成js文件，将响应头的content-type设置为application/javascript

从App.vue?type=template导入render函数 (服务器做了特殊处理) 加载模块 就会向 App.vue?type=template发起请求

在请求`App.vue?type=template`中，服务器会通过vue的compiler-sfc模块把App.vue单文件组件编译成render函数，export导出render函数



**大致工作原理**：

使用浏览器原生支持的ESM模式加载模块，开发环境不会打包项目，会把所有模块请求都交给服务器处理；

Vite会拦截浏览器发送的请求，浏览器向服务器发送请求获取相应模块，Vite对浏览器不识别的模块进行处理；

例如.vue单文件组件 会在服务端通过 compiler-sfc模块对文件进行编译，并把编译结果返回给浏览器