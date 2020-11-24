const c1 = () => import(/* webpackChunkName: "page--src--pages--blog-list--detail-vue" */ "/Users/superman285/Programmer/LFED/Vue/SSG/VBlog-Imitate/src/pages/BlogList/Detail.vue")
const c2 = () => import(/* webpackChunkName: "page--src--pages--social-circle-vue" */ "/Users/superman285/Programmer/LFED/Vue/SSG/VBlog-Imitate/src/pages/SocialCircle.vue")
const c3 = () => import(/* webpackChunkName: "page--src--pages--social-follower-vue" */ "/Users/superman285/Programmer/LFED/Vue/SSG/VBlog-Imitate/src/pages/SocialFollower.vue")
const c4 = () => import(/* webpackChunkName: "page--src--pages--social-following-vue" */ "/Users/superman285/Programmer/LFED/Vue/SSG/VBlog-Imitate/src/pages/SocialFollowing.vue")
const c5 = () => import(/* webpackChunkName: "page--src--pages--opensource-vue" */ "/Users/superman285/Programmer/LFED/Vue/SSG/VBlog-Imitate/src/pages/Opensource.vue")
const c6 = () => import(/* webpackChunkName: "page--src--pages--blog-list--index-vue" */ "/Users/superman285/Programmer/LFED/Vue/SSG/VBlog-Imitate/src/pages/BlogList/Index.vue")
const c7 = () => import(/* webpackChunkName: "page--src--templates--blog-vue" */ "/Users/superman285/Programmer/LFED/Vue/SSG/VBlog-Imitate/src/templates/Blog.vue")
const c8 = () => import(/* webpackChunkName: "page--src--pages--trends-vue" */ "/Users/superman285/Programmer/LFED/Vue/SSG/VBlog-Imitate/src/pages/Trends.vue")
const c9 = () => import(/* webpackChunkName: "page--src--pages--project-vue" */ "/Users/superman285/Programmer/LFED/Vue/SSG/VBlog-Imitate/src/pages/Project.vue")
const c10 = () => import(/* webpackChunkName: "page--src--pages--helper-vue" */ "/Users/superman285/Programmer/LFED/Vue/SSG/VBlog-Imitate/src/pages/Helper.vue")
const c11 = () => import(/* webpackChunkName: "page--src--pages--about-vue" */ "/Users/superman285/Programmer/LFED/Vue/SSG/VBlog-Imitate/src/pages/About.vue")
const c12 = () => import(/* webpackChunkName: "page--node-modules--gridsome--app--pages--404-vue" */ "/Users/superman285/Programmer/LFED/Vue/SSG/VBlog-Imitate/node_modules/gridsome/app/pages/404.vue")
const c13 = () => import(/* webpackChunkName: "page--src--pages--index-vue" */ "/Users/superman285/Programmer/LFED/Vue/SSG/VBlog-Imitate/src/pages/Index.vue")

export default [
  {
    path: "/blog-list/detail/",
    component: c1
  },
  {
    path: "/social-circle/:page(\\d+)?/",
    component: c2
  },
  {
    path: "/social-follower/:page(\\d+)?/",
    component: c3
  },
  {
    path: "/social-following/:page(\\d+)?/",
    component: c4
  },
  {
    path: "/opensource/:page(\\d+)?/",
    component: c5
  },
  {
    path: "/blog-list/:page(\\d+)?/",
    component: c6
  },
  {
    path: "/blog/:id/",
    component: c7
  },
  {
    path: "/trends/",
    component: c8
  },
  {
    path: "/project/",
    component: c9
  },
  {
    path: "/helper/",
    component: c10
  },
  {
    path: "/about/",
    component: c11
  },
  {
    name: "404",
    path: "/404/",
    component: c12
  },
  {
    name: "home",
    path: "/",
    component: c13
  },
  {
    name: "*",
    path: "*",
    component: c12
  }
]
