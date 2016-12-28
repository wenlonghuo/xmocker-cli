const router = require('./index.js');
const controller = require('../controller/apiProject');
// const checkLogin = require('../auth').checkLogin
// 查询书签

let util = require('../util');
let formatParam = util.formatParam;

router.get('/mock/getAppProject', formatParam, controller.getAppProject)

router.post('/mock/addAppProject', formatParam, controller.addAppProject)

router.put('/mock/editAppProject', formatParam, controller.editAppProject)

router.delete('/mock/deleteAppProject', formatParam, controller.deleteAppProject)


