'use strict'

const Datastore = require('../promiseNeDb')
const path = require('path')

// api 基础数据
const apiBase = new Datastore({filename: path.join(__dirname, '../../../db/api/base'), autoload: true})

// mock用于显示数据
const apiModel = new Datastore({filename: path.join(__dirname, '../../../db/api/model'), autoload: true})

// 基础配置
const appBase = new Datastore({filename: path.join(__dirname, '../../../db/app/base'), autoload: true})

// 项目信息
const appProject = new Datastore({filename: path.join(__dirname, '../../../db/app/project'), autoload: true})


module.exports = {
  apiBase: apiBase,
  apiModel: apiModel,
  appBase: appBase,
  appProject: appProject,
}
