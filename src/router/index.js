import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import project from '../view/project.vue'

var router = new VueRouter({
  routes: [
    {name: 'index', path: '/', component: project}
  ]
})

export default router
