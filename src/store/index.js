import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user')),
    menuList: JSON.parse(localStorage.getItem('menuList')),
    roleId: localStorage.getItem("roleId")
  },
  mutations: {
    setToken(state, data) {
      state.token = data
    },
    setRoleId(state, data) {
      state.roleId = data
    },
    setUser(state, data) {
      state.user = data
    },
    setMenuList(state, menuList) {
      state.menuList = menuList
    }
  },
  actions: {}
})
export default store