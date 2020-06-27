# 吴智翀 | Part2模块一

## 简答题

### 1. 谈谈你对工程化的初步认识，结合你之前遇到过的问题说出三个以上工程化能够解决问题或者带来的价值。



前端工程化的目标本质上是为了提高效率、降低成本、解放生产力。通过制定或遵循以一定的标准和规范，借助工具来解决前端开发或前后端协作过程的一些问题，都属于前端工程化的范畴。

创建项目、编码、测试、提交、部署，前端工程化的身影贯穿着整个开发流程。



1. 创建项目，通过前端脚手架可以快速搭建好项目目录结构、创建好文件模板、选择好所需的一些工具或模块，让项目能够快速地启动和开始开发，大大提高效率。
2. 编码阶段通过ESLint工具 可以规范代码风格和一些语法规则，能让整个团队的代码风格都接近和统一，还能让个人摒弃掉一些不好的编码习惯。
3. 编码阶段 通过webpack-dev-server、browserSync等工具开启热更新，可以极大地提高开发效率和开发体验。
4. 提交、部署阶段，通过travisCI 、 githubAction等工具，快速地持续集成，可以减少很多重复的工作，还能提高部署效率。



### 2. 你认为脚手架除了为我们创建项目结构，还有什么更深的意义？

脚手架在初期阶段就约定好一些规范，包括开发模式、所需工具配置、一些基础代码模板、模块依赖，可以降低框架或工具的学习、使用成本，让一些业务开发人员可以不用了解其中的原理，开箱即用，然后可以专注于自己的业务逻辑开发中。



## 编程题

### 1. 概述脚手架实现的过程，并使用NodeJS完成一个自定义的小型脚手架工具。

过程：启动后通过命令行询问用户一些预设问题，将用户回答结果结合一些模板文件生成项目结构。



可通过skr-cli -V查看版本号，通过skr-cli -A查看作者

skr-cli i 或 skr-cli init 初始化项目，输入页面名字 生成项目模板 包括一个html和一个css文件





### 2. 尝试使用Gulp完成项目的自动化构建

实现了gulp clean / gulp lint/ gulp serve / gulp start / gulp build

lint使用了eslint插件 使用命令后可fix代码

serve和start的区别是

serve启动的是中间过程temp目录的代码，会监听代码变化

start启动的是最后打包好的dist目录的代码，不会监听代码变化

build先 生成temp代码再生成dist代码



### 3. 使用Grunt完成项目的自动化构建

实现了grunt clean / grunt develop / grunt build

grunt develop就是开启browserSync服务器启动temp目录的代码

build就是 先生成temp中间代码 最后打包生成dist代码
