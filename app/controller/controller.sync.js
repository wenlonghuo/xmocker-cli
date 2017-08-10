'use strict'
const db = require('../database')
const Project = db.project
const ApiModel = db.apiModel
const ApiBase = db.apiBase
const request = require('superagent')

module.exports = {
  clientGetProjDiff: clientGetProjDiff,
  clientGetApiDiff: clientGetApiDiff,
  clientDownLoadProj: clientDownLoadProj,
  clientDownLoadProjBase: clientDownLoadProjBase,
  clientDownLoadApi: clientDownLoadApi,
  serverGetProj: serverGetProj,
  serverGetApi: serverGetApi,
  serverDiffProj: serverDiffProj,
  serverDiffApi: serverDiffApi,
}

function getServerInfo () {
  return new Promise(function (resolve, reject) {
    db.appBase.cfindOne({}).exec().then(function (doc) {
      doc = doc || {}
      let addr = doc.remoteAddress || 'http://localhost:6001'
      // let host = addr.split(":")[0];
      // let port = addr.split(":")[1];
      resolve(addr)
    }, function () { resolve('http://localhost:6001') })
  })
}

/**
 * 获取与服务器之间项目基础信息差异
 */
async function clientGetProjDiff (ctx, next) {
  // let finalParams = ctx.finalParams
  let projData
  try {
    projData = await Project.cfind({}).exec()
  } catch (e) {
    return ctx.respond.error({ctx: ctx, next: next, err: '获取项目信息出错', e: e})
  }

  let host = await getServerInfo()
  let url = host + '/mock/serverDiffProj'
  let req = request.put(url).send({data: projData})
  let res = await req
  ctx.body = res.body
  return next()
}

/**
 * 获取与服务器之间某个项目所有api的差异
 */
async function clientGetApiDiff (ctx, next) {
  let finalParams = ctx.finalParams
  let projUid = finalParams.id
  let toArr = []
  try {
    let proj = await Project.cfindOne({_uid: projUid}).exec()

    if (proj) {
      let projId = proj._id
      let toApi = await ApiBase.cfind({project: projId}).exec()
      let aBids = toApi.map((api) => { return api._id })
      let toApiModel = await ApiModel.cfind({baseid: {$in: aBids}}).exec()

      toApi.forEach((api) => {
        let model = toApiModel.filter((ms) => { return ms.baseid === api._id })
        toArr.push({base: api, model: model})
      })
    }
  } catch (e) {
    return ctx.respond.error({ctx: ctx, next: next, err: '获取api信息出错', e: e})
  }
  let host = await getServerInfo()
  let url = host + '/mock/serverDiffApi'
  let req = request.put(url).send({id: projUid, data: toArr})
  let res = await req
  ctx.body = res.body
  return next()
}

/**
 * 下载服务器项目信息
 */
async function clientDownLoadProj (ctx, next) {
  let finalParams = ctx.finalParams
  finalParams.type = 'detail'

  let host = await getServerInfo()
  let url = host + '/mock/serverGetProj'
  let req = request.get(url).query(finalParams)
  let res = await req
  let data = res.body.data

  if (!res.body || res.body.code) return ctx.respond.error('下载项目信息出错')

  let proj = data.proj
  let apis = data.api

  delete proj._id
  let newP = await Project.update({_uid: proj._uid}, {$set: proj}, {returnUpdatedDocs: true, upsert: true})

  newP = newP[1] ? newP[1] : newP

  let projectId = newP._id
  // add to base

  for (let i = 0; i < apis.length; i++) {
    let api = apis[i]
    let base = api.base
    let model = api.model
    delete base._id
    base.project = projectId
    let rApiB = await ApiBase.update({_uid: base._uid}, {$set: base}, {returnUpdatedDocs: true, upsert: true})
    rApiB = rApiB[1] ? rApiB[1] : rApiB
    if (rApiB && rApiB._id) {
      for (let j = 0; j < model.length; j++) {
        delete model[j]._id
        model[j].baseid = rApiB._id
        await ApiModel.update({_uid: model[j]._uid}, {$set: model[j]}, {upsert: true})
      }
    }
  }

  ctx.respond.success('成功')
}

/**
 * 下载服务器项目基础信息
 */
async function clientDownLoadProjBase (ctx, next) {
  let finalParams = ctx.finalParams
  finalParams.type = 'base'

  let host = await getServerInfo()
  let url = host + '/mock/serverGetProj'
  let req = request.get(url).query(finalParams)
  let res = await req
  let data = res.body.data

  if (!res.body || res.body.code) return ctx.respond.error('下载项目信息出错')

  let proj = data.proj
  delete proj._id
  delete proj.path
  delete proj.port
  delete proj.member

  await Project.update({_uid: proj._uid}, {$set: proj}, {returnUpdatedDocs: true, upsert: true})

  ctx.respond.success('成功')
}

/**
 * 下载服务器项目基础信息
 */
async function clientDownLoadApi (ctx, next) {
  let finalParams = ctx.finalParams

  let host = await getServerInfo()
  let url = host + '/mock/serverGetApi'
  let req = request.get(url).query(finalParams)
  let res = await req

  let data = res.body.data
  if (!res.body || res.body.code) return ctx.respond.error('下载api信息出错')

  let apis = data.api

  let proj = await Project.cfindOne({_uid: finalParams.project}).exec()

  let projectId = proj._id
  // add to base

  for (let i = 0; i < apis.length; i++) {
    let api = apis[i]
    let base = api.base
    base.project = projectId
    let model = api.model

    delete base._id
    let rApiB = await ApiBase.update({_uid: base._uid}, {$set: base}, {returnUpdatedDocs: true, upsert: true})
    rApiB = rApiB[1]
    if (rApiB && rApiB._id) {
      for (let j = 0; j < model.length; j++) {
        delete model[j]._id
        model[j].baseid = rApiB._id
        await ApiModel.update({_uid: model[j]._uid}, {$set: model[j]}, {returnUpdatedDocs: true, upsert: true})
      }
    }
  }
  ctx.respond.success('成功')
  return next()
}

// 服务器端供查询及下载
// 提供api信息下载
async function serverGetProj (ctx, next) {
  let finalParams = ctx.finalParams
  let id = finalParams.id
  let type = finalParams.type || 'detail'

  let projInfo
  let apiArr = []
  try {
    projInfo = await Project.cfindOne({_uid: id}).exec()
    if (type === 'detail') {
      let procId = projInfo._id
      let apiBs = await ApiBase.cfind({project: procId}).exec()
      let apiBIds = apiBs.map(function (api) { return api._id })

      let apiMs = await ApiModel.cfind({ baseid: {$in: apiBIds} }).exec()

      apiBs.forEach((api) => {
        let model = apiMs.filter((ms) => { return ms.baseid === api._id })
        apiArr.push({base: api, model: model})
      })
    }
  } catch (e) {
    return ctx.respond.error('下载项目信息出错', {e})
  }
  ctx.respond.success('成功', {
    proj: projInfo,
    api: apiArr,
    version: '1.0',
  })
}

async function serverGetApi (ctx, next) {
  let finalParams = ctx.finalParams
  let ids = finalParams.ids.split(',')
  let apiArr = []
  try {
    let apiBs = await ApiBase.cfind({ _uid: {$in: ids} }).exec()

    let apiBIds = apiBs.map(function (api) { return api._id })

    let apiMs = await ApiModel.cfind({ baseid: {$in: apiBIds} }).exec()

    apiBs.forEach((api) => {
      let model = apiMs.filter((ms) => { return ms.baseid === api._id })
      apiArr.push({base: api, model: model})
    })
  } catch (e) {
    return ctx.respond.error('下载api信息出错', {e})
  }

  ctx.respond.success('成功', {
    api: apiArr,
    version: '1.0',
  })
}

// 返回差值信息

async function serverDiffApi (ctx, next) {
  let finalParams = ctx.finalParams
  let projUid = finalParams.id
  let fromApi = finalParams.data

  let result
  let toArr = []
  try {
    let proj = await Project.cfindOne({_uid: projUid}).exec()
    if (proj) {
      let projId = proj._id
      let toApi = await ApiBase.cfind({project: projId}).exec()
      let aBids = toApi.map((api) => { return api._id })
      let toApiModel = await ApiModel.cfind({baseid: {$in: aBids}}).exec()

      toApi.forEach((api) => {
        let model = toApiModel.filter((ms) => { return ms.baseid === api._id })
        toArr.push({base: api, model: model})
      })
    }
    result = diffTimeStamp(fromApi, toArr, {idKeys: ['base', '_uid'], timeKeys: ['base', '_mt']})
  } catch (e) {
    return ctx.respond.error('下载api区别信息出错', {e})
  }

  ctx.respond.success('成功', result)
}

// 返回差值信息
async function serverDiffProj (ctx, next) {
  let finalParams = ctx.finalParams
  let fromProj = finalParams.data

  let result
  try {
    let toProj = await Project.cfind({}).exec()
    // let tempObj = {}
    // console.log(fromProj, toProj);
    result = diffTimeStamp(fromProj, toProj)
  } catch (e) {
    return ctx.respond.error('下载项目区别信息出错', {e})
  }
  ctx.respond.success('成功', result)
}

function diffTimeStamp (fromArr, toArr, option = {}) {
  let idKeys = option.idKeys || ['_uid']
  let timeKeys = option.timeKeys || ['_mt']

  let tempObj = {}
  let result = {unchanged: [], behind: [], ahead: [], serverSide: [], clientSide: [], unstaged: []}
  // set all keys to an empty object;
  toArr.forEach((p) => {
    let tuid = getDeepValue(p, idKeys)
    tempObj[tuid] = {to: p}
  })

  fromArr.forEach((p) => {
    let tuid = getDeepValue(p, idKeys)
    if (tempObj[tuid]) {
      tempObj[tuid].from = p
    } else {
      tempObj[tuid] = {from: p}
    }
  })

  Object.keys(tempObj).forEach(function (tuid) {
    let obj = tempObj[tuid]
    let to = obj.to
    let from = obj.from
    let info = {server: to, client: from}
    if (to && from) {
      let toTime = getDeepValue(to, timeKeys)
      let fromTime = getDeepValue(from, timeKeys)

      if (toTime === fromTime) {
        result.unchanged.push(info)
      } else if (toTime > fromTime) {
        result.behind.push(info)
      } else if (toTime < fromTime) {
        result.ahead.push(info)
      } else {
        if (toTime) {
          result.behind.push(info)
        } else if (fromTime) {
          result.ahead.push(info)
        } else {
          result.untaged.push(info)
        }
      }
    } else if (to) {
      result.serverSide.push(info)
    } else if (from) {
      result.clientSide.push(info)
    }
  })

  return result

  function getDeepValue (obj = {}, arr = []) {
    let tmp = obj
    arr.forEach((a) => {
      tmp = tmp[a]
    })
    return tmp
  }
}
