'use strict'
const router = require('./index.js')
const controller = require('../controller/appBase')
const inspect = require('util').inspect

let util = require('../util')
let formatParam = util.formatParam

router.get('/mock/online', controller.online)

router.get('/mock/reloadDatabase', controller.reloadDatabase)

router.get('/mock/getAppBase', formatParam, controller.getAppBase)

router.put('/mock/editAppBase', formatParam, controller.editAppBase)

router.get('/mock/getAppStatus', formatParam, controller.getAppStatus)

router.post('/error/upload', async function (ctx, next) {
  let time = new Date().toLocaleTimeString()
  console.log(`\n[${time}] 网页出现错误啦，下面是错误信息 ~~~`)
  console.log(inspect(ctx.request.body, {colors: true, depth: null}))
  ctx.body = 'ok'
})
