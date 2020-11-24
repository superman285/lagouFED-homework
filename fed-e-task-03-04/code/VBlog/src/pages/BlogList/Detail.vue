<template>
	<Layout>
		<div class="blog-detail-title-wrap">
			<h2 class="blog-detail-title">{{blog.title}}</h2>
			<span class="blog-detail-share" @click="shareLink">分享</span>
			<span class="blog-detail-more" @click="showMore">更多博客</span>
		</div>
		<p class="date">发布于 {{dayjs(blog.created_at).format('YYYY-MM-DD HH:mm:ss')}}</p>
		<p class="date">更新于 {{dayjs(blog.updated_at).format('YYYY-MM-DD HH:mm:ss')}}</p>
		<div class="blog-detail-content" v-html="blogContent"></div>

	</Layout>
</template>

<page-query>
	query ($id: String) {
	blog: strapiBloglist(id: $id) {
	id
	title
	content
	created_at
	updated_at
	description
	}
	}
</page-query>

<script>
import dayjs from 'dayjs'
import MarkdownIt from 'markdown-it'
const md = new MarkdownIt()

export default {
  name: "BlogDetail",
	data() {
		return {
			blog: {},
			dayjs,
			blogContent: ''
		}
	},
	methods: {
		shareLink() {
			console.log('分享链接:',location.href)

		},
		showMore() {
			console.log('更多')
			this.$router.go(-1)
		}
	},
	created() {
		/*this.blog = this.$page.blog
  	this.blog = this.$route.params.blog
		this.blogContent = md.render(this.blog.content)*/
	},
	/*beforeRouteEnter(to, from, next) {
		if (from.path.includes('blog-list')) {
			next()
		} else {
			next({path: '/blog-list/'})
		}
	}*/
}
</script>

<style>
.blog-detail-title-wrap {
	display: flex;
	align-items: center;
	margin-bottom: 20px;
	border-bottom: 1px solid gainsboro;
}
.blog-detail-title-wrap span {
	cursor: pointer;
}
.blog-detail-share {
	margin-left: auto;
	margin-right: 20px;
}
.blog-detail-more {
	margin-right: 20px;
}
.date {
	font-size: 14px;
	color: darkgrey;
}
.blog-detail-content {
	font-size: 16px;
}
.blog-detail-content img {
	width: 100%;
}
</style>
