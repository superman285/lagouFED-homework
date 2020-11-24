# SSG(Static-Site-Generators)

`静态网站生成器`

也叫 `JAMStack`

- Javascript | API | Markup 的首字母组合
- 本质上是一种胖前端，通过各种API来实现更多功能
- 明显分离的前后端模式，不需要服务器



==预渲染==

核心是每次启动服务器时拉取一下服务器数据(提前拿到数据)，之后(不重启服务器)再拉取数据就不是通过服务器来拉取了



> 不适合
>
> - 不适合有大量路由页面的应用
> - 不适合有大量动态内容的应用(例如后台管理系统，大量增删改查)



### 快速安装启动

gridsome.org/docs/#how-to-install



有个npm包 sharp 比较难安装成功 需要特殊处理下





### 自动生成路由

pages目录创建组件，自动生成路由，类似nuxtJS

文件模式

```js
src/pages/Index.vue							/
src/pages/AboutUs.vue						/about-us/
src/pages/about/Vision.vue					/about/vision/
src/pages/blog/Index.vue					/blog/
```

或 gridsome.server.js

编程模式

```js
module.exports = function (api) {
    api.createPages({createPage}=>{
        createPage({
            path: '/my-page',
            component: './src/templates/MyPage.vue'
        })
    })
}
```



### 动态路由

/user/:id 会生成 /user/_id.html 但静态服务器可能没匹配上 需要手动配置afterBuild





### 集合Collections

==若正常使用vue前端写法展示数据，则是 客户端动态请求加载进来的，而不是被静态化到页面中(不是预渲染生成的)==

在network页签 看preview 没有数据 则说明是靠客户端动态请求加载进来的 而不是服务端预渲染静态化到页面

(开发模式下是看不出效果的，正式模式打包后运行，再看preview就有效果了，或者在dist打包目录看生成的html，能看出来数据都被静态化了)

浏览器点刷新，则触发服务端渲染，页面内点链接跳转 则为 SPA 客户端动态请求加载



`集合配置如下`

```js
// gridsome.server.js
module.exports = function(api) {
    api.loadSource( ({addCollection}) => {
        const colllection = addCollection('Post')
        const {data} = await axios.get('xxx')
        for (const item of data) {
            collection.addNode({
                id: item.id,
                title: item.title,
                content: item.body
            })
        }
    } )
}
```

在templates文件夹新建Post.vue 写好模板内容 html中使用 写法为 $page.post.content

```js
// 在模板vue文件中配graphQL查询
<page-query>
query ($id: ID!){
    post (id: $id){
        id
        title
        content
    }
}
</page-query>
```

metaInfo() { return { title: this.$page.post.title}}



在gridsome.config.js 配置 templates项

```js
module.exports = {
    siteName: '拉勾教育',
    siteDescriiption: '大前端',
    plugins: [],
    templates: {
        Post: [
            {
                path: '/posts/:id',
                component: './src/templates/Post.vue'
            }
        ]
    }
}
```





### 数据来源

- Import from APIs
- Import from local files （@gridsome/source-filesystem)  读非原生格式需要转换器 不然报错
  - 通过CMS 内容管理系统辅助 `strapi` 方案



##### GraphQL写法示范

在strapi-demo中 http://localhost:1337/graphql

```sql
# 查单个
query {
  trend(id: 1) {
    title
    content
  }
}

# 查多个
query {
  trends {
    id
    title
    content
  }  
}

# 分页查 每页三个 第一页
query {
  allFollowing(perPage: 3, page: 1) @paginate {
    edges {
      node {
        id
        name
        page
        avatar
      }
    }
  }
}

followCount(id: 1) {
    followerCount
    followingCount
  }
  
 # or
allFollowCount {
    edges {
      node {
        id
        followerCount
        followingCount
      }
    }
  }
 
```



```
followings: allFollowing {
 edges {
  node {
   id
   name
   page
   avatar
  }
 }
}
followCount(id: 1) {
 followerCount
 followingCount
}
```

```
{
  path: "/social-circle/:page(\\d+)?/",
  component: c3
},
```