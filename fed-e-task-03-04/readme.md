💡笔记在notes文件夹



源码在 code 文件夹 对应github地址

https://github.com/superman285/VBlog-Imitate.git



项目访问地址在

https://vblog-imitate.vercel.app/trends



💡作业说明:

- 由于这个章节主要是讲SSR和SSG的内容，所以没有模仿原项目的 都用客户端发起请求的方式
- 最新动态和博客列表的内容采用了strapi系统，因为内容方便管理
- 社交圈内容调用了github的api 取的博客作者的数据，配置在gridsome.server.js的集合中
- 开源项目的内容直接调用github的api(repo)，然后配置在gridsome.server.js的集合中
- 单个项目具体内容的展示由于无法取到数据集合只能单个调用api所以还是通过了前端来调用
- 所以只有 单个具体开源项目readme显示 采用的是客户端请求的方式 其他均采用了 服务端渲染的方式来获取数据
- 搜索功能是搜索标题，搜索未做分页处理
- 没有直接拷贝原项目的样式，样式都是自己写的 所以会有些出入，有的地方可能不够美观，见谅



