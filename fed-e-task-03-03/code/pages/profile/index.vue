<template>
  <div class="profile-page">

    <div class="user-info">
      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <button @click="onFollow(profile)" :disabled="profile.followDisabled" class="btn btn-sm btn-outline-secondary action-btn">
              <i v-if="profile.following" class="ion-minus-round"></i>
              <i v-else class="ion-plus-round"></i>
              &nbsp;
              <span v-if="profile.following">Unfollow {{ profile.username }}</span>
              <span v-else>Follow {{ profile.username }}</span>
            </button>
          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
<!--                <a class="nav-link active" href="">My Articles</a>-->
                <nuxt-link exact class="nav-link" :class="{active: !tab}" :to="{name: 'profile', params: { username: profile.username }}">My Articles</nuxt-link>
              </li>
              <li class="nav-item">
<!--                <a class="nav-link" href="">Favorited Articles</a>-->
                <nuxt-link exact class="nav-link" :class="{active: tab === 'favorites'}" :to="{name: 'profile', params: { username: profile.username, tab: 'favorites' }}">Favorited Articles</nuxt-link>
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
                <span class="date">{{ article.createdAt | formatDate('MMMM DD') }}</span>
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

          <!--<div class="article-preview">
            <div class="article-meta">
              <a href=""><img src="http://i.imgur.com/N4VcUeJ.jpg" /></a>
              <div class="info">
                <a href="" class="author">Albert Pai</a>
                <span class="date">January 20th</span>
              </div>
              <button class="btn btn-outline-primary btn-sm pull-xs-right">
                <i class="ion-heart"></i> 32
              </button>
            </div>
            <a href="" class="preview-link">
              <h1>The song you won't ever stop singing. No matter how hard you try.</h1>
              <p>This is the description for the post.</p>
              <span>Read more...</span>
              <ul class="tag-list">
                <li class="tag-default tag-pill tag-outline">Music</li>
                <li class="tag-default tag-pill tag-outline">Song</li>
              </ul>
            </a>
          </div>-->

        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { follow, getProfile, unfollow } from "../../api/user";
import { addFavorite, deleteFavorite, getArticles } from "../../api/article";

export default {
  name: '',
  middleware: ['authenticated'],
  async asyncData({ params: { username, tab = '' } }) {
    const { data: { profile } } = await getProfile(username)
    console.log('dadadata', profile, username, tab)

    const { data: { articles } } = !tab ? await getArticles({ author: profile.username })
      : await getArticles({ favorited: profile.username })
    console.log('My Or Favor Articles', articles)

    return {
      profile: {
        ...profile,
        followDisabled: false
      },
      articles,
      tab
    }
  },
  methods: {
    async onFollow(profile) {
      profile.followDisabled = true
      if (profile.following) {
        await unfollow(profile.username)
        profile.following = false
      } else {
        await follow(profile.username)
        profile.following = true
      }
      profile.followDisabled = false
    },
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
