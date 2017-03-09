'use strict'
const db = require('../db')
const apiBase = db.apiBase
const apiModel = db.apiModel
const appProject = db.appProject

// const util = require('../util')

const processControl = require('./processControl')
const procList = processControl.procList

module.exports = {
  restartBackground: restartBackground,
  reloadDatabase: reloadDatabase,
  ctrlApi: ctrlApi,
}

let restartSe = getSeTeam(function (info) {
  processControl.restartProcess(info.proj)
})

let reloadSe = getSeTeam(function (info) {
  processControl.sendMsg(info.id, {_type: 'func', func: 'reloadDatabase', data: info.dbs})
})

let ctrlApiSe = getSeTeam(function (info) {
  processControl.sendMsg(info.id, info.msg)
})

// 重新载入子进程的数据库
async function reloadDatabase (option) {
  getProjId(option, reloadSe.list, reloadSe)
}

// 重启子进程
async function restartBackground (option) {
  getProjId(option, restartSe.list, restartSe)
}

// 重启子进程
async function ctrlApi (id, data) {
  getProjId({apiBase: id}, ctrlApiSe.list, ctrlApiSe, data)
}

// 生成项目处理的序列
function getSeTeam (cb) {
  let handler
  let list = []
  let running

  function execList () {
    clearTimeout(handler)
    handler = setTimeout(function () {
      if (!running) drainList()
    }, 2000)
  }

  function drainList () {
    if (!list.length) {
      running = false
      return
    }
    running = true
    let info = list.shift()
    let id = info.id
    appProject.cfindOne({_id: id}).exec().then(function (doc) {
      if (doc) {
        if (procList.find(function (p) { return p.id === doc._id && p.status })) {
          info.proj = doc
          cb(info)
        }
        process.nextTick(drainList)
      }
    })
  }

  execList.list = list
  return execList
}
// 获取 项目id
function getProjId (option, list, cb, msg) {
  if (option.project) {
    let item = list.find(function (p) {
      return p.id === option.project
    })
    let proj = {id: option.project, dbs: ['appProject'], msg: msg}
    if (!item) {
      list.push(proj)
      cb()
    }
  } else if (option.apiBase) {
    apiBase.cfindOne({_id: option.apiBase}).exec().then(function (doc) {
      if (doc && doc.project) {
        let item = list.find(function (p) {
          return p.id === doc.project
        })
        if (!item) {
          list.push({id: doc.project, dbs: ['apiBase'], msg: msg})
          cb()
        }
      }
    })
  } else if (option.apiModel) {
    apiModel.cfindOne({_id: option.apiModel}).exec().then(function (model) {
      if (model && model.baseid) {
        apiBase.cfindOne({_id: model.baseid}).exec().then(function (doc) {
          let item = list.find(function (p) {
            return p.id === doc.project
          })
          if (!item) {
            list.push({id: doc.project, dbs: ['apiModel'], msg: msg})
            cb()
          }
        })
      }
    })
  }
}
