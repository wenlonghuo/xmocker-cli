'use strict'
// 重启数据库
const db = require('../../database')
const gInfo = require('./global-info')

module.exports = function reloadDatabase (msg) {
  let data = msg.data || []
  gInfo.apiList = []
  if (!data.length) {
    Object.keys(db).forEach((key) => {
      db[key].loadDatabase()
    })
  } else {
    data.forEach(function (name) {
      if (db[name]) db[name].loadDatabase()
    })
  }
}
