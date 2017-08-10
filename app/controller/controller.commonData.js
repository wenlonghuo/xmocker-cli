'use strict'
const db = require('../database/')
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
    return ctx.respond.error('查询模板信息出错', {e})
  }

  let res = {
    list: data,
    pagination: {
      total: total,
      pageCnt: Math.ceil(total / size),
      pageNo: no,
    },
  }
  ctx.respond.success('获取公用数据成功', res)
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
    return ctx.respond.error('搜索数据出错', {e})
  }

  let res = {
    list: data,
    pagination: {
      total: total,
      pageCnt: Math.ceil(total / size),
      pageNo: no,
    },
  }
  ctx.respond.success('获取公用数据成功', res)
}

async function addCommonData (ctx, next) {
  let finalParams = ctx.finalParams

  let result
  try {
    finalParams._uid = uid()
    finalParams._mt = +new Date()
    result = await CommonData.insert(finalParams)
  } catch (e) {
    return ctx.respond.error('添加api基础信息出错', {e})
  }
  ctx.respond.success('添加信息成功', {result})
}

async function editCommonData (ctx, next) {
  let finalParams = ctx.finalParams

  let id = finalParams.id
  delete finalParams.id

  let result
  try {
    finalParams._mt = +new Date()
    result = await CommonData.update({_id: id}, {$set: finalParams}, {returnUpdatedDocs: true})
    result = result[1]
  } catch (e) {
    return ctx.respond.error('编辑信息出错', {e})
  }

  ctx.respond.success('编辑信息成功', { result })
}

async function deleteCommonData (ctx, next) {
  let finalParams = ctx.finalParams

  let result
  try {
    result = await CommonData.remove({_id: finalParams.id}, { multi: true })
  } catch (e) {
    return ctx.respond.error('删除信息出错', {e})
  }

  ctx.respond.success('删除成功', {result})
}
