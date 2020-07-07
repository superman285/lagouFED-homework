> ## **初衷**
>
> 做一个小而美的ESM高效打包器，充分利用ESM各项特性，构建出结构扁平、性能出众的第三方类库。
>
> 打包出来的代码非常简洁，没有太多多余代码(不像webpack有那么多辅助代码)。

并不是想和webpack做直接竞争，不支持HMR之类的高级功能特性



rollup打包默认开启了 treeshaking，config配置中直接支持ESM



`IIFE输出格式非常适合浏览器环境使用`

#### rollup命令 iife(或esm等)

```js
yarn rollup ./src/index.js --format iife --file dist/bundle.js
```





==rollup.config.js==

```js
export default {
    input: 'src/index.js',
    output: {
        file: 'dist/bundle.js',
        format: 'iife',
        // dir: 'dist'
    }
}

打包使用
yarn rollup --config      // 默认使用rollup.config.js
也可指定配置文件 例如
yarn rollup --config rollup.prod.config.js
```



`注意`

想直接通过模块名称导入第三方npm模块，需要安装rollup-plugin-node-resolve

rollup默认只能处理es module模块，使用不了普通版本的npm模块，所以用es版本npm包

```js
import resolve from 'rollup-plugin-node-resolve'

export default {
    plugins: [
        resolve()
    ]   
}

// index.js
import _ from 'lodash-es'
```



想支持导入CommonJS的模块(自己的或第三方npm的)，需要安装插件，但导入时还是用import方式

```js
import commonjs from 'rollup-plugin-commonjs'

export default {
    plugins: [
        commonjs()
    ]
}

// index.js
import cjs from './cjs-module'


// cjs-module.js
module.exports = {
    foo: 'bar'
}
```



### 支持动态导入(import()) 后 自动做代码拆分 code splitting (动态导入 - 代码分割)

但iife和UMD导出模式 不支持代码拆分

AMD标准 支持浏览器



### 多页打包

entry配置为对象，会自动拆分出公共模块，所以输出模式不能使用iife，可用amd



==加载AMD模式打包生成js，不能直接引入到页面上， 而是需要通过实现AMD标准的库去加载，例如requirejs==

正确的amd方式打包后文件引入页面的写法🔽

```html
<body>
    <script src="https://unpkg.ccom/requirejs@w.3.6/require.js" data-main="foo.js"></script>
</body>
```



> ## 特点
>
> **`优点`**
>
> ### 输出结果更加扁平
>
> ### 自动移除未引用代码(无需配置的tree-shaking)
>
> ### 打包结果接近手写代码，完全可读
>
> **`缺点`**
>
> ### 加载非ESM标准的第三方模块比较复杂
>
> ### 模块最终都被打包到一个函数中，无法实现HMR模块热替换
>
> ### 浏览器环境中，代码拆分功能要以AMD方式输出，页面引入需要依赖AMD库
>
> ---
>
> #### 开发普通web应用时一般不选择rollup，而选择webpack
>
> #### 开发框架或类库时，可以选择`rollup`

webpack中

optimization对象中的concatenateModules属性开启，也可以让代码更扁平，更精简