import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default ({
  state: {
    menuList: [],
    permList: [],
    loadRoutes: false,
    editableTabsValue: '2',
    editableTabs: [{
      title: 'Home',
      name: 'Index'
    }]
  },
  mutations: {
    setMenuList (state, menu) {
      state.menuList = menu
    },
    setPermList (state, perm) {
      state.permList = perm
    },
    changeRouteStatus (state, loadRoutes) {
      state.loadRoutes = loadRoutes
    },
    addTab (state, tab) {
      const index = state.editableTabs.findIndex(e => e.name === tab.name)
      if (index === -1) {
        state.editableTabs.push({
          title: tab.title,
          name: tab.name
        })
      }
      state.editableTabsValue = tab.name
    },
    resetState: (state) => {
      state.menuList = []
      state.permList = []
      state.loadRoutes = false
      state.editableTabsValue = 'Index'
      state.editableTabs = [{
        title: 'Home',
        name: 'Index'
      }]
    }
  },
  actions: {},
  modules: {}
})
