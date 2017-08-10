'use strict';

var path = require('path');
var router = require('koa-router')();
router.prefix('/mock');
var loadFileList = require('../util/loadFileList');
var apiSchema = require('../api-schemas');

router.formatParam = require('../middleware/formatParam')(apiSchema);

router.controller = loadFileList(path.join(__dirname, '../controller'), 'controller');

module.exports = router;
loadFileList(__dirname, 'router');