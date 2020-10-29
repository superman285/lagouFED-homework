import axios from 'axios'

export const request = axios.create({
  // baseURL: 'http://realword.api.fed.lagounews.com'
  baseURL: 'https://conduit.productionready.io'
})

// 通过插件机制获取到上下文对象 (query,params,req,res,app,store)
// 插件导出 必须作为 默认 default 成员
export default ({ store }) => {
  console.log('ctx store', store)
  const { user } = store.state
// 请求拦截器 通过拦截器 处理token获取
// 任何请求都会经过请求拦截器
// 在请求拦截器中做一些公共业务处理，例如统一设置token
  request.interceptors.request.use(config => {
    // Do something before request is sent
    /* !重要!：通过nuxt插件获取到上下文 再拿到用户token */
    if (user && user.token) {
      console.log('token from ctx', user.token);
      config.headers.Authorization = `Token ${user.token}`
    }
    return config
  }, error => {
    // 请求失败 请求未发出 进入这里
    // Do something with request error
    return Promise.reject(error)
  })
}

