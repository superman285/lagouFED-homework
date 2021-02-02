### 1. 说说 application/json 和 application/x-www-form-urlencoded 二者之间的区别。

第一种是提交json字符串格式的数据，以json格式{'key1':'val1','key2':'val2'}

第二种是提交form表单格式的数据，以URL中的参数编码的格式key1=val1&key2=val2





### 2. 说一说在前端这块，角色管理你是如何设计的。

- 添加角色
- 编辑角色
- 删除角色
- 根据条件搜索展示角色列表



### 3. @vue/cli 跟 vue-cli 相比，@vue/cli 的优势在哪？

- 采用了当下更流行的monorepo方式，对各个功能模块做了更细粒度更合理的拆分
- 支持GUI界面
- 支持更深度的自定义定制，支持vue-cli插件
- 新增了serve、inspect等命令，丰富了用户需求大的功能



### 4. 详细讲一讲生产环境下前端项目的自动化部署的流程。

使用`Travis CI` 或 `Github Action`

#### Travis CI

- 注册Travis CI账户并关联好github的仓库

- 配置好一些重要的环境变量，例如私钥数据等

- 创建.travis.yml配置文件，在相应字段填入对应的提交、部署等操作语句
- 提交代码后等待Travis CI进行自动部署



#### Github Action

- 在项目仓库下的`.github/workflows`目录下创建一个yml配置文件

- 相应字段填入相应内容，steps中填入需要使用的actions，可在actions市场寻找合适的action
- 在Secrets中设置私密数据
- 提交代码等待GitHub Action进行自动部署





### 5. 你在开发过程中，遇到过哪些问题，又是怎样解决的？请讲出两点。

1. 需要将某个智能硬件和电脑端网页进行连接，首先使用webusb方案，后来经反复测试后发现在windows10部分版本系统中无法成功连接，后参考其他项目采用了稍老但更成熟稳定的u2f方案。
2. babel-loader和babel/core版本不一致导致报错，后来查阅官方文档，重新安装了版本匹配的两个依赖。
3. 使用cnpm安装依赖时，部分模块下载不完全导致使用时报错can not find module，此时又没有vpn环境使用npm会卡住，于是上到jsdelivr网站直接找到对应的完整npm包下载回来放到对应目录 即可正常运行。
4. 在使用vue3 + ts时，getCurrentInstance拿到的实例上挂载了ctx对象，但在d.ts的实例的类型定义中却没有ctx，所以需要扩展"@vue/runtime-core"的ComponentInternalInstance接口，增加ctx属性。





### 6. 针对新技术，你是如何过渡到项目中？

先进行一定的技术预研，确认技术方案可行性和需求。然后渐进式地将新技术一步一步地重构到项目中，过程中需要编写完备的单元测试用例，并在重构完成后进行完备的e2e测试。