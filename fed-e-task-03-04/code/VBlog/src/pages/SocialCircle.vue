<template>
	<Layout>
		<div class="tabs">
			<div class="tab-follower"
			     :class="{active: active==='follower'}"
			     @click="active='follower'"
			>粉丝 <span>{{followerCount}}</span></div>
			<div class="tab-following"
			     :class="{active: active==='following'}"
			     @click="active='following'"
			>关注 <span>{{followingCount}}</span></div>
		</div>
		<div class="users follower" v-if="active==='follower'">
			<div class="card" v-for="follower in followers" :key="follower.id">
				<p>{{follower.name}}</p>
				<a :href="follower.page" style="text-decoration: none;color: deepskyblue">TA的主页</a>
				<img :src="follower.avatar" alt="ava">
			</div>

		</div>
		<Pager :info="$page.followers.pageInfo" />

		<div class="users following" v-if="active==='following'">
			<div class="card" v-for="following in followings" :key="following.id">
				<p>{{following.name}}</p>
				<a :href="following.page" style="text-decoration: none;color: deepskyblue">TA的主页</a>
				<img :src="following.avatar" alt="ava">
			</div>
		</div>
	</Layout>
</template>

<page-query>
	query ($page: Int) {
	followers: allFollower(perPage: 9, page: $page) @paginate {
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
	followCount(id: 1) {
	followerCount
	followingCount
	}
	}
</page-query>

<script>
	// https://api.github.com/users/GitHub-Laziji/followers?page=1&per_page=9
	import { Pager } from 'gridsome'
	export default {
		name: "SocialCircle",
		components: {
			Pager
		},
		data() {
			return {
				followers: [],
				followings: [],
				followerCount: 0,
				followingCount: 0,
				active: 'follower' // or 'following'
			}
		},
		watch: {
			$page(newValue, oldValue) {
				this.followers = (this.$page.followers.edges[0] && this.$page.followers.edges[0].node) && this.$page.followers.edges.map(item=>item.node);
				this.followings = (this.$page.followings.edges[0] && this.$page.followings.edges[0].node) && this.$page.followings.edges.map(item=>item.node);
			}
		},
		created() {
			this.followers = (this.$page.followers.edges[0] && this.$page.followers.edges[0].node) && this.$page.followers.edges.map(item=>item.node);
			this.followings = (this.$page.followings.edges[0] && this.$page.followings.edges[0].node) && this.$page.followings.edges.map(item=>item.node);

			[this.followerCount, this.followingCount] = [this.$page.followCount.followerCount, this.$page.followCount.followingCount]

			console.log('followers',this.followers,this.$data)

		}
	}
</script>

<style>
	.tabs {
		display: flex;
		border-bottom: 1px solid grey;
	}
	.tab-follower,.tab-following {
		border: 1px solid gainsboro;
		border-bottom: none;
		width: 80px;
		padding: 10px;
		cursor: pointer;
	}
	.active {
		color: dodgerblue;
	}

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
