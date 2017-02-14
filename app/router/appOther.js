'use strict'
const router = require('./index.js')
const controller = require('../controller/appOther')

let util = require('../util')
let formatParam = util.formatParam

router.get('/mock/clientGetProjDiff', formatParam, controller.clientGetProjDiff)

router.get('/mock/clientGetApiDiff', formatParam, controller.clientGetApiDiff)

router.get('/mock/serverGetProj', formatParam, controller.serverGetProj)

router.get('/mock/serverGetApi', formatParam, controller.serverGetApi)

router.put('/mock/serverDiffProj', formatParam, controller.serverDiffProj)

router.put('/mock/serverDiffApi', formatParam, controller.serverDiffApi)

router.put('/mock/clientDownLoadProj', formatParam, controller.clientDownLoadProj)

router.put('/mock/clientDownLoadProjBase', formatParam, controller.clientDownLoadProjBase)

router.put('/mock/clientDownLoadApi', formatParam, controller.clientDownLoadApi)
