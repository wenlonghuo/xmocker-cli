let router = require('koa-router')();
const controller = require('./controller');
let util = require('../util');
let formatParam = util.formatParam;
let getAppConfig = controller.getAppConfig;

router.get('*', getAppConfig, controller.getApi)

router.post('*', getAppConfig, controller.addApi)

router.put('*', getAppConfig, controller.editApi)

router.delete('*', getAppConfig, controller.deleteApi)


module.exports = router