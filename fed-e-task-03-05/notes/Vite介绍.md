## 关于Vite

- Vite是一个更轻、更快的web应用开发工具
- 基于ECMAScript标准的 ES Module 实现
- 配置 项目依赖简单 @vue/compiler-sfc | Vite
- 开发过程中省略了打包步骤，即时编译，按需编译



### 命令

- vite serve 启动
- vite build 打包(生产模式)



### HMR

- Vite HMR
  - 立即编译当前所修改的文件
- Webpack HMR
  - 会自动以这个文件为入口重新build一次，所有涉及到的依赖也会被重新加载一次



### `Vite` V.S. `vue-cli of Vue2` 开发时工作流程图



<font style="color:white;background:#F12F28;padding:3px 6px;font-weight:bold;line-height:28px">Vite</font>

![vite开发工作流程](/Users/superman285/Desktop/KKB&Lagou/Vue3·来咯/vite开发工作流程.png)



<font style="color:white;background:#F12F28;padding:3px 6px;font-weight:bold;line-height:28px">vue-cli of Vue2</font>

![vue2开发工作流程](/Users/superman285/Desktop/KKB&Lagou/Vue3·来咯/vue2开发工作流程.png)



### Build

- 命令 vite build 生成模式打包
- 底层使用rollup打包
- 代码切割采用原生的 Dynamic import 动态导入实现，打包结果只支持较新的现代浏览器



### 使用Webpack打包的两个原因

- 浏览器环境不支持模块化 (目前大部分现代浏览器已逐渐支持ESM)
- 零散过多的模块文件会产生大量HTTP请求 (HTTP2可以很好地解决该问题)



### Vite开箱即用

- TypeScript 内置支持
- less/sass/stylus/postcss 内置支持 (但需单独安装对应编译器)
- JSX
- WebAssembly



## 总结

> - **快速冷启动**
> - **模块热更新实时**
> - **按需编译**
> - **开箱即用 (减少复杂配置loader plugin)**

