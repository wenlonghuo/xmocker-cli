'use strict'
let router = require('koa-router')()

module.exports = router

require('./apiBase')

require('./apiModel')

require('./appProject')

require('./appBase')

require('./apiHis')

require('./appOther')
