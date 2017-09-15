'use strict'
const db = require('../../database')
const AppBase = db.appBase
const axios = require('axios')

module.exports = {
  getServerInfo,
  getRemoteUrl,
  request: {
    get: axiosGet,
    put: axiosPut,
  },
}

async function getRemoteUrl (url) {

}

function getServerInfo () {
  return AppBase.cfindOne({}).exec().then(doc => {
    doc = doc || {}
    let addr = doc.remoteAddress || 'http://localhost:6001'
    return addr
  })
  .catch(e => {
    return 'http://localhost:6001'
  })
}

function axiosGet (url, params) {
  return getServerInfo().then(server => {
    let remoteUrl = server + url
    return axios.request({url: remoteUrl, params}).then(res => res.data)
  })
}
function axiosPut (url, data) {
  return getServerInfo().then(server => {
    let remoteUrl = server + url
    return axios.request({url: remoteUrl, method: 'PUT', data}).then(res => res.data)
  })
}

