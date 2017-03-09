'use strict'
let through2 = require('through2')
const path = require('path')
const Datastore = require('../db/promiseNeDb')
// 日志有效时间
let td = +new Date() - 1000 * 60 * 60 * 24 * 5
let ws, wss
let logLevel = 10

// 初始化数据库
const ErrStore = new Datastore({filename: path.join(__dirname, '../../db/log/err'),
  autoload: true,
  onload: function () {
    ErrStore.remove({time: {$lte: td}}, {multi: true}).catch(function (e) { console.log(e) })
  },
})
// api 基础数据
const HisStore = new Datastore({filename: path.join(__dirname, '../../db/log/his'),
  autoload: true,
  onload: function () {
    HisStore.remove({time: {$lte: td}}, {multi: true}).catch(function (e) { console.log(e) })
  },
})

// 生成日志函数，传入数据库句柄
function LogFunc (db) {
  let running
  let team = []
  let maxLen = 100
  let clearTeam = function () {
    let msg = team.splice(0, maxLen)
    if (!msg.length) {
      running = false
      return
    }
    running = true
    db.insert(msg).then(function () {
      setTimeout(clearTeam, 0)
    }, function (e) {
      console.log(e)
      setTimeout(clearTeam, 0)
    })
  }

  let func = function (data) {
    team.push(data)
    if (!running) clearTeam()
  }

  return func
}

let errLog = LogFunc(ErrStore)
let hisLog = LogFunc(HisStore)

// 生成需要的 stream
let errStream = through2(function (chunk, enc, cb) {
  process.stdout.write(chunk)
  cb(null, chunk)
})

let errGulp = through2(function (chunk, enc, cb) {
  process.stdout.write(chunk)
  cb(null, chunk)
})

let logGulp = through2(function (chunk, enc, cb) {
  process.stdout.write(chunk)
  cb(null, chunk)
})

// websocket 初始连接函数
function wsConnect (wsClient) {
  ws = wsClient
  wsClient.on('message', incoming)
}

// websocket 通讯
function incoming (msg) {
  try {
    msg = JSON.parse(msg)
  } catch (e) {
    return
  }
  let cmd = msg._cmd
  if (cmd === 'getAllLogs') {
    getAllLogs(msg, function (data) {
      let str = JSON.stringify({_cmd: 'setLogs', data: data})
      ws.send(str, function (err) {
        if (err) {
          console.log(err)
        }
      })
    })
  }
}
// 日志查询函数
function getAllLogs (msg, cb) {
  let lists = []
  let maxLen = 1000
  let queryList = ['projectId', 'apiId', 'apiModelId']
  let query = {}
  queryList.forEach(function (q) {
    if (msg[q] && msg[q].length) {
      query[q] = {$in: msg[q]}
    }
  })

  ErrStore.cfind(query).sort({time: -1}).limit(maxLen).exec().then(function (docs) {
    lists.push(...docs)

    HisStore.cfind(query).sort({time: -1}).limit(maxLen).exec().then(function (docs) {
      lists.push(...docs)
      lists.sort(function (a, b) { return a.time - b.time })
      cb(lists)
    })
  })
}

// 日志记录函数
function childLog (data) {
  if (typeof data === 'object') {
    wss.broadcast(JSON.stringify({_cmd: 'pushLogs', data: [data]}))
    if (data.level < logLevel) {
      if (data._type === 'error') {
        console.log('[%s] %s', new Date(data.time).toLocaleTimeString(), data.data)
        console.log(' %s', data.err.msg)
        console.log(' 项目：[%s], api：[%s], 分支：[%s]', data.project, data.api, data.apiModel)
        console.log(' 传入参数:', data.req)
        errLog(data)
      } else if (data._type === 'his') {
        hisLog(data)
      }
    } else {
      if (data._type === 'console') {
        console.log(data.data)
      }
    }
  } else {
    console.log(data)
  }
}

module.exports = function (msg) {
  process.stdout.write(msg)
}

module.exports.broad = function (hd) {
  wss = hd
  wss.on('connection', wsConnect)

  // Broadcast to all.
  wss.broadcast = function broadcast (data) {
    wss.clients.forEach(function each (client) {
      if (client.readyState === 1) {
        client.send(data)
      }
    })
  }
}

module.exports.errStream = errStream
module.exports.childLog = childLog
module.exports.errGulp = errGulp
module.exports.logGulp = logGulp
module.exports.ws = wsConnect
