'use strict'
const path = require('path')
const fs = require('fs')
const join = path.join
var defaultOption = {
  root: '../',
  buildPath: '/build/',
  js: '/{script,general}/',
  css: '/{general,style}/',
  html: '/{general,html}/',
  image: '/{general,image}/',
}

var ext = {
  js: '/*.js',
  css: '/*.css',
  html: '/*.html',
  image: '/*.{jpg,png,gif,webp}',
}
var sourceList = ['html', 'js', 'css', 'image']
var specialReg = /\/!\((\w*)\)\$\/?$/

function formatPath (option) {
  var root = option.root
  keysToArr(option, sourceList)
  sourceList.forEach((name) => {
    option[name] = arrRealPath(root, option[name], ext[name])
  })

  option.buildPath = join(root, option.buildPath)
  return option
}
// 所有键值转数组
function keysToArr (obj, list) {
  list.forEach((key) => {
    obj[key] = toArr(obj[key])
  })
}
// 转数组
function toArr (str) {
  if (typeof str !== 'string' && typeof str !== 'object') return []
  var arr = Array.isArray(str) ? str : str.split(',')
  return arr
}
// 转为实体路径
function arrRealPath (base, arr, extStr) {
  if (!Array.isArray(arr)) arr = [arr]
  var result = []
  arr.forEach((p) => {
    if (specialReg.test(p)) {
      var contentName = p.match(specialReg)
      contentName = contentName && contentName[1]
      // result.push(addExt(join(base, p), '/**' + extStr))
      p = p.replace(specialReg, '')

      result.push(addExt(join(base, p), extStr))

      var list = fs.readdirSync(join(base, p))
      list.forEach((content) => {
        if (!path.extname(content) && content !== contentName) {
          var pathStr = addExt(join(base, p, content), '/**' + extStr)
          result.push(pathStr)
        }
      })
    } else {
      result.push(addExt(join(base, p), '/**' + extStr))
    }
  })
  return result
}

function addExt (str, extStr) {
  return (str.replace(/[/\\]$/, '') + extStr).replace(/\\/g, '/')
}

module.exports = function (option) {
  let buildOption = Object.assign(defaultOption, option.gulp)
  buildOption.root = option.path.trim()

  buildOption = formatPath(buildOption, ext)
  return buildOption
}
