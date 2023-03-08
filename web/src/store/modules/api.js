const type = {
  SET_SEARCH: 'SET_SEARCH',
  SET_SORT: 'SET_SORT',
  CHECK_PROJECT_LIST: 'CHECK_PROJECT_LIST',
  INCREMENT: 'INCREMENT',
  SET_PAGE_SIZE: 'SET_PAGE_SIZE',
  SET_ZERO: 'SET_ZERO',
  SET_TOTAL: 'SET_TOTAL',
}

const state = {
  pageSize: 6,
  pageNo: 0,
  total: 0,
  sortBy: 'name',
  searchVal: '',
}

const getters = {
}

const mutations = {
  [type.SET_SEARCH] (state, val) {
    state.searchVal = val
  },
  [type.SET_SORT] (state, val) {
    state.sortBy = val
  },
  [type.INCREMENT] (state, val) {
    state.pageNo += val
  },
  [type.SET_PAGE_SIZE] (state, val) {
    state.pageSize = val
  },
  [type.SET_ZERO] (state, val) {
    state.pageNo = 0
    state.total = 1
  },
  [type.SET_TOTAL] (state, val) {
    state.total = val
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
}
