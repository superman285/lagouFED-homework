> ### 特性1 ESM自动采用严格模式，忽略 ‘use strict’ (全局下this指向undefined)
>
> ### 特性2 每个ES Module 都是运行在单独的私有作用域中 (不同type module的script标签中变量不能互相访问)
>
> ### 特性3 ESM是通过 CORS的方式 请求外部JS模块的 (服务端需要支持cors)
>
> ### 特性4 ESM的script标签会延迟执行脚本 (相当于添加了defer属性 等待网页渲染完成再执行脚本，不会阻塞页面元素展示，若没有type属性或defer 会等脚本执行完再渲染后面的元素)



```js
// module.js
export {
	foo as default
}

import { default as newFoo } from './module.js'
```



💡 ==注意事项==

- 1️⃣ export {foo,bar} 的写法 并不意味着导出一个对象 , 同理 import {foo, bar} 也不意味着对象解构！这只是一种固定语法

  可以试试import {foo: newFoo} from ... 会报错



- 2️⃣ export 导出 ，import引入 的是值的引用(指向一样的地址)， 如果导出的值在那之后发生了变化 引入的对象其实也会发生变化



- 3️⃣ 暴露出来的成员是只读的，import引入的 值 是不可修改的

  ```js
  import {foo , bar} from './module.js'
  foo = 'tom'    // --> 会报错 只读 不允许修改!!
  ```


- 4️⃣ import引入时 不同于commonJS 不能省略.js后缀 (经过打包配置的话 可省略)



- 5️⃣ import引入文件 不能省略路径(相对路径./ 或 绝对路径 / (网站根目录开始)) 省略路径相当于去引入第三方模块

  引入第三方 例如 import Web3 from ‘web3’



- 6️⃣ import 可以引入一个url 例如cdn 需要该库cdn支持才可 一般后缀会为mjs/ esm.js/ esm.browser.js 之类

  ```js
  import chimeePlayer from "//lib.baomitu.com/chimee-player/1.4.6/chimee-player.esm.js"
  console.log(chimeePlayer)
  ```

  参考: https://75.team/post/75cdn-es-modul



- ==动态导入==普通import 静态导入只能位与顶层 无法嵌套在条件语句或函数中，动态导入则可以

  动态导入语法为`import('').then(module=>{})`

  ```js
  if(condition) {
      import('//lib.baomitu.com/chimee-player/1.4.6/chimee-player.esm.js').then(module=>{
  		console.log('dynamic import',module,module.default);
  	})
  }
  上面代码块中静态引入的 chimeePlayer 动态引入中可用 module.default 来使用
  ```



- ==同时导入 `命名成员` 和 `默认成员`的两种方式==

  ```js
  // module.js
  export const a = 123;
  export const b = 'sstr'
  
  export default 666; // 或 const c = 666; export default c; default后可以直接跟值
  
  // app.js
  
  // 写法一 🌰
  import c,{a,b,} from './module.js';
  console.log('a,b,c',a,b,c);
  // import 的 花括号的 逗号左侧是默认成员  花括号内是命名成员
  
  // 写法二 🌰
  import {a,b, default as c} from './module.js'
  console.log('a,b,c',a,b,c);
  // 这种写法更不容易记混
  
  ```


- ==冷门经典用法== 一个语句搞定导入和导出 简单方便

  ```js
  // module2.js
  export {default as aaa , a } from './module.js'
  // 相当于 
  import {default as aaa, a} from './module.js'
  export {aaa, a}
  
  // 引用
  import {a, aaa} from './module2.js'
  
  // 🈲使用
  export default from './module.js'  ❌ default得放在括号内
  
  ```


==导出全部==

```js
import * as module from './module.js'

console.log(module,module.foo)
```





### Polyfill  兼容ESModule 方法

- browser-es-module-loader.js
- 配合script标签的`nomodule`属性  加上nomodule属性后就只会在不支持ESM的浏览器上工作



> ==ESM in Node.js==

第三方模块大多不支持 提取的写法 import {camelCase} from ‘lodash’  ❌  除非特意做了兼容

Node原生模块支持提取写法 可使用命名导出 !!  import { writeFileSync } from ‘fs’ ✅





### babel基于插件机制，核心模块@babel/core并不会去转换代码，转换代码就要用到对应插件

preset-env是插件集合 集成了 最新的特性

babel可以让node 支持很多新特性 或者 node本身不支持的特性(例如esm)

babel-node用于运行代码 

babel-node --presets=@babel/preset-env

或者不用命令 直接在babelrc文件中 配置presets

preset是一组插件的集合 若不使用 则可用单独插件 然后再plugins字段中配置



> ##  ESModule   V.S.  CommonJS

###  ESModules中可以载入 使用CommonJS导出的模块

###  CommonJS中`不`可以载入 使用ESModules导出的模块

### CommonJS始终只会导出一个默认成员

### import 并不是 解构导出对象 它的 { } 不是解构语法！！



```js
// commonjsModule.js
exports.foo = 'common JS value'  
// 或
module.exports = {
    foo: 'common JS value'  
}

// es-module.mjs
import mod from './commonjsModule.js' ✅
// -> { foo: 'common JS value'   }
import {foo} from './commonjsModule.js' ❌
import {} 不是对象解构!!!!
    
node原生环境
ESM export导出的内容
commonJS 不允许载入 ESM 导出的内容
```



```js
commonJS中的
require / module / exports / __filename / __dirname 成员
在 ESModule中 
通通没有 🙅

但 可以自己造呀

// es-module.js
import.meta 很重要!!

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 当前文件绝对路径
console.log('filename',__filename)

// 当前文件所在目录
console.log('dirname',__dirname)


```



