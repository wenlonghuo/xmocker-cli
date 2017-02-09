'use strict'
const db = require('../db');
const apiBase = db.apiBase;
const apiModel = db.apiModel;

const util = require('../util');
const pushRestartList = require('./restartProcess').pushRestartList;
const uid = util.uid();

module.exports = {
  getApiBase: getApiBase,
  addApiBase: addApiBase,
  editApiBase: editApiBase,
  deleteApiBase: deleteApiBase,
  getApiDetail: getApiDetail,
  copyApi: copyApi,
}

async function getApiDetail(ctx, next){

  let finalParams = ctx.finalParams;

  let baseData, modelData;
  try{
    baseData = await apiBase.cfind({_id: finalParams.id}).exec()
    modelData = await apiModel.cfind({baseid: finalParams.id}).exec();
    
  }catch(e){

  }

  

  ctx.body = {
    code: 0,
    data: {
      base: baseData,
      model: modelData,
    }
  };
  return next();
}

async function getApiBase(ctx, next){

  let finalParams = ctx.finalParams;
  let size = ~~finalParams.pageSize;
  let no = finalParams.pageNo;
  let skip = ~~(size * no);

  delete finalParams.pageSize;
  delete finalParams.pageNo;

  let data, total;
  try {
    total = await apiBase.count(finalParams);
    data = await apiBase.cfind(finalParams).sort({name: 1}).skip(skip).limit(size).exec();
  } catch (e) {

  }


  ctx.body = {
    code: 0,
    data: {
      list: data,
      pagination: {
        total: total,
        pageNum: Math.ceil(total/size),
        pageNo: no,
      }
    }
  };
  return next();
}




async function addApiBase(ctx, next){
  let finalParams = ctx.finalParams;

  let data;
  try{
    finalParams._uid = uid();
    finalParams._mt = + new Date();
    data = await apiBase.insert(finalParams);
  }catch(e){
    
  }
  pushRestartList({apiBase: data._id});
  ctx.body = {
    code: 0,
    data: {
      result:data,
      tip: '添加api基础信息成功'
    }
  }
  return next();
}




async function editApiBase(ctx, next){
  let finalParams = ctx.finalParams;

  let id = finalParams.id;
  delete finalParams.id;

  let data;
  try{
    finalParams._mt = + new Date();
    data = await apiBase.update({_id: id}, {$set:finalParams}, {returnUpdatedDocs: true});
    data = data[1]
  }catch(e){
    
  }

  pushRestartList({apiBase: id});

  ctx.body = {
    code: 0,
    data: {
      result:data,
      tip: '编辑api基础信息成功'
    }
  }
  return next();
}

async function deleteApiBase(ctx, next){
  let finalParams = ctx.finalParams;

  let data;
  try{
    data = await apiBase.remove({_id: finalParams.id});
    data = await apiModel.remove({baseid: finalParams.id});
  }catch(e){
    
  }

  ctx.body = {
    code: 0,
    data: {
      tip: '删除成功'
    }
  }
  return next();
}

async function copyApi(ctx, next){
  let finalParams = ctx.finalParams;

  let apiIds = finalParams.from.split(',');
  let projList = finalParams.to.split(',');

  let data;
  try{
    let apiBaseList = await apiBase.cfind({_id: {$in: apiIds}}).exec();
    let apiModelList;
    let i, j, api, proj, apiId, k;

    for(i = 0; i<projList.length;i++){
      proj = projList[i];
      for(j=0; j<apiBaseList.length; j++){
        api = apiBaseList[j];
        if(api.project === proj)continue;
        let oriApiId = api._id;
        delete api._id;
        let oProject = api.project;
        api.project = proj;
        if(!api._uid)api._uid = uid();
        api._mt = +new Date();
        let query = {name: api.name, url: api.url, method: api.method, project: proj,};

        apiId = await apiBase.update(query, {$set:api}, {returnUpdatedDocs: true, upsert: true,});
        
        apiId = apiId[1];
        if(!apiId)continue;

        apiModelList = await apiModel.cfind({baseid: oriApiId}).exec()


        for(k=0; k<apiModelList.length; k++){
          let model = apiModelList[k];
          delete model._id;
          model.baseid = apiId._id;
          if(!model._uid)model._uid = uid();
          model._mt = +new Date();
          let query = {baseid: model.baseid, name: model.name, condition: model.condition};
          await apiModel.update(query, {$set:model}, {returnUpdatedDocs: true, upsert: true,})
        }


      }
      
      pushRestartList({project: proj});
    }

  }catch(e){
    
  }


  ctx.body = {
    code: 0,
    data: {
      result:'',
      tip: '复制api成功'
    }
  }
  return next();
}

