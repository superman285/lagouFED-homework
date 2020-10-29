<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Sign up</h1>
          <p class="text-xs-center">
            <nuxt-link to="/login">Have an account?</nuxt-link>
          </p>

          <ul class="error-messages">
            <!--            <li>That email is already taken</li>-->
            <template v-for="(msgs, field) in errors">
              <li v-for="(msg, idx) in msgs" :key="idx">{{ field }} {{msg}}</li>
            </template>
          </ul>

          <form @submit.prevent="onSubmit">
            <fieldset class="form-group">
              <input v-model="user.username" class="form-control form-control-lg" type="text" placeholder="Your Name" required>
            </fieldset>
            <fieldset class="form-group">
              <input v-model="user.email" class="form-control form-control-lg" type="email" placeholder="Email" required>
            </fieldset>
            <fieldset class="form-group">
              <input
                v-model="user.password"
                class="form-control form-control-lg"
                type="password"
                minlength="8"
                placeholder="Password"
                required>
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              Sign up
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { register } from '@/api/user'

export default {
  name: 'RegisterIndex',
  computed: {
    isRegister() {
      return this.$route.name === 'register'
    }
  },
  data() {
    return {
      user: {
        username: '',
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
        const { data } = await register({
          user: this.user
        })
        console.log(data)
        // todo: 保存用户登录状态

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
