'use strict'
const gate = require('../plugin/json-gate/json-gate')
const createSchema = gate.createSchema
const lodash = require('lodash')
const clone = lodash.clone
const camelCase = lodash.camelCase

module.exports = function (apiSchema) {
  return async function formatParam (ctx, next) {
    let method = ctx.method.toLowerCase()
    let query = clone(ctx.query)
    let body = ctx.request.body

    let p = ctx.request.path
    p = camelCase(p.slice(5))

    if (!apiSchema[method] || !apiSchema[method][p]) {
      return ctx.respond.error('接口' + p + '不存在schema')
    }
    let schema = apiSchema[method][p]
    let pathSchema = createSchema(schema)

    // parse url string to Object
    Object.keys(query).forEach(key => {
      if (schema && schema.properties && schema.properties[key] && schema.properties[key].type === 'string') return
      try {
        query[key] = JSON.parse(query[key])
      } catch (e) {}
    })

    let params = Object.assign({}, query, clone(body))
    try {
      pathSchema.validate(params)
    } catch (e) {
      return ctx.respond.error(e.message, {e})
    }

    ctx.finalParams = params
    return next()
  }
}
