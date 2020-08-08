Vue的virtualDom 改造了 Snabbdom



> ==虚拟DOM==
>
> 用普通的SJ对象来描述DOM对象，由于不是真实DOM对象，所以称之为虚拟DOM



==Virtual DOM好处==

当状态改变时不需要立即更新DOM，只需要创建一个虚拟DOM树🌲来描述DOM，Virtual DOM内部通过diff算法来更新DOM

- 可以维护程序的状态，跟踪上一次的状态 (维护视图和状态的关系)
- 通过比较前后两次状态的差异更新真实DOM

- 复杂视图情况下提升渲染性能