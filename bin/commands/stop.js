'use strict'
const base = require('./base')
function stopProjByNet (id) {
  return base.sendToServer('stopProject', { id: id, force: true })
}
module.exports = function kill (commander) {
  let proj = commander.args[0]
  if (!proj) return console.error('请输入要结束的项目名称')
  return base.initAppInfo().then(data => {
    if (!data) {
      console.log('mocker服务尚未启动')
      return
    }
    base.getProjIdByName(proj)
      .then((docs) => {
        if (docs) {
          let ids = docs.map(d => d._id).join(',')
          stopProjByNet(ids)
            .then(res => {
              console.log(res.message)
            })
        } else {
          console.log('未找到该项目，请确认输入的名称是否正确')
        }
      })
  })
}
