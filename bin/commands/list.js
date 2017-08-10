'use strict'
const base = require('./base')

function getProjList (name) {
  return base.db.project.cfind({}).exec()
}

function getProjListByNet (option) {
  return base.getFromServer('project', option)
}

module.exports = function list (arg) {
  return base.initAppInfo().then(data => {
    return data ? getProjListByNet({ pageSize: 1000, pageNo: 0 }) : getProjList()
  }).then(data => {
    let list = (data.data ? data.data.list : data) || []
    console.log('name \t\t shortcut \t\tstatus')
    list.forEach(item => {
      console.log(`${item.name} \t\t ${item.shortcut} \t\t ${item.status ? 'running' : 'stopped'}`)
    })
  })
}
