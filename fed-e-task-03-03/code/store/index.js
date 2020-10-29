const CookieParser = process.server ? require('cookieparser') : undefined

// 服务端渲染期间运行的都是同一个实例
// 为防止数据冲突，必须把 state 定义成一个函数，返回数据对象
const state = () => ({
  user: null
})

const mutations = {
  setUser(state, data) {
    state.user = data
  }
}

const actions = {
  // nuxtServerInit 是一个特殊 action 方法
  // 该action 会在服务端渲染期间自动调用
  // 作用： 初始化容器数据，传递数据给客户端使用
  nuxtServerInit({ commit }, { req }) {
    console.log('nuxtServerInit')
    let user = null

    // 如果请求头有 Cookie
    if (req.headers.cookie) {
      // 使用cookieparser 把cookie字符串转为js对象
      const parsed = CookieParser.parse(req.headers.cookie)

      try {
        user = JSON.parse(parsed.user)
        console.log('store user', user)
      } catch (err) {
        console.log('No valid cookie found')
      }
      // 提交 mutation 修改 state 状态
      commit('setUser', user)
    }
  }
}

export {
  state,
  mutations,
  actions
}

/* const nuxt_store = {};
export default nuxt_store */
























