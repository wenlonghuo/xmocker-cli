'use strict'
const Koa = require('koa')
const app = new Koa()
const http = require('http')
const WebSocket = require('ws')
const bodyParser = require('koa-bodyparser')
const path = require('path')

const processControl = require('./controller/processControl')
const sendFile = require('./util/file-server.js')
const db = require('./db')
const log = require('./util/log')
const router = require('./router')
const argv = require('minimist')(process.argv.slice(2))
// const killPort = require('./util/common').killPort

let appPORT

app.proxy = true

// body parser
app.use(bodyParser())

// 静态服务器 添加默认为Index.html
app.use(async function (ctx, next) {
  ctx.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods' : 'PUT, POST, GET, DELETE, OPTIONS',
  })
  return next().then(sendFile(ctx, ctx.path, {root: path.join(__dirname, '../dist/'), index: 'index.html'}))
})

// 调用路由
app.use(router.routes())

// 建立是的监听及server
const httpServer = http.createServer(app.callback())

// 建立 websocket 服务
const wss = new WebSocket.Server({server: httpServer})
log.broad(wss)

// 查询appbase
db.appBase.cfindOne({}).exec().then(function (doc) {
  doc = doc || {}
  appPORT = doc.managePort || 6001
  // 去除原占用的端口
  // common.killPort(appPORT)

  httpServer.listen(appPORT, function (e) {
    console.log('后台管理界面运行于: http://localhost:%s', appPORT)
  })

  if (argv.empty) {
    return
  }

  let queryObj = {}
  let shortcut = argv.proj
  if (shortcut) {
    queryObj.shortcut = shortcut
  } else {
    if (doc.defaultProject) {
      queryObj = {_id: doc.defaultProject}
    }
  }

  db.appProject.cfindOne(queryObj).exec().then(function (doc) {
    if (!doc) {
      console.log('没有默认项目，添加后可自动启动')
      return
    }
    processControl.restartProcess(doc)
  })
})
