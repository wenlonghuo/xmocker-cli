'use strict'
const db = require('../db')
const AppBase = db.appBase

// const util = require('../util')
const processControl = require('./processControl')
const processList = processControl.processList

module.exports = {
  getAppBase: getAppBase,
  editAppBase: editAppBase,
  getAppStatus: getAppStatus,
}

async function getAppStatus (ctx, next) {
  // let finalParams = ctx.finalParams
  let procInfo = []
  processList.forEach(function (proc) {
    procInfo.push({
      procInfo: proc.proc,
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

