const db = require('../db');
const mockLib = db.mockLib;
const mockHis = db.mockHis;

const apiBase = db.apiBase;
const appBase = db.appBase;
const appProject = db.appProject;

const util = require('../util');

const checkParam = util.checkParam;

module.exports = {
  getApi: sendApiData,
  addApi: sendApiData,
  editApi: sendApiData,
  deleteApi: sendApiData,
  getAppConfig: getAppConfig,
}

let appConfig, projectConfig;

async function getAppConfig(ctx, next){
  
  try{
    appConfig = await appBase.cfind({}).exec();
    appConfig = appConfig || {};

    let queryObj = {
      project: appConfig.currentProject || 'root',
    };

    projectConfig = await apiBase.cfind(queryObj).exec();
  }catch(e){
    return ctx.body = {
      code: -1,
      err: '后台错误'
    }
  }
// 获取当前url所属的config
  let method = ctx.method;
  let body = ctx.request.body || {};
  let url = ctx.url;
  let targetConfig;
  for(let i=0; i<projectConfig.length; i++){
    let p = projectConfig[i];

    let md = String(p.method) || '';
    if(md.toUpperCase() !== method) return;
    
    let name = p.name || '/';
    if(p.name.indexOf('/') !== 0)name = '/' + name;
    
    let functionInfo = p.functionInfo || {};
    let type = functionInfo.type || 0;
    if(type === 0){// url 方式
      if(name === url){
        targetConfig = p;
        break;
      }
    } else if(type === 1){ // body方式
      let key = functionInfo.key || '';
      if(key && body[key] && body[key] === name){
        targetConfig = p;
        break;
      }
    }
  };

  if(!targetConfig){
    return ctx.body = {
      code: -1,
      err: '接口不存在，请手动添加接口'
    }
  }
  ctx.apiInfo = {
    api: targetConfig,
    app: appConfig,
    params: Object.assign({}, ctx.query || {}, body)
  };
  return next();
}

// 通用函数
async function sendApiData(ctx, next){
  let config = ctx.apiInfo || {app: {}, api:{}};

  let currentMode = config.app.currentMode;

  let data = {
    code: -1,
    err: '无数据'
  };

  if(currentMode === 1){// 随机模式
     data = setKeys(api.outputParam);

  } else {// 展示模式
    try{
      let apis = await mockLib.cfind({id: config.api._id}).exec();
      let result, defaultApi, i;
      for(i=0; i<apis.length; i++){
        let api = apis[i]
        let condition = api.condition;
        if(condition === ''){
          defaultApi = api.data;
          continue;
        }
        let param = config.param;
        let fc;

        try{
          fc = Function(condition);
        }catch(e){
          console.error('function is not legal'+ api.condition + "," + config.api.name + config.api.project);
          throw new Error(e);
        }
        result = fc.call(ctx, param);
        if(result){
          data = api.data;
          break;
        }
      }

      if(i >= apis.length && defaultApi){
        data = defaultApi;
      }

    }catch(e){

    }
  }

  ctx.body = data;
  return next();

}


function setKeys(obj){
  if(typeof obj !== 'object')return obj;
  if(Array.isArray(obj)){
    let cnt = Math.random() * 100;
    let result = [];
    for(let i=0; i<cnt; i++){
      result.push(setKeys(obj[0]));
    }
    return result;
  }else{
    if(!obj._type){
      let result = {};
      Object.keys(obj).forEach(function(key){
        result[key] = setKeys(obj[key]);
      });
      return result;
    }else{
      return generateData(obj);
    }
  }
}

function generateData(option){
  let type = option._type || 'string';
  if(type === 'string'){
    return 'ssass';
  } else if(type === 'number'){
    return Math.random() * 10000;
  } else if(type === 'boolean'){
    return true;
  } else {
    return null;
  }
}
