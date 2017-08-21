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
const searchDetail = r => require.ensure([], () => r(require('../pages/search-detail.vue')), 'list')

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
          path: '/index',
          name: '首页',
          component: index,
          meta: {
            breadList: [
              { name: '首页', menuName: '首页' },
            ],
          },
        },
        {
          path: 'apiEditor',
          name: 'API编辑',
          component: apiEditor,
          meta: {
            help: {
              name: 'api'
            },
          },
        },
        {
          path: 'apiDetail',
          name: 'API详情',
          component: apiDetail,
          meta: {
            breadList: [
              { name: '项目列表', menuName: '项目列表' },
              { name: '项目详情' },
              { name: 'API详情' },
            ],
            help: {
              name: 'api'
            },
          },
        },
        {
          path: 'apiCopy',
          name: 'API复制',
          component: apiCopy,
          meta: {
            breadList: [
              { name: '项目列表', menuName: '项目列表' },
              { name: '项目详情' },
              { name: 'API复制' },
            ],
            help: {
              name: 'api'
            },
          },
        },
        {
          path: 'projectList',
          name: '项目列表',
          component: projectList,
          alias: '/',
          meta: {
            breadList: [
              { name: '项目列表', menuName: '项目列表' },
            ],
            help: {
              name: 'project',
            },
          },
        },
        {
          path: 'projectDetail',
          name: '项目详情',
          component: projectDetail,
          meta: {
            breadList: [
              { name: '项目列表', menuName: '项目列表' },
              { name: '项目详情' },
            ],
            help: {
              name: 'project',
            },
          },
        },
        {
          path: 'projectEditor',
          name: '项目编辑',
          component: projectEditor,
          meta: {
            help: {
              name: 'project',
            },
          },
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
          meta: {
            breadList: [
              { name: '同步', menuName: '同步' },
            ],
            help: {
              name: 'sync',
            },
          },
        },
        {
          path: 'syncApi',
          name: '同步API',
          component: syncApi,
          meta: {
            breadList: [
              { name: '同步', menuName: '同步' },
              { name: 'API' },
            ],
            help: {
              name: 'sync',
            },
          },
        },
        {
          path: 'search',
          name: '搜索',
          component: search,
          meta: {
            breadList: [
              { name: '搜索', menuName: '搜索' },
            ],
          },
        },
        {
          path: 'search/detail',
          name: '搜索详情',
          component: searchDetail,
          meta: {
            breadList: [
              { name: '搜索', menuName: '搜索' },
              { name: '搜索详情' },
            ],
          },
        },
        {
          path: 'config',
          name: '基础配置',
          component: config,
          meta: {
            breadList: [
              { name: '基础配置', menuName: '基础配置' },
            ],
            help: {
              name: 'config',
            },
          },
        },
        {
          path: 'log',
          name: '日志',
          component: log,
          meta: {
            breadList: [
              { name: '日志', menuName: '日志' },
            ],
            help: {
              name: 'log',
            },
          },
        },
        {
          path: 'about',
          name: '关于',
          component: about,
          meta: {
            breadList: [
              { name: '关于', menuName: '关于' },
            ],
          },
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
