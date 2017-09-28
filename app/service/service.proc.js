'use strict'
const isDev = process.env.NODE_ENV === 'development'
const spawn = require('child_process').spawn
const path = require('path')
const _ = require('lodash')
const log = require('./service.log')
const fkill = require('fkill')
const Mocker = isDev ? require('../../xmocker') : require('xmocker')

let isWin = process.platform === 'win32'
let state = {
  proc: [],
  gulp: [],
}

let executor = new Promise((resolve) => { resolve() })
let handleTeam = []

/**
 * 启动项目
 * @param {*} proj
 * @param {*} option
 */
async function start (proj, option = {}) {
  if (!proj || !proj.port) throw new Error('项目不存在或项目端口不存在')
  if (!option.force) {
    let info = getChangedConfig(proj)
    if (info) {
      info.proc.proj = proj
      return info.proc.reconfig(info.option)
    }
  }

  if (isStarted(proj)) {
    await stop(proj, option)
  }

  let index = getProcIndex(state.proc, proj)
  if (~index) state.proc.splice(index, 1)
  return startMocker(proj, option)
}
/**
 * 停止项目
 * @param {*} proj
 * @param {*} option
 */
async function stop (proj, option = {}) {
  let index = state.proc.findIndex(function (proc) { return proc.id === proj._id })
  let proc
  if (~index) {
    if (option.force) {
      proc = state.proc.splice(index, 1)[0]
    } else {
      proc = state.proc[index]
    }
  }

  if (!proc || !proc.status) {
    let message = '项目尚未启动：[' + proj.name + '] ' + ', 端口号: ' + proj.port
    // console.error(message)
    throw message
  }

  removeGulp(proj, state.gulp, option)
  return proc.exit().then(mock => {
    console.log('项目退出成功：[' + proj.name + '] ' + ', 端口号: ' + proj.port)
  })
}

/**
 * 添加项目至重启列表
 * @param {*} proj
 * @param {*} option
 */
function addToRestart (proj, option = {force: false}) {
  if (!proj) return Promise.reject('project doesnot exist')
  return new Promise(function (resolve, reject) {
    let id = proj._id
    let index = handleTeam.findIndex(function (p) { return p.id === id })
    if (~index) {
      let info = handleTeam[index]
      info.proj = proj
      info.list.push({resolve, reject, option})
    } else {
      handleTeam.push({ id: id, proj: proj, list: [{ resolve, reject, option }] })
      executor = executor.then(restartExector)
    }
  })
}

/**
 * 重启子进程队列
 */
async function restartExector () {
  let handle = handleTeam.shift()
  let { list, proj } = handle
  let force = handle.list.some((hd) => hd.option.force)
  let option = {force: force}

  try {
    // if (isStarted(proj)) {
    //   await stop(proj, option)
    // }
    await start(proj, option)
    execGulp(proj, option)
    list.forEach(item => {
      item.resolve(proj)
    })
  } catch (e) {
    list.forEach(item => {
      item.reject(e)
    })
  }
}

/**
 * 启动mocker进程
 * @param {*} proj
 * @param {*} option
 */
async function startMocker (proj, option = {}) {
  if (!proj || !proj.port) throw new Error('项目不存在或项目端口不存在')
  let config = {
    source: { type: 'database', projectId: proj._id },
  }
  let mocker = new Mocker(config)
  mocker.id = proj._id
  mocker.proj = proj
  state.proc.push(mocker)

  return mocker.start(log.mocker)
    .then(config => {
      console.log('项目启动成功: [' + proj.name + '] , 进程id： ' + mocker.server.pid + ', 端口号：' + proj.port)
      return mocker
    })
    .catch(e => {
      console.log('项目启动失败：[' + proj.name + '] , 进程id：' + mocker.server.pid +
        ', 端口号: ' + proj.port)
    })
}

/**
 * exec gulp command
 * @param {*} proj project info
 * @param {*} option option force
 */

async function execGulp (proj, option = {}) {
  if (!proj.path) return

  let hasStarted = await removeGulp(proj, state.gulp, option)
  if (hasStarted) return

  let gOption = proj.gulp
  if (!Object.keys(gOption).length) return

  let info = {
    injectHtml: proj.injectHtml,
    port: proj.port,
    gulp: proj.gulp,
    path: proj.path.trim(),
  }

  let gulpPath = gOption.path || path.join(__dirname, '../../tool/gulp')
  let cwd = path.join(gulpPath, './node_modules/.bin')
  let cmdGulp = '/bin/sh ./gulp'
  if (isWin)cmdGulp = 'gulp.cmd'
  let gulpServer = spawn(cmdGulp, [proj.task || 'dev', '--option="' + convertCode(JSON.stringify(info)) + '"'], {
    stdio: 'inherit',
    shell: true,
    cwd: cwd,
  })

  state.gulp.push({server: gulpServer, id: proj._id, proj: proj})
  gulpServer.on('error', e => {
    console.error(e)
  })

  return gulpServer
}

/**
 * 移除gulp进程
 * @param {*} proj
 * @param {*} list
 * @param {*} option
 */
async function removeGulp (proj, list, option = {}) {
  let gulpIndex = list.findIndex(function (g) { return g.id === proj._id })
  if (~gulpIndex) {
    let gulp = list[gulpIndex]
    let gulpInfo = gulp.proj
    if (_.isEqual(proj.gulp, gulpInfo.gulp) && proj.path === gulpInfo.path && proj.port === gulpInfo.port && proj.injectHtml === gulpInfo.injectHtml) {
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

/**
 * 判断启动项目是否冲突
 * @param {*} list
 * @param {*} proj
 */
function getProcIndex (list, proj) {
  if (!Array.isArray(list) || typeof proj !== 'object') throw new Error('input is not legal')
  let samePort = list.find(item => item.proj && item.proj.port === proj.port && item.status > 1)
  if (samePort && samePort.id !== proj._id) throw new Error(`Conflict: same port ${samePort.proj.name}(${samePort.proj.shortcut}), please make sure the port is different!`)
  return list.findIndex(item => item.id === proj._id)
}

function isStarted (proj) {
  return ~state.proc.findIndex(item => item.id === proj._id && item.status > 1)
}

function getChangedConfig (proj) {
  let proc = getProcById(proj._id)
  if (!proc || proc.status < 2) return
  let oldProj = proc.proj
  let needRestart = ['port', 'path', 'staticPath'].some(key => !_.isEqual(proj[key], oldProj[key]))
  if (needRestart) return

  let optKeys = [
    {key: 'proxy404', optKey: 'proxyTo'},
    {key: 'proxyMode', optKey: 'proxyType'},
    {key: 'linkViews', optKey: 'urls'},
    {key: 'inject', optKey: 'injectHtml'},
    {key: 'proxyTable', optKey: 'proxyTable'},
  ]
  let option = {}
  optKeys.forEach(op => {
    if (!_.isEqual(proj[op.optKey], oldProj[op.optKey])) option[op.key] = proj[op.optKey]
  })
  return { proc, option }
}

function convertCode (param) {
  let p = param || ''
  return encodeURIComponent(p)
}

function getProcById (id) {
  return state.proc.find(item => item.id === id)
}

module.exports = {
  addToRestart,
  start,
  stop,
  state,
  getProcById,
}
