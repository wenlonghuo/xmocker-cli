#!/usr/bin/env node
'use strict'
const program = require('commander')
const pck = require('../package.json')

program
  .version(pck.version)
  .command('start <proj>', '启动项目')
  .command('stop <proj>', '停止项目')
  .command('restart <proj>', '重启项目')
  .command('list', '列出项目')
  .command('exit', '退出项目')
  .command('free <port>', '杀掉指定端口')
  .command('here', '在当前目录启动服务器，更多参数请使用 mocker here -h查看')
  .parse(process.argv)

module.exports = program

process.on('unhandledRejection', function (e) {
  throw e
})
