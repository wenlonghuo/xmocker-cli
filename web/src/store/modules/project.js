const type = {
  SET_PROJECT_LIST: 'SET_PROJECT_LIST',
  CHECK_PROJECT_LIST: 'CHECK_PROJECT_LIST',
  INCREMENT: 'INCREMENT',
  SET_PAGE_SIZE: 'SET_PAGE_SIZE',
}

const state = {
  list: [],
  pageSize: 6,
  pageNo: 0,
}

const getters = {
  selector: (state) => {
    return state.list.map((p) => { return {name: p.name, id: p._id} })
  },
  pagedList: (state) => {
    return state.list.slice(state.pageNo * state.pageSize, state.pageNo * state.pageSize + state.pageSize)
  },
  totalSize: (state) => {
    return Math.ceil(state.list.length / state.pageSize)
  },
  reachLast: (state) => {
    return (state.pageNo + 1) * state.pageSize >= state.list.length
  },
  reachZero: (state) => {
    return state.pageNo <= 0
  },
}

const actions = {
  async [type.CHECK_PROJECT_LIST] ({dispatch}, context) {
    await context.getProjectList()
  }
}

const mutations = {
  [type.SET_PROJECT_LIST] (state, list) {
    state.list = list
  },
  [type.INCREMENT] (state, val) {
    if (val > 0 && getters.reachLast(state)) return
    if (val < 0 && getters.reachZero(state)) return
    state.pageNo += val
  },
  [type.SET_PAGE_SIZE] (state, val) {
    state.pageSize = val
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
