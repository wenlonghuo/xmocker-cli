'use strict'
/**
 * 日志记录。
 * DB保存：
 * error 存储全局logger的错误
 * proxy 存储ctx记录的logger错误
 * record 存储指定的put post 等修改信息，或者用户登录退出信息
 * info 存储通用的get请求的相关信息，数据量过高时不再存储
 * 当日志存储出现问题时，或者开发环境下，使用console.log进行存储
 * 将用户信息保存到ctx.info.record时，将会自动将该记录保存到record数据库中
 */
const timer = require('../util/timer')
const isDev = process.env.NODE_ENV === 'development'
const chalk = isDev ? require('chalk') : null

const level = 10
const logList = {
  DEBUG: 12,
  INFO: 8,
  PROXY: 6,
  ERROR: 2,
}
const TEAM_LEN = 10000
const SAVE_LEN = 5000
const DELAY = 100

const stringify = require('../util/stringify')
const formatCtx = require('../util/formatCtx')
const db = require('../database')

function time () {
  const str = `[${timer()}] `
  return isDev ? chalk.yellow(str) : str
}

const logQueue = {
  error: [],
  info: [],
  record: [],
  proxy: [],
  logging: false,
  push (type, obj) {
    const queueName = type
    const queue = this[queueName]
    if (!queue) {
      console.error('队列不存在' + queueName)
      return
    }
    if (queue.length > TEAM_LEN) queue.splice(queue.length - TEAM_LEN, queue.length)
    queue.push(obj)
    if (!this.logging) this.exector()
  },
  async exector () {
    this.logging = true
    if (!this.length) {
      this.logging = false
      return
    }
    await this.delay(DELAY)
    let data
    try {
      data = await this.saveLogs()
    } catch (e) {
      console.error(e)
    }
    // console.log(`[${timer()}] 日志记录：`, JSON.stringify(data))
    if (data && this.length) {
      this.exector()
    } else {
      this.logging = false
    }
  },
  async delay (time) {
    return new Promise((resolve) => {
      setTimeout(resolve, ~~time)
    })
  },
  async saveLogs () {
    try {
      let error = await this.save2Db(db.errorDB, this.error)
      let info = await this.save2Db(db.hisDB, this.info)
      let record = await this.save2Db(db.recordDB, this.record)
      let proxy = await this.save2Db(db.proxyDB, this.proxy)
      return { error, info, record, proxy }
    } catch (e) {
      throw e
    }
  },
  get length () {
    return this.error.length + this.info.length + this.record.length + this.proxy.length
  },
  async save2Db (DbName, queue) {
    if (!queue.length) return

    let list = queue.splice(0, SAVE_LEN)
    const time = new Date()
    let data
    try {
      data = await DbName.insert(list)
    } catch (e) {
      throw e
    }
    return { len: data.length, left: queue.length, time: new Date() - time }
  },
}

class Logger {
  constructor (ctx) {
    this.ctx = ctx
  }
  debug () {
    if (level >= logList.DEBUG) {
      const str = this.convert2Str.apply(this, arguments)
      console.log(str)
    }
  }
  info () {
    if (level >= logList.INFO) {
      logQueue.push('info', arguments[0])
    }
    if (isDev) {
      const str = this.convert2Str.apply(this, arguments)
      console.log(str)
    }
  }
  proxy () {
    if (level >= logList.PROXY) {
      logQueue.push('proxy', arguments[0])
      if (!isDev) return
    }
    if (isDev) {
      const str = this.convert2Str.apply(this, arguments)
      console.log(str)
    }
  }
  error () {
    if (level >= logList.ERROR) {
      logQueue.push('error', arguments[0])
      if (!isDev) return
      const str = this.convert2Str.apply(this, arguments)
      console.error(str)
    }
  }
  record () {
    logQueue.push('record', arguments[0])
  }
  convert2Str () {
    if (isDev && typeof arguments[0] === 'object' && arguments[0]) delete arguments[0].res
    return stringify(time(), ...arguments)
  }
  getErrorInfo () {
    let message
    let data = {
      info: '',
      err: {},
    }
    let arg = arguments
    if (typeof arguments[0] === 'string') {
      message = arguments[0]
      arg = [].slice.call(arg, 1)
    }
    for (let obj of arg) {
      if (obj instanceof Error) {
        data.err = {
          msg: obj.message,
          stack: obj.stack,
        }
      } else {
        data.info += JSON.stringify(obj)
      }
    }
    return {
      time: timer(),
      message,
      data,
    }
  }
}

global.logger = new Logger()

module.exports = function () {
  return async function logger (ctx, next) {
    ctx.logger = new Logger(ctx)
    ctx.info = ctx.info || {}

    return next().then(() => {
      if (ctx.status >= 300) return
      if (ctx.info.record) {
        let info = formatCtx(ctx, (ctx.info && ctx.info.message) || (ctx.body && ctx.body.message), ctx.info)
        Object.assign(info, ctx.info.record)
        info.new = ctx.info.record.new || (ctx.body)
        info.message = ctx.info.record.message || (ctx.body && ctx.body.message)
        ctx.logger.record(info)
      } else {
        let obj = formatCtx(ctx, (ctx.info && ctx.info.message) || (ctx.body && ctx.body.message), ctx.info)
        let code = obj.res && obj.res.code
        if (code) {
          ctx.logger.error(obj)
        }
      }
    })
  }
}
module.exports.Logger = Logger
