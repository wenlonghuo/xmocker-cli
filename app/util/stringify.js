const isDev = process.env.NODE_ENV === 'development'
const inspect = require('util').inspect
const chalk = require('chalk')

var prettyObject = isDev ? prettyObjectDev : prettyObjectProd

function prettyObjectProd (obj) {
  if (obj && obj.toJSON) obj = obj.toJSON()
  if (typeof obj !== 'object') return String(obj)
  if (obj instanceof Error) {
    return `${obj.message}\n ${obj.stack}`
  }
  return JSON.stringify(obj)
}

function prettyObjectDev (obj) {
  if (obj && obj.toJSON) obj = obj.toJSON()
  if (typeof obj !== 'object' || !obj || obj instanceof Error || !obj.time) return inspect(obj)
  let str = '\n'
  for (let key in obj) {
    let head = chalk.green(key)
    let body = obj[key]
    if (body && body.toJSON) body = body.toJSON()
    body = inspect(body, {depth: 20, colors: true})
    str += `${head} -> ${body}\n`
  }
  return str
}

module.exports = function stringify () {
  let str = ''
  for (let arg of arguments) {
    str += typeof arg === 'object' ? prettyObject(arg) : String(arg)
  }
  return str
}

module.exports.stringifyPretty = function stringifyPretty () {
  let str = ''
  for (let arg of arguments) {
    str += typeof arg === 'object' ? prettyObjectDev(arg) : String(arg)
  }
  return str
}
