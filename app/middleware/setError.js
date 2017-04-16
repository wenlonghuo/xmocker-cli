'use strict'
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
function setError (log) {
  return async function setError (option) {
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

    log(info)

    ctx.body = errObj
    return next()
  }
}


module.exports = setError
