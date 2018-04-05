// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import mixins from './mixin.js'
import './assets/css/common.css'
import './components/page-action/index.js'
import Socket from './util/socket.js'

Vue.use(iView)

Vue.prototype.$socket = new Socket(store)

Vue.config.productionTip = false

Vue.mixin({
  ...mixins
})

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
