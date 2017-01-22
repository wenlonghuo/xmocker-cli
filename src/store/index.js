import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

var store = new Vuex.Store({
  state: {
    ws: {
      cmd: [{_cmd: 'init'}],
      logs: []
    }
  },
  mutations: {
    pushCmd: function (state, option) {
      state.ws.cmd.push(option)
    },
    shiftCmd: function (state, option) {
      state.ws.cmd.shift()
    },
    setLogs: function (state, option) {
      state.ws.logs.splice(0, state.ws.logs.length)
      state.ws.logs = option
    },
    pushLogs: function (state, option) {
      state.ws.logs.push(...option)
    }
  }
})

export default store
