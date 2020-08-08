五大部分

- Vue 构造函数
- compiler
- observer  
- dep
- watcher



通过属性保存选项数据



data中成员转换成getter和setter，挂在vue实例上 _proxyData



调用observer对象，监听数据变化



调用compiler对象，解析指令和插值表达式



---

##### Vue构造函数:

保存选项数据，data成员挂在vue实例



##### observer

数据劫持

data选项中属性转换为响应式数据，数据变化发送通知

- walk

- defineReactive  defineProperty转换为getter和setter



##### compiler

编译模板，解析指令 和 插值表达式

页面首次渲染

数据变化后重新渲染视图



##### dep

在getter中 收集依赖，添加观察者

在setter中 通知所有观察者

data中一个属性 对应一个dep



##### watcher

数据变化时触发依赖，dep通知所有watcher更新视图

实例化时 往 dep对象添加watcher

记录Dep.target (添加完后要将Dep.target设置为null)