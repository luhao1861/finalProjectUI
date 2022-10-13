<template>
  <el-container>
    <el-aside width="200px">
      <SideMenu></SideMenu>
    </el-aside>
    <el-container>
      <el-header>
        <Header></Header>
      </el-header>
      <el-main>
        <Tabs></Tabs>
        <div style="margin: 0 15px;">
          <router-view/>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import SideMenu from '@/views/include/SideMenu'
import Header from '@/views/include/Header'
import Tabs from '@/views/include/Tabs'

export default {
  name: 'Home',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    SideMenu: SideMenu,
    Header: Header,
    Tabs: Tabs
  },
  data: () => ({}),
  created () {
  },
  methods: {
    getUserInfo () {
      this.$axios.get('/sys/user').then(res => {
        this.user = res.data.data
      })
    },
    logout () {
      this.$axios.post('/logout').then(res => {
        localStorage.clear()
        sessionStorage.clear()
        this.$store.commit('resetState')
        this.$router.push('/login')
      })
    }
  }
}
</script>

<style scoped>

.el-container {
  padding: 0;
  margin: 0;
  height: 100vh;
}

.el-header, .el-footer {
  padding: 0px;
  background-color: #D22030;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  line-height: 200px;
  text-align: left;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: left;
  line-height: 50px;
  padding: 0px;
  margin: 0px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.header-avatar {
  float: right;
  width: 210px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

</style>
