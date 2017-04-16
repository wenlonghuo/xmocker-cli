'use strict'
const spawn = require('child_process').spawn
const path = require('path')

let args
let version = nodeVersion()
let restartCnt = 0
let sysTime = new Date()

if (version < 7) {
  args = [setPath('../app/lower-start.js')]
} else if (version >= 7.6) {
  args = [setPath('../app/index.js')]
} else {
  args = ['--harmony-async-await', setPath('../app/index.js')]
}

function startServer () {
  // 服务器
  let server = spawn('node', args, {
    stdio: 'inherit',
    shell: true,
  })

  // server.stderr.pipe(process.stderr)
  // server.stdout.pipe(process.stdout)

  // 重启次数过多不再重启
  if (restartCnt) {
    let perTime = (new Date() - sysTime) / restartCnt
    if (restartCnt > 2 && perTime < 5000) {
      return
    }
  }

  restartCnt++

  let timeStamp = new Date()

  server.on('close', function (msg) {
    if (new Date() - timeStamp > 1000) {
      setTimeout(startServer, 500)
    }
  })
}

let p = path.parse(process.argv[1])

if (p.name === 'server') {
  let cmd = require('../cli/parse').cmd
  startService(cmd)
}

function startService (cmd) {
  if (cmd) {
    if (cmd.short === 'e') {
      args.push('--empty="true"')
    } else if (cmd.short === 's' || cmd.short === 'r') {
      args.push('--proj="' + cmd.target[0] + '"')
    }
  }
  startServer()
  process.on('beforeExit', function () {
    console.warn('系统异常退出, 已重启 %s 次', restartCnt++)
  })
}

function nodeVersion () {
  let nv = (process.versions.node || '').split('.')
  return ~~(nv[0] + '.' + nv[1])
}

function setPath (p) {
  return '"' + path.join(__dirname, p) + '"'
}

module.exports = startService
