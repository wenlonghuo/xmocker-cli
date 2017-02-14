'use strict'
const router = require('./index.js')
const controller = require('../controller/apiHis')

let util = require('../util')
let formatParam = util.formatParam

router.get('/mock/getMockHis', formatParam, controller.getMockHis)



