import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index.js'

Vue.use(Router)

// api
const apiEditor = r => require.ensure([], () => r(require('../pages/api-editor.vue')), 'editor')
const apiDetail = r => require.ensure([], () => r(require('../pages/api-detail.vue')), 'detail')
const apiCopy = r => require.ensure([], () => r(require('../pages/api-copy.vue')), 'list')

// project
const projectList = r => require.ensure([], () => r(require('../pages/project-list.vue')), 'list')
const projectDetail = r => require.ensure([], () => r(require('../pages/project-detail.vue')), 'detail')
const projectEditor = r => require.ensure([], () => r(require('../pages/project-editor.vue')), 'editor')

// lib
const libEditor = r => require.ensure([], () => r(require('../pages/lib-editor.vue')), 'editor')

// sync from server
const syncList = r => require.ensure([], () => r(require('../pages/sync-list.vue')), 'list')
const syncApi = r => require.ensure([], () => r(require('../pages/sync-api.vue')), 'detail')

// base config
const config = r => require.ensure([], () => r(require('../pages/config-editor.vue')), 'editor')

// index
const index = r => require.ensure([], () => r(require('../pages/first-page.vue')), 'list')

// search
const search = r => require.ensure([], () => r(require('../pages/search-list.vue')), 'list')

// about
const about = r => require.ensure([], () => r(require('../pages/about.vue')), 'list')

// log
const log = r => require.ensure([], () => r(require('../pages/log-list.vue')), 'list')

const router = new Router({
  routes: [
    {
      path: '/',
      component: require('../layout/default.vue'),
      children: [
        {
          path: '',
          name: '首页',
          component: index,
        },
        {
          path: 'apiEditor',
          name: 'API编辑',
          component: apiEditor,
        },
        {
          path: 'apiDetail',
          name: 'API详情',
          component: apiDetail,
        },
        {
          path: 'apiCopy',
          name: 'API复制',
          component: apiCopy,
        },
        {
          path: 'projectList',
          name: '项目列表',
          component: projectList,
          meta: {
            actionBar: 'project-list-action'
          },
        },
        {
          path: 'projectDetail',
          name: '项目详情',
          component: projectDetail,
          meta: {
            actionBar: 'project-detail-action'
          },
        },
        {
          path: 'projectEditor',
          name: '项目编辑',
          component: projectEditor,
        },
        {
          path: 'libEditor',
          name: '模板编辑',
          component: libEditor,
        },
        {
          path: 'syncList',
          name: '同步',
          component: syncList,
        },
        {
          path: 'syncApi',
          name: '同步API',
          component: syncApi,
        },
        {
          path: 'search',
          name: '搜索',
          component: search,
        },
        {
          path: 'config',
          name: '基础配置',
          component: config,
        },
        {
          path: 'log',
          name: '日志',
          component: log,
        },
        {
          path: 'about',
          name: '关于',
          component: about,
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  store.commit('SET_ACTIONBAR', to.meta.actionBar)
  return next()
})

export default router
