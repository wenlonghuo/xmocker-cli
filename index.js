'use strict'
const spawn = require('child_process').spawn
// const killPort = require('./app/util/common').killPort

let args
let version = nodeVersion()
let restartCnt = 0
let sysTime = new Date()

if (version < 7) {
  args = ['./app/lower-start.js']
} else if (version === 7) {
  args = ['--harmony-async-await', './app/index.js']
} else {
  args = ['./app/index.js']
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

function nodeVersion () {
  let nv = process.versions.node || ''
  return ~~nv.split('.')[0]
}

startServer()

process.on('beforeExit', function () {
  console.warn('系统异常退出, 已重启 %s 次', restartCnt++)
})

