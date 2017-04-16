'use strict'
const db = require('../../database/')
const Project = db.project
const ApiModel = db.apiModel
const ApiBase = db.apiBase

const uid = require('../util/common').uid()
const service = require('../service')
const proc = service.proc
const processList = service.proc.state.proc
const isEqual = require('lodash').isEqual
const restartBackground = service.ctrlProc.restart.add

module.exports = {
  getProject: getProject,
  getRunningProject,
  addProject: addProject,
  editProject: editProject,
  deleteProject: deleteProject,
  startProject: startProject,
  stopProject: stopProject,
  setDefaultApiParam: setDefaultApiParam,
}

async function getProject (ctx, next) {
  let finalParams = ctx.finalParams
  let size = ~~finalParams.pageSize
  let no = ~~finalParams.pageNo
  let skip = ~~(size * no)

  delete finalParams.pageSize
  delete finalParams.pageNo

  let data, total
  try {
    total = await Project.count(finalParams)
    data = await Project.cfind(finalParams).sort({name: 1}).skip(skip).limit(size).exec()
  } catch (e) {
    return ctx.setError({ctx: ctx, next: next, err: '查询项目信息出错', e: e})
  }

  data.forEach(function (d) {
    let id = d._id
    let proc = processList.find(function (proc) { return proc.id === id })
    if (proc) {
      d.status = proc.status
    }
  })

  ctx.body = {
    code: 0,
    data: {
      list: data,
      pagination: {
        total: total,
        pageCnt: Math.ceil(total / size),
        pageNo: no,
      },
    },
  }
  return next()
}

async function getRunningProject (ctx, next) {
  let finalParams = ctx.finalParams
  let ids = (finalParams.id || '').split(',')
  let data = []
  ids.forEach(function (id) {
    let proc = processList.find(function (proc) { return proc.id === id })
    if (proc && proc.status) {
      data.push({name: proc.proj.name, id: id, shortcut: proc.proj.shortcut})
    }
  })

  ctx.body = {
    code: 0,
    data: {
      list: data,
    },
  }
  return next()
}

async function addProject (ctx, next) {
  let finalParams = ctx.finalParams

  let data
  try {
    finalParams._uid = uid()
    finalParams._mt = +new Date()
    data = await Project.insert(finalParams)
  } catch (e) {
    return ctx.setError({ctx: ctx, next: next, err: '添加项目出错', e: e})
  }
  // restartBackground({project: data._id})

  ctx.body = {
    code: 0,
    data: {
      data: data,
      tip: '添加成功',
    },
  }
  return next()
}

async function editProject (ctx, next) {
  let finalParams = ctx.finalParams

  let id = finalParams.id
  delete finalParams.id
  let option = {type: 'project', id: id}
  let data
  try {
    finalParams._mt = +new Date()
    let info = await Project.cfindOne({ _id: id }).exec()
    if (info && finalParams.gulp) {
      if (!isEqual(info.gulp, finalParams.gulp)) option.force = true
    }
    data = await Project.update({ _id: id }, { $set: finalParams })
  } catch (e) {
    return ctx.setError({ctx: ctx, next: next, err: '编辑项目出错', e: e})
  }

  restartBackground(option)
  ctx.body = {
    code: 0,
    data: {
      data: data,
      tip: '编辑成功',
    },
  }
  return next()
}

async function deleteProject (ctx, next) {
  let finalParams = ctx.finalParams

  // let data
  let ids = finalParams.id.split(',')
  try {
    await Project.remove({_id: {$in: ids}}, { multi: true })
    let apis = await ApiBase.cfind({_id: {$in: ids}}).exec()

    let aids = apis.map(function (api) { return api._id })
    await ApiModel.remove({baseid: {$in: aids}}, { multi: true })
    await ApiBase.remove({_id: {$in: ids}}, { multi: true })
  } catch (e) {
    return ctx.setError({ctx: ctx, next: next, err: '删除项目出错', e: e})
  }
  ctx.body = {
    code: 0,
    data: {
      tip: '删除成功',
    },
  }
  return next()
}

async function startProject (ctx, next) {
  let finalParams = ctx.finalParams

  let data
  let ids = finalParams.id.split(',')
  try {
    data = await Project.cfind({_id: {$in: ids}}).exec()
  } catch (e) {
    return ctx.setError({ctx: ctx, next: next, err: '启动项目出错', e: e})
  }

  if (!data || !data.length) {
    ctx.body = {
      code: 0,
      data: {
        tip: '成功启动0个应用',
      },
    }
    return
  }
  let procNum = 0
  let procInfo
  let err = ''
  for (let i = 0; i < data.length; i++) {
    try {
      procInfo = await proc.addToRestart(data[i], {force: finalParams.force})
    } catch (e) {
      err += e.message
    }
    if (procInfo) procNum++
  }

  ctx.body = {
    code: 0,
    data: {
      tip: '成功启动' + procNum + '个应用,' + err,
    },
  }
  return next()
}

async function stopProject (ctx, next) {
  let finalParams = ctx.finalParams

  let data
  let ids = finalParams.id.split(',')
  try {
    data = await Project.cfind({_id: {$in: ids}}).exec()
  } catch (e) {
    return ctx.setError({ctx: ctx, next: next, err: '停止项目出错', e: e})
  }

  if (!data || !data.length) {
    ctx.body = {
      code: 0,
      data: {
        tip: '成功停止0个应用',
      },
    }
    return next()
  }
  let procNum = 0
  for (let i = 0; i < data.length; i++) {
    let procInfo = await proc.stop(data[i], {force: finalParams.force})
    if (procInfo) procNum++
  }
  ctx.body = {
    code: 0,
    data: {
      tip: '成功停止' + procNum + '个应用',
    },
  }
  return next()
}

async function setDefaultApiParam (ctx, next) {
  let finalParams = ctx.finalParams

  let project = finalParams.project
  delete finalParams.project

  let keys = Object.keys(finalParams)

  let data = 0
  try {
    let apis = await ApiBase.cfind({project: project}).exec()
    for (let i = 0; i < apis.length; i++) {
      let apiId = apis[i]._id
      for (let j = 0; j < keys.length; j++) {
        let key = keys[j]
        let query = {baseid: apiId}
        query[key] = {$exists: false}
        let sets = {}
        sets[key] = finalParams[key]
        data += await ApiModel.update(query, { $set: sets }, {multi: true})
      }
    }
  } catch (e) {
    return ctx.setError({ctx: ctx, next: next, err: '设置默认api出错', e: e})
  }
  restartBackground({type: 'project', id: project})
  ctx.body = {
    code: 0,
    data: {
      result: data,
      tip: '设定成功',
    },
  }
  return next()
}
