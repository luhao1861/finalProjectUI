import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import Index from '../views/Index'
// import User from '../views/system/User'
// import Role from '../views/system/Role'
// import Menu from '../views/system/Menu'
import axios from '../axios'
import store from '../store'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [{
      path: '/index',
      name: 'Index',
      component: Index
    },
    //   {
    //   path: '/sys/user',
    //   name: 'User',
    //   component: User
    // }, {
    //   path: '/sys/role',
    //   name: 'Role',
    //   component: Role
    // }, {
    //   path: '/sys/menu',
    //   name: 'Menu',
    //   component: Menu
    // },
    {
      path: '/sys/userCenter',
      name: 'UserCenter',
      meta: {
        title: 'Reset Password'
      },
      component: () => import(/* webpackChunkName: "about" */ '../views/system/UserCenter.vue')
    }]
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  let loadRoutes = store.state.menu.loadRoutes
  const token = localStorage.getItem('token')
  if (to.path === '/login') {
    next()
  } else if (!token) {
    next({ path: '/login' })
  } else if (token && !loadRoutes) {
    if (!loadRoutes) {
      axios.get('/sys/menu/nav', {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }).then(res => {
        store.commit('setMenuList', res.data.data.nav)
        store.commit('setPermList', res.data.data.authorization)
        const newRoute = router.options.routes
        res.data.data.nav.forEach(menu => {
          if (menu.children) {
            menu.children.forEach(e => {
              const route = menuToRoute(e)
              if (route) {
                newRoute[0].children.push(route)
              }
            })
          }
        })
        router.addRoutes(newRoute)
        loadRoutes = true
        store.commit('changeRouteStatus', loadRoutes)
      })
    }
  }
  next()
})
const menuToRoute = (menu) => {
  if (!menu.component) {
    return null
  }
  const route = {
    name: menu.name,
    path: menu.path,
    meta: {
      icon: menu.icon,
      title: menu.title
    }
  }
  route.component = () => import(/* webpackChunkName: "about" */ '../views/' + menu.component + '.vue')
  return route
}
export default router
