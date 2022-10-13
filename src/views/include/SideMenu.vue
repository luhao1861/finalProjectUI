<template>
  <el-menu
    :default-active="this.$store.state.menu.editableTabsValue"
    class="el-menu-vertical-demo"
    background-color="#D22030"
    text-color="#fff"
    active-text-color="#ffd04b">

    <router-link to="/index">
      <el-menu-item index="Index"  @click="clickMenu({name:'Index',title:'Home'})">
        <template slot="title">
          <i class="el-icon-s-home"></i>
          <span slot="title">Home</span>
        </template>
      </el-menu-item>
    </router-link>
    <el-submenu v-for="menu in menuList" v-bind:key="menu.id" :index="menu.name" >
      <template slot="title">
        <i :class="menu.icon"></i>
        <span>{{ menu.title }}</span>
      </template>
      <router-link :to="item.path" v-for="item in menu.children" v-bind:key="item.id">
        <el-menu-item :index="item.name" @click="clickMenu(item)">
          <template slot="title">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </template>
        </el-menu-item>
      </router-link>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: 'SideMenu',
  data: () => ({
  }),
  computed: {
    menuList: {
      get () {
        return this.$store.state.menu.menuList
      }
    }
  },
  methods: {
    clickMenu (item) {
      this.$store.commit('addTab', item)
    }
  }
}
</script>

<style scoped>
.el-menu-vertical-demo {
  height: 100%;
}
</style>
