'use strict'
const db = require('../../database')
const Project = db.project
const ApiBase = db.apiBase
const ApiModel = db.apiModel

const restart = require('../service.ctrlProc').restart.add
const uid = require('../../util/common').uid()

const projectGet = require('./service.get')

module.exports = {
  addProject,
  editProject,
  deleteProject,
}

async function addProject (params) {
  let data
  try {
    let exist = await projectGet.getExistProject(params)
    if (exist.data && exist.data.length) return { code: 1, msg: '项目简称和当前项目冲突', data: exist }
    params._uid = uid()
    params._mt = +new Date()
    data = await Project.insert(params)
  } catch (e) {
    throw e
  }
  return { code: 0, data }
}

async function editProject (id, params) {
  let data
  try {
    let exist = await projectGet.getExistProject(params, { id })
    if (exist.data && exist.data.length) return { code: 1, msg: '项目简称和当前项目冲突', data: exist.data }
    params._mt = +new Date()
    data = await Project.update({ _id: id }, { $set: params }, { returnUpdatedDocs: true, multi: true, upsert: true })
    data = data[1]
  } catch (e) {
    throw e
  }
  restart({type: 'project', id: data._id})
  return { code: 0, data }
}

async function deleteProject (ids = []) {
  let data = {}
  try {
    data.project = await Project.remove({_id: {$in: ids}})

    let apis = await ApiBase.cfind({project: {$in: ids}}).exec()
    let apiIds = apis.map(item => item._id)

    if (!apiIds.length) return

    data.base = await ApiBase.remove({ _id: apiIds }, { multi: true })
    data.model = await ApiModel.remove({ baseid: apiIds }, { multi: true })
  } catch (e) {
    throw e
  }

  return { code: 0, data }
}
