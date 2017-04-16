'use strict'
const db = require('../../database/')
const Lib = db.Lib

const uid = require('../util/common').uid()

module.exports = {
  getLibDetail,
  getLibList,
  searchLib,
  addLib,
  editLib,
  deleteLib,
}

async function getLibDetail (ctx, next) {
  let finalParams = ctx.finalParams

  let baseData
  try {
    baseData = await Lib.cfindOne({_id: finalParams.id}).exec()
  } catch (e) {
    return ctx.setError({ctx: ctx, next: next, err: '查询lib详细信息出错', e: e})
  }
  ctx.body = {
    code: 0,
    data: {
      result: baseData,
    },
  }
  return next()
}

async function getLibList (ctx, next) {
  let finalParams = ctx.finalParams
  let size = ~~finalParams.pageSize
  let no = ~~finalParams.pageNo
  let skip = ~~(size * no)

  delete finalParams.pageSize
  delete finalParams.pageNo

  let data, total
  try {
    total = await Lib.count(finalParams)
    data = await Lib.cfind(finalParams).sort({name: 1}).skip(skip).limit(size).exec()
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

async function searchLib (ctx, next) {
  let finalParams = ctx.finalParams
  let size = ~~finalParams.pageSize
  let no = ~~finalParams.pageNo
  let skip = ~~(size * no)

  delete finalParams.pageSize
  delete finalParams.pageNo

  let words = finalParams.words
  let type = finalParams.type
  let regex = new RegExp(words, 'i')

  let query = {
    type: type,
    name: {$regex: regex},
  }

  let data, total
  try {
    total = await Lib.count(query)
    data = await Lib.cfind(query).sort({name: 1}).skip(skip).limit(size).exec()
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

async function addLib (ctx, next) {
  let finalParams = ctx.finalParams

  let data
  try {
    finalParams._uid = uid()
    finalParams._mt = +new Date()
    data = await Lib.insert(finalParams)
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

async function editLib (ctx, next) {
  let finalParams = ctx.finalParams

  let id = finalParams.id
  delete finalParams.id

  let data
  try {
    finalParams._mt = +new Date()
    data = await Lib.update({_id: id}, {$set: finalParams}, {returnUpdatedDocs: true})
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

async function deleteLib (ctx, next) {
  let finalParams = ctx.finalParams

  let data
  try {
    data = await Lib.remove({_id: finalParams.id}, { multi: true })
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
