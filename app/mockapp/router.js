'use strict'
let router = require('koa-router')();
const controller = require('./controller');
let util = require('../util');
let formatParam = util.formatParam;
let getProjectApiList = controller.getProjectApiList;

router.get('*', getProjectApiList, controller.getApi)

router.post('*', getProjectApiList, controller.addApi)

router.put('*', getProjectApiList, controller.editApi)

router.delete('*', getProjectApiList, controller.deleteApi)


module.exports = router