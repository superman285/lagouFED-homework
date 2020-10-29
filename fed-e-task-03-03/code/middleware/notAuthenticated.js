// 已登录 不能访问登录页面
export default function ({ store, redirect }) {
  // if the user is authenticated redirect to home page
  if (store.state.user) {
    return redirect('/')
  }
}
