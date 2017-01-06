const router = require('./index.js');
const controller = require('../controller/apiModel');
// const checkLogin = require('../auth').checkLogin
// 查询书签

let util = require('../util');
let formatParam = util.formatParam;

router.get('/mock/getApiModel', formatParam, controller.getApiModel)

router.post('/mock/addApiModel', formatParam, controller.addApiModel)

router.put('/mock/editApiModel', formatParam, controller.editApiModel)

router.delete('/mock/deleteApiModel', formatParam, controller.deleteApiModel)


