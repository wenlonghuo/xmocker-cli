'use strict'
/**
 * 日志记录。包含内容
 * _type: 'out'
 * level: 10 日志等级
 * time: 时间戳
 * data: 内容
 * project: project名称
 * api： api名称
 * apiModel： 分支名称
 * projectId: 项目id
 * apiId: 接口Id
 * apiModelId: 分支id
 * req: 请求入参
 * reqParse: 转换后入参
 * res: 输出参数
 * args: process的启动参数
 * err: 错误详细信息
 * additional: 其他参数
 */
let errorExp = /\$\{msg\}/gi
let uaParser = require('ua-parser-js')

function formatParam (ctx, proj, data, option = {}) {
  let base = option.base || {}
  let model = option.model || {}
  let e = option.e
  let ua = uaParser(ctx.headers['user-agent'])
  ua.ip = ctx.ip

  let msg = {
    time: +new Date(),
    args: {
      port: proj.port,
      fsPath: proj.path,
    },
    projectId: proj._id,
    project: proj.name,
    data: data,
    apiId: base._id,
    api: base.name,
    apiModelId: model._id,
    apiModel: model.name,
    req: {
      params: option.params,
      url: ctx.url,
      method: ctx.method,
    },
    reqParsed: option.dealedParams,
    res: option.res || ctx.body,
    client: ua,
    additional: option.additional,
  }
  if (e) {
    msg.err = {
      msg: e.message,
      stack: e.stack,
    }
  }
  return msg
}

function logError (proj, ctx) {
  return ctx ? function (msg, option) {
    _logError(proj, ctx, msg, option)
  } : function (ctx, msg, option) {
    _logError(proj, ctx, msg, option)
  }
}
function _logError (proj, ctx, msg, option) {
  let data = formatParam(ctx, proj, msg, option)
  data._type = 'error'
  data.level = option.level || 8
  process.send(data)
}

function toError (proj, ctx) {
  let errorModel = JSON.stringify(proj.error) || '{"code": -1, "codeDesc":"${msg}", "codeDescUser":"${msg}"}'
  return ctx ? function (msg, option) {
    _toError(errorModel, proj, ctx, msg, option)
  } : function (ctx, msg, option) {
    _toError(errorModel, proj, ctx, msg, option)
  }
}
function _toError (errorModel, proj, ctx, msg, option) {
  ctx.logE(msg, option)
  ctx.body = formatError(errorModel, msg)
}

function logHis (proj, ctx) {
  return ctx ? function (msg, option) {
    _logHis(proj, ctx, msg, option)
  } : function (ctx, msg, option) {
    _logHis(proj, ctx, msg, option)
  }
}
function _logHis (proj, ctx, msg, option) {
  let data = formatParam(ctx, proj, msg, option)
  data._type = 'his'
  data.level = option.level || 8
  process.send(data)
}

function logProxy (proj) {
  return function (ctx, msg, option) {
    let data = formatParam(ctx, proj, msg, option)
    data._type = 'proxy'
    data.level = option.level || 8
    process.send(data)
  }
}

module.exports = function (proj) {
  return async function sendMessage (ctx, next) {
    ctx.logE = logError(proj, ctx)
    ctx.toError = toError(proj, ctx)
    ctx.log = logHis(proj, ctx)

    return next()
  }
}

module.exports.logError = logError
module.exports.toError = toError
module.exports.logHis = logHis
module.exports.logProxy = logProxy

function formatError (model, msg) {
  let str = model.replace(errorExp, msg)
  let obj
  try {
    obj = JSON.parse(str)
  } catch (e) {
    console.log('项目中错误串无法转换为obj。')
  }
  return obj
}
