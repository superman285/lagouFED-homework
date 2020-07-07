> ==不同环境创建不同配置== 
>
> - 方案一: 配置文件根据环境不同导出不同配置 (判断)
> - 方案二: 一个环境对应一个配置文件(所有配置文件都已创建好)

```js
module.exports = (env,argv)=>{
    
    const config = {
        ...
    };
                    
    if(env === 'production') {
    	config.mode = 'production';
        config.devtool = false;
        config.plugins = [
        	...config.plugins,
       		new CleanWebpackPlugin(),
        	new CopyWebpacckPlugin({patterns:['public']})
        ]
    }                
                             
    return config;
}
```

适用于中小型项目

打包时使用 `webpack --env production` 即可



```js
// 三个配置文件，一个公用 webpack.common.js 一个生产prod 一个开发dev

// webpack.prod.js

const common = require('./webpack.common')
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge')

module.exports = Object.assign({}, common, {
    mode: 'production',
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpacckPlugin({patterns:['public']})
    ]
})

🔽

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpacckPlugin({patterns:['public']})
    ]
})

// 但这么写 plugins会被覆盖而不是合并，这时就要用到webpack-merge了

```

除了中小型项目，也适用于大型项目

打包时使用`webpack --config webpack.prod.js`







## DefinePlugin -- 为代码注入全局成员

webpack.DefinePlugin({  })

默认生产环境就会启用DefinePlugin，`process.env.NODE_ENV` 判断当前运行环境

```js
new webpack.DefinePlugin({
    API_BASE_URL: ''   // --> 传进来的其实是一个JS代码段，所以此处传进来的不能是 'http://xxx'
    '"https://xxx.api/"'
    或  JSON.stringify('https://xxx.api/')  值转换为标示值的代码片段
    API_URL: JSON.stringify('https://xxx.api/') ✅
})
```





## Tree Shaking (生产模式下自动开启)

> tree-shaking 前提是必须使用ES Modules来组织我们的代码

移除掉dead-code 未引用代码



@babel/preset-env 老一点的版本是会将ESM转换为CommonJS方式的

但最新的 会增加判断 若支持ESM 则不会转换为CommonJS 所以仍然支持tree-shaking



```js
module.exports = {
    optimization: {
        usedExports: true, // 输出结果中只导出外部使用的成员!!
        minimize: true,
        concatenateModules: true  // 尽可能将所有模块合并输出到一个函数中(提升效率,减少体积)
    }
}

usedExports 负责标记「枯树叶」
minimize 负责「摇掉」他们
concatenateModules ---> Scope Hoisting 
```



忽略最新@babel/preset-env 对ESM的判断处理，强制开启转换为CommonJS的配置

`此处是数组套数组的配置，极易出错`

```js
module: {
    rules: [
        {
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/preset-env',{modules: 'commonjs'}]
                        // 若不确定当前版本的babel/preset-env是否会开启将ESM转为commonjs
                `那就设置 modules:false 这样就确保preset-env不会开启ESM转换插件,tree-shaking可正常生效`
                    ]
                }
            }
        }
    ]
}
```







## sideEffects副作用  webpack4

> 模块执行时除了导出成员 之外 是否还做了其他的事情 (例如给原型挂载点啥，给某个对象挂载点啥)
>
> 所以一般package.json 的 sideEffects 声明小心又小心，你可能某些地方有副作用代码
>
> 载入的css代码 也属于副作用代码

```js
optimization: {
    sideEffects: true,  // 生产环境默认开启 开启功能
    // 检查package.json中的sideEffects属性值    
}
    
    
// package.json
"sideEffects": false 
`标识该项目没有副作用` (所有文件)
    
"sideEffects":[
	"./srcc/extend.js",
    "*.css"
]

`这样配置即extend.js和css有副作用但仍会被打包，其他所有文件都无副作用，没导出的就不打包了`
```





### 代码分割 code splitting

- 多入口打包
- 动态导入



常规: 一个页面对应额一个打包入口，多页面需进行以下配置

==entry配置为对象，多入口==

==output的filename配置加上[name]==

==HtmlWebpackPlugin配置对应chunks数组==

```js
entry: {
    index: './src/index.js',
    album: './src/album.js'    
},
output: {
	filename: '[name].bundle.js'        
},
plugins:[
    new HtmlWebpackPlugin({
        title: 'Multi Entry Index',
        template: './src/index.html',
        filename: 'index.html',
        chunks: ['index']
    }),
    new HtmlWebpackPlugin({
        title: 'Multi Entry Album',
        template: './src/album.html',
        filename: 'album.html',
        chunks: ['album']
    }),
]
```

注意⚠️

HtmlWebpackPlugin插件 默认会输出一个`自动注入所有打包结果`的html，所以需要做一些配置，才能生成只注入对应页面JS的对应html



#### 提取公共模块

多入口打包，这样配置可提取出多个入口公共使用的模块部分

```js
module.exports = {
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    }
}
```



#### 动态导入 | 按需加载

`需要用到某个模块时，再去加载` -- 动态导入的模块都会被自动分包

ESM规范动态导入语法

```js
import('./posts/posts').then(({default: posts}) => {
    mainElement.appendChild(posts());
})

// 魔法注释
import(/* webpackChunkName: 'posts' */'./posts/posts').then(({default: posts}) => {
    mainElement.appendChild(posts());
})

还有个特点是，可以两个组件使用同一个魔法注释名，这样他们就被被打到同一个包
可根据这个特点灵活分包!!
   
import(/* webpackChunkName: 'posts' */'./album/album').then(({default: album}) => {
    mainElement.appendChild(album());
})
```

动态导入的默认名称只是一个序号数字

可通过魔法注释来给这些bundle进行命名



##### CSS模块按需加载 可借助MiniCssExtractPlugin

提取CSS到单个文件

`style-loader`是将样式通过style标签注入页面，而MiniCssExtractPlugin是将css提取到单个文件，然后页面通过link方式引入

用MiniCssExtractPlugin.loader 取代 style-loader

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimiza-css-assets-webpack-plugin');

const TerserWebpackPlugin = require('terser-webpack-plugin');


module.exports = {
    optimization: {
        minimizer: [
            new OptimizeCssAssetsWebpackPlugin(),
            new TerserWebpackPlugin
        ]
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    // 'style-loader'  //将样式通过 style标签 注入页面
                    MiniCssExtractPlugin.loader, // 样式提取到单个文件
                    'css-loader'
                ]
            }
        ]
    },
    plugins:[
        new MiniCssExtractPlugin(),
    	// new OptimizeCssAssetsWebpackPlugin()
    ]
}
```

可用 OptiimizeCssAssetsWebpackPlugin 压缩css文件



==最佳实践==

当CSS文件提取出来大于`150kb`时，提取成单个文件效果可能才优于 style-loader的嵌入页面的方式

当css文件较小时，单独提取成文件，多一次请求反而可能会降低效率

- 压缩：CSS压缩或JS压缩 一般是在生产环境下需要，如果配置在plugins中 任何环境都会压缩，所以一般配置在optimization的minimizer中由minimize来管理(true就调用minimizer数组中插件)，上图就是最佳实践 



> **`易忽略点`**
>
> ##### 配置在plugins中的插件，是在任何打包模式下(开发或生产或none)都会生效的，所以一般压缩类的插件(css或js)可配置在`optimization`属性的`minimizer`数组中，这样就会根据optimization的minimize属性去统一开启或关闭，minimize属性在生产模式下是默认开启的，所以minimizer中配置的插件都会生效
>
> ##### 一旦开启了minimize，压缩插件会以minimizer数组中插件为准，所以默认的webpack压缩插件(TerserPlugin)都会被minimizer数组覆盖掉，若配置了minimizer数组而其中又不开启TerserPlugin那么 生产打包反而会导致JS不被压缩，所以此时需要在其中手动补充回TerserPlugin，正确配置见上图代码段，在minimizer中配置两个压缩插件
>
> ##### *特殊需求:* 希望开发模式打包，但是代码又想压缩，尝试把TerserPlugin移到 Plugins中看效果 😶
>
> 一般来说:  压缩代码的需求 都是在生产环境才需要的 所以一般都放在minimizer中管理



### 静态资源缓存

缓存失效时间过短 相当于没缓存 很快又要重新请求

缓存过期时间过长 更新部署后无法及时更新

`=> 生产模式下文件名带上Hash,就可以把服务端缓存设置得时间很长,不用担心更新不生效`

```js
module.exports = {
    [hash] -- 项目级别的 任意文件改变 都会变化
    [chunkhash] -- chunk内容变了 chunk变 其他chunk文件名不变
    [contenthash] -- 文件级别的hash 不同的文件就有不同的hash (文件变了文件名才会变) - 处理缓存最佳实践
    [contenthash:8]  -- 最佳实践
}
```

