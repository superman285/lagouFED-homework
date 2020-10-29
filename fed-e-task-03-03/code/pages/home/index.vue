<template>
  <div class="home-page">

    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">

        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item" v-if="user">
                <nuxt-link exact class="nav-link" :class="{active: tab === 'your_feed'}" :to="{name: 'home', query: {tab: 'your_feed'}}">Your Feed</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link exact class="nav-link" :class="{active: tab === 'global_feed'}" :to="{name: 'home', query: {tab: 'global_feed'}}">Global Feed</nuxt-link>
              </li>
              <li class="nav-item" v-if="tag">
                <nuxt-link exact class="nav-link" :class="{active: tab === 'tag'}" :to="{name: 'home', query: {tab: 'tag', tag}}">#{{tag}}</nuxt-link>
              </li>
            </ul>
          </div>

          <div class="article-preview" v-for="article in articles" :key="article.slug">
            <div class="article-meta">
              <nuxt-link :to="{name: 'profile', params:{ username: article.author.username }}">
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link class="author" :to="{name: 'profile', params:{ username: article.author.username }}">
                  {{ article.author.username }}
                </nuxt-link>
                <span class="date">{{ article.createdAt | formatDate('MMM DD,YYYY') }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{active: article.favorited}"
                @click="onFavorite(article)"
                :disabled="article.favorDisabled"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link :to="{name:'article',params:{slug:article.slug}}" class="preview-link">
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>

          <!-- 分页列表 -->
          <nav>
            <ul class="pagination">
              <li class="page-item" :class="{active: pageNum === page}" v-for="pageNum in totalPage" :key="pageNum">
                <nuxt-link style="text-decoration: none" :to="{name:'home',query:{page: pageNum, tag: $route.query.tag, tab}}" class="page-link">{{ pageNum }}</nuxt-link>
              </li>
            </ul>
          </nav>

        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                :to="{
                  name: 'home',
                  query: {
                    tag,
                    tab: 'tag'
                  }
                }"
                class="tag-pill tag-default"
                v-for="tag in handleTags"
                :key="tag">
                {{ tag }}
              </nuxt-link>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getArticles, getFeedArticles } from '@/api/article'
import { getTags } from "../../api/tag"
import { addFavorite, deleteFavorite } from "../../api/article";

export default {
  name: 'HomeIndex',
  computed: {
    ...mapState(['user']),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit)
    },
    handleTags() {
      return this.tags.filter(tag => (/\w/).test(tag))
    }
  },
  // 路由匹配加上了exact 没生效 加上 query查询参数监听
  watchQuery: ['page', 'tag', 'tab'],
  // asyncData 有利于 服务端渲染 seo
  async asyncData ({ query, store }) {
    const page = +(query.page || 1)
    const countPerPage = 20
    // 通过 offset 来处理分页
    /* const { data } = await getArticles({
      limit: countPerPage,
      offset: (page - 1) * countPerPage
    })

    const { data: { tags } } = await getTags() */

    const { tag, tab = 'global_feed' } = query
    const listArticles = (store.state.user && tab === 'your_feed') ? getFeedArticles : getArticles
    const [articlesData, tagsData] = await Promise.all([
      listArticles({
        limit: countPerPage,
        offset: (page - 1) * countPerPage,
        tag
      }),
      getTags()
    ])

    const { data: { articles, articlesCount } } = articlesData
    const { data: { tags } } = tagsData;

    articles.forEach(article => {
      article.favorDisabled = false
    })

    return {
      articles,
      articlesCount,
      limit: countPerPage,
      page,
      tags,
      tag,
      tab
    }
  },
  methods: {
    async onFavorite(article) {
      // 应添加防抖
      article.favorDisabled = true
      if (article.favorited) {
        // 有赞了 取消点赞
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount -= 1
      } else {
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.favorDisabled = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
