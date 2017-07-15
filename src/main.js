import Vue from 'vue'
import App from './App'
import i18n from './i18n'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  i18n,
  el: '#app',
  template: '<App/>',
  components: { App }
})
