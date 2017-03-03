'use strict'
const Koa = require('koa')
const app = new Koa()
// const fs = require('fs')
const path = require('path')
const http = require('http')
const minimist = require('minimist')
const sendFile = require('../util/file-server.js')
const db = require('../db')
// const spawn = require('child_process').spawn
// 全局变量定义区，待后续可改为配置
var args = minimist(process.argv.slice(2))

console.log = function log (data) {
  let msg = {
    _type: 'console',
    time: +new Date(),
    data: data,
  }
  process.send(msg)
}

for (let key in args) {
  let str = args[key]

  if (typeof str === 'string' && str[0] === '"' && str[str.length - 1] === '"') {
    args[key] = str.slice(1, str.length - 1)
  }
}

let projectId = args.projectId
if (!projectId) {
  throw new Error('项目ID传递出错，请调试')
}

let proc = {
  proj: {},
}

module.exports = proc

db.appProject.cfindOne({_id: projectId}).exec().then(function (proj) {
  if (!proj) {
    throw new Error('项目ID不存在，程序报错')
  }
  proc.proj = proj

  const apiPORT = proj.port || 6000
  let fileServerPath = proj.path
  if (proj.gulp && proj.gulp.buildPath) {
    fileServerPath = path.join(proj.path, proj.gulp.buildPath)
  }

  app.proxy = true
  // sessions

  // body parser
  const bodyParser = require('koa-bodyparser')
  app.use(bodyParser())
  // 调用路由
  // 静态服务器 添加默认为Index.html
  app.use(async function (ctx, next) {
    return next().then(sendFile(ctx, ctx.path, {root: fileServerPath, index: 'index.html'}))
  })
  // log(projectDir)
  let router = require('./router.js')

  const controller = require('./controller')

  app.use(require('./router.js').routes())


  // 建立是的监听及server
  const httpServer = http.createServer(app.callback())

  httpServer.listen(apiPORT, function (e) {
    process.send({_type: 'process', data: 'finished'})
  })

  module.exports = httpServer

  process.on('message', function (msg) {
    if (typeof msg !== 'object') return

    if (msg._type === 'process' && msg.data === 'kill') {
      process.exit(1)
    } else if (msg._type === 'func') {
      if (controller[msg.func]) {
        controller[msg.func](msg)
      }
    }
  })
})


