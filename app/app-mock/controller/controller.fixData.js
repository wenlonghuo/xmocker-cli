'use strict'
const gInfo = require('./global-info')
// 设置api状态 1表示抛异常， 2表示固定值， 3表示错误值, 4表示清除
module.exports.fix = function fixData (msg) {
  if (msg.api) {
    msg.type = ~~msg.type
    if (msg.type === 0) {
      gInfo.fixData[msg.api] = undefined
    } else {
      gInfo.fixData[msg.api] = msg
    }
  }
}

// 获取本api状态, 0表示正常， 1表示随机值， 2表示固定值， 3表示错误值
module.exports.get = function getFix (id) {
  return gInfo.fixData[id]
}
