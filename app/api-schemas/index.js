'use strict'
const loadFileList = require('../util/loadFileList')
let schema = {}
loadFileList(__dirname, 'schema', (file) => {
  var obj = require(file)
  Object.keys(obj).forEach((type) => {
    if (!schema[type]) schema[type] = {}
    Object.keys(obj[type]).forEach((name) => {
      schema[type][name] = obj[type][name]
    })
  })
  return obj
})

module.exports = schema
