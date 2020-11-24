<template>
	<Layout>

		<Tabs active="follower" />
		<div class="users follower" v-if="active==='follower'">
			<div class="card" v-for="follower in followers" :key="follower.id">
				<p>{{follower.name}}</p>
				<a  target="_blank"
						:href="follower.page" style="text-decoration: none;color: deepskyblue">TA的主页</a>
				<img :src="follower.avatar" alt="ava">
			</div>

		</div>
		<Pager :info="$page.followers.pageInfo" />
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
		followCount(id: 1) {
			followerCount
			followingCount
		}
	}
</page-query>

<script>
import { Pager } from 'gridsome'
import Tabs from '../layouts/Tabs'
export default {
  name: "SocialFollower",
	components: {
  	Pager,
		Tabs
	},
	data() {
		return {
			followers: [],
			followerCount: 0,
			followingCount: 0,
			active: 'follower' // or 'following'
		}
	},
	watch: {
		$page(newValue, oldValue) {
			this.followers = (this.$page.followers.edges[0] && this.$page.followers.edges[0].node) && this.$page.followers.edges.map(item=>item.node)
		}
	},
	created() {
		this.followers = (this.$page.followers.edges[0] && this.$page.followers.edges[0].node) && this.$page.followers.edges.map(item=>item.node);

		[this.followerCount, this.followingCount] = [this.$page.followCount.followerCount, this.$page.followCount.followingCount]


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
