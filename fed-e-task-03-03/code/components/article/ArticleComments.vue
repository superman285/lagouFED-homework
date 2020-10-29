<template>
  <div>
    <form class="card comment-form" @submit.prevent="addComment">
      <div class="card-block">
        <textarea v-model="commentContent" class="form-control" placeholder="Write a comment..." rows="3"></textarea>
      </div>
      <div class="card-footer">
        <img :src="user.image" class="comment-author-img" />
        <span style="margin-left:10px;color:violet;font-weight:700;">{{ user.username }}</span>
        <button class="btn btn-sm btn-primary">
          Post Comment
        </button>
      </div>
    </form>

    <div class="card" v-for="(comment, idx) in comments" :key="comment.id">
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link :to="{name: 'profile', params: {username: comment.author.username}}" class="comment-author">
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link style="font-weight: 500;margin-left:5px;" :to="{name: 'profile', params: {username: comment.author.username}}" class="comment-author">
          {{ comment.author.username }}
        </nuxt-link>
        <span class="date-posted">{{ comment.createdAt | formatDate('MMM DD, YYYY') }}</span>
        <i @click="deleteComment($route.params.slug, comment.id, idx)" class="ion-trash-a" style="margin-left:auto;"></i>
      </div>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { addComment, deleteComment, getComments } from '../../api/comment'
export default {
  name: "ArticleComments",
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState(['user'])
  },
  data () {
    return {
      comments: [],
      commentContent: ''
    }
  },
  methods: {
    async addComment() {
      const { data: { comment } } = await addComment({ slug: this.$route.params.slug, comment: { body: this.commentContent } })
      console.log('AddComment', comment)
      this.commentContent = ''
      const { author: { image, username }, body, createdAt } = comment
      this.comments.unshift({
        author: {
          image,
          username
        },
        body,
        createdAt
      })
    },

    deleteComment(slug, id, idx) {
      deleteComment(slug, id)
      console.log('idx del', idx, this.comments)
      this.comments.splice(idx, 1)
      console.log('after', this.comments)
    }
  },
  // asyncData仅限于页面组件 普通组件无法使用asyncData
  async mounted () {
    const { data } = await getComments(this.article.slug)
    this.comments = data.comments
    console.log('comments', this.comments)
  }
}
</script>

<style scoped>
.card-footer {
  display: flex;
  align-items: center;
}
.card-footer i {
  margin-left: auto;
  cursor: pointer;
}
.card-footer button {
  margin-left: auto;
}
</style>
