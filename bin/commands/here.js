'use strict'
const Mocker = require('xmocker')
const stringify = require('../../app/util/stringify').stringifyPretty
function log (debug, msg) {
  if (msg.type === 'error' || debug) {
    console.log(stringify(msg))
  }
}

module.exports = function (commander) {
  let root = process.cwd()

  let option = {
    root,
    source: { type: 'json' },
    inject: commander.inject,
    port: commander.port || 6003,
    proxy404: commander.proxyTo,
    proxyMode: 1,
  }
  let mocker = new Mocker(option)
  let logger = log.bind(null, commander.debug)
  mocker.start(logger).then(function (config) {
    console.log('文件服务启动成功, 进程id： ' + mocker.server.pid + ', 端口号：' + config.port)
  })
}
