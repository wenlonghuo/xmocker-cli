'use strict'
let router = require('koa-router')()
const controller = require('./controller')
let util = require('../util')
let formatParam = util.formatParam
let getProjectApiList = controller.getProjectApiList
let proj = require('./index').proj
let proxyTable = proj.proxyTable || []

proxyTable.forEach(function (p) {
  router.all(p.api, controller.proxyTo)
})

router.get('*', getProjectApiList, controller.getApi)

router.post('*', getProjectApiList, controller.addApi)

router.put('*', getProjectApiList, controller.editApi)

router.delete('*', getProjectApiList, controller.deleteApi)

module.exports = router
