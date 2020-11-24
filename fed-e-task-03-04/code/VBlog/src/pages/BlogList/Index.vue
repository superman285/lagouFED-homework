<template>
	<Layout>
		<div class="search">
			<input v-model="search" type="text" placeholder="搜索博客">
			&nbsp;
			<button @click="searchBlog">搜索</button>
		</div>

		<!--或换g-link 用template套 -->
		<!--<template v-for="blog in blogs">
			<g-link tag="div" :to="`/blog/${blog.id}`"></g-link>
		</template>-->

		<div v-for="blog in blogs" :key="blog.id" class="blog-card" @click="goToBlog(blog.id)">
			<div class="title">
				<h2>{{ blog.title }}</h2>
				<span @click="shareLink($event,blog.id)">分享链接</span>
			</div>
			<div class="blog-contnet-wrap">
				<p style="color: darkgrey">最近更新 {{dayjs(blog.updated_at).format('YYYY-MM-DD HH:mm:ss')}}</p>
				<div class="blog-description">{{blog.description}}</div>
			</div>
		</div>

		<Pager :info="$page.blogs.pageInfo" />
	</Layout>
</template>

<page-query>
	query ($page: Int) {
	blogs: allStrapiBloglist(perPage: 2, page: $page) @paginate {
	pageInfo {
	totalPages
	currentPage
	}
	edges {
	node {
	id
	title
	content
	created_at
	updated_at
	description
	}
	}
	}
	}
</page-query>

<script>
	import dayjs from 'dayjs'
	import MarkdownIt from 'markdown-it'
	import { Pager } from 'gridsome'

	const md = new MarkdownIt()

	export default {
		name: "BlogList",
		data() {
			return {
				blogs:[],
				dayjs,
				md,
				search: ''
			}
		},
		components: {
			Pager
		},
		watch: {
			$page(newValue, oldValue) {
				this.blogs = (this.$page.blogs.edges[0] && this.$page.blogs.edges[0].node) && this.$page.blogs.edges.map(item=>item.node);
			},
			search(newV,oldV) {
				if (!newV && oldV) {
					this.blogs = (this.$page.blogs.edges[0] && this.$page.blogs.edges[0].node) && this.$page.blogs.edges.map(item=>item.node);
				}
			}
		},
		methods: {
			searchBlog() {
				if (!this.search) {
					return console.log('请输入内容')
				}
				this.blogs = this.blogs.filter(blog => blog.title.includes(this.search))
			},
			goToBlog(id) {

				const GoToBlog = (this.blogs.filter(blog=> +blog.id === +id) || [])[0]
				this.$router.push(`/blog/${id}`)
				/*this.$router.push({
					// name: 'blogdetail',
					params: {
						blog: GoToBlog,
						id: (GoToBlog || {}).id
					},
					/!*query: {
						id: (GoToBlog || {}).id
					}*!/
				})*/
			},
			shareLink(ev, id) {
				process.browser && console.log('分享链接:', `${window.location.href}/detail?id=${id}`)
				ev.stopPropagation();
				process.browser && window.alert('分享链接见控制台!')
			},
		},
		created() {
			this.blogs = (this.$page.blogs.edges[0] && this.$page.blogs.edges[0].node) && this.$page.blogs.edges.map(item=>item.node)
		}
	}
</script>

<style>
	.blog-card {
		border: 1px solid gainsboro;
		border-radius: 4px;
		margin-top: 40px;
		transition: .3s;
	}
	.blog-card:hover {
		box-shadow: 3px 3px 7px lightgrey;
	}
	.blog-card .title {
		border-bottom: 1px solid gainsboro;
		padding: 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.blog-card .title span {
		cursor: pointer;
	}
	.blog-contnet-wrap {
		padding: 20px;
	}

	nav {
		font-size: 18px;
		margin: 20px auto 0;
		width: 150px;
	}
	nav a:not(:last-child) {
		margin-right: 6px !important;
	}
</style>
