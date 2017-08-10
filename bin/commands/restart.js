'use strict'
const base = require('./base')
function startProjByNet (id, option = {}) {
  option.id = id
  return base.sendToServer('startProject', option)
}
module.exports = function restart (commander) {
  let proj = commander.args[0]
  if (!proj) return console.error('请输入要结束的项目名称')
  return base.initAppInfo().then(data => {
    if (!data) return console.error('主进程尚未启动，请使用start命令')
    base.getProjIdByName(proj)
      .then((docs) => {
        if (docs && docs.length) {
          let ids = docs.map(d => d._id).join(',')
          startProjByNet(ids, { force: true })
            .then(res => {
              console.log(res.message)
            })
        } else {
          console.log('未找到该项目，请确认输入的名称是否正确')
        }
      })
  })
}
