'use strict'

const crypto = require('crypto');


let nodeUtil = require('util')



// 校验用户是否登录
function* hasLogin(next) {
  let _s = this.session;

  // 用户未登录时错误提示
  let _r = {
    "hasLogin": false,
    "response": {
      "code": 403,
      "err": "Need login"
    }
  };

  // 登录状态校验
  if (!_s || !Object.keys(_s).length) {
    log('INFO', "check session: false");
  } else if (!_s.id || !_s.name || !_s.title || !_s.mobile) {
    log('INFO', "check session: Not enough params");
  } else {
    return yield next;
  }
  // 返回错误码
  this.body = _r.response;
}

/*
 * 设置错误
 * */
function setError(ctx, err, e, code) {
  if (code === undefined) {
    code = e;
  }

  if (typeof e === 'object') {
    log("ERROR", e, ctx)
    if (e.status === 413) {
      err = "填写的内容总长度超出限制"
    }
  }

  code = (typeof code !== 'number') ? -1 : code;

  ctx.body = {
    code: code,
    err: err
  }
}


/*
 * 日志记录
 * 根据日志级别进行，级别越低，越重要
 *
 * */

let levelBox = {
  "OFF": 0,
  "FATAL": 2,
  "ERROR": 4,
  "WARN": 6,
  "INFO": 10,
  "DETAIL": 12,
  "DEBUG": 15,
}

let currentLogLevel = require('../index').logLevel

function log(level, err, ctx) {
  if (err == null) {
    err = level;
    level = 15;
  }
  if (typeof level === 'string') {
    level = levelBox[level] || 15;
  }


  if (Number(level) <= currentLogLevel) {
    if (typeof err === 'object') {
      try {
        err = currentLogLevel < 15 ?
          JSON.stringify(err) : nodeUtil.inspect(err, { depth: null, colors: true })
      } catch (e) {
        console.log(e);
      }
    }

    if (ctx) {
      let sess = ctx.session || {};
      let info = '[' + new Date().toLocaleString() + '] user: ' + sess.name + ', id: ' + sess.id +
        ',' + ctx.method + ': ' + ctx.url + ', body:' + JSON.stringify(ctx.request.body);
      console.log(info);
    }

    console.log(err);
  }
}

/*
 * 数组的数字类型转字符串，删除指定键值
 *
 * */

function formatArr(arr, option) {
  if (!Array.isArray(arr)) return arr;

  option = option || {};

  let deleteArr = !option.del ? [] : option.del.split(' ');
  let toStr = !option.toStr ? [] : option.toStr.split(' ');
  let cpArr = [];

  arr.forEach(function(obj, index) {
    // 转换为json
    let item = obj;
    if (obj.toJSON) item = obj.toJSON();

    deleteArr.forEach(function(d) {

      // 有子集
      if (d.indexOf('\.') < 0) {
        if (item[d]) {
          delete item[d];
        }
      } else {
        let names = d.split('.')
        let name1 = names[0],
          name2 = names[1];
        let subArr = item[name1];

        if (subArr && Array.isArray(subArr)) {
          subArr.forEach(function(sba) {
            if (sba[name2] !== undefined) {
              delete sba[name2];
            }
          });
        }
      }
    });

    toStr.forEach(function(s) {
      // 有子集
      if (s.indexOf('.') < 0) {
        if (item[s] !== undefined && typeof item[s] !== 'string') {
          item[s] = String(item[s]);
        }
      } else {

        let names = s.split('.')
        let name1 = names[0],
          name2 = names[1];
        let subArr = item[name1];

        if (subArr && Array.isArray(subArr)) {
          subArr.forEach(function(sba) {
            if (sba[name2] !== undefined && typeof sba[name2] !== 'string') {
              sba[name2] = String(sba[name2]);
            }
          });
        }
      }

    });

    cpArr.push(item)
  });

  return cpArr;
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
function checkParam(ctx, params, schema, option) {
  if (!ctx) throw new Error('ctx is needed when use checkParam function');

  // 返回数据类型，默认是编辑状态，仅处理存在数据的部分

  let keys = Object.keys(schema),
    key, param, oriParam = {},
    defaultValue;
  let keyObj;

  for (let i = 0; i < keys.length; i++) {
    key = keys[i];
    keyObj = schema[key] || {};

    // 客户端传输进来的参数
    param = params[key];

    if (param === undefined) {

      // 参数未上传
      if (keyObj.required) {
        return setError(ctx, '请填写参数：' + (keyObj.name || key))
      }
      // 未传参数，但模板存在默认值，设定该值
      if (keyObj.default !== undefined) {
        oriParam[key] = keyObj.default;
      }

    } else {

      // 参数已经上传
      let paramType = typeof param;

      if (keyObj.type === 'string') {

        // 字符串型
        param = String(param);
        // 非空判断
        if (keyObj.noEmpty && param === '') {
          return setError(ctx, '参数值不能为空: ' + (keyObj.name || key))
        }

      } else if (keyObj.type === 'number') {

        // 数字类型
        param = parseFloat(param);
        if (isNaN(param)) {
          return setError(ctx, (keyObj.name || key) + ' 必须是数字或数字样式的字符串')
        }

      } else if (keyObj.type === 'boolean') {

        // 布尔型
        if (paramType !== 'boolean') {
          try {
            if (param === 'true' || param === 'false' && paramType === 'string') {
              param = JSON.parse(param);
            } else {
              param = keyObj.default;
            }
          } catch (e) {
            return setError(ctx, '转换布尔类型失败', e)
          }
        }

      } else if (keyObj.type === 'object') {

        // 对象类型
        if (typeof param !== 'object') {
          try {
            param = JSON.parse(param);
          } catch (e) {
            return setError(ctx, key + ' 必须是对象格式的字符串');
          }
        }

      }

      oriParam[key] = param;
    }

  }
  return oriParam;
}


let apiSchema = require('../api-schemas');
/**
 * formatParam
 * 
 * 格式化参数中间件
 * @param  {} ctx
 * @param  {} next
 */
function formatParam(ctx, next) {
  let method = ctx.method;
  let params = ctx.request.body;
  if (method.toLowerCase() == 'get') params = ctx.query;

  let p = ctx.request.path;
  p = p.split('/').pop();
  let schema = apiSchema[p];
  if (!schema) throw new Error('接口' + p + '不存在schema');

  let finalParams = checkParam(ctx, params, schema);
  if (finalParams) {
    ctx.finalParams = finalParams;
    return next();
  }
}

/**
 * 查询是否修改
 * @param  {} ctx
 * @param  {} type
 */
let reCheckTime = 1000 * 60 * 60;

function* setNotModify(ctx, type) {
  let info;

  try {
    info = yield ChangeInfo.findOne({ name: type });
  } catch (e) {
    log('ERROR', e)
    return;
  }

  if (!info) return;

  let lastDate = info.time || 0;
  let label = info.tag;
  if (lastDate && (+new Date() - lastDate) < reCheckTime) {
    // 时间尚未生成
    ctx.status = 200;
    ctx.set('ETag', label);

    if (ctx.fresh) {
      ctx.status = 304;
      return true;
    }
  } else {
    yield saveChangeInfo(type)
  }

  ctx.set('ETag', label);
  return;
}


// 保存版本信息

let cnt = 0;

function saveChangeInfo(type) {
  cnt++;
  if (cnt > 100000) cnt = 0;
  let tagStr = '' + (+new Date()) + cnt;
  let label = crypto.createHash('md5').update(tagStr).digest("hex");

  return new Promise(function(resolve) {
    ChangeInfo.find({ name: { $in: type } })
      .update({ time: new Date(), tag: label })
      .exec(function(err, result) {
        if (err) {
          log('ERROR', { type: 'saveChangeInfo ERROR', e: err })
        }
        resolve();
      });
  });
}
// // 初始化
// (function() {
//   let tagStr = '' + (+new Date()) + cnt;
//   let label = crypto.createHash('md5').update(tagStr).digest("hex");

//   ['homeCell', 'process', 'version'].forEach(function(name) {
//     ChangeInfo.findOneAndUpdate({ name: name }, { time: new Date(), tag: label }, { upsert: true }, function(err, result) {
//       if (err) {
//         log('ERROR', { type: 'saveChangeInfo ERROR', e: err })
//       }
//     });
//   });

// })();

module.exports = {
  hasLogin: hasLogin,
  checkParam: checkParam,
  formatParam: formatParam,
  setError: setError,
  log: log,
  formatArr: formatArr,
  setNotModify: setNotModify,
  saveChangeInfo: saveChangeInfo,
}