'use strict'
const db = require('../db');
const AppProject = db.appProject;
const ApiModel = db.apiModel;
const ApiBase = db.apiBase;
const request = require('superagent')

const util = require('../util');
const processControl = require('./processControl')
const processList = processControl.processList

module.exports = {
  clientGetProjDiff: clientGetProjDiff,
  clientGetApiDiff: clientGetApiDiff,
  clientDownLoadProj: clientDownLoadProj,
  clientDownLoadProjBase: clientDownLoadProjBase,
  clientDownLoadApi: clientDownLoadApi,
  serverGetProj: serverGetProj,
  serverGetApi: serverGetApi,
  serverDiffProj: serverDiffProj,
  serverDiffApi: serverDiffApi,
}

function getServerInfo(){
  return new Promise(function(resolve, reject){
    db.appBase.cfindOne({}).exec().then(function(doc){
      doc = doc || {};
      let addr = doc.remoteAddress;
      let host = addr.split(":")[0];
      let port = addr.split(":")[1];
      resolve(doc.remoteAddress)
    }, function(){resolve('http://localhost:6001')})
  });
}

/**
 * 获取与服务器之间项目基础信息差异
 */
async function clientGetProjDiff(ctx, next){

  let finalParams = ctx.finalParams;

  let host = await getServerInfo();
  let url = host + "/mock/serverGetProj";
  let req = request.get(url).query(finalParams)
  let res = await req;
  ctx.body = res;
  return next();
}

/**
 * 获取与服务器之间某个项目所有api的差异
 */
async function clientGetApiDiff(ctx, next){

  let finalParams = ctx.finalParams;

  let host = await getServerInfo();
  let url = host + "/mock/serverDiffApi";
  let req = request.get(url).query(finalParams)
  let res = await req;
  ctx.body = res;
  return next();
}

/**
 * 下载服务器项目信息
 */
async function clientDownLoadProj(ctx, next){

  let finalParams = ctx.finalParams;

  let host = await getServerInfo();
  let url = host + "/mock/serverGetProj";
  let req = request.put(url).send(finalParams)
  let res = await req;
  ctx.body = res;
  return next();
}

/**
 * 下载服务器项目基础信息
 */
async function clientDownLoadProjBase(ctx, next){

  let finalParams = ctx.finalParams;

  let host = await getServerInfo();
  let url = host + "/mock/serverGetProj";
  let req = request.put(url).send(finalParams)
  let res = await req;
  ctx.body = res;
  return next();
}

/**
 * 下载服务器项目基础信息
 */
async function clientDownLoadApi(ctx, next){

  let finalParams = ctx.finalParams;

  let host = await getServerInfo();
  let url = host + "/mock/serverGetApi";
  let req = request.put(url).send(finalParams)
  let res = await req;
  ctx.body = res;
  return next();
}

// 服务器端供查询及下载
// 提供api信息下载
async function serverGetProj(ctx, next){

  let finalParams = ctx.finalParams;
  let id = finalParams.id;

  let projInfo, apiInfo, apiArr = [];
  try{
    projInfo = await appProject.cfind({_uid: id}).exec()
    let procId = projInfo._id;
    let apiBs = await ApiBase.cfind({project: procId}).exec()
    let apiBIds = apiBs.map(function(api){return api._id})

    let apiMs = await apiModel.cfind({project: {$in: apiBIds} }).exec()

    apiBs.forEach((api)=>{
      let model = apiMs.filter((ms)=>{return ms.baseid === api._id})
      apiArr.push({base: api, model: model});
    })
    

  }catch(e){

  }

  ctx.body = {
    code: 0,
    data: {
      proj: projInfo,
      api: apiArr,
    }
  };
  return next();
}

async function serverGetApi(ctx, next){

  let finalParams = ctx.finalParams;
  let ids = finalParams.ids;
  let apiArr = [];
  try{
    let apiBs = await ApiBase.cfind({_uid: {$in: ids} }).exec()

    let apiBIds = apiBs.map(function(api){return api._id})

    let apiMs = await apiModel.cfind({project: {$in: apiBIds} }).exec()

    apiBs.forEach((api)=>{
      let model = apiMs.filter((ms)=>{return ms.baseid === api._id})
      apiArr.push({base: api, model: model});
    })
  }catch(e){

  }

  ctx.body = {
    code: 0,
    data: {
      api: apiArr,
    }
  };
  return next();
}

// 返回差值信息

async function serverDiffApi(ctx, next){

  let finalParams = ctx.finalParams;
  let projId = finalParams.id;
  let fromApi = finalParams.data;

  let result;
  try{
    let toApi = await ApiBase.cfind({project: projId}).exec()
    let aBids = toApi.map((api)=>{return api._id})
    let toApiModel = await ApiModel.cfind({baseid: {$in: aBids}}).exec()

    let toArr = [];
    toApi.forEach((api)=>{
      let model = toApiModel.filter((ms)=>{return ms.baseid === api._id})
      toArr.push({base: api, model: model});
    })

    result = diffArr(fromArr, toArr)

  }catch(e){

  }

  ctx.body = {
    code: 0,
    data: result
  };
  return next();
}

// 返回差值信息
async function serverDiffProj(ctx, next){

  let finalParams = ctx.finalParams;
  let fromProj = finalParams.data;

  let result;
  try{
    let toProj = await appProject.cfind({}).exec()
    let tempObj = {};

    result = diffArr(fromProj, toProj)

  }catch(e){

  }

  ctx.body = {
    code: 0,
    data: result
  };
  return next();
}


function diffArr(fromArr, toArr){
  let tempObj = {};
  toArr.forEach((p)=>{
    tempObj[p._uid] = {to: p};
  })

  fromArr.forEach((p)=>{
    if(tempObj[p._uid]){
      tempObj[p._uid].from = p;
    } else {
      tempObj[p._uid] = {from: p};
    }
  })

  Object.keys(tempObj).forEach(function(tuid){
    let obj = tempObj[tuid];
    let to = obj.to;
    let from = obj.from;
    if(to && from){
      if(to._mt === from._mt){
        unchanged.push(from)
      } else if(to._mt > from._mt){
        behind.push(to)
      } else if(to._mt < from._mt){
        ahead.push(from)
      } else {
        if(to._mt) {
          behind.push(to)
        } else if(from._mt){
          ahead.push(from)
        } else {
          untaged.push({server: to, client: from})
        }
      }
    } else if(to){
      serverSide.push(to)
    } else if(from){
      clientSide.push(to)
    }
  })

  return tempObj
}