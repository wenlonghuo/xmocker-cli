'use strict'
const fs = require('fs')
const os = require('os')
let router = require('koa-router')()
const controller = require('./controller')
let util = require('../util')
let formatParam = util.formatParam
let getProjectApiList = controller.getProjectApiList
let proj = require('./index').proj
let proxyTable = proj.proxyTable || []
const bodyParser = require('koa-bodyparser')()
var _ = require('lodash')
const template = _.template
// const htmlStr = fs.readFileSync(__dirname + '/link.tmpl', {encoding: 'utf-8'})

let localIp = (function getIp () {
  let netInfo = os.networkInterfaces()
  let localIp = 'localhost'
  if (netInfo) {
    let keys = Object.keys(netInfo)
    let ips = keys.filter((key) => {
      let list = netInfo[key]
      list.forEach((info) => {
        if (/^[\d]{1,3}\./.test(info.address)) {
          if (!/^127\./.test(info.address)) {
            localIp = info.address
          }
        }
      })
    })
  }
  return localIp
})()

proxyTable.forEach(function (p) {
  router.all(p.api, controller.proxyTo)
})

let urlList = proj.urls || []

let pageLink = {
  localAddr: 'http://' + localIp + ':' + proj.port,
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
router.get('/_refreshPage', function (ctx, next) {
  if (wsctrl.wss) {
    let pages = ctx.query.pages
    wsctrl.wss.broadcast({_cmd: 'reload', pages: pages})
  }
  ctx.body = 'ok'
})
router.post('/_setPageList', bodyParser, function (ctx, next) {
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
})

router.get('/_link', function (ctx, next) {
  var query = ctx.query
  var htmlStr = fs.readFileSync(__dirname + '/link.tmpl', {encoding: 'utf-8'})
  pageLink.query = query || {}
  let complied = template(htmlStr)
  ctx.body = complied(pageLink)
})

router.get('*', bodyParser, getProjectApiList, controller.getApi)

router.post('*', bodyParser, getProjectApiList, controller.addApi)

router.put('*', bodyParser, getProjectApiList, controller.editApi)

router.delete('*', bodyParser, getProjectApiList, controller.deleteApi)

module.exports = router
