'use strict'
const db = require('../../database/')
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

  let data
  try {
    data = await ApiModel.cfind(finalParams).exec()
  } catch (e) {
    return ctx.setError({ctx: ctx, next: next, err: '查询api分支信息出错', e: e})
  }

  ctx.body = {
    code: 0,
    data: {
      list: data,
    },
  }
  return next()
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
    return ctx.setError({ctx: ctx, next: next, err: '查询api基础信息出错', e: e})
  }

  ctx.body = {
    code: 0,
    data: {
      list: data,
      pagination: {
        total: total,
        pageCnt: Math.ceil(total / size),
        pageNo: no,
      },
    },
  }
  return next()
}

async function addApiModel (ctx, next) {
  let finalParams = ctx.finalParams

  let data
  try {
    finalParams._uid = uid()
    finalParams._mt = +new Date()
    await ApiBase.update({ _id: finalParams.baseid }, { $set: { _mt: +new Date() } })
    data = await ApiModel.insert(finalParams)
  } catch (e) {
    return ctx.setError({ctx: ctx, next: next, err: '添加api分支信息出错', e: e})
  }
  reloadDatabase({ apiModel: data._id })

  ctx.body = {
    code: 0,
    data: {
      result: data,
      tip: '添加api分支成功',
    },
  }
  next()
}

async function editApiModel (ctx, next) {
  let finalParams = ctx.finalParams

  let id = finalParams.id
  delete finalParams.id
  let data
  try {
    finalParams._mt = +new Date()
    data = await ApiModel.update({ _id: id }, { $set: finalParams }, { returnUpdatedDocs: true })

    data = data[1]
    await ApiBase.update({ _id: data.baseid }, { $set: { _mt: +new Date() } })
  } catch (e) {
    return ctx.setError({ctx: ctx, next: next, err: '编辑api分支信息出错', e: e})
  }
  reloadDatabase({ type: 'apiModel', id: id })

  ctx.body = {
    code: 0,
    data: {
      result: data,
      tip: '编辑api分支成功',
    },
  }
  next()
}

async function deleteApiModel (ctx, next) {
  let finalParams = ctx.finalParams

  let data
  try {
    data = await ApiModel.remove({ _id: finalParams.id }, { multi: true })
  } catch (e) {
    return ctx.setError({ctx: ctx, next: next, err: '删除api分支信息出错', e: e})
  }

  ctx.body = {
    code: 0,
    data: {
      result: data,
      tip: '删除成功',
    },
  }
  next()
}
