'use strict'
const program = require('commander')
const dealer = require('./commands/here')

program
  .option('-d, --debug', '开启详情记录')
  .option('-p, --port <number>', '端口号')
  .option('-t, --proxyTo <http://...>', '代理api至指定的服务器')
  .option('-i, --inject <boolean>', '注入脚本至Html')
  .parse(process.argv)

dealer(program)
