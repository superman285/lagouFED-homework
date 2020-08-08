# 吴智翀 | Part3模块一

## 简答题

### 1. 当我们点击按钮的时候动态给data增加的成员是否是响应式数据，如果不是，如何把新增成员设置为响应式数据，它的内部原理是什么？ (Trump is a dog???? 666)

```js
let vm = new Vue({
    el: '#el',
    data: {
        o: 'object',
        dog: {}
    },
    method: {
        clickHandler() {
            // 该name属性是否是响应式的？
            this.dog.name = 'Trump'
        }
    }
})
```



答：

不是响应式的，需要使用`Vue.set`或`this.$set`将数据变为响应式

```js
Vue.set(this.dog, 'name', 'Trump')
this.$set(this.dog, 'name', 'Trump')
```

将数据变为响应式本质上是需要通过Object.defineProperty给属性设置getter和setter从而拦截数据，后面新增的对象属性没有经过Object.defineProperty，所以需要我们手动去通过defineReactive中的defineProperty给新增属性添加getter/setter 对数据进行响应式处理。



### 2. 请简述Diff算法的执行过程。

- 新老节点都有 文本 ，且不相等

  - 设置新节点对应 DOM 元素的 textContent

- 只有老节点有 文本

  - 清空对应 DOM 元素的 textContent

- 只有新节点有 文本

  - 设置新节点对应 DOM 元素的 textContent

- 只有老节点有 Children

  - 移除所有子节点

- 只有新节点有 Children

  - 添加所有子节点

- 新老节点不相等，且都有 children 

  - 调用 `updateChildren()`

  - 对比子节点，并更新子节点差异

    👇

`updateChildren` 

- 对同级别的子节点依次比较，然后再找下一级别的节点比较
- 在进行同级别节点比较的时候，首先会对新老节点数组的开始和结尾节点设置标记索引，遍历过程中移动索引
- 在对开始和结束节点比较时，总共有四种情况
  - oldStartVnode / newStartVnode （旧开始节点 / 新开始节点）
  - oldEndVnode / newEndVnode （旧结束节点 / 新结束节点）
  - oldStartVnode / newEndVnode （旧开始节点 / 新结束节点）
  - oldEndVnode / newStartVnode （旧结束节点 / 新开始节点）
- 开始节点和结束节点比较，这两种情况类似
  - oldStartVnode / newStartVnode （旧开始节点 / 新开始节点）
  - oldEndVnode / newEndVnode （旧结束节点 / 新结束节点）
- 如果 oldStartVnode 和 newStartVnode 是 sameVnode
  - 调用 `patchVnode()` 对比和更新节点
  - 把旧开始和新开始索引往后移动
- 如果 oldStartVnode 和 newEndVnode 是 sameVnode
  - 调用 `patchVnode()` 对比和更新节点
  - 把 oldStartVnode 对应的 DOM 元素移动到最右边
  - 更新索引
- 如果 oldEndVnode 和 newStartVnode 是 sameVnode
  - 调用 `patchVnode()` 对比和更新节点
  - 把 oldEndVnode 对应的 DOM 元素移动到最左边边
- 如果不是以上四种情况
  - 遍历新节点，使用 newStartVnode 的 key 在老节点数组中找相同节点
  - 如果没有找到，说明 newStartVnode 是新节点
    - 创建新节点对应的 DOM 元素，插入到 DOM 树中
  - 如果找到了
    - 判断新节点和找到的老节点是否相同
    - 如果不相同，说明节点被修改了
      - 重新创建对应的 DOM 元素，插入到 DOM 树中
    - 如果相同，把找到的老节点移动到左边
- 循环结束
  - 当老节点的所有子节点先遍历完（oldStartIdx > oldEndIdx）
  - 当新节点的所有子节点先遍历完（newStartIdx > newEndIdx）
- 如果老节点的数组优先遍历完，说明新节点有剩余，把剩余节点插入到对应位置
- 如果新节点的数组优先遍历完，说明老节点有剩余，把剩余节点删除

