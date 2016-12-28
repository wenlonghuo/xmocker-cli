const router = require('./index.js');
const controller = require('../controller/apiHis');
// const checkLogin = require('../auth').checkLogin
// 查询书签

let util = require('../util');
let formatParam = util.formatParam;

router.get('/mock/getMockHis', formatParam, controller.getMockHis)



