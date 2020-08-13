import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: window.sessionStorage.getItem('username'),
    userRole: window.sessionStorage.getItem('userRole'),
    token: window.sessionStorage.getItem('token'),
    logo: window.sessionStorage.getItem('logo'),
    userId: window.sessionStorage.getItem('userId')
  },
  mutations: {
    login (state, data) {
      window.sessionStorage.setItem('username', data.username)
      window.sessionStorage.setItem('userRole', data.userRole)
      window.sessionStorage.setItem('token', data.token)
      window.sessionStorage.setItem('logo', data.userLogo)
      window.sessionStorage.setItem('userId', data.userId)
      state.username = data.username
      state.userRole = data.userRole
      state.token = data.token
      state.logo = data.userLogo
      state.userId = data.userId
    },
    logout (state) {
      // 注意不能用 null 清除，否则将无法判断 user 里具体的内容
      state.username = ''
      window.sessionStorage.removeItem('username')
      window.sessionStorage.removeItem('token')
    }
  },
  actions: {
  },
  modules: {
  }
})
