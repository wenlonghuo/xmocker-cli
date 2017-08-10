'use strict'
const router = require('./index.js')
const controller = router.controller.appBase
let formatParam = router.formatParam
const inspect = require('util').inspect

router.get('/online', controller.online)

router.get('/reloadDatabase', controller.reloadDatabase)

router.get('/appBase', formatParam, controller.getAppBase)

router.put('/appBase', formatParam, controller.editAppBase)

router.put('/upgradeV0', formatParam, controller.upgradeFromV0)

router.put('/killMain', async function (ctx, next) {
  process.exit(1)
})

router.get('/appStatus', formatParam, controller.getAppStatus)

router.post('/error', async function (ctx, next) {
  let time = new Date().toLocaleTimeString()
  console.log(`\n[${time}] 网页出现错误啦，下面是错误信息 ~~~`)
  console.log(inspect(ctx.request.body, {colors: true, depth: null}))
  ctx.body = 'ok'
})
