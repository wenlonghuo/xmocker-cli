const db = require('../db');
const apiBase = db.apiBase;
const apiModel = db.apiModel;

const util = require('../util');
const nodeUtil = require('util');

const checkParam = util.checkParam;

module.exports = {
  getApiBase: getApiBase,
  addApiBase: addApiBase,
  editApiBase: editApiBase,
  deleteApiBase: deleteApiBase,
  getApiDetail: getApiDetail,
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
    data = await apiBase.insert(finalParams);
  }catch(e){
    
  }
  
  ctx.body = {
    code: 0,
    data: {
      result:data,
      tip: '添加api基础信息成功'
    }
  }
  next();
}




async function editApiBase(ctx, next){
  let finalParams = ctx.finalParams;

  let id = finalParams.id;
  delete finalParams.id;

  let data;
  try{
    data = await apiBase.update({_id: id}, {$set:finalParams}, {returnUpdatedDocs: true});
  }catch(e){
    
  }

  ctx.body = {
    code: 0,
    data: {
      result:data,
      tip: '编辑api基础信息成功'
    }
  }
  next();
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
  next();
}

