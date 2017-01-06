import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import project from '../view/project.vue'

import apiList from '../view/api-list.vue'

import apiAdd from '../view/api-add.vue'

var router = new VueRouter({
  routes: [
    {name: 'index', path: '/', component: project},
    {name: 'project-list', path: '/projectList/', component: project},
    {name: 'api-list', path: '/api/', component: apiList},
    {name: 'api-add', path: '/apiAdd/', component: apiAdd}
  ]
})

export default router
