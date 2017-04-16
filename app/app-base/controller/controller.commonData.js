'use strict'
const db = require('../../database/')
const CommonData = db.CommonData

const uid = require('../util/common').uid()

module.exports = {
  getCommonData: getCommonData,
  searchCommonData: searchCommonData,
  addCommonData: addCommonData,
  editCommonData: editCommonData,
  deleteCommonData: deleteCommonData,
}

async function getCommonData (ctx, next) {
  let finalParams = ctx.finalParams
  let size = ~~finalParams.pageSize
  let no = ~~finalParams.pageNo
  let skip = ~~(size * no)

  delete finalParams.pageSize
  delete finalParams.pageNo

  if (finalParams.name) {
    finalParams.name = {$in: finalParams.name.split(',')}
  }

  let data, total
  try {
    total = await CommonData.count(finalParams)
    data = await CommonData.cfind(finalParams).sort({name: 1}).skip(skip).limit(size).exec()
  } catch (e) {
    return ctx.setError({ctx: ctx, next: next, err: '查询模板信息出错', e: e})
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

async function searchCommonData (ctx, next) {
  let finalParams = ctx.finalParams
  let size = ~~finalParams.pageSize
  let no = ~~finalParams.pageNo
  let skip = ~~(size * no)

  delete finalParams.pageSize
  delete finalParams.pageNo

  let words = finalParams.words
  let project = finalParams.project
  let regex = new RegExp(words)

  let query = {
    project: project,
    name: {$regex: regex},
  }

  let data, total
  try {
    total = await CommonData.count(query)
    data = await CommonData.cfind(query).sort({name: 1}).skip(skip).limit(size).exec()
  } catch (e) {
    return ctx.setError({ctx: ctx, next: next, err: '搜索API出错', e: e})
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

async function addCommonData (ctx, next) {
  let finalParams = ctx.finalParams

  let data
  try {
    finalParams._uid = uid()
    finalParams._mt = +new Date()
    data = await CommonData.insert(finalParams)
  } catch (e) {
    return ctx.setError({ctx: ctx, next: next, err: '添加api基础信息出错', e: e})
  }
  ctx.body = {
    code: 0,
    data: {
      result: data,
      tip: '添加api基础信息成功',
    },
  }
  return next()
}

async function editCommonData (ctx, next) {
  let finalParams = ctx.finalParams

  let id = finalParams.id
  delete finalParams.id

  let data
  try {
    finalParams._mt = +new Date()
    data = await CommonData.update({_id: id}, {$set: finalParams}, {returnUpdatedDocs: true})
    data = data[1]
  } catch (e) {
    return ctx.setError({ctx: ctx, next: next, err: '编辑api基础信息出错', e: e})
  }

  ctx.body = {
    code: 0,
    data: {
      result: data,
      tip: '编辑api基础信息成功',
    },
  }
  return next()
}

async function deleteCommonData (ctx, next) {
  let finalParams = ctx.finalParams

  let data
  try {
    data = await CommonData.remove({_id: finalParams.id}, { multi: true })
  } catch (e) {
    return ctx.setError({ctx: ctx, next: next, err: '删除api基础信息出错', e: e})
  }

  ctx.body = {
    code: 0,
    data: {
      result: data,
      tip: '删除成功',
    },
  }
  return next()
}
