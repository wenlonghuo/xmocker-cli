'use strict';

var router = require('./index.js');
var controller = router.controller.sync;
var formatParam = router.formatParam;

router.get('/clientGetProjList', formatParam, controller.clientGetProjList);

router.get('/clientGetProjDetail', formatParam, controller.clientGetProjDetail);

router.get('/clientGetApiListByProject', formatParam, controller.clientGetApiListByProject);

router.get('/clientGetApiListByIds', formatParam, controller.clientGetApiListByIds);

router.get('/clientGetProjDiff', formatParam, controller.clientGetProjDiff);

router.get('/clientGetApiDiff', formatParam, controller.clientGetApiDiff);

router.put('/clientDownLoadProj', formatParam, controller.clientDownLoadProj);

router.put('/clientDownLoadProjBase', formatParam, controller.clientDownLoadProjBase);

router.put('/clientDownLoadApi', formatParam, controller.clientDownLoadApi);

router.put('/clientPushApiListById', formatParam, controller.clientPushApiListById);

router.put('/clientPushApiById', formatParam, controller.clientPushApiById);

router.put('/clientPushApiByData', formatParam, controller.clientPushApiByData);

router.put('/clientPushApiListByData', formatParam, controller.clientPushApiListByData);

router.put('/serverReceiveApi', formatParam, controller.serverReceiveApi);

router.put('/serverReceiveApiList', formatParam, controller.serverReceiveApiList);

router.get('/serverGetProjList', formatParam, controller.serverGetProjList);

router.get('/serverGetProj', formatParam, controller.serverGetProj);

router.get('/serverGetApiListByProject', formatParam, controller.serverGetApiListByProject);

router.get('/serverGetApi', formatParam, controller.serverGetApi);

router.put('/serverDiffProj', formatParam, controller.serverDiffProj);

router.put('/serverDiffApi', formatParam, controller.serverDiffApi);