'use strict'
const path = require('path')
let router = require('koa-router')()
router.prefix('/mock')
const loadFileList = require('../util/loadFileList')
const apiSchema = require('../api-schemas')

router.formatParam = require('../middleware/formatParam')(apiSchema)

router.controller = loadFileList(path.join(__dirname, '../controller'), 'controller')

module.exports = router
loadFileList(__dirname, 'router')
