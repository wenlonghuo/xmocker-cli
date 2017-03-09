#!/usr/bin/env node
'use strict'
const parser = require('../cli/parse')
const handler = require('../cli/handler').handle

function findCommand () {
  let cmd = parser.cmd()

  if (cmd === undefined) {
    console.log('抱歉，您所输入的指令无法识别，可输入 -h 指令查询所有命令')
    parser.help()
    return
  }

  if (cmd && cmd.short === 'h') {
    parser.help()
    return
  }

  handler(cmd)
}

findCommand()
