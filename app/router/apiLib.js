const router = require('./index.js');
const controller = require('../controller/apiLib');
// const checkLogin = require('../auth').checkLogin
// 查询书签

let util = require('../util');
let formatParam = util.formatParam;

router.get('/mock/getMockLib', formatParam, controller.getMockLib)

router.post('/mock/addMockLib', formatParam, controller.addMockLib)

router.put('/mock/editMockLib', formatParam, controller.editMockLib)

router.delete('/mock/deleteMockLib', formatParam, controller.deleteMockLib)


