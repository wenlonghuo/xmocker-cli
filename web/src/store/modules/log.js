const type = {
  SET_LOGS: 'SET_LOGS',
  ADD_LOGS: 'ADD_LOGS',
}

const state = {
  err: [],
  his: [],
  proxy: [],
  fetchTime: 0,
}

const getters = {

}

const actions = {
  async [type.CHECK_PROJECT_LIST] ({dispatch}, context) {
    await context.getProjectList()
  }
}

const mutations = {
  [type.SET_LOGS] (state, val) {
    state.err = val.filter(v => v._type === 'error')
    state.his = val.filter(v => v._type === 'his')
    state.proxy = val.filter(v => v._type === 'proxy')
    state.fetchTime = +new Date()
  },
  [type.ADD_LOGS] (state, val) {
    let logType = val.logType
    logType = logType === 'error' ? 'err' : logType
    state[logType].unshift(val.data)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
