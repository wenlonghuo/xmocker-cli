'use strict'
const db = require('../database')
const formatCtx = require('../util/formatCtx')
const broadcast = require('../service/service.ws').broadcast

module.exports = {
  errorUpload,
}

async function errorUpload (ctx, next) {
  let finalParams = ctx.finalParams
  try {
    let data = formatCtx(ctx, finalParams.message)
    data.err = {
      msg: finalParams.message,
      source: finalParams.source,
      lineno: finalParams.lineno,
      stack: finalParams.stack,
      colno: finalParams.colno,
    }
    await db.collectorDB.insert(data)
    broadcast({ type: 'log', action: 'ADD_LOGS', logType: 'collector', data: data })
  } catch (e) {
    return ctx.respond.error('保存错误信息出错', { e })
  }
  ctx.respond.success('提交成功')
}
