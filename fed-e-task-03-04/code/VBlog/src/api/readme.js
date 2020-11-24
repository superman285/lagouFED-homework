const axios = require('axios')

const getReadme = repo => axios(`https://api.github.com/repos/superman285/${repo}/contents/README.md`)

module.exports = {
	getReadme
}
