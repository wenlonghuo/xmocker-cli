'use strict'
const gInfo = require('./global-info')
const parseURL = require('../util/url-params')
const jsonGate = require('../../plugin/json-gate/json-gate')
const createSchema = jsonGate.createSchema
const execFunc = require('../util/exec-func')

const db = require('../../database/')
const apiModel = db.apiModel
const apiBase = db.apiBase
const Lib = db.Lib

module.exports = {
  findApi,
  filterModels,
  dealFixed,
}

async function findApi (ctx, next) {
  if (!gInfo.apiList || !gInfo.apiList.length) {
    try {
      gInfo.apiList = await apiBase.cfind({ project: gInfo.proj._id }).sort({ name: 1 }).exec()
    } catch (e) {
      return ctx.toError('后台错误')
    }
  }
  let api
  let apiList = gInfo.apiList
  // 查询api
  let base
  let params = Object.assign({}, ctx.query || {}, ctx.request.body)

  if (apiList.length) {
    for (let i = 0; i < apiList.length; i++) {
      api = apiList[i]
      // 判断  method 是否相等
      if (api.method.toUpperCase() !== ctx.method) continue
      // 判断 url 是否相等,并取出参数
      let urlParam = parseURL(api.url, ctx.path)
      if (!urlParam) continue
      // 判断二级路径是否相等
      if (api.path) {
        if (params[api.path] !== api.pathEqual) continue
      }
      base = api
      Object.assign(params, urlParam)
      break
    }
  }

  if (base) {
    let models
    try {
      models = await apiModel.cfind({ baseid: base._id }).exec()
    } catch (e) {
      return ctx.toError('后台错误')
    }
    ctx.matchedApi = { base, models, params }
  }

  return next()
}

async function dealFixed (ctx, next) {
  if (!ctx.matchedApi || !ctx.matchedApi.base || !ctx.matchedApi.models || !ctx.matchedApi.models.length) return next()
  let base = ctx.matchedApi.base
  let models = ctx.matchedApi.models
  let fixData = gInfo.fixData[base._id]
  if (!fixData) return next()
  let type = fixData.type
  if (type === 1) {
    let data = await Lib.findOne({_id: fixData.id})
    if (!data) return next()
    ctx.body = data.model
  } else if (type === 2) {
    ctx.throw(fixData.data.code, fixData.data.message)
  } else if (type === 3) {
    let model = models.find(item => item._id === fixData.id)
    if (!model) return next()
    ctx.body = model.data
  } else {
    return next()
  }
}

async function filterModels (ctx, next) {
  if (!ctx.matchedApi) return next()

  let { base, models, params } = ctx.matchedApi

  let i, model, targetModel
  let result

  // 获取不同条件的api
  for (i = 0; i < models.length; i++) {
    model = models[i]
    let condition = model.condition || ''
    condition = condition.replace(/^\s+/g, '')
    condition = condition.replace(/\s+$/g, '')
    // 条件为空时设置为默认值
    if (condition === '') {
      targetModel = model
      continue
    }
    // 格式化输入参数
    try {
      let mSchema = createSchema(model.inputParam)
      mSchema.format(params)
      result = execFunc(ctx, condition, params)
    } catch (e) {
      return ctx.toError(e, {base, model, params, e})
    }

    if (result) {
      targetModel = model
      break
    }
  }

  if (!targetModel) return ctx.toError('无数据', {base, params})

  let tip = targetModel ? '获取api数据成功：' : '获取api数据失败：'
  let data = targetModel && targetModel.data
  ctx.log(tip + base.name, {base, model, params, res: data})
  await delay(base.delay)
  ctx.body = data
  return next()
}

function delay (time) {
  return new Promise(resolve => {
    setTimeout(resolve, ~~time)
  })
}
