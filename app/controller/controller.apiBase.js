'use strict'
const db = require('../database')
const apiBase = db.apiBase
const apiModel = db.apiModel

const service = require('../service')
const getProcById = service.proc.getProcById
const reloadDatabase = service.ctrlProc.reload.add
const uid = require('../util/common').uid()

const apiGet = require('../service/api/service.get.js')
const apiEdit = require('../service/api/service.edit.js')
const apiCopy = require('../service/api/service.copy.js')

module.exports = {
  getApiBase,
  searchApiBase,
  addApiBase,
  editApiBase,
  deleteApiBase,
  getApiDetail,
  copyApi,
  setApiStatus,
  getApiList,
}
// 获取指定ID的API详情
async function getApiDetail (ctx, next) {
  let finalParams = ctx.finalParams

  try {
    if (!finalParams.id) return ctx.respond.error('请提供API的ID')
    let result = await apiGet.getApiById(finalParams.id)
    if (!result) return ctx.respond.error('查询的API不存在或者已删除')
    ctx.respond.success('获取API详情成功', {result})
  } catch (e) {
    return ctx.respond.error('查询api详细信息出错', {e})
  }
}
// 获取API列表，带models
async function getApiList (ctx, next) {
  let finalParams = ctx.finalParams

  try {
    if (!finalParams.project) return ctx.respond.error('请提供项目的ID')
    let result = await apiGet.getApiByProject(finalParams.project, finalParams, true)
    return ctx.respond.success('获取API列表成功', result)
  } catch (e) {
    return ctx.respond.error('查询api列表出错', {e})
  }
}

// 获取API基础列表，可根据名字进行过滤
async function getApiBase (ctx, next) {
  let finalParams = ctx.finalParams
  let option = Object.assign({}, finalParams)

  let query = {
    project: finalParams.project,
  }

  if (finalParams.name) {
    query.name = {$in: finalParams.name.split(',')}
  }

  try {
    let result = await apiGet.getApiByQuery(query, option)
    return ctx.respond.success('获取API列表成功', result)
  } catch (e) {
    return ctx.respond.error('查询api列表出错', {e})
  }
}
// 搜索API，根据名称和项目ID
async function searchApiBase (ctx, next) {
  let finalParams = ctx.finalParams
  let option = Object.assign({}, finalParams)

  let words = finalParams.words
  let project = finalParams.project
  let regex = new RegExp(words, 'i')

  let query = {
    project: project,
    name: {$regex: regex},
  }

  try {
    let result = await apiGet.getApiByQuery(query, option)
    return ctx.respond.success('搜索API列表成功', result)
  } catch (e) {
    return ctx.respond.error('搜索API出错', {e})
  }
}

async function addApiBase (ctx, next) {
  let finalParams = ctx.finalParams

  try {
    let data = await apiEdit.addApi(finalParams)
    if (data.code) return ctx.respond.error(data)
    return ctx.respond.success('添加api基础信息成功', { result: data.data })
  } catch (e) {
    return ctx.respond.error('添加api基础信息出错', {e})
  }
}

async function editApiBase (ctx, next) {
  let finalParams = ctx.finalParams

  let id = finalParams.id
  finalParams.id = undefined

  let data
  try {
    data = await apiEdit.editApi(id, finalParams)
    if (data.code) return ctx.respond.error(data)
    return ctx.respond.success('编辑api基础信息成功', { result: data.data })
  } catch (e) {
    return ctx.respond.error('编辑api基础信息出错', {e})
  }
}

async function deleteApiBase (ctx, next) {
  let finalParams = ctx.finalParams

  try {
    let data = await apiEdit.deleteApi(finalParams.id)
    if (data.code) return ctx.respond.error(data)
    return ctx.respond.success('删除API成功', { result: data.data })
  } catch (e) {
    return ctx.respond.error('删除api基础信息出错', {e})
  }
}

async function copyApi (ctx, next) {
  let finalParams = ctx.finalParams

  let apiIds = finalParams.from.split(',')
  let projList = finalParams.to.split(',')

  // let data
  try {
    let result = await apiCopy.copyApi(apiIds, projList, finalParams)
    if (result.code) return ctx.respond.error(result)
    return ctx.respond.success('复制API成功', { result: result.data })
  } catch (e) {
    return ctx.respond.error('复制api出错', {e})
  }
}

// 设置 api状态， 包括 clear 清除状态  error 错误模式 fixed 固定模式 random 随机模式
async function setApiStatus (ctx, next) {
  let finalParams = ctx.finalParams

  let id = finalParams.project
  let proc = getProcById(id)
  if (!proc) {
    ctx.body = {
      code: -1,
      data: {
        tip: '项目尚未启动',
      },
    }
    return
  }
  try {
    await proc.setApiReturn(finalParams)
    ctx.respond.success('提交成功', { result: '' })
  } catch (e) {
    ctx.respond.success('提交失败成功,' + e.message, { e })
  }
}
