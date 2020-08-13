import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import moment from 'moment'
axios.defaults.baseURL = 'http://localhost:8081/'
axios.defaults.withCredentials = false
const basePicturePath = 'http://localhost:8081/static/'

Vue.prototype.$axios = axios
Vue.prototype.$moment = moment
Vue.prototype.$picturePath = basePicturePath
Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
