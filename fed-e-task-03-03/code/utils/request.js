/*
* 基于axios 封装请求模块
* */

import axios from 'axios'

const request = axios.create({
  baseURL: 'https://conduit.productionready.io'
})

// 请求拦截器 通过拦截器 处理token获取
// 任何请求都会经过请求拦截器
// 在请求拦截器中做一些公共业务处理，例如统一设置token
request.interceptors.request.use(config => {
  // Do something before request is sent
  console.log(config)
  /* !重要!：通过nuxt插件获取到上下文 再拿到用户token */
  config.headers.Authorization = `Token 用户token`
  return config
}, error => {
  // 请求失败 请求未发出 进入这里
  // Do something with request error
  return Promise.reject(error)
})

// 响应拦截器

export default request
