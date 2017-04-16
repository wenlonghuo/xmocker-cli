'use strict'
const db = require('../../database')
const AppBase = db.appBase

const service = require('../service')
const processList = service.proc.state.proc
const upgrade = service.upgrade.upgradeFromV0

module.exports = {
  getAppBase: getAppBase,
  editAppBase: editAppBase,
  getAppStatus: getAppStatus,
  online: online,
  reloadDatabase: reloadDatabase,
  upgradeFromV0,
}

async function online (ctx, next) {
  ctx.body = {
    code: 0,
    data: 'online',
  }
  return next()
}

async function reloadDatabase (ctx, next) {
  Object.keys(db).forEach(function (name) {
    if (db[name].loadDatabase) {
      db[name].loadDatabase()
    }
  })
  ctx.body = {
    code: 0,
    data: '重载成功',
  }
}

async function getAppStatus (ctx, next) {
  // let finalParams = ctx.finalParams
  let procInfo = []
  processList.forEach(function (proc) {
    procInfo.push({
      procInfo: proc.proj,
      createdTime: proc.createdTime,
      pid: proc.pid,
      status: proc.status,
    })
  })
  procInfo.sort(function (a, b) { return a.procInfo.name > b.procInfo.name })
  ctx.body = {
    code: 0,
    data: {
      runningProject: procInfo,
    },
  }
  return next()
}

async function getAppBase (ctx, next) {
  let finalParams = ctx.finalParams

  let data
  try {
    data = await AppBase.cfindOne(finalParams).exec()
  } catch (e) {
    return ctx.setError({ctx: ctx, next: next, err: '查询基础信息出错', e: e})
  }

  ctx.body = {
    code: 0,
    data: {
      result: data,
    },
  }
  return next()
}

async function editAppBase (ctx, next) {
  let finalParams = ctx.finalParams

  let data
  try {
    data = await AppBase.update({}, {$set: finalParams}, {returnUpdatedDocs: true, upsert: true})
    data = data[1]
  } catch (e) {
    return ctx.setError({ctx: ctx, next: next, err: '保存基础信息出错', e: e})
  }

  ctx.body = {
    code: 0,
    data: {
      result: data,
      tip: '更新基础信息成功',
    },
  }
  next()
}

async function upgradeFromV0 (ctx, next) {
  try {
    await upgrade()
  } catch (e) {
    return ctx.setError({ctx: ctx, next: next, err: '更新失败，请查看日志' + e.message, e: e})
  }
  ctx.body = {
    code: 0,
    data: {
      result: {},
      tip: '导入成功',
    },
  }
  return next()
}
