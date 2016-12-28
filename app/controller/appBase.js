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
    data = await AppBase.cfind(finalParams).exec()
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


async function editAppBase(ctx, next){
  let finalParams = ctx.finalParams;

  let id = finalParams.id;
  delete finalParams.id;

  let data;
  try{
    data = await AppBase.update({_id: id}, {$set:finalParams});
  }catch(e){
    
  }

  ctx.body = {
    code: 0,
    data: data
  }
  next();
}

