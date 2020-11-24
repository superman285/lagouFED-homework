<template>
	<Layout>

		<Tabs active="following" />
		<div class="users following" v-if="active==='following'">
			<div class="card" v-for="following in followings" :key="following.id">
				<p>{{following.name}}</p>
				<a  target="_blank"
						:href="following.page" style="text-decoration: none;color: deepskyblue">TA的主页</a>
				<img :src="following.avatar" alt="ava">
			</div>

		</div>
		<Pager :info="$page.followings.pageInfo" />
	</Layout>
</template>

<page-query>
	query ($page: Int) {
	followings: allFollowing(perPage: 9, page: $page) @paginate {
	pageInfo {
	totalPages
	currentPage
	}
	edges {
	node {
	id
	name
	page
	avatar
	}
	}
	}
	}
</page-query>

<script>
	import { Pager } from 'gridsome'
	import Tabs from '../layouts/Tabs'
	export default {
		name: "SocialFollowing",
		components: {
			Pager,
			Tabs
		},
		data() {
			return {
				followings: [],
				active: 'following' // or 'follower'
			}
		},
		watch: {
			$page(newValue, oldValue) {
				this.followings = (this.$page.followings.edges[0] && this.$page.followings.edges[0].node) && this.$page.followings.edges.map(item=>item.node)
			}
		},
		created() {
			this.followings = (this.$page.followings.edges[0] && this.$page.followings.edges[0].node) && this.$page.followings.edges.map(item=>item.node);

		}
	}
</script>

<style>
	.users {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-evenly;
		width: 30%;
		height: 18vw;
		border: 1px solid gainsboro;
		margin-top: 20px;
		box-shadow: 10px 10px 10px gainsboro;
	}
	.card img {
		width: 40%;
	}
	nav {
		font-size: 20px;
		margin: 20px auto 0;
		width: 150px;
	}
	nav a:not(:last-child) {
		margin-right: 6px !important;
	}
</style>
