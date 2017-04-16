'use strict'
const Datastore = require('./promiseNeDb')
const join = require('path').join
const userDirectory = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']
// api 基础数据
const apiBase = new Datastore({filename: join(userDirectory, '.mocker/v1/db/apiBase'), autoload: true})

// mock用于显示数据
const apiModel = new Datastore({filename: join(userDirectory, '.mocker/v1/db/apiModel'), autoload: true})

// 基础配置
const appBase = new Datastore({filename: join(userDirectory, '.mocker/v1/db/appBase'), autoload: true})

// 项目信息
const project = new Datastore({filename: join(userDirectory, '.mocker/v1/db/project'), autoload: true})

// 通用信息
const commonDB = new Datastore({filename: join(userDirectory, '.mocker/v1/db/commonDB'), autoload: true})

// 数据库可变信息
const dynDB = new Datastore({filename: join(userDirectory, '.mocker/v1/db/dynDB'), autoload: true})

const Lib = new Datastore({filename: join(userDirectory, '.mocker/v1/db/lib'), autoload: true})

// 下面是日志相关
const proxyDB = new Datastore({filename: join(userDirectory, '.mocker/v1/db/proxyDB'), autoload: true})

let td = +new Date() - 1000 * 60 * 60 * 24 * 5
// 错误数据库
const errorDB = new Datastore({filename: join(userDirectory, '.mocker/v1/db/log/error'),
  autoload: true,
  onload: function () {
    errorDB.remove({time: {$lte: td}}, {multi: true}).catch(function (e) { console.log(e) })
  },
})
// 请求历史数据库
const hisDB = new Datastore({filename: join(userDirectory, '.mocker/v1/db/log/his'),
  autoload: true,
  onload: function () {
    hisDB.remove({time: {$lte: td}}, {multi: true}).catch(function (e) { console.log(e) })
  },
})

module.exports = {
  apiBase,
  apiModel,
  appBase,
  project,
  commonDB,
  dynDB,
  proxyDB,
  errorDB,
  hisDB,
  Lib,
}
