const path = require('path');

export default {

  server: {
    port: 3000, // default: 3000
    host: 'localhost' // default: localhost,
  },

  router: {
    linkActiveClass: 'active',
    extendRoutes(routes,resolve) {
      console.log(routes);
      routes.splice(0);  // 清空routes数组，清除nuxt基于pages目录默认生成的路由表规则
      routes.push(...[
        {
          path: '/',
          component: resolve(__dirname, 'pages/layout/'), //index可省略，
          children: [
            {
              path: '', // 默认子路由
              name: 'home',
              component: resolve(__dirname, 'pages/home/')
            },
            {
              path: '/login',
              name: 'login',
              component: resolve(__dirname, 'pages/login/')
            },
            {
              path: '/register',
              name: 'register',
              component: resolve(__dirname, 'pages/register/')
            },
            {
              path: '/profile/:username/:tab?',
              name: 'profile',
              component: resolve(__dirname, 'pages/profile/')
            },
            {
              path: '/settings',
              name: 'settings',
              component: resolve(__dirname, 'pages/settings/')
            },
            {
              path: '/editor/:slug?',
              name: 'editor',
              component: resolve(__dirname, 'pages/editor/')
            },
            {
              path: '/article/:slug',
              name: 'article',
              component: resolve(__dirname, 'pages/article/')
            },
          ]
        }
      ])
    }

  },

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Nuxt-realworld',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  // 注册插件 ~代表根目录
  plugins: [
    '~/plugins/request.js',
    '~/plugins/dateFormatter.js'
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/tailwindcss
    // '@nuxtjs/tailwindcss'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios'
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    /*resolve: {
      extensions: ['.js', '.json', '.vue', '.ts'],
      root: path.resolve(__dirname),
      alias: {
        '@': path.resolve(__dirname),
        '~': path.resolve(__dirname),
        '@utils': path.resolve(__dirname, '/utils'),
      },
    },*/
    extend (config, ctx) {
      if (ctx.isClient) {
        Object.assign(config.resolve.alias, {
          '@utils': path.resolve(__dirname, 'utils'),
          '@': path.resolve(__dirname)
        })
      }
    },
  },



}
