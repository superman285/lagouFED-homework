<template>
  <div class="article-meta">
    <nuxt-link :to="{name: 'profile', params: {username: article.author.username}}">
      <img :src="article.author.image" />
    </nuxt-link>
    <div class="info">
      <nuxt-link :to="{name: 'profile', params: {username: article.author.username}}" class="author">{{ article.author.username }}</nuxt-link>
      <span class="date">{{ article.createdAt | formatDate('MMM DD, YYYY') }}</span>
    </div>
    <template v-if="user.username === article.author.username">
      <button @click="editArticle(article.slug)" class="btn btn-sm btn-outline-secondary" :class="{active: article.author.following}">
        <i class="ion-edit"></i>
        &nbsp;
        Edit Article
      </button>
      &nbsp;
      <button @click="deleteArticle(article.slug)" class="btn btn-sm btn-outline-danger" :class="{active: article.author.favorited}">
        <i class="ion-trash-b"></i>
        &nbsp;
        Delete Article
      </button>
    </template>
    <template v-else>
      <button @click="onFollow(article.author.username)" class="btn btn-sm btn-outline-secondary" :class="{active: article.author.following}">
        <i v-if="article.author.following" class="ion-minus-round"></i>
        <i v-else class="ion-plus-round"></i>
        &nbsp;
        <span v-if="article.author.following">Unfollow {{article.author.username}}</span>
        <span v-else>Follow {{article.author.username}}</span>
        <span class="counter">({{article.favoritesCount}})</span>
      </button>
      &nbsp;
      <button @click="onFavorite(article.slug)" class="btn btn-sm btn-outline-primary" :class="{active: article.favorited}">
        <i v-if="article.favorited" class="ion-heart"></i>
        <i v-else class="ion-heart"></i>
        &nbsp;
        <span v-if="article.favorited">Unfavorite Article</span>
        <span v-else>Favorite Article</span>
        <span class="counter">({{article.favoritesCount}})</span>
      </button>
    </template>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { addFavorite, deleteArticle, deleteFavorite } from '../../api/article'
import { follow, unfollow } from "../../api/user"
export default {
  name: "ArticleMeta",
  computed: {
    ...mapState(['user'])
  },
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  methods: {
    onFollow (username) {
      console.log('onFollow', this.article, this.article.author, this.article.favoritesCount);
      if (this.article.author.following) {
        unfollow(username)
        this.article.author.following = false
        this.article.favoritesCount -= 1
      } else {
        follow(username)
        this.article.author.following = true
        this.article.favoritesCount += 1
      }
    },
    onFavorite (slug) {
      console.log('onFollow', this.article.favorited);
      if (this.article.favorited) {
        deleteFavorite(slug)
        this.article.favorited = false
        this.article.favoritesCount -= 1
      } else {
        addFavorite(slug)
        this.article.favorited = true
        this.article.favoritesCount += 1
      }
    },
    editArticle (slug) {
      // this.$router.push(`/editor/${slug}`)
      this.$router.push({
        name: 'editor',
        params: {
          slug,
          article: {
            body: this.article.originBody,
            description: this.article.description,
            tagList: this.article.tagList,
            title: this.article.title
          }
        }
      })
    },
    async deleteArticle (slug) {
      try {
        const delAnswer = confirm('Do you confirm the deletion?')
        if (delAnswer) {
          await deleteArticle(slug)
          this.$router.push('/')
        }
      } catch (err) {
        console.err('del article err:', err)
      }
    }
  }
}

</script>

<style lang="scss" scoped>

</style>
