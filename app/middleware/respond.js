'use strict'
/**
 * 返回格式化模块
 * 提供 ctx.respond.success和ctx.respond.error两种方法
 */

function logError (ctx, code, msg, option = {}) {
  if (typeof code === 'object' && code.code != null) {
    ctx.body = Object.assign({}, code, {message: code.msg})
    return
  }
  if (typeof msg === 'object' || msg == null) {
    option = msg || {}
    msg = code
    code = -1
  }
  ctx.info.e = option.e
  ctx.body = {
    code: code,
    message: msg,
    data: option.data,
  }
}

function success (ctx, msg, data) {
  ctx.info.message = msg
  ctx.body = {
    code: 0,
    message: msg,
    data: data,
  }
}

module.exports = function () {
  return async function sendMessage (ctx, next) {
    ctx.info = ctx.info || {}
    ctx.respond = ctx.respond || {}
    ctx.respond.success = success.bind(ctx, ctx)
    ctx.respond.error = logError.bind(ctx, ctx)
    return next()
  }
}
