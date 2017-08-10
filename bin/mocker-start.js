'use strict'
const program = require('commander')
const dealer = require('./commands/start')

program
  .option('-m, --main', '只启动主进程，不启动任何项目')
  .parse(process.argv)

dealer(program)
