'use strict'
const router = require('./index.js')
const controller = router.controller.search
let formatParam = router.formatParam

router.get('/search', formatParam, controller.search)
