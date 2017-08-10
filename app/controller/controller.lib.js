'use strict'
const db = require('../database')
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

  let result
  try {
    result = await Lib.cfindOne({_id: finalParams.id}).exec()
  } catch (e) {
    return ctx.respond.error('查询lib详细信息出错', {e})
  }

  ctx.respond.success('获取Lib详情成功', {result})
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
    return ctx.respond.error('查询lib出错', {e})
  }

  let res = {
    list: data,
    pagination: {
      total: total,
      pageCnt: Math.ceil(total / size),
      pageNo: no,
    },
  }
  ctx.respond.success('获取lib列表成功', res)
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
    return ctx.respond.error('搜索API出错', {e})
  }

  let res = {
    list: data,
    pagination: {
      total: total,
      pageCnt: Math.ceil(total / size),
      pageNo: no,
    },
  }
  ctx.respond.success('搜索成功', res)
}

async function addLib (ctx, next) {
  let finalParams = ctx.finalParams

  let result
  try {
    finalParams._uid = uid()
    finalParams._mt = +new Date()
    result = await Lib.insert(finalParams)
  } catch (e) {
    return ctx.respond.error('添加lib出错', {e})
  }

  ctx.respond.success('添加Lib成功', {result})
}

async function editLib (ctx, next) {
  let finalParams = ctx.finalParams

  let id = finalParams.id
  delete finalParams.id

  let result
  try {
    finalParams._mt = +new Date()
    result = await Lib.update({_id: id}, {$set: finalParams}, {returnUpdatedDocs: true})
    result = result[1]
  } catch (e) {
    return ctx.respond.error('编辑lib出错', {e})
  }
  ctx.respond.success('编辑Lib成功', { result })
}

async function deleteLib (ctx, next) {
  let finalParams = ctx.finalParams

  let result
  try {
    result = await Lib.remove({_id: finalParams.id}, { multi: true })
  } catch (e) {
    return ctx.respond.error('删除api基础信息出错', {e})
  }
  ctx.respond.success('删除成功', { result })
}
