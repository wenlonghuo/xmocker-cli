const db = require('../db');
const AppProject = db.appProject;

const util = require('../util');

const checkParam = util.checkParam;

module.exports = {
  getAppProject: getAppProject,
  addAppProject: addAppProject,
  editAppProject: editAppProject,
  deleteAppProject: deleteAppProject,

}


async function getAppProject(ctx, next){

  let finalParams = ctx.finalParams;

  let data;
  try{
    data = await AppProject.cfind(finalParams).exec()
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



async function addAppProject(ctx, next){
  let finalParams = ctx.finalParams;

  let data;
  try{
    data = await AppProject.insert(finalParams);
  }catch(e){
    
  }
  
  ctx.body = {
    code: 0,
    data: data
  }
  next();
}




async function editAppProject(ctx, next){
  let finalParams = ctx.finalParams;

  let id = finalParams.id;
  delete finalParams.id;

  let data;
  try{
    data = await AppProject.update({_id: id}, {$set:finalParams});
  }catch(e){
    
  }

  ctx.body = {
    code: 0,
    data: data
  }
  next();
}

async function deleteAppProject(ctx, next){
  let finalParams = ctx.finalParams;

  let data;
  try{
    data = await AppProject.remove({_id: finalParams.id});
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

