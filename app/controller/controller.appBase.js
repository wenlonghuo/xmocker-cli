'use strict'
const db = require('../database')
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
  ctx.respond.success('重载成功')
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
  ctx.respond.success('获取状态成功', { runningProject: procInfo })
}

async function getAppBase (ctx, next) {
  let finalParams = ctx.finalParams

  let result
  try {
    result = await AppBase.cfindOne(finalParams).exec()
  } catch (e) {
    return ctx.respond.error('查询基础信息出错', {e})
  }
  ctx.respond.success('获取app基础信息成功', {result})
}

async function editAppBase (ctx, next) {
  let finalParams = ctx.finalParams

  let result
  try {
    result = await AppBase.update({}, {$set: finalParams}, {returnUpdatedDocs: true, upsert: true})
    result = result[1]
  } catch (e) {
    return ctx.respond.error('保存基础信息出错', {e})
  }

  ctx.respond.success('更新基础信息成功', {result})
}

async function upgradeFromV0 (ctx, next) {
  try {
    await upgrade()
  } catch (e) {
    return ctx.respond.error('更新失败，请查看日志' + e.message, {e})
  }
  ctx.respond.success('导入成功', {})
}
