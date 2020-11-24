// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const {getFollowers, getFollowings, getUserDatas} =  require("./src/api/users")
const {getRepos} = require("./src/api/repos")


module.exports = function (api) {
	api.loadSource(async ({addCollection}) => {
		// Use the Data Store API here: https://gridsome.org/docs/data-store-api/

		const followerCollection = addCollection('Follower')
		const followingCollection = addCollection('Following')
		const followCountCollection = addCollection('FollowCount')

		const repoCollection = addCollection('Repo')

		const {data:followers} = await getFollowers
		const {data:followings} = await getFollowings
		const {data:followCount} = await getUserDatas

		const {data:repos} = await getRepos


		for (const {id, login, html_url, avatar_url} of followers) {
			followerCollection.addNode({
				id,
				name: login,
				page: html_url,
				avatar: avatar_url,
				count: followCount.followers
			})
		}

		for (const {id, login, html_url, avatar_url} of followings) {
			followingCollection.addNode({
				id,
				name: login,
				page: html_url,
				avatar: avatar_url,
				count: followCount.following
			})
		}

		followCountCollection.addNode({
			id: 1,
			followerCount: followCount.followers,
			followingCount: followCount.following
		})

		for (const {id,name,updated_at,created_at,description,stargazers_count,watchers_count,forks_count} of repos) {
			repoCollection.addNode({
				id,
				name,
				updated_at,
				created_at,
				description,
				stars: stargazers_count,
				watchers: watchers_count,
				forks: forks_count
			})
		}

	})

	api.createPages(({createPage}) => {
		// Use the Pages API here: https://gridsome.org/docs/pages-api/
	})
}
