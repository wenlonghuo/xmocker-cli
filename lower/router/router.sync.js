'use strict';

var router = require('./index.js');
var controller = router.controller.sync;
var formatParam = router.formatParam;

router.get('/clientGetProjDiff', formatParam, controller.clientGetProjDiff);

router.get('/clientGetApiDiff', formatParam, controller.clientGetApiDiff);

router.get('/serverGetProj', formatParam, controller.serverGetProj);

router.get('/serverGetApi', formatParam, controller.serverGetApi);

router.put('/serverDiffProj', formatParam, controller.serverDiffProj);

router.put('/serverDiffApi', formatParam, controller.serverDiffApi);

router.put('/clientDownLoadProj', formatParam, controller.clientDownLoadProj);

router.put('/clientDownLoadProjBase', formatParam, controller.clientDownLoadProjBase);

router.put('/clientDownLoadApi', formatParam, controller.clientDownLoadApi);