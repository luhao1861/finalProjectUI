<template>
  <el-header>
    <strong>CSUN Library Management System</strong>
    <div class="header-avatar">
      <el-avatar :src="user.avatar"></el-avatar>
      <el-dropdown>
        <el-button type="primary">
          {{ user.username }}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <router-link to="/sys/userCenter">Profile</router-link>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout">Log out</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script>
export default {
  name: 'Header',
  data: () => ({
    user: {
      id: '',
      username: '',
      avatar: '',
      created: ''
    }
  }),
  created () {
    this.getUserInfo()
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
.router-link-active{
  text-decoration: none;
}
.header-avatar {
  float: right;
}

.header-avatar {
  float: right;
  width: 210px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

</style>
