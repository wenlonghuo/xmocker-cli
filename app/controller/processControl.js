'use strict'
const os = require('os')
let ostype = '*nix'
if (os.EOL === '\r\n') {
  ostype = 'win'
}

const spawn = require('child_process').spawn
const path = require('path')
const _ = require('lodash')
const log = require('../util/log')

let processList = []
let gulpList = []

let procTeam = []
let restartRunning

/**
 * addNewProcess
 * @param  {} option 传入的project对象
 */
function addNewProcess (proc, option = {force: false}) {
  if (!proc) return
  let existSamePort = processList.find(function (proc) {
    return proc.proc && proc.proc.port === proc.port && proc.status
  })
  if (existSamePort) return

  let index = processList.findIndex(function (p) { return p.id === proc._id })
  if (index >= 0) {
    processList.splice(index, 1)
  }
  return startMockServer(proc, option)
}

function restartProcess (proc, option = {force: false}) {
  return new Promise(function (resolve) {
    let procIndex = procTeam.findIndex(function (p) { return p.proc._id === proc._id })
    if (procIndex >= 0) {
      let targetProc = procTeam[procIndex]
      targetProc.proc = proc
      targetProc.cb.push(resolve)
    } else {
      procTeam.push({proc: proc, cb: [resolve]})
    }

    if (!restartRunning) execEachProc(option)
  })
}

function execEachProc (option) {
  let procItem = procTeam.shift()
  if (!procItem) {
    restartRunning = false
    return
  }
  restartRunning = true
  let proc = procItem.proc

  return killProcess(proc).then(function (processInfo) {
    if (processInfo) {
      let index = processList.findIndex(function (p) { return p.id === proc._id })
      if (index >= 0) {
        processList.splice(index, 1)
      }
    }
    return addNewProcess(proc, option).then(function (proc) {
      let cb = procItem.cb
      cb.forEach(function (c) {
        c(proc)
      })
      return process.nextTick(function () { execEachProc(option) })
    })
  })
}

function killProcess (proc, option = {force: false}) {
  let id = proc._id
  let processInfo = processList.find(function (proc) { return proc.id === id })
  if (!processInfo || !processInfo.status) {
    console.log('项目尚未启动：[' + proc.name + '] ' + ', 端口号: ' + proc.port)
    return new Promise(function (resolve) { resolve() })
  }

  let server = processInfo.server
  let hasResolved
  let gulpServer = processInfo.gulpServer

  if (option.force && gulpServer) {
    try {
      gulpServer.kill(0)
    } catch (e) {
      console.log('结束gulpServer出错')
    }
  }

  return new Promise(function (resolve) {
    processInfo.closeEvents.push(function (server) {
      if (!hasResolved) {
        hasResolved = true
        resolve(processInfo)
      }
    })

    if (processInfo.status) {
      server.send({_type: 'cmd', data: 'kill'})
      setTimeout(function () {
        if (!hasResolved) {
          hasResolved = true
          resolve(null)
        }
      }, 10000)
    } else {
      if (!hasResolved) {
        hasResolved = true
        resolve(null)
      }
    }
  })
}

function setEventForObj (obj) {
  if (typeof obj !== 'object') return
  Object.defineProperty(obj, 'status', {
    set: function (value) {
      if (value === 1) {
        if (obj['openEvents'].length) {
          obj['openEvents'].forEach(function (f) {
            f.call(obj, obj.server)
          })
        }
      } else if (value === 0) {
        if (obj['closeEvents'].length) {
          obj['closeEvents'].forEach(function (f) {
            f.call(obj, obj.server)
          })
        }
      }
      this._value = value
    },
    get: function () {
      return this._value
    },
  })
  obj.closeEvents = []
  obj.openEvents = []
}
/**
 * 启动子服务进程
 * @param  {} proc proc的详细信息
 */
function startMockServer (proc, option) {
  if (!proc) return new Promise(function (resolve) { resolve() })
  let processInfo

  let param = []
  param.push('--port=' + (proc.port || 6000))

  let fPath = proc.path
  if (proc.gulp && proc.gulp.buildPath) {
    fPath = path.join(fPath, proc.gulp.buildPath)
  }
  param.push('--fileServerPath="' + (fPath || '') + '\\"')

  param.push('--projectId="' + (proc._id || '') + '"')

  param.push('--projectName="' + (proc.name || '') + '"')

  let error = JSON.stringify(proc.error) || ''
  param.push('--errorModel="' + (error.replace(/"/g, '\\"') || '') + '"')

  // 服务器
  let startArgs = ['--harmony-async-await', path.join(__dirname, '../mockapp'), ...param]
  if (process.versions.node.split('.')[0] < 7) {
    startArgs = [path.join(__dirname, '../mockapp/lower-start'), ...param]
  }
  const server = spawn('node', startArgs, {
    stdio: ['pipe', 'ipc', 'pipe'],
    shell: true,
  })

  server.stderr.pipe(log.errStream)

  let gulpServer = startGulp(proc, option)

  processInfo = {
    id: proc._id,
    proc: proc,
    server: server,
    gulpServer: gulpServer,
    createdTime: new Date(),
    pid: server.pid,
  }
  setEventForObj(processInfo)
  processInfo.status = 2// 等待状态
  processList.push(processInfo)
  let hasResolved

  return new Promise(function (resolve) {
    server.on('exit', function () {
      console.log('项目退出：[' + processInfo.proc.name + '] , 进程id：' + server.pid +
      ', 端口号: ' + processInfo.proc.port)
      processInfo.status = 0
    })

    processInfo.openEvents.push(function (server) {
      if (!hasResolved) {
        hasResolved = true
        resolve(processInfo)
      }
    })

    processInfo.closeEvents.push(function (server) {
      if (!hasResolved) {
        hasResolved = true
        resolve()
      }
    })

    server.on('message', function (msg) {
      if (msg._type === 'cmd') {
        if (msg.data === 'finished') {
          console.log('项目启动成功: [' + proc.name + '] , 进程id： ' + server.pid + ', 端口号：' + proc.port)
          processInfo.status = 1
        }
      } else {
        log.childLog(msg)
      }
    })

    setTimeout(function () {
      if (!hasResolved) {
        hasResolved = true
        resolve(processInfo)
      }
    }, 10000)
  })
}

function startGulp (proc, option = { force: false }) {
  if (!proc.path) return

  let gulpIndex = gulpList.findIndex(function (g) { return g._id === proc._id })

  if (gulpIndex < 0) {
    gulpList.push(proc)
  } else {
    let targetGulp = gulpList[gulpIndex]
    if (_.isEqual(proc, targetGulp)) {
      if (!option.force) return
    } else {
      gulpList.splice(gulpIndex, 1)
      gulpList.push(proc)
    }
  }

  let gOption = proc.gulp

  if (!gOption.html) return
  let params = []
  for (let key in gOption) {
    params.push('--' + key + '="' + gOption[key] + '"')
  }

  params.push('--root=' + proc.path)

  let gulpPath = gOption.path || path.join(__dirname, '../../tools/gulp')
  gulpPath = path.join(gulpPath, './node_modules/.bin')
  let cmdGulp = './gulp'
  if (ostype === 'win')cmdGulp = 'gulp'
  let gulpServer = spawn(cmdGulp, [proc.task || 'dev', ...params], {
    stdio: 'pipe',
    shell: true,
    cwd: gulpPath,
  })

  gulpServer.stdout.pipe(log.logGulp)
  gulpServer.stderr.pipe(log.errGulp)

  return gulpServer
}

module.exports = {
  addNewProcess: addNewProcess,
  restartProcess: restartProcess,
  killProcess: killProcess,
  processList: processList,
}
