const db = require('../db');
const MockLib = db.mockLib;

const util = require('../util');

const checkParam = util.checkParam;

module.exports = {
  getMockLib: getMockLib,
  addMockLib: addMockLib,
  editMockLib: editMockLib,
  deleteMockLib: deleteMockLib,

}


async function getMockLib(ctx, next){

  let finalParams = ctx.finalParams;

  let data;
  try{
    data = await MockLib.cfind(finalParams).exec()
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



async function addMockLib(ctx, next){
  let finalParams = ctx.finalParams;

  let data;
  try{
    data = await MockLib.insert(finalParams);
  }catch(e){
    
  }
  
  ctx.body = {
    code: 0,
    data: data
  }
  next();
}




async function editMockLib(ctx, next){
  let finalParams = ctx.finalParams;

  let id = finalParams.id;
  delete finalParams.id;

  let data;
  try{
    data = await MockLib.update({_id: id}, {$set:finalParams});
  }catch(e){
    
  }

  ctx.body = {
    code: 0,
    data: data
  }
  next();
}

async function deleteMockLib(ctx, next){
  let finalParams = ctx.finalParams;

  let data;
  try{
    data = await MockLib.remove({_id: finalParams.id});
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

