import { getLog } from '@/api/api.js'
const TYPE = {
  SET_LOGS: 'SET_LOGS',
  ADD_LOGS: 'ADD_LOGS',
  GET_LOGS: 'GET_LOGS',
  CLEAR_LOGS: 'CLEAR_LOGS',
}

const state = {
  error: {
    list: [],
    pageNo: 0,
    total: 0,
    isOver: false,
    lastTime: '',
  },
  his: {
    list: [],
    pageNo: 0,
    total: 0,
    isOver: false,
    lastTime: '',
  },
  proxy: {
    list: [],
    pageNo: 0,
    total: 0,
    isOver: false,
    lastTime: '',
  },
  record: {
    list: [],
    pageNo: 0,
    total: 0,
    isOver: false,
    lastTime: '',
  },
  collector: {
    list: [],
    pageNo: 0,
    total: 0,
    isOver: false,
    lastTime: '',
  },
}

const getters = {

}

const actions = {
  async [TYPE.GET_LOGS] ({dispatch, state, commit}, {type, search, refresh}) {
    let info = state[type]
    if (refresh) {
      commit(TYPE.CLEAR_LOGS, { type })
    }
    if (info.isOver) return
    let query = Object.assign({}, search, {
      type,
      pageNo: info.pageNo,
      pageSize: 20,
    })
    let logs = await getLog(query).catch(e => console.log(e))
    if (logs.code) return
    commit(TYPE.SET_LOGS, {type, data: logs.data})
  }
}

const mutations = {
  [TYPE.SET_LOGS] (state, {type, data}) {
    let info = state[type]
    info.list.push(...data.list)
    info.pageNo = data.pagination.pageNo + 1
    info.total = data.pagination.total
    if (Math.floor(info.total / 20) < info.pageNo) info.isOver = true
    info.lastTime = info.list.length ? info.list.reduce((sum, value) => sum.time < value.time ? value : sum).time : ''
  },
  [TYPE.CLEAR_LOGS] (state, {type}) {
    let info = state[type]
    info.list.splice(0, info.list.length)
    info.pageNo = 0
    info.total = 0
    info.isOver = false
    info.lastTime = ''
  },
  [TYPE.ADD_LOGS] (state, option) {
    let logType = option.logType
    let info = state[logType]
    info.list.unshift(option.data)
    info.lastTime = option.data.time
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
