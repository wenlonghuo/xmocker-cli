'use strict'
const spawn = require('child_process').spawn
const path = require('path')
const _ = require('lodash')
const log = require('../util/log')
const killPID = require('../util/common').killPID
const killPort = require('../util/common').killPort

let nv = nodeVersion()
let ostype = process.platform
let procList = []
let gulpList = []

let executor = new Promise((resolve) => { resolve() })
let handleTeam = []

/**
 * addNewProcess
 * @param  {} option 传入的project对象
 */
function addNewProcess (proj, option = {force: false}) {
  option = option || {}
  return new Promise(function (resolve) {
    if (!proj || !proj.port) return
    // 端口相同且还在开启则不进行
    if (procList.find(function (p) { return p.proj && p.proj.port === proj.port && p.status })) return
    let index = procList.findIndex(function (p) { return p.id === proj._id })
    if (index >= 0) procList.splice(index, 1)
    return startMockServer(proj, option).then(resolve)
  })
}

function restartProcess (proj, option = {force: false}) {
  option = option || {}
  return new Promise(function (resolve) {
    if (!proj) return
    let index = handleTeam.findIndex(function (p) { return p.proj._id === proj._id })
    if (index >= 0) {
      let info = handleTeam[index]
      info.proj = proj
      info.cb.push(resolve)
    } else {
      handleTeam.push({proj: proj, cb: [{resolve: resolve, option: option}]})
      executor = executor.then(execCommand)
    }
  })
}

function execCommand () {
  let handle = handleTeam.shift()
  let proj = handle.proj
  let force = !!handle.cb.find((hd) => { return hd.option.force === true })
  let option = {force: force}
  // 先杀掉进程
  return killProcess(proj, option).then(function (p) {
    // 再重启进程
    return addNewProcess(proj, option).then(function (p) {
      let cb = handle.cb
      cb.forEach(function (c) {
        c.resolve(p)
      })
    })
  })
}

function killProcess (proj, option = {force: false}) {
  option = option || {}
  return new Promise(function (resolve) {
    let id = proj._id
    let index = procList.findIndex(function (proc) { return proc.id === id })
    let proc
    if (index >= 0) {
      if (option.force) {
        proc = procList.splice(index, 1)[0]
      } else {
        proc = procList[index]
      }
    }

    if (!proc || !proc.status) {
      console.log('项目尚未启动：[' + proj.name + '] ' + ', 端口号: ' + proj.port)
      return resolve()
    }

    let server = proc.server
    let gulpServer = proc.gulpServer

    // 杀掉gulp进程
    if (option.force && gulpServer) {
      try {
        gulpServer.stdin.write('kill')
      } catch (e) {
        console.log(e)
        console.log('结束gulpServer出错')
      }
    }

    if (server.connected) {
      let resolved
      proc.closeEvents.push(function (server) {
        if (!resolved) {
          killPort(proj.port).then(function () {
            resolved = true
            resolve(proc)
          })
        }
      })

      server.send({_type: 'process', data: 'kill'})

      setTimeout(() => {
        if (!resolved) {
          resolved = true
          resolve()
        }
      }, 30000)
    } else {
      killPort(proj.port).then(function () {
        resolve()
      })
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
function startMockServer (proj, option) {
  return new Promise(function (resolve) {
    if (!proj) return resolve()
    let proc

    let param = []
    param.push('--port=' + (proj.port || 6000))
    param.push('--projectId="' + (proj._id || '') + '"')

    let dir = '../mockapp'
    if (nv < 7) dir = '../mockapp/lower-start'
    let startArgs = ['"' + path.join(__dirname, dir) + '"', ...param]

    if (nv >= 7 && nv < 7.6) {
      startArgs.unshift('--harmony-async-await')
    }

    const server = spawn('node', startArgs, {
      stdio: ['pipe', 'ipc', 'pipe'],
      shell: true,
    })

    server.stderr.pipe(log.errStream)

    let gulpServer = startGulp(proj, option)

    proc = {
      id: proj._id,
      proj: proj,
      server: server,
      gulpServer: gulpServer,
      createdTime: new Date(),
    }
    setEventForObj(proc)
    proc.status = 2// 等待状态
    procList.push(proc)
    let hasResolved

    proc.openEvents.push(function (server) {
      if (!hasResolved) {
        hasResolved = true
        resolve(proc)
      }
    })

    proc.closeEvents.push(function (server) {
      if (!hasResolved) {
        hasResolved = true
        resolve()
      }
    })

    server.on('exit', function () {
      console.log('项目退出：[' + proj.name + '] , 进程id：' + server.pid +
      ', 端口号: ' + proj.port)
      proc.status = 0
    })

    server.on('message', function (msg) {
      if (msg._type === 'process') {
        if (msg.data === 'finished') {
          console.log('项目启动成功: [' + proj.name + '] , 进程id： ' + server.pid + ', 端口号：' + proj.port)
          proc.status = 1
        }
      } else {
        log.childLog(msg)
      }
    })

    setTimeout(function () {
      if (!hasResolved) {
        hasResolved = true
        resolve(proc)
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
    if (typeof gOption[key] !== "string") continue
    params.push('--' + key + '="' + convertCode(gOption[key]) + '"')
  }

  params.push('--root="' + convertCode(proc.path) + '"')
  params.push('--otherOption="' + convertCode(JSON.stringify({autoRefresh: gOption.autoRefresh, port: proc.port})) + '"')

  let gulpPath = gOption.path || path.join(__dirname, '../../tools/gulp')
  gulpPath = path.join(gulpPath, './node_modules/.bin')
  let cmdGulp = '/bin/sh ./gulp'
  if (ostype === 'win32')cmdGulp = 'gulp.cmd'
  let gulpServer = spawn(cmdGulp, [proc.task || 'dev', ...params], {
    stdio: 'pipe',
    shell: true,
    cwd: gulpPath,
  })

  gulpServer.stdout.pipe(log.logGulp)
  gulpServer.stderr.pipe(log.errGulp)

  return gulpServer
}

function nodeVersion () {
  let nv = (process.versions.node || '').split('.')
  return ~~(nv[0] + '.' + nv[1])
}

function sendMsg (id, msg) {
  let proj = procList.find((p) => { return p.id === id })
  if (proj && proj.server && proj.server.connected) {
    proj.server.send(msg)
  }
}

function convertCode (param) {
  let p = param || ''
  return p.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

module.exports = {
  addNewProcess: addNewProcess,
  restartProcess: restartProcess,
  killProcess: killProcess,
  procList: procList,
  sendMsg: sendMsg,
}
