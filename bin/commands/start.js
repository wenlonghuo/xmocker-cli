'use strict'
const base = require('./base')

function getProjStateByNet (option) {
  return base.getFromServer('state/project', option)
}

function startProjByNet (id, option = {}) {
  option.id = id
  return base.sendToServer('startProject', option)
}

module.exports = function startProject (command) {
  let proj = command.args[0]
  return base.initAppInfo().then(isStarted => {
    if (!isStarted) return base.startServer({ proj })
    if (!proj) return console.error('主进程已启动，如果需要启动项目，请提供项目名')
    base.getProjIdByName(proj)
      .then((docs) => {
        if (docs) {
          let ids = docs.map(d => d._id).join(',')
          getProjStateByNet({ id: ids })
            .then(data => {
              if (data.code) return Promise.resolve(data)
              let list = data.data.list
              let emptyIds = docs.filter(doc => !list.find(l => l.id === doc._id))
              ids = emptyIds.map(d => d._id).join(',')
              if (!ids.length) return Promise.resolve({ message: '指定的项目已经全部启动' })
              return startProjByNet(ids, {})
            })
            .then(res => {
              console.log(res.message)
            })
        } else {
          console.log('未找到该项目，请确认输入的名称是否正确')
        }
      })
  })
}
