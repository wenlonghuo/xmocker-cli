'use strict'
let through2 = require('through2')

let broadcast = require('./service.ws').broadcast

// 生成需要的 stream
let errStream = through2(function (chunk, enc, cb) {
  process.stdout.write(chunk)
  cb(null, chunk)
})

// 日志记录函数
function mocker (data) {
  if (typeof data === 'object') {
    if (data.res && typeof data.res === 'object') {
      data.res = JSON.stringify(data.res)
    }
    broadcast({type: 'log', action: 'ADD_LOGS', logType: data.type, data: data})

    let type = data.type === 'his' ? 'info' : data.type
    if (logger[type]) {
      logger[type](data)
    }
  }
}

module.exports = function (msg) {
  process.stdout.write(msg)
}

module.exports.errStream = errStream
module.exports.mocker = mocker
