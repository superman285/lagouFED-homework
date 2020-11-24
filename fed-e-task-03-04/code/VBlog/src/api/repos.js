const axios = require('axios')

const getRepos = axios('https://api.github.com/users/superman285/repos?page=1&per_page=105')

module.exports = {
	getRepos
}
