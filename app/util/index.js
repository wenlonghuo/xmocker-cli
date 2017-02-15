'use strict'
// const crypto = require('crypto')
let log = require('./log')
/*
 * 设置错误
 * */
/**
 * 日志记录。包含内容
 * _type: 'out'
 * level: 10 日志等级
 * time: 时间戳
 * data: 内容
 * project: project名称
 * api： api名称
 * apiModel： 分支名称
 * projectId: 项目id
 * apiId: 接口Id
 * apiModelId: 分支id
 * req: 请求入参
 * reqParse: 转换后入参
 * res: 输出参数
 * args: process的启动参数
 * err: 错误详细信息
 * additional: 其他参数
 */
function setError (option) {
  let ctx = option.ctx
  let next = option.next
  let err = option.err
  let e = option.e
  let code = option.code || -1

  let errObj = {
    code: code,
    err: err,
  }

  let info = {
    _type: 'error',
    level: 4,
    time: +new Date(),
    data: err,
    req: {
      params: ctx.finalParams,
      url: ctx.url,
      method: ctx.method,
    },
    res: errObj,
    err: {
      msg: String(e),
      stack: String(e ? e.stack : ''),
    },
  }

  log.childLog(info)

  ctx.body = errObj
  return next()
}

/*
 * 参数校验
 * @ctx Koa上下文
 * @params request传入的query或body的参数
 * @schema 自定义参数校验模板
 * @option 参数
 *
 * schema中可传参数类型
 * type:
 *   'string': 可设置noEmpty
 *   'number'
 *   'boolean'
 *   'object'
 *
 * 注意：
 * schema中default值设置后，不管该参数是否是required，返回的obj均放入返回对象中
 *
 * */
let specialList = ['null', 'undefined', 'NaN', 'Infinity', '-Infinity']
function checkParam (ctx, params, schema, option) {
  if (!ctx) throw new Error('ctx is needed when use checkParam function')

  option = option || {}
  // 返回数据类型，默认是编辑状态，仅处理存在数据的部分
  let oriParam = formatEntranceParam(params, schema, option)
  if (oriParam._err) {
    return setError({ctx: ctx, next: new Function(), err: oriParam._err, e: oriParam._e})
  }
  return oriParam
}

// 格式化代码
function formatEntranceParam (params, schema, option = {}) {
  let keys = Object.keys(schema)
  let key, param, cname
  let oriParam = {}
  let keyObj

  for (let i = 0; i < keys.length; i++) {
    key = keys[i]
    keyObj = schema[key] || {}

    // 客户端传输进来的参数
    param = params[key]
    cname = keyObj.cname || key

    if (param === undefined) {
      // 参数未上传
      if (keyObj.required) {
        return {_err: '请填写参数：' + cname}
      }
      // 未传参数，但模板存在默认值，设定该值
      if (keyObj.default !== undefined) {
        oriParam[key] = keyObj.default
      }
    } else {
      // 特殊值提醒
      if (option.warn && keyObj.specialValue && specialList.indexOf(String(param)) >= 0 && keyObj.specialValue.indexOf(String(param)) < 0) {
        console.error('传入参数可能存在错误' + cname + ', 值为：' + param)
      }

      // 参数已经上传
      let paramType = typeof param

      if (keyObj.type === 'string') {
        // 字符串型
        param = String(param)

        // 非空判断
        if (keyObj.noEmpty && param === '') {
          return {_err: '参数值不能为空: ' + cname}
        }

        if (keyObj.max != null && (keyObj.max < param.length || keyObj.min > param.length)) {
          return {_err: '参数值长度范围不正常: ' + cname}
        }
      } else if (keyObj.type === 'number') {
        // 数字类型
        param = parseFloat(param)
        if (isNaN(param)) {
          return {_err: cname + ' 必须是数字或数字样式的字符串'}
        }

        if (keyObj.max != null && (keyObj.max < param || keyObj.min > param)) {
          return {_err: '参数数值超出范围: ' + cname}
        }
      } else if (keyObj.type === 'boolean') {
        // 布尔型
        if (paramType !== 'boolean') {
          try {
            if (param === 'true' || param === 'false' && paramType === 'string') {
              param = JSON.parse(param)
            } else {
              param = keyObj.default
            }
          } catch (e) {
            return {_err: '转换布尔类型失败' + cname, _e: e}
          }
        }
      } else if (keyObj.type === 'object') {
        // 对象类型
        if (typeof param !== 'object') {
          try {
            param = JSON.parse(param)
          } catch (e) {
            return {_err: cname + ' 必须是对象格式的字符串'}
          }
        }
        // 存在子对象校验
        if (keyObj.child) {
          param = formatEntranceParam(param, keyObj.child, option)
          if (param._err) {
            return param
          }
        }
      } else if (keyObj.type === 'array') {
        // 数组类型
        if (typeof param !== 'object') {
          try {
            param = JSON.parse(param)
          } catch (e) {
            return {_err: cname + ' 必须是数组格式的字符串'}
          }
        }
        // 存在子对象校验
        if (keyObj.child && Array.isArray(param)) {
          let tmpArr = []
          let item, resultItem
          for (let i = 0; i < param.length; i++) {
            item = param[i]
            resultItem = formatEntranceParam(item, keyObj.child, option)
            if (resultItem._err) {
              return resultItem
            }
            tmpArr.push(resultItem)
          }
          param = tmpArr
        } else if (!Array.isArray(param)) {
          return {_err: cname + ' 传入的不是数组'}
        }
      }
      oriParam[key] = param
    }
  }
  return oriParam
}

let apiSchema = require('../api-schemas')
/**
 * formatParam
 * 格式化参数中间件
 * @param  {} ctx
 * @param  {} next
 */
function formatParam (ctx, next) {
  let method = ctx.method
  let params = ctx.request.body
  if (method.toLowerCase() === 'get' || method.toLowerCase() === 'delete') params = ctx.query

  let p = ctx.request.path
  p = p.split('/').pop()
  let schema = apiSchema[p]
  if (!schema) {
    ctx.body = {
      code: -1,
      err: '接口' + p + '不存在schema',
    }
    return
  }

  let finalParams = checkParam(ctx, params, schema)
  if (finalParams) {
    ctx.finalParams = finalParams
    return next()
  }
}

module.exports = {
  checkParam: checkParam,
  formatParam: formatParam,
  formatEntranceParam: formatEntranceParam,
  setError: setError,
}
