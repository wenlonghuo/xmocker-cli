'use strict'
const isLower = nodeVersion() < 7.6
const db = isLower ? require('../../lower/database') : require('../../app/database')
const spawn = require('child_process').spawn
const path = require('path')
const request = require('superagent')
let restartCnt = 0
let sysTime = new Date()
let baseURL = 'http://localhost:'
const defaultPort = 6001

function startServer (option = {}) {
  let filename = isLower ? resolveFile('lower') : resolveFile('app')
  let args = ['"' + filename + '"']

  setKeys(args, option)
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
    if (msg === 1) return
    if (new Date() - timeStamp > 1000) {
      setTimeout(startServer, 500)
    }
  })
}

// DB reader
function getProjIdByName (name) {
  name = Array.isArray(name) ? name : [name]
  let query = { $or: [{ name: { $in: name } }, { shortcut: { $in: name } }] }
  return db.project.cfind(query).exec()
}

function initAppInfo () {
  return getAPPBase().then((doc = {}) => {
    doc = doc || {}
    baseURL += (doc.managePort || defaultPort) + '/mock'
    return getAppStatus().catch(err => Promise.resolve(null))
  })
}

function getAPPBase () {
  return db.appBase.cfindOne({}).exec()
}

function getAppStatus () {
  return getFromServer('appStatus', {}).catch(err => {
    return Promise.resolve(null)
  })
}

// common request
function sendToServer (url, params) {
  return new Promise((resolve, reject) => {
    request.put(`${baseURL}/${url}`).send(params).end(function (err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res.body)
      }
    })
  })
}

function getFromServer (url, params) {
  return new Promise((resolve, reject) => {
    request.get(`${baseURL}/${url}`).query(params).end(function (err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res.body)
      }
    })
  })
}

function nodeVersion () {
  return parseFloat(process.versions.node) || 0
}

function resolveFile (name) {
  return path.join(__dirname, '../../', name)
}

function setKeys (args, obj) {
  Object.keys(obj).forEach((key) => {
    args.push('--' + key + '="' + convertCode(obj[key]) + '"')
  })
  return args
}

function convertCode (param) {
  let p = param || ''
  if (typeof p === 'object') p = JSON.stringify(p)
  return encodeURIComponent(p)
}

module.exports = {
  isLower,
  db,
  startServer,
  initAppInfo,
  getProjIdByName,
  sendToServer,
  getFromServer,
}

process.on('unhandledRejection', function (e) {
  throw e
})
