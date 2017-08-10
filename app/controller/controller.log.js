'use strict'
const db = require('../database')
const logDb = {
  'error': db.errorDB,
  'his': db.hisDB,
  'proxy': db.proxyDB,
  'record': db.recordDB,
  'collector': db.collectorDB,
}

const getQuery = require('../util/getQuery').getQuery

module.exports = {
  searchLog,
}

async function searchLog (ctx, next) {
  let finalParams = ctx.finalParams
  let size = ~~finalParams.pageSize
  let no = ~~finalParams.pageNo
  let skip = ~~(size * no)
  let type = finalParams.type

  delete finalParams.pageSize
  delete finalParams.pageNo

  const sort = {time: -1}

  let list, total
  if (!logDb[type]) return ctx.respond.error('查询的日志类型不存在！')
  try {
    let query = getQuery(finalParams)
    total = await logDb[type].count(query)
    list = await logDb[type].cfind(query).sort(sort).skip(skip).limit(size).exec()
  } catch (e) {
    return ctx.respond.error('搜索日志出错', {e})
  }

  let res = {
    list,
    pagination: {
      total: total,
      pageCnt: Math.ceil(total / size),
      pageNo: no,
    },
  }
  ctx.respond.success('搜索api成功', res)
}
