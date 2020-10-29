/*
* 验证是否登录的中间件 避免未登录也能操作 类似路由拦截 起到拦截作用
* */
export default function ({ store, redirect }) {
  // if the user is not authenticated redirect to login page
  if (!store.state.user) {
    return redirect('/login')
  }
}
