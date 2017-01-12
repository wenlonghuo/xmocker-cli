const db = require('../db');
const ApiModel = db.apiModel;

const util = require('../util');

const checkParam = util.checkParam;

module.exports = {
  getApiModel: getApiModel,
  addApiModel: addApiModel,
  editApiModel: editApiModel,
  deleteApiModel: deleteApiModel,

}


async function getApiModel(ctx, next){

  let finalParams = ctx.finalParams;

  let data;
  try{
    data = await ApiModel.cfind(finalParams).exec()
  }catch(e){

  }

  ctx.body = {
    code: 0,
    data: {
      list: data
    }
  };
  return next();
}



async function addApiModel(ctx, next){
  let finalParams = ctx.finalParams;

  let data;
  try{
    data = await ApiModel.insert(finalParams);
  }catch(e){
    
  }
  
  ctx.body = {
    code: 0,
    data: {
      result:data,
      tip: '添加api分支成功'
    }
  }
  next();
}




async function editApiModel(ctx, next){
  let finalParams = ctx.finalParams;

  let id = finalParams.id;
  delete finalParams.id;

  let data;
  try{
    data = await ApiModel.update({_id: id}, {$set:finalParams}, {returnUpdatedDocs: true});
    data = data[1]
  }catch(e){
    
  }

  ctx.body = {
    code: 0,
    data: {
      result:data,
      tip: '添加api分支成功'
    }
  }
  next();
}

async function deleteApiModel(ctx, next){
  let finalParams = ctx.finalParams;

  let data;
  try{
    data = await ApiModel.remove({_id: finalParams.id});
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

