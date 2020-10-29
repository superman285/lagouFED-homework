<template>
  <div>
    <!--    顶部导航栏-->
    <nav class="navbar navbar-light">
      <div class="container">
<!--        <a class="navbar-brand" href="/">conduit</a>-->
        <nuxt-link class="navbar-brand" to="/">conduit</nuxt-link>
        <ul class="nav navbar-nav pull-xs-right">
          <li class="nav-item">
            <!-- Add "active" class when you're on that page" -->
            <nuxt-link exact class="nav-link" to="/">Home</nuxt-link>
          </li>

          <template v-if="user">
            <li class="nav-item">
              <nuxt-link class="nav-link" to="/editor">
                <i class="ion-compose" />&nbsp;New Post
              </nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link class="nav-link" to="/settings">
                <i class="ion-gear-nuxt-link" />&nbsp;Settings
              </nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link class="nav-link" to="/profile/superman285">
<!--                src="https://i.loli.net/2020/10/16/fYR5G82qncLIeaM.jpg"-->
                <img class="user-pic" :src="user.image">
                {{ user.username }}
              </nuxt-link>
            </li>
          </template>

          <template v-else>
            <li class="nav-item">
              <nuxt-link class="nav-link" to="/login">Sign in</nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link class="nav-link" to="/register">Sign up</nuxt-link>
            </li>
          </template>

        </ul>
      </div>
    </nav>

    <nuxt-child />

    <!--    底部导航栏-->
    <footer>
      <div class="container">
        <nuxt-link to="/" class="logo-font">conduit</nuxt-link>
        <span class="attribution">
          An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design licensed under MIT.
        </span>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'LayoutIndex',
  computed: {
    ...mapState(['user'])
  },
  mounted() {
    console.log('this user', this.user)
  }
}
</script>

<style lang="scss" scoped>

</style>
