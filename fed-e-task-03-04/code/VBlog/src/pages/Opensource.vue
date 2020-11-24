<template>
	<Layout>
		<div class="search">
			<input v-model="search" type="text" placeholder="搜索repo">
			&nbsp;
			<button @click="searchRepo">搜索</button>
		</div>
		<div class="project-card" v-for="project in projects" :key="project.id" @click="goToProject(project.name,project.id)">
			<div class="title">
				<h2>{{ project.name }}</h2>
				<span class="goto-github" @click="goToGithub(project.name)">前往GitHub</span>
				<span class="share" @click="shareLink($event,project.id)">分享链接</span>
			</div>
			<div class="project-contnet-wrap">
				<p style="color: darkgrey">最近更新 {{dayjs(project.updated_at).format('YYYY-MM-DD HH:mm:ss')}}</p>
				<div class="project-description">{{project.description}}</div>
			</div>
			<div class="counts">
				<div class="count-star">
					<img src="../assets/img/star.png" alt="star_count">
					<span>{{project.stars}}</span>
				</div>
				<div class="count-watcher">
					<img src="../assets/img/watcher.png" alt="watcher_count">
					<span>{{project.watchers}}</span>
				</div>
				<div class="count-fork">
					<img src="../assets/img/fork.png" alt="fork_count">
					<span>{{project.forks}}</span>
				</div>
			</div>
		</div>

		<Pager :info="$page.projects.pageInfo" />
	</Layout>
</template>

<page-query>
	query ($page: Int) {
		projects: allRepo(perPage: 10, page: $page) @paginate {
			pageInfo {
				totalPages
				currentPage
			}
			edges {
				node {
					id
					name
					created_at
					updated_at
					description
					stars
					watchers
					forks
				}
			}
		}
	}
</page-query>

<script>
import dayjs from 'dayjs'
import {Pager} from 'gridsome'
import axios from 'axios'
const {getReadme} = require('../api/readme')

export default {
  name: "Opensource",
	data() {
		return {
			dayjs,
			projects: [],
			search: ''
		}
	},
	components: {
  	Pager
	},
	methods: {
		async goToProject(repo,id) {
			this.$router.push({
				// name: 'project',
				path: 'project',
				/*params: {
					name: repo,
					project: readme
				},*/
				query: {
					name: repo,
					// id
				}
			})
		},
		goToGithub(repo) {
			process.browser && window.open(`https://github.com/superman285/${repo}`)
		},
		shareLink(ev, id) {
			process.browser && console.log('分享链接:', `${window.location.href}?id=${id}`)
			ev.stopPropagation();
			process.browser && window.alert('分享链接见控制台!')
		},
		searchRepo() {

			if (!this.search) {
				return console.log('请输入内容')
			}
			this.projects = this.projects.filter(proj => proj.name.includes(this.search))
		}
	},
	watch: {
		$page(newValue, oldValue) {
			this.projects = (this.$page.projects.edges[0] && this.$page.projects.edges[0].node) && this.$page.projects.edges.map(item=>item.node);
		},
		search(newV,oldV) {
			if (!newV && oldV) {
				this.projects = (this.$page.projects.edges[0] && this.$page.projects.edges[0].node) && this.$page.projects.edges.map(item=>item.node);
			}
		}
	},
	created() {
		this.projects = (this.$page.projects.edges[0] && this.$page.projects.edges[0].node) && this.$page.projects.edges.map(item=>item.node)
	}
}
</script>

<style>
	.project-card {
		border: 1px solid gainsboro;
		border-radius: 4px;
		margin-top: 40px;
		transition: .3s;
	}
	.project-card:hover {
		box-shadow: 3px 3px 7px lightgrey;
	}
	.project-card .title {
		border-bottom: 1px solid gainsboro;
		padding: 15px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.project-card .title .goto-github {
		margin-left: auto;
		margin-right: 20px;
		cursor: pointer;
	}
	.project-card .title .share {
		margin-right: 20px;
		cursor: pointer;
	}
	.project-contnet-wrap {
		padding: 20px;
	}
	.counts {
		display: flex;
		align-items: center;
		margin-bottom: 20px;
	}
	.counts>div {
		display: flex;
		align-items: center;
	}
	.counts>div img {
		width: 18px;
		margin-right: 7px;
		margin-left: 20px;
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
