const db = require('../db');
const AppProject = db.appProject;

const util = require('../util');
const processControl = require('../processControl')
const processList = processControl.processList

const checkParam = util.checkParam;

module.exports = {
  getAppProject: getAppProject,
  addAppProject: addAppProject,
  editAppProject: editAppProject,
  deleteAppProject: deleteAppProject,
  startAppProject: startAppProject,
  stopAppProject: stopAppProject,
}


async function getAppProject(ctx, next) {

  let finalParams = ctx.finalParams;
  let size = ~~finalParams.pageSize;
  let no = finalParams.pageNo;
  let skip = ~~(size * no);

  delete finalParams.pageSize;
  delete finalParams.pageNo;

  let data, total;
  try {
    total = await AppProject.count(finalParams);
    data = await AppProject.cfind(finalParams).sort({name: 1}).skip(skip).limit(size).exec();
  } catch (e) {

  }

  data.forEach(function(d){
    let id = d._id;
    let proc = processList.find(function(proc){return proc.id === id});
    if(proc){
      d.status = proc.status;
    }
  });

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



async function addAppProject(ctx, next) {
  let finalParams = ctx.finalParams;

  let data;
  try {
    data = await AppProject.insert(finalParams);
  } catch (e) {

  }

  ctx.body = {
    code: 0,
    data: {
      data: data,
      tip: '添加成功'
    }
  }
  return next();
}




async function editAppProject(ctx, next) {
  let finalParams = ctx.finalParams;

  let id = finalParams.id;
  delete finalParams.id;

  let data;
  try {
    data = await AppProject.update({ _id: id }, { $set: finalParams });
  } catch (e) {

  }

  ctx.body = {
    code: 0,
    data: {
      data: data,
      tip: '编辑成功'
    }
  }
  return next();
}

async function deleteAppProject(ctx, next) {
  let finalParams = ctx.finalParams;

  let data;
  let ids = finalParams.id.split(',');
  try {
    data = await AppProject.remove({ _id:{$in: ids}}, { multi: true });
  } catch (e) {

  }

  ctx.body = {
    code: 0,
    data: {
      tip: '删除成功'
    }
  }
  return next();
}

async function startAppProject(ctx, next) {
  let finalParams = ctx.finalParams;

  let data;
  let ids = finalParams.id.split(',');
  try {
    data = await AppProject.cfind({ _id:{$in: ids}}).exec();
  } catch (e) {

  }

  if(!data || !data.length){
    return ctx.body = {
      code: 0,
      data: {
        tip: '成功启动0个应用'
      }
    }
  }
  let procNum = 0;
  for(let i=0; i<data.length; i++) {
    let procInfo = await processControl.restartProcess(data[i]);
    if(procInfo)procNum++;
  }

  ctx.body = {
    code: 0,
    data: {
      tip: '成功启动' + procNum + '个应用'
    }
  }
  return next();
}

async function stopAppProject(ctx, next) {
  let finalParams = ctx.finalParams;

  let data;
  let ids = finalParams.id.split(',');
  try {
    data = await AppProject.cfind({ _id:{$in: ids}}).exec();
  } catch (e) {

  }

  if(!data || !data.length){
    return ctx.body = {
      code: 0,
      data: {
        tip: '成功停止0个应用'
      }
    }
  }
  let procNum = 0;
  for(let i=0; i<data.length; i++) {
    let procInfo = await processControl.killProcess(data[i]);
    if(procInfo)procNum++;
  }
  

  ctx.body = {
    code: 0,
    data: {
      tip: '成功停止'+procNum+ '个应用'
    }
  }
  return next();
}