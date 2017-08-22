'use strict'
const db = require('../database')
const ApiModel = db.apiModel
const ApiBase = db.apiBase

const uid = require('../util/common').uid()
const reloadDatabase = require('../service/service.ctrlProc').reload.add

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
  let size = ~~finalParams.pageSize
  let no = ~~finalParams.pageNo
  let skip = ~~(size * no)

  delete finalParams.pageSize
  delete finalParams.pageNo

  let data, total
  try {
    total = await ApiModel.count(finalParams)
    data = await ApiModel.cfind(finalParams).sort({name: 1}).skip(skip).limit(size).exec()
  } catch (e) {
    return ctx.respond.error('查询api基础信息出错', {e})
  }

  let res = {
    list: data,
    pagination: {
      total: total,
      pageCnt: Math.ceil(total / size),
      pageNo: no,
    },
  }
  ctx.respond.success('获取分支列表成功', res)
}

async function addApiModel (ctx, next) {
  let finalParams = ctx.finalParams

  let result
  try {
    finalParams._uid = uid()
    finalParams._mt = +new Date()
    if (finalParams.data) finalParams.data = JSON.stringify(finalParams.data)
    await ApiBase.update({ _id: finalParams.baseid }, { $set: { _mt: +new Date() } })
    result = await ApiModel.insert(finalParams)
  } catch (e) {
    return ctx.respond.error('添加api分支信息出错', {e})
  }
  reloadDatabase({ type: 'apiModel', id: result._id })

  ctx.respond.success('添加api分支成功', {result})
}

async function editApiModel (ctx, next) {
  let finalParams = ctx.finalParams

  let id = finalParams.id
  delete finalParams.id
  let result
  try {
    finalParams._mt = +new Date()
    if (finalParams.data) finalParams.data = JSON.stringify(finalParams.data)
    result = await ApiModel.update({ _id: id }, { $set: finalParams }, { returnUpdatedDocs: true })

    result = result[1]
    await ApiBase.update({ _id: result.baseid }, { $set: { _mt: +new Date() } })
  } catch (e) {
    return ctx.respond.error('编辑api分支信息出错', {e})
  }
  reloadDatabase({ type: 'apiModel', id: id })

  ctx.respond.success('编辑api分支成功', { result })
}

async function deleteApiModel (ctx, next) {
  let finalParams = ctx.finalParams

  let result
  try {
    result = await ApiModel.remove({ _id: finalParams.id }, { multi: true })
  } catch (e) {
    return ctx.respond.error('删除api分支信息出错', {e})
  }

  ctx.respond.success('编辑api分支成功', { result })
}
