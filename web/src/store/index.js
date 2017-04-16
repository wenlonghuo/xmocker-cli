import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import project from './modules/project.js'
import log from './modules/log.js'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
const state = {
  actionBar: ''
}

const mutations = {
  SET_ACTIONBAR: (state, val) => {
    state.actionBar = val
  },
}

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  modules: {
    project,
    log,
  },
  strict: debug,
})
