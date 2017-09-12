'use strict'
const db = require('../database')
const ApiModel = db.apiModel

const apiGet = require('../service/api/service.get')
const apiEdit = require('../service/api/service.edit')

module.exports = {
  getApiModel: getApiModel,
  addApiModel: addApiModel,
  editApiModel: editApiModel,
  deleteApiModel: deleteApiModel,
  getApiModelList,
}

async function getApiModel (ctx, next) {
  let finalParams = ctx.finalParams

  let list
  try {
    list = await ApiModel.cfind(finalParams).exec()
  } catch (e) {
    return ctx.respond.error('查询api分支信息出错', {e})
  }

  ctx.respond.success('获取分支成功', {list})
}

async function getApiModelList (ctx, next) {
  let finalParams = ctx.finalParams

  try {
    let data = await apiGet.getModelByQuery({baseid: finalParams.baseid}, finalParams)
    return ctx.respond.success('获取分支列表成功', data)
  } catch (e) {
    return ctx.respond.error('分支列表出错', {e})
  }
}

async function addApiModel (ctx, next) {
  let finalParams = ctx.finalParams

  try {
    let data = await apiEdit.addModel(finalParams, true)
    if (data.code) return ctx.respond.error(data)
    return ctx.respond.success('添加API分支成功', { result: data.data })
  } catch (e) {
    return ctx.respond.error('添加api分支信息出错', {e})
  }
}

async function editApiModel (ctx, next) {
  let finalParams = ctx.finalParams

  let id = finalParams.id
  delete finalParams.id
  let data
  try {
    data = await apiEdit.editModel(id, finalParams)
    if (data.code) return ctx.respond.error(data)
    return ctx.respond.success('编辑API分支成功', { result: data.data })
  } catch (e) {
    return ctx.respond.error('编辑api分支信息出错', {e})
  }
}

async function deleteApiModel (ctx, next) {
  let finalParams = ctx.finalParams

  let data
  try {
    data = await apiEdit.deleteModel(finalParams.id)
    if (data.code) return ctx.respond.error(data)
    return ctx.respond.success('删除API分支成功', { result: data.data })
  } catch (e) {
    return ctx.respond.error('删除api分支信息出错', {e})
  }
}
