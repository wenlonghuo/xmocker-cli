'use strict'
const db = require('../app/database')
const spawn = require('child_process').spawn
const path = require('path')
const request = require('superagent')
let restartCnt = 0
let sysTime = new Date()
let baseURL = 'http://localhost:'
const defaultPort = 6001

function setKeys (obj) {
  let arr = []
  Object.keys(obj).forEach((key) => {
    let val = obj[key]
    if (Array.isArray(val)) {
      val.forEach(v => arr.push('--' + key + '="' + v + '"'))
    } else {
      arr.push('--' + key + '="' + val + '"')
    }
  })
  return arr
}

function startServer (option = {}) {
  let nv = nodeVersion()
  let filename = nv < 7 ? resolve('lower-start.js') : resolve('index.js')
  let args = [filename]
  if (nv < 7.6 && nv >= 7) args.unshift('--harmony-async-await')

  args.push(...setKeys(option))
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

function initAppInfo () {
  return getAPPBase().then((doc = {}) => {
    doc = doc || {}
    baseURL += (doc.managePort || defaultPort) + '/mock'
    return getAppStatus().catch(err => Promise.resolve(null))
  })
}

// DB reader
function getProjIdByName (name) {
  let query = { $or: [{ name: { $in: name } }, { shortcut: { $in: name } }] }
  return db.project.cfind(query).exec()
}

function getProjList (name) {
  return db.project.cfind({}).exec()
}

function getAPPBase () {
  return db.appBase.cfindOne({}).exec()
}

// action to netWork
function stopProjByNet (id) {
  return sendToServer('stopProject', { id: id, force: true })
}

function startProjByNet (id, option = {}) {
  option.id = id
  return sendToServer('startProject', option)
}

function killMain () {
  return sendToServer('killMain', {})
}

function getAppStatus () {
  return getFromServer('appStatus', {}).catch(err => {
    return Promise.resolve(null)
  })
}

function getProjListByNet (option) {
  return getFromServer('project', option)
}

function getProjStateByNet (option) {
  return getFromServer('state/project', option)
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

function resolve (name) {
  return '"' + path.join(__dirname, '../app/app-base/', name) + '"'
}

module.exports.main = function main (arg) {
  return initAppInfo().then(data => {
    if (!data) {
      startServer({empty: true})
    } else {
      console.log(`主进程已经启动，可以使用-h 或者--help 启动更多命令`)
    }
  })
}

module.exports.default = function main (arg) {
  return initAppInfo().then(data => {
    if (!data) {
      startServer()
    } else {
      console.log(`主进程已经启动，可以使用-h 或者--help 启动更多命令`)
    }
  })
}

module.exports.exit = function exit (arg) {
  return initAppInfo().then(data => {
    if (!data) {
      console.log(`mocker服务未启动`)
    } else {
      killMain().catch(err => {
        if (err.code === 'ECONNRESET') {
          console.log('主进程已经成功退出')
        } else {
          throw err
        }
      })
    }
  })
}

module.exports.free = function free (arg) {

}

module.exports.list = function list (arg) {
  return initAppInfo().then(data => {
    return data ? getProjListByNet({pageSize: 1000, pageNo: 0}) : getProjList()
  }).then(data => {
    let list = (data.data ? data.data.list : data) || []
    console.log('name \t\t shortcut \t\tstatus')
    list.forEach(item => {
      console.log(`${item.name} \t\t ${item.shortcut} \t\t ${item.status ? 'running' : 'stopped'}`)
    })
  })
}

module.exports.start = function start (arg) {
  return initAppInfo().then(data => {
    if (!data) return startServer({proj: arg})
    getProjIdByName(arg)
      .then((docs) => {
        if (docs) {
          let ids = docs.map(d => d._id).join(',')
          getProjStateByNet({id: ids})
            .then(data => {
              if (data.code) return Promise.resolve(data)
              let list = data.data.list
              let emptyIds = docs.filter(doc => !list.find(l => l.id === doc._id))
              ids = emptyIds.map(d => d._id).join(',')
              if (!ids.length) return Promise.resolve({err: '指定的项目已经全部启动'})
              return startProjByNet(ids, {})
            })
            .then(res => {
              let tip = res.err || res.data.tip
              console.log(tip)
            })
        } else {
          console.log('未找到该项目，请确认输入的名称是否正确')
        }
      })
  })
}

module.exports.kill = function kill (arg) {
  return initAppInfo().then(data => {
    if (!data) {
      console.log('mocker服务尚未启动')
      return
    }
    getProjIdByName(arg)
      .then((docs) => {
        if (docs) {
          let ids = docs.map(d => d._id).join(',')
          stopProjByNet(ids)
            .then(res => {
              let tip = res.err || res.data.tip
              console.log(tip)
            })
        } else {
          console.log('未找到该项目，请确认输入的名称是否正确')
        }
      })
  })
}

module.exports.restart = function restart (arg) {
  return initAppInfo().then(data => {
    if (!data) return startServer({proj: arg})
    getProjIdByName(arg)
      .then((docs) => {
        if (docs) {
          let ids = docs.map(d => d._id).join(',')
          startProjByNet(ids, {force: true})
            .then(res => {
              let tip = res.err || res.data.tip
              console.log(tip)
            })
        } else {
          console.log('未找到该项目，请确认输入的名称是否正确')
        }
      })
  })
}
