'use strict'

const projectGet = require('../service/project/service.get')

const syncGet = require('../service/sync/service.get')
const syncDiff = require('../service/sync/service.diff')
const syncDownload = require('../service/sync/service.download')
const syncReceive = require('../service/sync/service.receive')
const syncPush = require('../service/sync/service.push')

module.exports = {
  clientGetProjList,
  clientGetProjDetail,
  clientGetApiListByProject,
  clientGetApiListByIds,

  clientGetProjDiff,
  clientGetApiDiff,

  clientDownLoadProj,
  clientDownLoadProjBase,
  clientDownLoadApi,

  clientPushApiListById,
  clientPushApiById,
  clientPushApiByData,
  clientPushApiListByData,

  serverGetProjList,
  serverGetApiListByProject,
  serverGetProj,
  serverGetApi,

  serverDiffProj,
  serverDiffApi,
  serverReceiveApi,
  serverReceiveApiList,
}

/**
 * 获取远程项目列表
 */
async function clientGetProjList (ctx, next) {
  let finalParams = ctx.finalParams

  try {
    let data = await syncGet.getRemoteData('/mock/serverGetProjList', finalParams)
    ctx.body = data
    return
  } catch (e) {
    return ctx.respond.error('获取项目列表失败', { e })
  }
}
/**
 * 获取远程项目详情，通过UID
 */
async function clientGetProjDetail (ctx, next) {
  let finalParams = ctx.finalParams

  try {
    let data = await syncGet.getRemoteData('/mock/serverGetProjDetail', finalParams)
    ctx.body = data
    return
  } catch (e) {
    return ctx.respond.error('获取项目列表失败', { e })
  }
}
/**
 * 获取远程API列表，通过项目
 */
async function clientGetApiListByProject (ctx, next) {
  let finalParams = ctx.finalParams

  try {
    let data = await syncGet.getRemoteData('/mock/serverGetApiListByProject', finalParams)
    ctx.body = data
    return
  } catch (e) {
    return ctx.respond.error('获取项目列表失败', { e })
  }
}
/**
 * 获取远程API信息通过UID
 */
async function clientGetApiListByIds (ctx, next) {
  let finalParams = ctx.finalParams

  try {
    let data = await syncGet.getRemoteData('/mock/serverGetApiListByIds', finalParams)
    ctx.body = data
    return
  } catch (e) {
    return ctx.respond.error('获取项目列表失败', { e })
  }
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
  let localProject = finalParams.localProject
  try {
    if (!projUid) return ctx.respond.error('请提供本地项目UID')
    if (!localProject) return ctx.respond.error('请提供本地项目ID')
    if (!ids) return ctx.respond.error('请提供API的UID')
    let data = await syncDownload.downloadApi(ids, projUid, localProject, finalParams)
    if (data.code) {
      ctx.body = data
      return
    }
    let message = `下载API成功 ${data.api.ok.length}, 失败 ${data.api.fail.length}`
    return ctx.respond.success(message, data)
  } catch (e) {
    return ctx.respond.error('下载API出错', { e })
  }
}

/**
 * 发起PUSH系列
 */
async function clientPushApiListById (ctx, next) {
  let finalParams = ctx.finalParams
  let ids = finalParams.ids
  let projUid = finalParams.project
  try {
    ids = ids.split(',')
    if (!projUid) return ctx.respond.error('请提供项目UID')
    if (!ids.length) return ctx.respond.error('请提供API的UID')
    let data = await syncPush.pushApiToServerByIdList(ids, projUid, finalParams)
    ctx.body = data
    return
  } catch (e) {
    return ctx.respond.error('下载API出错', { e })
  }
}

async function clientPushApiById (ctx, next) {
  let finalParams = ctx.finalParams
  let id = finalParams.id
  let projUid = finalParams.project
  try {
    if (!projUid) return ctx.respond.error('请提供项目UID')
    if (!id) return ctx.respond.error('请提供API的UID')
    let data = await syncPush.pushApiToServerById(id, projUid, finalParams)
    ctx.body = data
    return
  } catch (e) {
    return ctx.respond.error('下载API出错', { e })
  }
}

async function clientPushApiByData (ctx, next) {
  let finalParams = ctx.finalParams
  let apiData = finalParams.data
  let projUid = finalParams.project
  try {
    if (!projUid) return ctx.respond.error('请提供项目UID')
    if (!apiData) return ctx.respond.error('请提供API数据')
    let data = await syncPush.pushApiToServerByData(apiData, projUid, finalParams)
    ctx.body = data
    return
  } catch (e) {
    return ctx.respond.error('下载API出错', { e })
  }
}

async function clientPushApiListByData (ctx, next) {
  let finalParams = ctx.finalParams
  let apiData = finalParams.data
  let projUid = finalParams.project
  try {
    if (!projUid) return ctx.respond.error('请提供项目UID')
    if (!apiData) return ctx.respond.error('请提供API数据')
    let data = await syncPush.pushApiListToServerByData(apiData, projUid, finalParams)
    ctx.body = data
    return
  } catch (e) {
    return ctx.respond.error('下载API出错', { e })
  }
}

// 服务器端供查询及下载
// 获取项目列表
async function serverGetProjList (ctx, next) {
  let finalParams = ctx.finalParams

  try {
    let data = await projectGet.getProjectByQuery({}, finalParams)
    return ctx.respond.success('获取项目列表成功', data)
  } catch (e) {
    return ctx.respond.error('获取项目列表失败', {e})
  }
}
// 根据上传的项目UID获取项目详情，包括API信息
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
// 根据项目UID获取项目下的API列表
async function serverGetApiListByProject (ctx, next) {
  let finalParams = ctx.finalParams
  let id = finalParams.id
  try {
    if (!id) return ctx.respond.error('下载的API长度不能为空')
    let data = await syncGet.getApiListByProjectUid(id, finalParams)

    return ctx.respond.success('获取API列表成功', data)
  } catch (e) {
    return ctx.respond.error('下载api信息出错', { e })
  }
}
// 根据上传的UID获取API列表
async function serverGetApi (ctx, next) {
  let finalParams = ctx.finalParams
  let ids = finalParams.ids.split(',')
  let project = finalParams.project
  try {
    if (!ids.length) return ctx.respond.error('下载的API长度不能为空')
    if (!project) return ctx.respond.error('请提供项目的UID')
    let data = await syncGet.getApiListByUid(ids, project)

    if (!data) return ctx.respond.error('项目不存在')

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

/**
 * 接收APIpush系列
 */
// 接收单个API
async function serverReceiveApi (ctx, next) {
  let finalParams = ctx.finalParams
  let apiData = finalParams.data
  let projectUid = finalParams.project
  try {
    if (!apiData) return ctx.respond.error('请提供API')
    if (!projectUid) return ctx.respond.error('请提供项目的UID')
    let data = await syncReceive.saveDownloadApi(apiData, projectUid, finalParams)
    if (!data) return ctx.respond.error('API或项目不存在')
    if (data.code) return ctx.respond.error(data)
    return ctx.respond.success('接收API成功', data)
  } catch (e) {
    return ctx.respond.error('接收API失败', { e })
  }
}
// 接收API列表
async function serverReceiveApiList (ctx, next) {
  let finalParams = ctx.finalParams
  let apiData = finalParams.data
  let projectUid = finalParams.project
  try {
    if (!apiData) return ctx.respond.error('请提供API')
    if (!projectUid) return ctx.respond.error('请提供项目的UID')
    let data = await syncReceive.saveDownloadApiList(apiData, projectUid, finalParams)
    if (!data) return ctx.respond.error('API或项目不存在')
    if (data.code) return ctx.respond.error(data)
    return ctx.respond.success('接收API成功', data)
  } catch (e) {
    return ctx.respond.error('接收API失败', { e })
  }
}
