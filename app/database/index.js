'use strict'
const removeFile = require('fs').unlinkSync
const Datastore = require('nedb-promise')
const join = require('path').join
const timer = require('../util/timer')
const userDirectory = join(process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'], '.mocker/v1/db')

function createDatabase (dir, name, option) {
  let opt = { filename: join(dir, name), autoload: true }
  Object.assign(opt, option)
  return new Datastore(opt)
}

function removeDb (dir, name) {
  let filename = join(dir, name)
  removeFile(filename)
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
  let tdStr = timer(td)

  const proxyDB = createDb('/log/proxyDB', {
    onload: function (e) {
      if (e) {
        console.error('proxyDB: ', e)
        console.error('the file will be removed now, you may need to restart service')
        removeDb(dir, '/log/proxyDB')
        return
      }
      proxyDB.remove({ time: { $lte: td } }, { multi: true }).catch(function (e) { console.log(e) })
      proxyDB.remove({ time: { $lte: tdStr } }, { multi: true }).catch(function (e) { console.log(e) })
    },
  })
  const errorDB = createDb('/log/error', {
    onload: function (e) {
      if (e) {
        console.error('errordb: ', e)
        console.error('the file will be removed now, you may need to restart service')
        removeDb(dir, '/log/error')
        return
      }
      errorDB.remove({ time: { $lte: td } }, { multi: true }).catch(function (e) { console.log(e) })
      errorDB.remove({ time: { $lte: tdStr } }, { multi: true }).catch(function (e) { console.log(e) })
    },
  })
  const hisDB = createDb('/log/his', {
    onload: function (e) {
      if (e) {
        console.error('hisDb: ', e)
        console.error('the file will be removed now, you may need to restart service')
        removeDb(dir, '/log/his')
        return
      }
      hisDB.remove({ time: { $lte: td } }, { multi: true }).catch(function (e) { console.log(e) })
      hisDB.remove({ time: { $lte: tdStr } }, { multi: true }).catch(function (e) { console.log(e) })
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
