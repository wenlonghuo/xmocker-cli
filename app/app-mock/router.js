'use strict'
let router = require('koa-router')()
const api = require('./controller/controller.api')
const gInfo = require('./controller/global-info')
const reject = require('./controller/controller.inject')
let proxyTable = gInfo.proj.proxyTable || []
const proxy = require('../middleware/proxyTo')

proxyTable.forEach(function (p) {
  router.all(p.api, proxy.proxyTo(p.target, {}))
})

router.get('/_refreshPage', reject.refresh)
router.post('/_setPageList', reject.storePageList)

router.get('/_link', reject.serveView)
if (gInfo.proj.proxyType !== 1) router.all('*', api.findApi, api.dealFixed, api.filterModels)

module.exports = router
