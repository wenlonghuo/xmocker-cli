'use strict'
let through2 = require('through2')
let db = require('../../database')
let errorDB = db.errorDB
let hisDB = db.hisDB
let proxyDB = db.proxyDB
const inspect = require('util').inspect

const getQuery = require('../util/getQuery').getQuery

let ws, wss
let logLevel = 10
let maxLen = 1000

// 生成日志函数，传入数据库句柄
class LogData {
  constructor (db, option = {}) {
    this.maxLen = option.len || 100
    this.db = db
    this.team = []
    this.running = false
    this.execSave = this.execSave.bind(this)
    this.add = this.add.bind(this)
  }
  execSave () {
    let msg = this.team.splice(0, this.maxLen)
    if (!msg.length) {
      this.running = false
      return
    }
    this.running = true
    this.db.insert(msg).then(() => {
      setTimeout(this.execSave, 0)
    }, e => {
      setTimeout(this.execSave, 0)
    })
  }
  add (data) {
    this.team.push(data)
    if (!this.running) {
      return this.execSave()
    }
  }
}

const logDB = {
  error: new LogData(errorDB),
  his: new LogData(hisDB),
  proxy: new LogData(proxyDB),
}

// 生成需要的 stream
let errStream = through2(function (chunk, enc, cb) {
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
  if (msg.type === 'log') {
    let time = +new Date()
    searchLog(msg).then(data => {
      data = {
        data: data,
        type: msg.type,
        action: msg.action,
        id: msg.id,
        time,
      }
      data = JSON.stringify(data)
      ws.send(data, function (err) {
        if (err) {
          console.log(err)
        }
      })
    })
  }
}

async function readLogDB (db, query, sort) {
  return await db.cfind(query).sort(sort).limit(maxLen).exec()
}

async function searchLog (msg) {
  msg.data = msg.data || {}
  let query = msg.data.query || {}
  let sort = msg.data.sort || {time: -1}
  query = getQuery(query)
  let eData = await readLogDB(errorDB, query, sort) || []
  let hData = await readLogDB(hisDB, query, sort) || []
  let pData = await readLogDB(proxyDB, query, sort) || []
  return eData.concat(hData).concat(pData)
}

// 日志记录函数
function childLog (data) {
  if (typeof data === 'object') {
    wss.broadcast(JSON.stringify({type: 'log', action: 'ADD_LOGS', logType: data._type, data: data}))
    if (logDB[data._type]) logDB[data._type].add(data)
    if (data.level < logLevel) {
      if (data._type === 'error') {
        console.log(`${new Date(data.time).toLocaleTimeString()} ${inspect(data.data)}`)
        console.log(' 项目：[%s], api：[%s], 分支：[%s]', inspect(data.project), data.api, data.apiModel)
        console.log(' 传入参数: %s', inspect(data.req))
      }
    } else {
      if (data._type === 'console') {
        console.log(...Object.values(data.data))
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
module.exports.ws = wsConnect
