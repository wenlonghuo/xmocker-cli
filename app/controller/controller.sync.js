'use strict'

const syncGet = require('../service/sync/service.get')
const syncDiff = require('../service/sync/service.diff')
const syncDownload = require('../service/sync/service.download')

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

/**
 * 获取与服务器之间项目基础信息差异
 */
async function clientGetProjDiff (ctx, next) {
  try {
    let res = await syncDownload.getProjectListDiff()
    ctx.body = res
    return
  } catch (e) {
    return ctx.respond.error('获取项目差异出错', {e})
  }
}

/**
 * 获取与服务器之间某个项目所有api的差异
 */
async function clientGetApiDiff (ctx, next) {
  let finalParams = ctx.finalParams
  let projUid = finalParams.id
  try {
    if (!projUid) return ctx.respond.error('请提供项目UID')
    let res = await syncDownload.getApiListDiff(projUid)
    if (!res) return ctx.respond.error('项目不存在')
    ctx.body = res
    return
  } catch (e) {
    return ctx.respond.error('获取API差异出错', { e })
  }
}

/**
 * 下载服务器项目信息
 */
async function clientDownLoadProj (ctx, next) {
  let finalParams = ctx.finalParams
  let projUid = finalParams.id
  try {
    if (!projUid) return ctx.respond.error('请提供项目UID')
    let data = await syncDownload.downloadProject(projUid)
    if (data.code) {
      ctx.body = data
      return
    }
    return ctx.respond.success('下载项目成功', {})
  } catch (e) {
    return ctx.respond.error('下载项目出错', { e })
  }
}

/**
 * 下载服务器项目基础信息
 */
async function clientDownLoadProjBase (ctx, next) {
  let finalParams = ctx.finalParams
  let projUid = finalParams.id
  try {
    if (!projUid) return ctx.respond.error('请提供项目UID')
    await syncDownload.downloadProject(projUid)
    let data = await syncDownload.downloadProject(projUid)
    if (data.code) {
      ctx.body = data
      return
    }
    return ctx.respond.success('下载项目成功', {})
  } catch (e) {
    return ctx.respond.error('下载项目出错', { e })
  }
}

/**
 * 下载服务器项目基础信息
 */
async function clientDownLoadApi (ctx, next) {
  let finalParams = ctx.finalParams
  let ids = finalParams.ids
  let projUid = finalParams.project
  try {
    if (!projUid) return ctx.respond.error('请提供项目UID')
    if (!ids) return ctx.respond.error('请提供API的UID')
    let data = await syncDownload.downloadApi(ids, projUid, finalParams)
    if (data.code) {
      ctx.body = data
      return
    }
    return ctx.respond.success('下载API成功', {})
  } catch (e) {
    return ctx.respond.error('下载API出错', { e })
  }
}

// 服务器端供查询及下载
// 提供api信息下载
async function serverGetProj (ctx, next) {
  let finalParams = ctx.finalParams
  let id = finalParams.id
  let type = finalParams.type || 'detail'

  try {
    let data = await syncGet.getProjectByUid(id, type === 'detail')
    return ctx.respond.success('成功', data)
  } catch (e) {
    return ctx.respond.error('下载项目信息出错', {e})
  }
}

async function serverGetApi (ctx, next) {
  let finalParams = ctx.finalParams
  let ids = finalParams.ids.split(',')
  try {
    if (!ids.length) return ctx.respond.error('下载的API长度不能为空')
    let data = await syncGet.getApiListByUid(ids)
    
    return ctx.respond.success('获取API列表成功', {api: data})
  } catch (e) {
    return ctx.respond.error('下载api信息出错', {e})
  }
}

// 返回差值信息

async function serverDiffApi (ctx, next) {
  let finalParams = ctx.finalParams
  let projUid = finalParams.id
  let fromApi = finalParams.data

  try {
    if (!projUid) return ctx.respond.error('下载的项目UID不存在')
    if (!fromApi) return ctx.respond.error('下载的API信息不存在')
    let data = await syncDiff.diffApiListDataByTime({_uid: projUid}, fromApi)
    if (!data) return ctx.respond.error('项目不存在')
    return ctx.respond.success('获取API列表成功', data)
  } catch (e) {
    return ctx.respond.error('获取API差异出错', { e })
  }
}

// 返回差值信息
async function serverDiffProj (ctx, next) {
  let finalParams = ctx.finalParams
  let fromApi = finalParams.data
  try {
    if (!fromApi) return ctx.respond.error('下载的项目信息不存在')
    let data = await syncDiff.diffProjectListDataByTime({}, fromApi)
    return ctx.respond.success('获取项目列表成功', data)
  } catch (e) {
    return ctx.respond.error('获取项目差异出错', { e })
  }
}
