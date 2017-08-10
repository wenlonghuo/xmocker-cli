'use strict'
const db = require('../database')
const Project = db.project
const ApiModel = db.apiModel
const ApiBase = db.apiBase

const uid = require('../util/common').uid()
const service = require('../service')
const getProcById = service.proc.getProcById
const proc = service.proc
const processList = service.proc.state.proc
const isEqual = require('lodash').isEqual
const restartBackground = service.ctrlProc.restart.add
const argv = require('minimist')(process.argv.slice(2))
const isServer = argv.isServer

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

  let list, total
  try {
    total = await Project.count(finalParams)
    list = await Project.cfind(finalParams).sort({name: 1}).skip(skip).limit(size).exec()
  } catch (e) {
    return ctx.respond.error('查询项目信息出错', {e})
  }

  list.forEach(function (d) {
    let id = d._id
    let proc = processList.find(function (proc) { return proc.id === id })
    if (proc) {
      d.status = proc.status
    }
  })

  let res = {
    list,
    pagination: {
      total: total,
      pageCnt: Math.ceil(total / size),
      pageNo: no,
    },
  }
  ctx.respond.success('获取项目信息成功', res)
}

async function getRunningProject (ctx, next) {
  let finalParams = ctx.finalParams
  let ids = (finalParams.id || '').split(',')
  let list = []
  ids.forEach(function (id) {
    let proc = processList.find(function (proc) { return proc.id === id })
    if (proc && proc.status) {
      list.push({name: proc.proj.name, id: id, shortcut: proc.proj.shortcut})
    }
  })

  ctx.respond.success('获取运行信息成功', {list})
}

async function addProject (ctx, next) {
  let finalParams = ctx.finalParams

  let result
  try {
    finalParams._uid = uid()
    finalParams._mt = +new Date()
    result = await Project.insert(finalParams)
  } catch (e) {
    return ctx.respond.error('添加项目出错', {e})
  }

  ctx.respond.success('添加成功', { result })
}

async function editProject (ctx, next) {
  let finalParams = ctx.finalParams

  let id = finalParams.id
  delete finalParams.id
  let option = {type: 'project', id: id}
  let result
  try {
    finalParams._mt = +new Date()
    let info = await Project.cfindOne({ _id: id }).exec()
    if (info && finalParams.gulp) {
      if (!isEqual(info.gulp, finalParams.gulp)) option.force = true
    }
    result = await Project.update({ _id: id }, { $set: finalParams })
  } catch (e) {
    return ctx.respond.error('编辑项目出错', {e})
  }

  if (Object.keys(finalParams).length === 2 && finalParams.proxyType != null) {
    let proc = getProcById(id)
    if (proc) proc.setProxyMode(finalParams.proxyType)
  } else {
    restartBackground(option)
  }

  ctx.respond.success('编辑成功', {result})
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
    return ctx.respond.error('删除项目出错', {e})
  }
  ctx.respond.success('删除成功')
}

async function startProject (ctx, next) {
  let finalParams = ctx.finalParams
  if (isServer) return ctx.respond.error('抱歉，当前服务只能查看服务信息，不能开启子进程。')
  let data
  let ids = finalParams.id.split(',')
  try {
    data = await Project.cfind({_id: {$in: ids}}).exec()
  } catch (e) {
    return ctx.respond.error('启动项目出错', {e})
  }

  if (!data || !data.length) {
    ctx.respond.error('没有需要启动的项目')
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
  ctx.respond.success('成功启动' + procNum + '个应用,' + err)
}

async function stopProject (ctx, next) {
  let finalParams = ctx.finalParams

  let data
  let ids = finalParams.id.split(',')
  try {
    data = await Project.cfind({_id: {$in: ids}}).exec()
  } catch (e) {
    return ctx.respond.error('停止项目出错', {e})
  }

  if (!data || !data.length) {
    ctx.respond.error('没有需要停止的项目')
    return next()
  }
  let procNum = 0
  for (let i = 0; i < data.length; i++) {
    try {
      await proc.stop(data[i], { force: finalParams.force })
      procNum++
    } catch (e) {
      console.error(e)
    }
  }
  ctx.respond.success('成功停止' + procNum + '个应用')
}

async function setDefaultApiParam (ctx, next) {
  let finalParams = ctx.finalParams

  let project = finalParams.project
  delete finalParams.project

  let keys = Object.keys(finalParams)

  let result = 0
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
        result += await ApiModel.update(query, { $set: sets }, {multi: true})
      }
    }
  } catch (e) {
    return ctx.respond.error('设置默认api出错', {e})
  }
  restartBackground({type: 'project', id: project})
  ctx.respond.success('设定成功', {result})
}
