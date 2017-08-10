'use strict'
const Koa = require('koa')
const app = new Koa()
const http = require('http')
const path = require('path')

const bodyParser = require('koa-bodyparser')

const startTime = new Date()

const sendFile = require('./plugin/file-server.js')
const db = require('./database')
const ws = require('./service/service.ws.js')
const router = require('./router')
const respond = require('./middleware/respond')
const logger = require('./middleware/logger')
const argv = require('minimist')(process.argv.slice(2))

let appPORT

app.proxy = true

// body parser
app.use(bodyParser())

// 静态服务器 添加默认为Index.html
app.use(async function (ctx, next) {
  ctx.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, OPTIONS',
  })
  return next().then(sendFile(ctx, ctx.path, {root: path.join(__dirname, '../web/dist/'), index: 'index.html'}))
})

app.use(logger())
app.use(respond())

// 调用路由
app.use(router.routes())

// 建立是的监听及server
const httpServer = http.createServer(app.callback())

// 建立 websocket 服务
ws(httpServer)

// 查询appbase
db.appBase.cfindOne({}).exec().then(function (doc) {
  doc = doc || {}
  appPORT = doc.managePort || 6001
  // 去除原占用的端口
  // common.killPort(appPORT)

  httpServer.listen(appPORT, function (e) {
    console.log('后台管理界面运行于: http://localhost:%s', appPORT, '耗时：', new Date() - startTime, 'ms')
  })

  let queryObj = {}
  let projs = argv.proj
  if (projs) {
    projs = Array.isArray(projs) ? projs : [projs]
    queryObj.$or = [
      {name: {$in: projs}},
      {shortcut: {$in: projs}},
    ]
  } else {
    return
  }

  db.project.cfind(queryObj).exec().then(function (docs) {
    if (!docs) {
      console.log('未找到需要启动的项目')
      return
    }
    const start = require('./service/service.proc').addToRestart
    docs.forEach(p => start(p))
    // processControl.restartProcess(doc)
  })
})

process.on('unhandledRejection', function (e) {
  throw e
})
