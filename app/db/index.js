'use strict'

const Datastore = require('./promiseNeDb')


// api 基础数据
const apiBase = new Datastore({filename: 'db/api/base', autoload: true});

// mock用于显示数据
const mockLib = new Datastore({filename: 'db/mock/lib', autoload: true});
// mock数据历史记录
const mockHis = new Datastore({filename: 'db/mock/his', autoload: true});

// 基础配置
const appBase = new Datastore({mockDb: 'db/app/base', mockDb: true});

// 项目信息
const appProject = new Datastore({mockDb: 'db/app/project', mockDb: true});


module.exports = {
	apiBase: apiBase,
  mockLib: mockLib,
  mockHis: mockHis,
  appBase: appBase,
  appProject: appProject,
}