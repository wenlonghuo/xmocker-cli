'use strict'
const Koa = require('koa')
const app = new Koa()
const assert = require('assert')
// const fs = require('fs')
const path = require('path')
const http = require('http')
const minimist = require('minimist')
const bodyParser = require('koa-bodyparser')()
const sendFile = require('../plugin/file-server')
const htmlInject = require('./util/file-server-inject')
const db = require('../database')
const gInfo = require('./controller/global-info')
const comuFunction = {
  setApiStatus: require('./controller/controller.fixData'),
  reloadDatabase: require('./controller/controller.reloadDatabase'),
}
const setError = require('./middleware/log')
const fix = require('./controller/controller.fixData').fix

// 全局变量定义区，待后续可改为配置
var args = minimist(process.argv.slice(2))

console.log = function log () {
  let msg = {
    _type: 'console',
    time: +new Date(),
    data: arguments,
  }
  process.send(msg)
}

let projectId = args.projectId
async function findAppBase () {
  try {
    return await db.appBase.cfindOne({}).exec()
  } catch (e) {
    console.log(e)
    return
  }
}

async function findProjectById (projectId) {
  assert(projectId, 'error happen while tranform projectid')
  try {
    return await db.project.cfindOne({_id: projectId}).exec()
  } catch (e) {
    console.log(e)
    return
  }
}

async function startServer (projectId) {
  let appConfig = await findAppBase() || {}
  let proj = await findProjectById(projectId) || {}
  proj.path = proj.path.trim()
  gInfo.proj = proj
  app.use(bodyParser)
  // bind error method
  app.use(setError(proj))

  // proxy
  if (proj.proxyTo && proj.proxyType) {
    app.use(require('../middleware/proxyTo').proxyTo(proj.proxyTo, {
      status: 404,
      error: setError.toError(proj),
      deal: setError.logProxy(proj),
    }))
  }

  // static server
  const port = proj.port || 6000
  const staticPath = proj.staticPath || []
  let defaultPath = proj.path
  if (defaultPath && proj.gulp && proj.gulp.buildPath) {
    defaultPath = path.join(proj.path, proj.gulp.buildPath.trim())
  }
  if (defaultPath) staticPath.unshift(defaultPath)

  if (staticPath && staticPath.length) {
    staticPath.forEach((sp) => {
      sp = sp.trim()
      let abPath = sp
      if (!path.isAbsolute(sp)) {
        abPath = path.join(proj.path, sp)
      }

      app.use(async function (ctx, next) {
        return next().then(sendFile(ctx, ctx.path, {
          root: abPath,
          index: 'index.html',
          autoRefresh: proj.injectHtml,
          port: proj.port,
          managePort: appConfig.managePort || 6001,
          plugin: htmlInject,
        }))
      })
    })
  }
  // router
  app.use(require('./router.js').routes())

  // 建立是的监听及server
  const httpServer = http.createServer(app.callback())

  if (proj.injectHtml) {
    const WebSocket = require('ws')
      // 建立 websocket 服务
    const wss = new WebSocket.Server({server: httpServer})
    const wsctrl = require('./controller/wsctrl.js')
    wsctrl.broad(wss)
  }

  httpServer.listen(port, function (e) {
    process.send({_type: 'process', data: 'finished'})
  })
}
startServer(projectId)

process.on('message', function (msg) {
  if (typeof msg !== 'object') return
  if (msg._type === 'process' && msg.data === 'kill') {
    process.exit(1)
  } else if (msg._type === 'func') {
    fix(msg)
  }
})
process.on('unhandledRejection', function (e) {
  throw e
})
