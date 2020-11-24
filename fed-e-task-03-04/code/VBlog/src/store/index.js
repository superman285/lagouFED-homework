let activeTabFromLocal = 'trends'
process && process.browser && (activeTabFromLocal = window.localStorage.getItem('activeTab'))

const store = {
	state: {
		count: 0,
		activeTab: activeTabFromLocal
	},
	mutations: {
		increment (state) {
			state.count++
		},
		selectTab ( state, newTab) {
			state.activeTab = newTab
		}
	}
}

process && process.browser && window.addEventListener('beforeunload', e => window.localStorage.setItem('activeTab',store.state.activeTab))


export default store
