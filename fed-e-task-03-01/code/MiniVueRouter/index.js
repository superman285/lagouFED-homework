// 可设置history模式或hash模式

let _Vue = null

class VueRouter {
	static install(Vue) {
		//1 判断当前插件是否被安装
		if (VueRouter.install.installed) {
			return;
		}
		VueRouter.install.installed = true
		//2 把Vue的构造函数记录在全局
		_Vue = Vue
		//3 把创建Vue的实例传入的router对象注入到Vue实例
		// _Vue.prototype.$router = this.$options.router
		// 使用mixin生命周期钩子 每个组件的beforeCreate挂载
		// 为了延后挂载$router的时机 若是在开始时候就挂载 那时候还没有$router呢
		_Vue.mixin({
			beforeCreate() {
				if (this.$options.router) {
					_Vue.prototype.$router = this.$options.router

				}

			}
		})
	}

	constructor(options) {
		this.$options = options;
		this.mode = options.mode;
		this.routeMap = {}
		// observable
		this.data = _Vue.observable({
			current: "/"
		})
		// 另一个响应式写法
		// const initial = window.location.pathname.slice(1) || '/';
		// _Vue.util.defineReactive(this.data,'current',initial);
		this.init()
		console.log('this.mode', this.mode);
	}

	init() {
		this.createRouteMap()
		this.initComponent(_Vue)
		this.initEvent()
	}

	createRouteMap() {
		//遍历所有的路由规则 吧路由规则解析成键值对的形式存储到routeMap中
		this.$options.routes.forEach(route => {
			this.routeMap[route.path] = route.component
		});
	}

	initComponent(Vue) {
		const router_instance = this;

		Vue.component("router-link", {
			props: {
				to: String
			},
			render(h) {
				switch (router_instance.mode) {
					case 'history':
						let renderRes1 = h("a", {
							attrs: {
								href: this.to
							},
							on: {
								click: this.clickhander
							}
						}, [this.$slots.default])
						return renderRes1;
					case 'hash':
						let renderRes2 = h("a", {
							attrs: {
								href: `#${this.to}`
							},
							on: {
								click: this.clickhander2
							}
						}, [this.$slots.default])
						return renderRes2;
					default:
						break;

				}

			},
			methods: {
				clickhander(e) {
					history.pushState({},"",this.to);
					this.$router.data.current = this.to
					e.preventDefault()
				},
				clickhander2(e) {
					console.log('this.to2', this.to, e);
				}
			},
			/*template:"<a ref='link' :href='to'><slot></slot></a>",
			mounted() {
				let link = this.$refs.link;
				console.log('link',link);
				link.onclick = (e)=>{
					history.pushState({},"",this.to)
					this.$router.data.current=this.to
					e.preventDefault();
				}
			}*/
		})
		const self = this
		// 此处this为vue-router
		console.log('outer render', this);
		Vue.component("router-view", {
			render(h) {
				// 此处this为vue组件
				console.log('inner render', this);

				const cm = self.routeMap[self.data.current]
				// h函数将组件转换为虚拟dom
				return h(cm)
			}
		})

	}

	initEvent() {
		console.log('initEvent',this.mode);
		switch (this.mode) {
			case 'history':
				window.addEventListener("popstate", () => {
					console.log('hashchange',location.pathname);
					this.data.current = window.location.pathname
				})

				// 处理刷新后情况
				window.addEventListener("load", () => {
					this.data.current = window.location.pathname
				})
				break;
			case 'hash':
				window.addEventListener("hashchange", () => {
					console.log('hashchange',location.hash);
					this.data.current = window.location.hash.slice(1);
				})
				window.addEventListener("load", () => {
					this.data.current = window.location.hash.slice(1);
				})
				break;
			default:
				break;
		}

	}
}

export default VueRouter;
