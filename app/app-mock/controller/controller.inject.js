'use strict'
const fs = require('fs')
const path = require('path')
const gInfo = require('./global-info')
let urlList = gInfo.proj.urls || []
var _ = require('lodash')
const template = _.template

let pageLink = {
  localAddr: 'http://' + gInfo.local.ip + ':' + gInfo.proj.port,
  list: [],
  configList: [],
  configNoList: [],
  unconfigList: [],
  urls: [],
}

urlList.forEach((item) => {
  if (item.path) {
    item._path = item.path.replace(/index.html$/, '').replace(/\/|\\/g, '')
    var params = item.params || {}
    var arr = []
    Object.keys(params).forEach((key) => {
      arr.push(key + '=' + params[key])
    })
    item._url = item.path + '?' + arr.join('&')
  } else {
    item._url = item.url
  }
  pageLink.urls.push(item)
})

// 刷新页面接口
const wsctrl = require('./wsctrl')
async function refresh (ctx, next) {
  if (wsctrl.wss) {
    let pages = ctx.query.pages
    wsctrl.wss.broadcast({_cmd: 'reload', pages: pages})
  }
  ctx.body = 'ok'
}

async function storePageList (ctx, next) {
  let param = ctx.request.body

  if (!param) return
  let pages = param.html || []
  pageLink.list = pages.map((url) => {
    return {
      _path: url.replace(/index.html$/, '').replace(/\/|\\/g, ''),
      url: url,
    }
  })
  pageLink.configList = []
  pageLink.configNoList = []
  pageLink.unconfigList = []

  pageLink.urls.forEach((item) => {
    var exist = pageLink.list.find((link) => { return item._path === link._path })
    if (exist) {
      pageLink.configList.push(item)
    } else {
      pageLink.configNoList.push(item)
    }
  })

  pageLink.list.forEach((link) => {
    if (!pageLink.urls.find((item) => { return item._path === link._path })) {
      pageLink.unconfigList.push(link)
    }
  })
  ctx.body = 'ok'
}

async function serveView (ctx, next) {
  var query = ctx.query
  var htmlStr = fs.readFileSync(path.join(__dirname, '../tmpl/link.tmpl'), {encoding: 'utf-8'})
  pageLink.query = query || {}
  let complied = template(htmlStr)
  ctx.body = complied(pageLink)
}

module.exports = {
  serveView,
  storePageList,
  refresh,
}
