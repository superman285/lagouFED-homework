<template>
  <div class="article-page">

    <div class="banner">
      <div class="container">

        <h1>{{ article.title }}</h1>

        <!-- article-meta 封装成组件 -->
        <article-meta :article="article"/>

      </div>
    </div>

    <div class="container page">

      <div class="row article-content">
        <div class="col-md-12" v-html="article.body">
          <!--{{ article.body }}-->
        </div>
      </div>

      <hr />

      <div class="article-actions">
        <article-meta :article="article" />
      </div>

      <div class="row">

        <div class="col-xs-12 col-md-8 offset-md-2">

          <article-comments  :article="article"/>

        </div>

      </div>

    </div>

  </div>
</template>

<script>
import MarkdownIt from 'markdown-it'
import { getArticle } from "../../api/article"
import ArticleMeta from "../../components/article/ArticleMeta";
import ArticleComments from "../../components/article/ArticleComments";

export default {
  name: 'ArticleIndex',
  async asyncData ({ params: { slug } }) {
    const { data } = await getArticle(slug)
    console.log('article data', data)
    const { article } = data
    const MDRenderer = new MarkdownIt()
    article.originBody = article.body
    article.body = MDRenderer.render(article.body)
    return {
      article
    }
  },
  components: {
    ArticleMeta,
    ArticleComments
  },
  head () {
    return {
      title: `${this.article.title} - RealWorld`,
      meta: [{ hid: 'description', name: 'description', content: this.article.description }]
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
