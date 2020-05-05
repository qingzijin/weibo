// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import 'common/stylus/index.styl'
import store from './store'
import Vconsole from 'vconsole'
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload)

const vConsole = new Vconsole()

fastclick.attach(document.body)

Vue.use(vConsole)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
