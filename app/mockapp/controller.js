'use strict'
const minimist = require('minimist');

const db = require('../db');
const apiModel = db.apiModel;
const mockHis = db.mockHis;

const apiBase = db.apiBase;
const appBase = db.appBase;
const appProject = db.appProject;

const funcToString = Function.prototype.toString;
const util = require('../util');
const argv = minimist(process.argv.slice(2))
const formatEntranceParam = util.formatEntranceParam;

module.exports = {
  getApi: sendApiData,
  addApi: sendApiData,
  editApi: sendApiData,
  deleteApi: sendApiData,
  getProjectApiList: getProjectApiList,
}

let appConfig, projectConfig;

let projectId = argv.projectId || '';
let apiList;
// 获取当前项目所有的api列表，存储到内存中
async function getProjectApiList(ctx, next) {

   if(!ctx.is('application/x-www-form-urlencoded'))return next();

  let api;
  if(!apiList){
    try {
      apiList = await apiBase.cfind({ project: projectId }).sort({ name: 1 }).exec();
    } catch (e) {
      return resError(ctx, '后台错误')
    }
  }
  let url = ctx.path;
  let method = ctx.method;
  let apiItem;
  let params = Object.assign({}, ctx.query || {}, ctx.request.body);

  if (apiList.length) {
    for (let i = 0; i < apiList.length; i++) {
      api = apiList[i];
      if (api.url !== url || api.method.toUpperCase() !== method) continue;
      if (!api.path) {
        if (api.name === url) {
          apiItem = api;
          break;
        }
      } else {
        let paramArr = api.path.split('.');
        let name, urlName, i;
        urlName = params;
        for (i = 0; i < paramArr.length; i++) {
          let n = paramArr[i];
          if (!urlName[n]) break;
          urlName = urlName[n];
        }
        if (i >= paramArr.length && urlName === api.name) {
          apiItem = api;
          break;
        }
      }
    }
  }
  if (apiItem) {
    let conditionList;
    try {
      conditionList = await apiModel.cfind({ baseid: apiItem._id }).exec();
    } catch (e) {
      return resError(ctx, '后台错误')
    }
    ctx.apiInfo = {
      apiBase: apiItem,
      apiModel: conditionList,
      params: params
    };
  } else {
    return resError(ctx, '不存在api信息，请添加相关信息')
  }

  return next();
}

// 通用函数
async function sendApiData(ctx, next) {
  if(!ctx.is('application/x-www-form-urlencoded'))return next();

  let currentMode = 0;
  let reqApiModel = ctx.apiInfo.apiModel;
  let reqApiBase = ctx.apiInfo.apiBase;
  let params = ctx.apiInfo.params;
  let data;

  let defaultApi, i, api, noData;
  let conditionFunction, result, dealedParams, paramsArr = [];

  // 获取不同条件的api
  for (i = 0; i < reqApiModel.length; i++) {
    api = reqApiModel[i]
    let condition = api.condition || '';
    // 条件为空时设置为默认值
    if (condition === '') {
      defaultApi = api;
      continue;
    }

    try {
      if (condition.indexOf('return') < 0) condition = 'return ' + condition;

      dealedParams = formatEntranceParam(params, api.inputParam);
      if(dealedParams._err)return resError(ctx, dealedParams._err);
      let keys = Object.keys(dealedParams);
      keys.forEach(function(key) {
        paramsArr.push(dealedParams[key]);
      })

      keys.push(condition);

      conditionFunction = new Function(...keys);
    } catch (e) {
      sendErrorMsg(ctx, {
        data: 'api分支判断条件函数不合法：' + condition,
        level: 6,
        apiId: reqApiBase._id,
        api: reqApiBase.name,
        apiModelId: api._id,
        apiModel: api.name,
        req: {
          params: params,
          url: ctx.url,
          method: ctx.method,
        },
        reqParsed: dealedParams,
        res: null,
        err: {
          msg: String(e),
          stack: String(e.stack)
        },
        additional: null,
      });
      continue;
    }

    // 调用函数
    try {
      result = conditionFunction.apply(ctx, paramsArr);
    } catch (e) {
      sendErrorMsg(ctx, {
        data: 'api分支执行判断条件的函数时出现错误：' + condition,
        level: 6,
        apiId: reqApiBase._id,
        api: reqApiBase.name,
        apiModelId: api._id,
        apiModel: api.name,
        req: {
          params: params,
          url: ctx.url,
          method: ctx.method,
        },
        reqParsed: dealedParams,
        res: null,
        err: {
          msg: String(e),
          path: 'app/mockapp/controller/sendApiData'
        },
        additional: null,
      });
      continue;
    }

    if (result) {
      data = api.data[0];
      break;
    }
  }

  if (i >= reqApiModel.length && defaultApi) {
    api = defaultApi || {};
    if(!dealedParams){
      dealedParams = formatEntranceParam(params, api.inputParam);
      if(dealedParams._err)return resError(ctx, dealedParams._err);
    }
    let apiData = api.data || [];
    data = apiData[0] || {};
  } else if(i >= reqApiModel.length && !defaultApi){
    noData = true;
  }


  if (currentMode === 1) { // 随机模式
    data = setKeys(api.outputParam);

  }

  if (!noData) {
    sendHisData(ctx, {
      data: '获取api数据成功：' + reqApiBase.name,
      level: 8,
      apiId: reqApiBase._id,
      api: reqApiBase.name,
      apiModelId: api._id,
      apiModel: api.name,
      req: {
        params: params,
        url: ctx.url,
        method: ctx.method,
      },
      reqParsed: dealedParams,
      res: data,
    });
  } else {
    sendHisData(ctx, {
      data: '获取api数据失败：' + reqApiBase.name,
      level: 8,
      apiId: reqApiBase._id,
      api: reqApiBase.name,
      req: {
        params: params,
        url: ctx.url,
        method: ctx.method,
      },
      reqParsed: dealedParams,
      res: data,
    });
  }

  if(!data)return resError(ctx, '无数据');
  ctx.body = data;
  return next();
}


// 设置模板值
function setKeys(obj) {
  if (typeof obj !== 'object') return obj || {};
  let topResult = {};
  let keys = Object.keys(obj);

  keys.forEach(function(key) {
    let param = obj[key]

    if (param.type === 'array') {
      // 数组型
      let cnt = Math.random() * 100;
      let result = [];
      for (let i = 0; i < cnt; i++) {
        result.push(setKeys(param.child));
      }
      topResult[key] = result;
    } else {
      if (param.type === 'object') {
        // 对象型
        let result = setKeys(param.child);
        topResult[key] = result;
      } else {
        // 普通
        topResult[key] = generateData(param);
      }
    }
  })

  return topResult
}

function generateData(option) {
  let type = option._type || 'string';
  if (type === 'string') {
    let len = Math.round(Math.random() * 200);
    return randomCode(len);
  } else if (type === 'number') {
    return Math.random() * 10000;
  } else if (type === 'boolean') {
    return true;
  } else {
    return null;
  }
}


// 生成随机字符串

let codeDirecory = {
  punctuation: [
    [32, 15],
    [58, 6],
    [91, 5],
    [123, 3],
    [160, 31],
    [215, 0],
    [247, 0],
  ],
  number: [
    [48, 0]
  ],
  letter: [
    [65, 25],
    [97, 25]
  ],
  chinese: [
    [19968, 20941]
  ],
}

function randomCode(len = 10, type = ['letter', 'chinese', 'number', 'punctuation']) {
  let i = 0;
  let str = "";
  let base, range, order, arr, randomInfo, randomLen, lower;
  let typeLen = type.length - 1;
  if (typeLen < 0) {
    return '';
  }

  while (i < len) {
    i++;
    order = Math.round(Math.random() * typeLen);
    arr = codeDirecory[type[order]] || codeDirecory.letter;

    randomInfo, randomLen = arr.length - 1;

    if (randomLen > 0) {
      randomInfo = arr[Math.round(Math.random() * randomLen)];
    } else {
      randomInfo = arr[0];
    }
    base = randomInfo[0]
    range = randomInfo[1]
    lower = parseInt(Math.random() * range);
    str += String.fromCharCode(base + lower);
  }
  return str;
}


function sendErrorMsg(ctx, data) {
  let msg = {
    _type: 'error',
    time: +new Date(),
    args: {
      port: argv.port,
      fsPath: argv.fileServerPath
    },
    projectId: argv.projectId,
    project: argv.projectName
  };
  msg = Object.assign(msg, data);
  process.send(msg);
}
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
function sendHisData(ctx, data) {
  let msg = {
    _type: 'his',
    time: +new Date(),
    args: {
      port: argv.port,
      fsPath: argv.fileServerPath
    },
    projectId: argv.projectId,
    project: argv.projectName
  };
  msg = Object.assign(msg, data);
  process.send(msg);
}

let errorModel = argv.errorModel || '{code: -1, codeDesc:"${msg}", codeDescUser:"${msg}"}';
let errorExp = /\$\{msg\}/gi;
function resError(ctx, msg){
  sendErrorMsg(ctx, msg)
  return ctx.body = errorModel.replace(errorExp, msg)
}