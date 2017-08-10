'use strict'
const path = require('path')
const loadFileList = require('../util/loadFileList')

module.exports = loadFileList(path.join(__dirname, './'))
