/**
** 注入插件
 */
'use strict'
var path = require('path')
var extname = path.extname
var fs = require('mz/fs')
const template = require('lodash').template
const clientInject = fs.readFileSync(path.join(__dirname, '../tmpl/clientInject.tmpl'), {encoding: 'utf-8'})
/**
 * Expose `send()`.
 */
let sys = require('./getLocalInfo')

module.exports = async function ({ctx, path, stats}, opts) {
  if (extname(path) === '.html' && opts.autoRefresh) {
    let html = fs.readFileSync(path, {encoding: 'utf-8'})
    let complied = template(clientInject)
    let inj = complied({port: opts.port, managePort: opts.managePort, ip: sys.ip})
    html = html.replace('</head>', inj + '</head>')
    ctx.body = html
  } else {
    ctx.body = fs.createReadStream(path)
  }
  return true
}
