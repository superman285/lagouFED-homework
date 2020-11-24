<template>
	<Layout>
		<h2>{{news.title}}</h2>
		<hr>
		<p class="news-created">发布于 {{dayjs(news.created_at).format('YYYY-MM-DD HH:mm:ss')}}</p>
		<p class="news-created">更新于 {{dayjs(news.updated_at).format('YYYY-MM-DD HH:mm:ss')}}</p>
		<div class="news-content" v-html="newsContent"></div>
	</Layout>
</template>

<page-query>
	query {
		trends: allStrapiTrend {
			edges {
				node {
					id
					title
					content
					created_at
					updated_at
				}
			}
		}
	}
</page-query>

<script>
import dayjs from 'dayjs'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

export default {
  name: "Trends",
	data() {
  	return {
  		news:{},
		  dayjs,
		  newsContent: ''
	  }
	},
	created() {
		this.news = (this.$page.trends.edges[0] && this.$page.trends.edges[0].node) || {}
		this.newsContent = md.render(this.news.content)
	}
}
</script>

<style>
.news-created {
	font-size: 14px;
	color: darkgrey;
}
.news-content {
	font-size: 16px;
}
.news-content img {
	width: 100%;
}
</style>
