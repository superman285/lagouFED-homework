<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Sign in</h1>
          <p class="text-xs-center">
            <nuxt-link to="/register">Need an account?</nuxt-link>
          </p>

          <ul class="error-messages">
<!--            <li>That email is already taken</li>-->
            <template v-for="(msgs, field) in errors">
              <li v-for="(msg, idx) in msgs" :key="idx">{{ field }} {{msg}}</li>
            </template>
          </ul>

          <form @submit.prevent="onSubmit">
            <!--<fieldset class="form-group">
              <input class="form-control form-control-lg" type="text" placeholder="Your Name">
            </fieldset>-->
            <fieldset class="form-group">
              <input v-model="user.email" class="form-control form-control-lg" type="email" placeholder="Email" required>
            </fieldset>
            <fieldset class="form-group">
              <input v-model="user.password" class="form-control form-control-lg" type="password" placeholder="Password" required>
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              Sign in
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import { login } from '@/api/user'
  // 仅在客户端(浏览器端)加载 js-cookie 包
  const Cookie = process.client ? require('js-cookie') : undefined

  export default {
    name: 'LoginIndex',
    middleware: 'notAuthenticated',
    computed: {
      isLogin() {
        return this.$route.name === 'login'
      }
    },
    data() {
      return {
        user: {
          email: '',
          password: ''
        },
        errors: {}
      }
    },
    methods: {
      async onSubmit() {
        // 提交表单请求登录
        try {
          const { data } = await login({
            user: this.user
          })
          console.log(data)
          // todo: 保存用户登录状态 用上cookie
          console.log('开始存')

          this.$store.commit('setUser', data.user)

          console.log('存完了', this.$store)

          // 防止刷新页面数据丢失 持久化数据
          Cookie.set('user', data.user)

          // 跳转首页
          this.$router.push('/')
        } catch (err) {
          console.log('err:', err)
          this.errors = err.response.data.errors
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
