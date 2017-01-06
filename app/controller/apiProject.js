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
    data = await AppProject.cfind(finalParams).skip(skip).limit(size).exec();
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