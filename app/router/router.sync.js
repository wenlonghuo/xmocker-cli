'use strict'
const router = require('./index.js')
const controller = router.controller.sync
let formatParam = router.formatParam

// 获取
router.get('/clientGetProjList', formatParam, controller.clientGetProjList)

router.get('/clientGetProjDetail', formatParam, controller.clientGetProjDetail)

router.get('/clientGetApiListByProject', formatParam, controller.clientGetApiListByProject)

router.get('/clientGetApiListByIds', formatParam, controller.clientGetApiListByIds)

 // diff
router.get('/clientGetProjDiff', formatParam, controller.clientGetProjDiff)

router.get('/clientGetApiDiff', formatParam, controller.clientGetApiDiff)

// 下载
router.put('/clientDownLoadProj', formatParam, controller.clientDownLoadProj)

router.put('/clientDownLoadProjBase', formatParam, controller.clientDownLoadProjBase)

router.put('/clientDownLoadApi', formatParam, controller.clientDownLoadApi)

// 推送
router.put('/clientPushApiListById', formatParam, controller.clientPushApiListById)

router.put('/clientPushApiById', formatParam, controller.clientPushApiById)

router.put('/clientPushApiByData', formatParam, controller.clientPushApiByData)

router.put('/clientPushApiListByData', formatParam, controller.clientPushApiListByData)

// 服务端

router.put('/serverReceiveApi', formatParam, controller.serverReceiveApi)

router.put('/serverReceiveApiList', formatParam, controller.serverReceiveApiList)

   // 获取
router.get('/serverGetProjList', formatParam, controller.serverGetProjList)

router.get('/serverGetProj', formatParam, controller.serverGetProj)

router.get('/serverGetApiListByProject', formatParam, controller.serverGetApiListByProject)

router.get('/serverGetApi', formatParam, controller.serverGetApi)

 // 获取差分
router.put('/serverDiffProj', formatParam, controller.serverDiffProj)

router.put('/serverDiffApi', formatParam, controller.serverDiffApi)
