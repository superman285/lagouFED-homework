<template>
	<div class="tabs">
		<g-link
				tag="div"
				class="tab-follower"
		    :class="{'tab-active': active==='follower'}"
				to="/social-follower/"
		>粉丝 <span>{{followerCount}}</span></g-link>
		<g-link
				tag="div"
				class="tab-following"
		    :class="{'tab-active': active==='following'}"
				to="/social-following/"
		>关注 <span>{{followingCount}}</span></g-link>
	</div>
</template>

<static-query>
	query {
		followCount(id: 1) {
			followerCount
			followingCount
		}
	}
</static-query>

<script>
export default {
  name: "Tabs",
	props: ['active'],
	data() {
		return {
			followerCount: 0,
			followingCount: 0
		}
	},
	created() {
		[this.followerCount, this.followingCount] = [this.$static.followCount.followerCount, this.$static.followCount.followingCount]
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
	.tab-active {
		color: dodgerblue;
	}
</style>
