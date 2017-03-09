#!/usr/bin/env node
'use strict'
const argv = require('minimist')(process.argv.slice(2))

let commands = [
  {short: 'e', equal: ['empty'], desc: '不启动任何项目'},
  {short: 'h', equal: ['help'], desc: '帮助'},
  {short: 'kp', equal: ['kill', 'port'], desc: '杀掉指定端口的进程'},
  {short: 'k', equal: ['kill'], desc: '停止指定项目'},
  {short: 'lr', equal: ['list', 'run'], desc: '列出所有正在运行的项目'},
  {short: 'l', equal: ['list'], desc: '列出所有项目'},
  {short: 'r', equal: ['restart'], desc: '重启带有简称的项目'},
  {short: 'st', equal: ['start', 'temp'], desc: '启动临时文件服务器，如已经存在则启动对应的项目，多个时会启动第一个'},
  {short: 's', equal: ['start'], desc: '启动带有简称的项目'},
]

module.exports.cmd = getTask
module.exports.commands = commands
module.exports.help = listCommands

function getTask () {
  let keys = argv._
  if (!keys.length && Object.keys(argv).length === 1) return null
  let cmd, i
  for (i = 0; i < commands.length; i++) {
    cmd = commands[i]
    cmd.target = getShortResut(cmd.short, argv)
    if (cmd.target) break

    cmd.target = getLongResut(cmd.equal, argv)
    if (cmd.target) break
  }
  if (i >= commands.length) {
    return
  }
  cmd.argv = argv
  return cmd
}

function getShortResut (str, obj) {
  let key
  if (str.length === 2) {
    if (!obj[str[0]] || !obj[str[1]]) return
    key = obj[str[1]]
  } else {
    if (!obj[str]) return
    key = obj[str]
  }
  if (key === true) {
    return obj._
  } else {
    return [key, ...obj._]
  }
}

function getLongResut (arr, obj) {
  let list = obj._
  if (arr[0] !== list[0]) return
  if (arr[1] !== undefined) {
    if (arr[1] !== list[1]) return
    return list.slice(2)
  } else {
    return list.slice(1)
  }
}

function listCommands () {
  let cmds = commands
  process.stdout.write('本指令包含的命令有\n 简写 \t命令 \t        描述\n')
  cmds.forEach(function (cmd) {
    let cstr = cmd.equal.join(' ')
    process.stdout.write(' -' + cmd.short + ' \t' + paddingLen(cstr, 10) + ' \t' + cmd.desc + '\n')
  })
}

function paddingLen (str, len) {
  str = str || ''
  if (str.length < len) {
    let a = []
    a[len - str.length] = ''
    str += a.join(' ')
  }
  return str
}
