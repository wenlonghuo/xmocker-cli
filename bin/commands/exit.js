'use strict'
const base = require('./base')

function killMain () {
  return base.sendToServer('killMain', {})
}

module.exports = function (commander) {
  return base.initAppInfo().then(data => {
    if (!data) {
      console.log(`mocker服务未启动`)
    } else {
      killMain().catch(err => {
        if (err.code === 'ECONNRESET') {
          console.log('主进程已经成功退出')
        } else {
          throw err
        }
      })
    }
  })
}
