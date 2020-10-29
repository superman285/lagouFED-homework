<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input v-model="title" type="text" class="form-control form-control-lg" placeholder="Article Title" minlength="1">
              </fieldset>
              <fieldset class="form-group">
                <input v-model="about" type="text" class="form-control" placeholder="What's this article about?" minlength="1">
              </fieldset>
              <fieldset class="form-group">
                <textarea v-model="body" class="form-control" rows="8" placeholder="Write your article (in markdown)" minlength="1"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input v-model="tags" type="text" class="form-control" placeholder="Enter tags" minlength="1"><div class="tag-list"></div>
              </fieldset>
              <button @click="$route.params.slug ? updateArticle($route.params.slug) : addArticle" class="btn btn-lg pull-xs-right btn-primary" type="button">
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { addArticle, updateArticle } from "../../api/article"

export default {
  name: 'EditorIndex',
  // 在路由匹配组件渲染之前会先执行中间件处理 直接写中间件文件名
  middleware: ['authenticated'],
  data() {
    return {
      title: '',
      about: '',
      body: '',
      tags: ''
    }
  },
  created () {
    console.log('route from article', this.$route.params)
    const { body, description, tagList, title } = this.$route.params.article || {}
    this.body = body
    this.about = description
    this.tags = tagList.join(',')
    this.title = title
  },
  methods: {

    async addArticle() {
      try {
        const { data: { article } } = await addArticle({
          title: this.title,
          description: this.about,
          body: this.body,
          tagList: this.tags.split(',')
        })
        console.log('Add Article', article)
        this.$router.push('/')
      } catch (err) {
        console.error('Add article err', err)
        this.title = this.about = this.body = this.tags = ''
      }
    },
    async updateArticle(slug) {
      try {
        const { data: { article } } = await updateArticle({
          slug,
          article: {
            title: this.title,
            description: this.about,
            body: this.body,
            tagList: this.tags.split(',')
          }
        })
        console.log('Update Article', article)
        this.$router.go(-1)
      } catch (err) {
        console.error('Update article err', err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
