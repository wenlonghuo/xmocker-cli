const router = require('./index.js');
const controller = require('../controller/appBase');
// const checkLogin = require('../auth').checkLogin
// 查询书签

let util = require('../util');
let formatParam = util.formatParam;

router.get('/mock/getAppBase', formatParam, controller.getAppBase)

router.put('/mock/editAppBase', formatParam, controller.editAppBase)


