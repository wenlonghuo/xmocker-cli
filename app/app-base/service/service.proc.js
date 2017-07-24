'use strict'
const spawn = require('child_process').spawn
const path = require('path')
const _ = require('lodash')
const log = require('./service.log')
const fkill = require('fkill');
const killPort = require('../util/common').killPort

let isWin = process.platform === 'win32'
let state = {
  proc: [],
  gulp: [],
}

let executor = new Promise((resolve) => { resolve() })
let handleTeam = []

function resolve (dir) {
  return path.join(__dirname, dir)
}

class ProjectServer {
  constructor (proj) {
    let nv = nodeVersion()
    let dir = nv < 7 ? resolve('../../app-mock') : resolve('../../app-mock/lower-start')
    let startArgs = [`"${dir}"`, `--projectId="${proj._id}"`]

    if (nv >= 7 && nv < 7.6) {
      startArgs.unshift('--harmony-async-await')
    }
    this.events = {
      finish: [],
      open: [],
      close: [],
      error: [],
    }

    this.action = {
      0: 'close',
      1: 'open',
      2: 'error',
      3: '',
    }

    this.server = spawn('node', startArgs, {
      stdio: ['pipe', 'ipc', 'pipe'],
      shell: true,
    })
    this.id = proj._id
    this.proj = proj
    this.status = 3
  }

  get status () {
    return this._status
  }
  // 0 exit 1 success 2 error 3 waiting
  set status (val) {
    this._status = val
    if (val !== 3) {
      let list = this.events.finish
      while (list.length) {
        let func = list.shift()
        func(this)
      }
    }
    let list = this.events[this.action[val]]
    if (!list) return
    while (list.length) {
      let func = list.shift()
      func(this)
    }
  }
  finish () {
    return new Promise((resolve, reject) => {
      this.events.finish.push(resolve)
    })
  }
}

async function start (proj, option = {}) {
  if (!proj || !proj.port) throw new Error('项目不存在或项目端口不存在')
  let index = isConflict(state.proc, proj)
  if (index != null) state.proc.splice(index, 1)
  return await startChildProc(proj, option)
}

async function stop (proj, option = {}) {
  let index = state.proc.findIndex(function (proc) { return proc.id === proj._id })
  let proc
  if (index >= 0) {
    if (option.force) {
      proc = state.proc.splice(index, 1)[0]
    } else {
      proc = state.proc[index]
    }
  }

  if (!proc || !proc.status) {
    console.log('项目尚未启动：[' + proj.name + '] ' + ', 端口号: ' + proj.port)
    return
  }

  let server = proc.server
  removeGulp(proj, state.gulp, option)

  if (server.connected) {
    server.send({_type: 'process', data: 'kill'})
    return await proc.finish()
  } else {
    killPort(proj.port)
    return
  }
}


function addToRestart (proj, option = {force: false}) {
  return new Promise(function () {
    if (!proj) return
    let index = handleTeam.findIndex(function (p) { return p.proj._id === proj._id })
    if (index >= 0) {
      let info = handleTeam[index]
      info.proj = proj
      info.cb.push(arguments)
    } else {
      handleTeam.push({proj: proj, cb: [{arg: arguments, option: option}]})
      executor = executor.then(restart)
    }
  })
}

async function restart () {
  let handle = handleTeam.shift()
  let proj = handle.proj
  let force = !!handle.cb.find((hd) => { return hd.option.force === true })
  let option = {force: force}
  // 先杀掉进程
  let result
  let order = 0
  try {
    await stop(proj, option)
    result = await start(proj, option)
  } catch (e) {
    console.log(e)
    result = e
    order = 1
  }

  handle.cb.forEach(function (obj) {
    obj.arg[order](result)
  })
}

async function startChildProc (proj, option = {}) {
  if (!proj || !proj.port) throw new Error('项目不存在或项目端口不存在')
  let proc = new ProjectServer(proj)
  state.proc.push(proc)

  const server = proc.server
  server.stderr.pipe(log.errStream)
  proc.gulp = await execGulp(proj, option)

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
  return await proc.finish()
}

async function execGulp (proj, option = {}) {
  if (!proj.path) return

  let hasStart = await removeGulp(proj, state.gulp, option)
  if (hasStart) return

  let info = {
    injectHtml: proj.injectHtml,
    port: proj.port,
    gulp: proj.gulp,
    path: proj.path.trim(),
  }
  let gOption = proj.gulp

  if (!Object.keys(gOption).length) return
  let params = []

  params.push('--option="' + convertCode(JSON.stringify(info)) + '"')

  let gulpPath = gOption.path || path.join(__dirname, '../../../tool/gulp')
  gulpPath = path.join(gulpPath, './node_modules/.bin')
  let cmdGulp = '/bin/sh ./gulp'
  if (isWin)cmdGulp = 'gulp.cmd'
  let gulpServer = spawn(cmdGulp, [proj.task || 'dev', ...params], {
    stdio: 'inherit',
    shell: true,
    cwd: gulpPath,
  })

  state.gulp.push({server: gulpServer, id: proj._id, proj: proj})
  gulpServer.on('error', e => {
    console.log(e)
  })

  return gulpServer
}

async function removeGulp (proj, list, option = {}) {
  let gulpIndex = list.findIndex(function (g) { return g.id === proj._id })
  if (gulpIndex >= 0) {
    let gulp = list[gulpIndex]
    let gulpInfo = gulp.proj
    if (_.isEqual(proj.gulp, gulpInfo.gulp) && proj.path === gulpInfo.path  && proj.port === gulpInfo.port && proj.injectHtml === gulpInfo.injectHtml) {
      if (!option.force) return true
    }

    if (gulp.server) {
      try {
        list.splice(gulpIndex, 1)
        await fkill(gulp.server.pid, {force: true}).catch(err => {
          console.log(err)
        })
      } catch (e) {
        console.log(e)
        console.log('结束gulpServer出错')
      }
    }
  }
}

function isConflict (list, proj) {
  if (!Array.isArray(list) || typeof proj !== 'object') throw new Error('input is not right')
  let samePort = list.find(item => item.proj && item.proj.port === proj.port && item.status)
  if (samePort && samePort.id !== proj._id) throw new Error(`Conflict: same port ${samePort.proj.name}(${samePort.proj.shortcut}), please make sure the port is different!`)
  let index = list.findIndex(item => item.id === proj._id)
  return index < 0 ? null : index
}

function nodeVersion () {
  return parseFloat(process.versions.node) || 0
}

function sendMsg (id, msg) {
  let proj = state.proc.find((p) => { return p.id === id })
  if (proj && proj.server && proj.server.connected) {
    proj.server.send(msg)
  }
}

function convertCode (param) {
  let p = param || ''
  return encodeURIComponent(p)
}

module.exports = {
  addToRestart,
  start,
  stop,
  state,
  sendMsg,
}
