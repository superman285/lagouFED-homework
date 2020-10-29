<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <!--bio: null
createdAt: "2020-10-16T12:21:38.536Z"
email: "superman285@126.com"
id: 119220
image: "https://i.loli.net/2020/10/16/fYR5G82qncLIeaM.jpg"
token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTE5MjIwLCJ1c2VybmFtZSI6InN1cGVybWFuMjg1IiwiZXhwIjoxNjA5MDY0NjQwfQ.3m0plKsamghkxsYUV6W0QQrZUpkCD0IFinJyfvZBBTM"
updatedAt: "2020-10-16T12:22:52.035Z"
username: "superman285"-->
          <form @submit.prevent="updateSetting">
            <fieldset>
              <fieldset class="form-group">
                <input v-model="image" class="form-control" type="text" placeholder="URL of profile picture">
              </fieldset>
              <fieldset class="form-group">
                <input v-model="username" class="form-control form-control-lg" type="text" placeholder="Your Name">
              </fieldset>
              <fieldset class="form-group">
                <textarea v-model="bio" class="form-control form-control-lg" rows="8" placeholder="Short bio about you"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input v-model="email" class="form-control form-control-lg" type="text" placeholder="Email">
              </fieldset>
              <fieldset class="form-group">
                <input v-model="password" class="form-control form-control-lg" type="password" placeholder="Password" minlength="8">
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">
                Update Settings
              </button>
            </fieldset>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { getUser, updateUser } from '../../api/user'
export default {
  name: 'SettingsIndex',
  middleware: ['authenticated'],
  data() {
    return {
      password: ''
    }
  },
  async asyncData () {
    const { data: { user } } = await getUser()
    console.log('cur user', user)
    return {
      ...user
      /*
      * image
      * username
      * bio
      * email
      * password
      * */
    }
  },

  methods: {
    /* eslint-disable */
    async updateSetting() {
      try {
        const { data: { user } } = await updateUser({
          email: this.email,
          username: this.username,
          password: this.password,
          image: this.image,
          bio: this.bio
        })
        console.log('update user', user)
        this.$router.push('/')
      } catch (err) {
        console.err('Update err', err)
        this.password = ''
      }

    }
  }
}
</script>

<style lang="scss" scoped>

</style>
