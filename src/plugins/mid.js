import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)
const icons = {
  iconfont: 'mdi',
}
export default new Vuetify(icons)