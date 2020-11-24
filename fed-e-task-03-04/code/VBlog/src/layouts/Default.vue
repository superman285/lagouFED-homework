
<template>
  <div class="layout">
    <header class="header">
      <!--<strong>
        <g-link to="/">{{ $static.metadata.siteName }}</g-link>
      </strong>
      <nav class="nav">
        <g-link class="nav__link" to="/">Home</g-link>
        <g-link class="nav__link" to="/about/">About</g-link>
      </nav>-->
      <h1>Superman285</h1>
      <p style="font-size: 18px">欢迎来到superman285的个人博客</p>
      <div class="btn-wrap">
        <button style="cursor:pointer;" >GitHub主页</button>
        <button style="cursor:pointer;" >博客源码</button>
      </div>
    </header>
      <main>
        <section class="sidebar" @click="clickTab($event)">
          <g-link class="trends" to="/trends" tag="div">
            <img v-if="activeTab==='trends'" width="18" src="../assets/img/star_active.png" alt="star">
            <img v-else width="18" src="../assets/img/star.png" alt="star">
            <span :class="{'active-tab':activeTab==='trends'}">最新动态</span>
          </g-link>
          <g-link class="socials" to="/social-follower" tag="div">
            <img v-if="activeTab==='socials'"  width="18" src="../assets/img/social_active.png" alt="social">
            <img v-else width="18" src="../assets/img/social.png" alt="social">
            <span :class="{'active-tab':activeTab==='socials'}">社交圈</span>
          </g-link>
          <g-link class="blogs" to="/blog-list" tag="div">
            <img v-if="activeTab==='blogs'"  width="18" src="../assets/img/bloglist_active.png" alt="bloglist">
            <img v-else width="18" src="../assets/img/bloglist.png" alt="bloglist">
            <span :class="{'active-tab':activeTab==='blogs'}">博客列表</span>
          </g-link>
          <g-link class="projects" to="/opensource" tag="div">
            <img v-if="activeTab==='projects'"  width="18" src="../assets/img/opensource_active.png" alt="opensource">
            <img v-else width="18" src="../assets/img/opensource.png" alt="opensource">
            <span :class="{'active-tab':activeTab==='projects'}">开源项目</span>
          </g-link>
          <div>
            <img width="18" src="../assets/img/help.png" alt="help">
            <span>使用帮助</span>
          </div>
          <div>
            <img width="18" src="../assets/img/readme.png" alt="readme">
            <span>README</span>
          </div>
        </section>
        <section class="content">
          <slot/>
        </section>
      </main>
  </div>
</template>



<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data: ()=>({

  }),
  created() {
    console.log('process', process)
  },
  methods: {
    ...mapMutations(['selectTab']),
    gotoGithub() {
      process.browser && window.open('https://github.com/superman285/VBlog-Imitate')
    },
    gotoBlogCode() {
      process.browser && window.open('https://github.com/superman285/VBlog-Imitate')
    },
    clickTab(ev) {
      const TABS = ['trends','socials','blogs','projects']
      TABS.forEach(tab=>{
        const activeTabIncluded = ev.path.some(ele => ele.classList && [...ele.classList].includes(tab))
        // activeTabIncluded && this.$store.commit('selectTab',tab)
        activeTabIncluded && this.selectTab(tab)
      })
    }
  },
  computed: {
    ...mapState(['activeTab'])
  }
}
</script>

<style>
body {
  font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  margin:0;
  padding:0;
  line-height: 1.5;
}

.layout {
  margin: 0 auto;
}

.header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  height: 300px;
  background-image: linear-gradient(120deg, rgb(38, 144, 249), rgb(252, 45, 45));
  color: rgb(255, 255, 255);
}

.header h1, .header p, .header .btn-wrap {
  margin: 20px auto;
}

.btn-wrap button {
  margin: auto 20px;
  padding: 10px;
  color: white;
  background: transparent;
  border: 1px solid white;
  border-radius: 4px;
}

main {
  width: 90%;
  margin: 40px auto;
  display: flex;
}

.sidebar {
  box-sizing: border-box;
  max-width: 250px;
  min-width: 250px;
  height: 380px;
  padding: 20px;
  border: 1px solid gainsboro;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.sidebar div {
  display: flex;
  align-items: center;
  width: 60%;
  margin: 0 auto;
  color: #515151;
  cursor: pointer;
}
.sidebar div span {
  margin-left: 20px;
}

.content {
  width: 100%;
  margin-left: 20px;
  padding: 20px;
  border: 1px solid gainsboro;
  border-radius: 4px;
}

span.active-tab {
  color: #11A0E0;
  font-weight: 500;
}

.nav__link {
  margin-left: 20px;
}
</style>
