const db = require('../db');
const apiBase = db.apiBase;

const util = require('../util');

const checkParam = util.checkParam;

module.exports = {
  getApiBase: getApiBase,
  addApiBase: addApiBase,
  editApiBase: editApiBase,
  deleteApiBase: deleteApiBase,

}


async function getApiBase(ctx, next){

  let finalParams = ctx.finalParams;

  let data;
  try{
    data = await apiBase.cfind(finalParams).exec()
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



async function addApiBase(ctx, next){
  let finalParams = ctx.finalParams;

  let data;
  try{
    data = await apiBase.insert(finalParams);
  }catch(e){
    
  }
  
  ctx.body = {
    code: 0,
    data: data
  }
  next();
}




async function editApiBase(ctx, next){
  let finalParams = ctx.finalParams;

  let id = finalParams.id;
  delete finalParams.id;

  let data;
  try{
    data = await apiBase.update({_id: id}, {$set:finalParams});
  }catch(e){
    
  }

  ctx.body = {
    code: 0,
    data: data
  }
  next();
}

async function deleteApiBase(ctx, next){
  let finalParams = ctx.finalParams;

  let data;
  try{
    data = await apiBase.remove({_id: finalParams.id});
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

