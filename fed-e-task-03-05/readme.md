### 1. Vue3.0性能提升主要通过哪几方面体现？

从以下方面体现：

- 响应式系统升级，核心由`defineProperty`升级为了`proxy`
- 编译优化，优化了diff算法
- 优化源码体积，移除了不常用API，需要使用的API模块由用户按需引入，tree-shaking更好的支持





### 2.Vue 3.0 所采用的 Composition Api 与 Vue 2.x使用的Options Api 有什么区别？

区别：

- Options API为对象的key-value形式，Composition API变为了函数的形式
- Composition API添加了setup入口，然后可以以更加FP(函数式编程)的方式在setup函数中使用新API
- Options API同一功能逻辑的代码可能会被拆分到不同选项、各个位置，Composition API则可以把同一功能逻辑的代码更好地组织在一起 使用时无需要上下滚动反复横跳，可以更好地进行逻辑复用。
- 具体的API名称和使用方式有一定变化，应以更加函数式的思维来使用新API
- Composition API需要按需引入，而不是像以前那般自动集成了



### 3.Proxy 相对于 Object.defineProperty 有哪些优点？

- 浏览器对Proxy的优化更好，性能天然更佳
- Proxy可以监听拦截到相比defineProperty更多的操作例如:
  - 动态新增的属性
  - 删除的属性
  - 数组的索引和length属性
- 可以支持更多特殊数据结构的拦截，例如Map、Set，defineProperty是不支持的
- 不需要初始化时就遍历所有属性避免性能浪费，只有访问到某属性时才会去递归处理多层嵌套属性



### 4. Vue 3.0 在编译方面有哪些优化？

- Patch Flag补丁标记
  - 动态节点：diff时可忽略静态节点，只追踪对比带有PatchFlag的动态节点
  - 动态属性：diff时可忽略不会变化的静态属性，只关注PatchFlag标记的可能发生变化的动态属性
- 将静态元素进行提升，后续更新无需再次理会了
- 事件侦听器缓存，减少不必要的更新操作
- Fragments ，不再必须唯一根节点



### 5. Vue.js 3.0 响应式系统的实现原理？



响应式系统的最原始需求即 ***我们修改了数据就希望能自动执行某个函数***

而vue3内部的副作用函数`effect`就可以满足此需求



`effect`和`track`通过一个都能访问到的外部变量activeEffect 进行了一定关联

effect内部将传入的callback函数参数赋值给activeEffect，并执行

track内部维护着targetMap、depsMap、dep数据结构(target为键，对应depsMap，depsMap中key为键，对应effect函数数组)，存放activeEffect函数

trigger也可以访问到targetMap，负责将dep中的函数依次执行触发



通过API `reactive`将数据转化为响应式数据，reactive内部通过Proxy进行监听拦截，在getter中进行依赖收集(track)，在setter中进行触发更新(派发通知)(trigger)



