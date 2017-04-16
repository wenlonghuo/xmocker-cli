'use strict'
const program = require('commander')
const pck = require('../package.json')
const dealer = require('./dealer')

function getList (val, list) {
  list.push(val)
  return list
}

const commands = ['main', 'exit', 'free', 'list', 'start', 'kill', 'restart']

program
  .version(pck.version)
  .option('-m, --main', '只启动主进程，不启动任何项目')
  .option('-e, --exit', '退出主进程')
  .option('-f, --free [value]', '释放指定端口', getList, [])
  .option('-l, --list', '列出所有项目', getList, [])
  .option('-s, --start [value]', '启动指定项目', getList, [])
  .option('-k, --kill [value]', '停止指定项目', getList, [])
  .option('-r, --restart [value]', '重启指定项目', getList, [])
  .parse(process.argv)
  .action(function () {
    console.log(arguments)
  })

let keys = commands.filter(key => {
  let val = program[key]
  return Array.isArray(val) ? val.length : val
})

keys.forEach(key => {
  if (dealer[key]) dealer[key](program[key])
})

if (!keys.length) {
  dealer.default()
}

module.exports = program

process.on('unhandledRejection', err => {
  throw err
})
