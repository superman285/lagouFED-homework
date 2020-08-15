# 吴智翀 | Part3模块二

## 简答题

### 1. 请简述Vue首次渲染的过程。

- Vue初始化，初始化实例成员和静态成员。

- 调用Vue构造函数，_init方法中触发了vm.$mount

- 获取el对应的dom

- 如果有render选项，执行mountComponent，触发beforeMount钩子，定义updateComponent方法(其中\_render生成虚拟dom,\_update将虚拟dom转换为真实dom并挂载在页面上)并传递给Watcher实例(创建Watcher实例后会触发watcher.get，然后调用updateComponent方法)，触发mounted钩子，返回vm实例

- 若无render选项则获取template，调用compileToFunctions方法生成render函数并挂在options.render上，然后执行有render步骤

- 完成初始化


### 2. 请简述Vue响应式原理。

- init方法调用initState初始化Vue实例状态，调用initData将data属性挂在Vue实例上，调用observe(data)将data转换为响应式对象
- observe方法判断传入参数是否对象，不是则返回。若无_\_ob\_\_属性标记，则创建observer对象
- 定义\__ob\_\_属性，分别进行数组响应式处理和对象响应式处理。数组的处理时拦截数组的7个特殊方法(push/pop等)，找到\_\_ob\_\_对象中的dep并调用notify方法，遍历数组中每个成员并对每个成员调用observe方法。对象的处理是调用walk方法，遍历对象每个属性，对每个属性调用defineReactive方法。
  - defineReactive为每个属性创建dep对象。defineReactive中的getter负责收集依赖，包括子对象，然后返回属性值。setter负责保存新值，若新值是对象，同样调用observe将其转换成响应式对象，然后调用dep.notify()发送通知。
  - 收集依赖的时候，在watcher对象的get方法中调用pushTarget来记录Dep.target属性，访问data中的成员时收集依赖，defineReactive中的getter收集依赖，然后把属性对象的watcher对象添加到dep的subs数组中。childOb也收集依赖，这样可以在子对象添加和删除成员时发送通知。
  - 数据发生变化，dep.notify() 开发发送通知，调用watcher对象的update()方法。在update()中的queueWatcher判定该watcher是否已经被处理，没有处理过的watcher被添加到queue队列，调用flushSchedulerQueue()。flushSchedulerQueue中触发 beforeUpdate钩子函数，调用watcher.run()：run()，get()，getter()，updateComponent()。
- 清空上一次的依赖，触发actived钩子函数和updated钩子函数



### 3. 请简述虚拟DOM中Key的作用和好处。

- 作用：为每个节点身份做标记，在新旧 nodes 对比时辨识 VNodes。进行比较时会基于 key 的变化复用现有元素和重新排列元素顺序，而不用重新创建新的节点。
- 好处：便于复用节点，减少dom操作，提高性能。



### 4. 请简述Vue中模板编译的过程。

- compileToFunctions入口函数加载缓存好的render函数，若没有则调用compile函数生成
- compile方法中先合并options，调用baseCompile来编译模板，传入template以及合并后的options
- baseCompile 函数首先把模版字符串转义为 AST 抽象语法树，然后对抽象语法树进行优化，最后把优化过的抽象语法书转换为 js 代码 (解析 -> 优化 -> 生成)
- compileToFunctions 会把上一步生成的字符串形式的 js 代码转换为函数，通过调用 createFunction 挂载到 Vue 实例的 options 对应的属性上

