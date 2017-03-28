// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import jsonEditor from './components/json-editor.vue'

Vue.mixin({
  components: {
    'json-editor': jsonEditor,
  },
  methods: {
    copyObj: function (to, from) {
      for (var f in from) {
        to[f] = typeof f === 'object' ? this.copyObj(to[f] || {}, from[f]) : from[f]
      }
      return to
    },
    formatJSONString: function (str) {
      str = str || ''
      var obj
      try {
        obj = new Function('return ' + str + '')()
      } catch (e) {
        console.log(e)
        return null
      }
      return JSON.stringify(obj)
    },
    prettyJSON: function (obj) {
      return JSON.stringify(obj, null, 4)
    },
  },
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  router,
  store,
  components: { App },
})
