'use strict'
const Datastore = require('nedb-promise')
const join = require('path').join
const userDirectory = join(process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'], '.mocker/v1/db')

function createDatabase (dir, name, option) {
  let opt = { filename: join(dir, name), autoload: true }
  Object.assign(opt, option)
  return new Datastore(opt)
}

function initDatabase (option = {}) {
  let dir = option.location || userDirectory
  let createDb = createDatabase.bind(null, dir)

  // api 基础数据
  const apiBase = createDb('/apiBase')

  // mock用于显示数据
  const apiModel = createDb('/apiModel')

  // 基础配置
  const appBase = createDb('/appBase')

  // 项目信息
  const project = createDb('/project')

  const Lib = createDb('/lib')

  const commonDB = createDb('/commonDB')

  const dynDB = createDb('/dynDB')

  const collectorDB = createDb('/log/collectorDB')

  const recordDB = createDb('/log/recordDB')

  let td = +new Date() - 1000 * 60 * 60 * 24 * 5

  const proxyDB = createDb('/log/proxyDB', {
    onload: function () {
      proxyDB.remove({ time: { $lte: td } }, { multi: true }).catch(function (e) { console.log(e) })
    },
  })
  const errorDB = createDb('/log/error', {
    onload: function () {
      errorDB.remove({ time: { $lte: td } }, { multi: true }).catch(function (e) { console.log(e) })
    },
  })
  const hisDB = createDb('/log/his', {
    onload: function () {
      hisDB.remove({ time: { $lte: td } }, { multi: true }).catch(function (e) { console.log(e) })
    },
  })

  return {
    apiBase,
    apiModel,
    appBase,
    project,
    commonDB,
    dynDB,
    recordDB,
    proxyDB,
    errorDB,
    hisDB,
    Lib,
    collectorDB,
  }
}

module.exports = initDatabase()
