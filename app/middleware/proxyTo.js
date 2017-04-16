'use strict'
const assert = require('assert')
const proxy = require('../plugin/proxy')()

function toReg (table) {
  assert(Array.isArray(table), 'proxyTable must be an array')
  let proxyReg = []
  table.forEach(p => {
    if (!p.api || !p.target) {
      console.error(`proxy table must has api or target key, ${JSON.stringify(p)}`)
      return
    }
    proxyReg.push({reg: new RegExp(p.api), target: p.target})
  })
  return proxyReg
}

async function execProxyList (ctx, proxyReg) {
  for (let i = 0; i < proxyReg.length; i++) {
    if (proxyReg[i].reg.test(ctx.path)) {
      ctx.req.body = ctx.request.body
      try {
        return await execProxy(ctx, proxyReg[i].target)
      } catch (e) {
        throw e
      }
    }
  }
}

async function execProxy (ctx, target) {
  ctx.req.body = ctx.request.body
  try {
    await proxy.web(ctx.req, ctx.res, {target: target})
  } catch (e) {
    throw e
  }
  return ctx.res.body
}

// 代理分别指向不同API下的中间件
function setProxy (table, {status, err, deal}) {
  let proxyReg = toReg(table)
  return async function proxyTo (ctx, next) {
    return next().then(async () => {
      if (status === undefined || ctx.status === status) {
        let data
        try {
          data = await execProxyList(ctx, proxyReg)
        } catch (e) {
          if (err) err.call(ctx, ctx, `代理服务器失败：${ctx.path}`, {e})
          return
        }
        if (deal) deal.call(ctx, ctx, '代理成功', {res: data})
      }
    })
  }
}
// 仅指出目标中间件
function proxyTo (target, {status, err, deal}) {
  return async function (ctx, next) {
    return next().then(async () => {
      if (status === undefined || ctx.status === status) {
        let data
        try {
          data = await execProxy(ctx, target)
        } catch (e) {
          if (err) err.call(ctx, ctx, `代理服务器失败：${target + ctx.path}`, {e})
          return
        }
        if (deal) deal.call(ctx, ctx, '代理成功', {res: data})
      }
    })
  }
}

module.exports = setProxy
module.exports.proxyTo = proxyTo
