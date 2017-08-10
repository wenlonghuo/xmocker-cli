'use strict'
const program = require('commander')
const dealer = require('./commands/stop')

program
  .option('-f, --force', '只列出正在运行的项目')
  .parse(process.argv)

dealer(program)
