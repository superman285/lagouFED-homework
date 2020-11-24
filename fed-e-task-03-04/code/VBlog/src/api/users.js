const axios = require('axios')

const getFollowers = axios('https://api.github.com/users/GitHub-Laziji/followers?per_page=100&page=1')
const getFollowings = axios('https://api.github.com/users/GitHub-Laziji/following?per_page=100&page=1')
const getUserDatas = axios('https://api.github.com/users/GitHub-Laziji')

module.exports = {
	getFollowers,
	getFollowings,
	getUserDatas
}
