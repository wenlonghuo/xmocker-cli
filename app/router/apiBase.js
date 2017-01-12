const router = require('./index.js');
const controller = require('../controller/apiBase');
// const checkLogin = require('../auth').checkLogin
// 查询书签

let util = require('../util');
let formatParam = util.formatParam;

router.get('/mock/getApiDetail', formatParam, controller.getApiDetail)

router.get('/mock/getApiBase', formatParam, controller.getApiBase)

router.post('/mock/addApiBase', formatParam, controller.addApiBase)

router.put('/mock/editApiBase', formatParam, controller.editApiBase)

router.delete('/mock/deleteApiBase', formatParam, controller.deleteApiBase)


