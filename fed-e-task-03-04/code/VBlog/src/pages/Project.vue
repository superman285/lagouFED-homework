<template>
	<Layout>
		<div class="proj-title-wrap">
			<h2 class="proj-title">{{name}}</h2>
			<span class="proj-share" @click="shareLink">分享</span>
			<span class="proj-more" @click="showMore">更多项目</span>
		</div>
		<p class="date">发布于 {{dayjs(proj.created_at).format('YYYY-MM-DD HH:mm:ss')}}</p>
		<p class="date">更新于 {{dayjs(proj.updated_at).format('YYYY-MM-DD HH:mm:ss')}}</p>
		<div v-if="!readmeContent"><h3>Please wait... ...</h3></div>
		<div v-else class="proj-content" v-html="readmeContent"></div>

	</Layout>
</template>


<script>
	import dayjs from 'dayjs'
	import MarkdownIt from 'markdown-it'
	const {Base64} = require('js-base64')
	import {getReadme} from '../api/readme'

	console.log('base64',Base64)
	const md = new MarkdownIt({
		html: true,
	})

	export default {
		name: "Project",
		data() {
			return {
				name: '',
				proj: {},
				dayjs,
				readmeContent: ''
			}
		},
		methods: {
			shareLink() {
				console.log('分享链接:',location.href)
				process.browser && window.alert('分享链接见控制台!')
			},
			showMore() {
				console.log('更多')
				this.$router.go(-1)
			}
		},
		async created() {

			this.name = this.$route.query.name
			let readme = {content:''}
			try {
				({data:readme} = await getReadme(this.name))
			} catch (err) {
				console.log('此repo没有readme...')
			}

			this.proj = readme
			this.readmeContent = md.render(Base64.decode(this.proj.content))+''
		},
		/*beforeRouteEnter(to, from, next) {
			if (from.path.includes('opensource')) {
				next()
			} else {
				next({path: 'opensource/'})
			}
		}*/
	}
</script>

<style>
	.proj-title-wrap {
		display: flex;
		align-items: center;
		margin-bottom: 20px;
		border-bottom: 1px solid gainsboro;
	}
	.proj-title-wrap span {
		cursor: pointer;
	}
	.proj-share {
		margin-left: auto;
		margin-right: 20px;
	}
	.proj-more {
		margin-right: 20px;
	}
	.date {
		font-size: 14px;
		color: darkgrey;
	}
	.proj-content {
		font-size: 16px;
	}
	/*.proj-content img {
		width: 100%;
	}*/
</style>
