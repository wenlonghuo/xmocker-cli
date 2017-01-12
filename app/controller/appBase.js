const db = require('../db');
const AppBase = db.appBase;

const util = require('../util');

const checkParam = util.checkParam;

module.exports = {
  getAppBase: getAppBase,
  editAppBase: editAppBase,

}


async function getAppBase(ctx, next){

  let finalParams = ctx.finalParams;

  let data;
  try{
    data = await AppBase.cfindOne(finalParams).exec()
  }catch(e){

  }

  ctx.body = {
    code: 0,
    data: {
      result: data
    }
  };
  return next();
}


async function editAppBase(ctx, next){
  let finalParams = ctx.finalParams;

  let data;
  try{
    data = await AppBase.update({}, {$set:finalParams}, {returnUpdatedDocs: true, upsert: true});
    data = data[1]
  }catch(e){
    
  }

  ctx.body = {
    code: 0,
    data:  {
      result:data,
      tip: '更新基础信息成功'
    }
  }
  next();
}

