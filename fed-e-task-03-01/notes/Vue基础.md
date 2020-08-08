## Vue基础



```js
new Vue({
  render: h => h(App)
}).$mount('#app')
```



#### `h函数`: 创建虚拟dom

```js
It comes from the term "hyperscript", which is commonly used in many virtual-dom implementations. "Hyperscript" itself stands for "script that generates HTML structures" because HTML is the acronym for "hyper-text markup language".

它来自单词 hyperscript，这个单词通常用在 virtual-dom 的实现中。Hyperscript 本身是指 
生成HTML 结构的 script 脚本，因为 HTML 是 hyper-text markup language 的缩写（超文本标记语言）
```

h 为 createElement 返回一个vnode



#### `render`:  把h函数创建的虚拟dom返回

#### `$mount`: 把虚拟dom转化为真实dom，渲染到屏幕上





## 生命周期



模板编译render渲染函数





## VueRouter 路由

#### 组件中获取动态路由参数的两种方式

```js
方式一: 通过当前路由
组件中
this.$router.params.id

方式二: 通过开启props和路由的关联
路由配置中
{
    path: '/detail/:id',
    name: 'Detail',
    props: true,
    component: Detail
}

写法二:
{
    path: '/detail',
    name: 'Detail',
    props: route => ({
        id: route.params.id
    }),
    component: Detail
}

组件中
props: ['id']
```



#### 嵌套路由

```js
{
    path: '/',
    component: Layout,
    children: [
        {
            name: 'index',
            path: '',
            component: Index,
        },
        {
            name: 'detail',
            path: 'detail/:id',
            props: true,
            component: Detail
        }
    ]
}
```



#### 编程式导航



#### 路由模式

###### Hash模式





###### History模式



