// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import iView from 'iview'
import locale from 'iview/dist/locale/en-US'
import App from './App'
import '../src/assets/styles/app.less'

window.blockstack = require('blockstack')
window.axios = require('axios')

Vue.config.productionTip = false
Vue.use(iView, { locale })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
