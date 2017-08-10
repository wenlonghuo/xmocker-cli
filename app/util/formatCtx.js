const uaParser = require('ua-parser-js')
const isDev = process.env.NODE_ENV === 'development'
const timer = require('./timer')

function baseInfo (ctx, option = {}) {
  let ua = uaParser(ctx.headers['user-agent'])

  let msg = {
    time: timer(),
    req: {
      method: ctx.method,
      path: ctx.path,
      url: ctx.url,
      href: ctx.request.header['referer'],
    },
    ip: ctx.ip,
    client: ua,
  }
  return msg
}

module.exports = function formatCtx (ctx, message, option = {}) {
  let e = option.e
  let params = Object.assign({}, ctx.params, ctx.query, ctx.request.body)

  let msg = baseInfo(ctx, option)
  msg.reqParsed = params
  msg.res = ctx.body
  msg.message = message
  if (e) {
    msg.err = {
      msg: e.message,
      stack: e.stack,
    }
  }

  if (!isDev && option.forbidReq) {
    const keys = option.forbidReq.split(' ')
    keys.forEach(key => {
      delete msg.req[key]
    })
  }
  if (!isDev && option.forbidRes) {
    delete msg.res
  }
  return msg
}

module.exports.baseInfo = baseInfo
