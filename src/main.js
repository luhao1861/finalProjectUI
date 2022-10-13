import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import global from './globalFun'
import locale from 'element-ui/lib/locale/lang/en'

Vue.prototype.$axios = axios
Vue.config.productionTip = false
// require('./mock.js')
Vue.use(ElementUI, { locale })
new Vue({
  router,
  store,
  global,
  render: h => h(App)
}).$mount('#app')
