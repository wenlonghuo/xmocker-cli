'use strict'
let router = require('koa-router')()
const controller = require('./controller')
let util = require('../util')
let formatParam = util.formatParam
let getProjectApiList = controller.getProjectApiList
let proj = require('./index').proj
let proxyTable = proj.proxyTable || []
const bodyParser = require('koa-bodyparser')()

proxyTable.forEach(function (p) {
  router.all(p.api, controller.proxyTo)
})

router.get('*', bodyParser, getProjectApiList, controller.getApi)

router.post('*', bodyParser, getProjectApiList, controller.addApi)

router.put('*', bodyParser, getProjectApiList, controller.editApi)

router.delete('*', bodyParser, getProjectApiList, controller.deleteApi)

module.exports = router
