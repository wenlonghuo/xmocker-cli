'use strict'
const db = require('../database')
const Proj = db.project
const ApiBase = db.apiBase
const Lib = db.Lib

module.exports = {
  search,
}

const searchAction = {
  project: searchProject,
  api: searchApi,
  lib: searchLib,
}

/**
 * search功能
 * 搜索条件：分类，项目，API，库
 */
async function search (ctx, next) {
  let finalParams = ctx.finalParams
  let size = ~~finalParams.pageSize
  let no = ~~finalParams.pageNo
  let skip = ~~(size * no)
  let type = finalParams.type

  delete finalParams.pageSize
  delete finalParams.pageNo

  let words = finalParams.keyword
  let regex = new RegExp(words, 'i')

  let result, total
  try {
    if (!type) {
      result = {}
      let keys = Object.keys(searchAction)
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i]
        result[key] = await searchAction[key](regex, {skip, size})
      }
      return ctx.respond.success('搜索成功', result)
    }
    if (!searchAction[type]) return ctx.respond.error('未知的搜索类型！')
    result = await searchAction[type](regex, { skip, size })
    total = result.total
    result = {
      list: result.list,
      pagination: {
        total: total,
        pageCnt: Math.ceil(total / size),
        pageNo: no,
      },
    }
    ctx.respond.success('搜索成功', result)
  } catch (e) {
    return ctx.respond.error('搜索日志出错', {e})
  }
}

async function searchProject (regex, {skip, size}) {
  const query = {
    $or: [
      { name: { $regex: regex } },
      { shortcut: { $regex: regex } },
    ],
  }

  try {
    let total, list
    total = await Proj.count(query)
    list = await Proj.cfind(query).sort({ name: 1 }).skip(skip).limit(size).exec()
    return {
      list,
      total,
    }
  } catch (e) {
    throw e
  }
}

async function searchApi (regex, {skip, size}) {
  const query = {
    $or: [
      {name: {$regex: regex}},
      {description: {$regex: regex}},
    ],
  }

  try {
    let total, list
    total = await ApiBase.count(query)
    list = await ApiBase.cfind(query).sort({ name: 1 }).skip(skip).limit(size).exec()

    return {
      list,
      total,
    }
  } catch (e) {
    throw e
  }
}

async function searchLib (regex, {skip, size}) {
  const query = {
    $or: [
      {name: {$regex: regex}},
      {description: {$regex: regex}},
    ],
  }

  try {
    let total, list
    total = await Lib.count(query)
    list = await Lib.cfind(query).sort({ name: 1 }).skip(skip).limit(size).exec()
    return {
      list,
      total,
    }
  } catch (e) {
    throw e
  }
}
