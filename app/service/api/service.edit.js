'use strict'
const db = require('../../database')
const ApiBase = db.apiBase
const ApiModel = db.apiModel

const reloadDatabase = require('../service.ctrlProc').reload.add
const uid = require('../../util/common').uid()

const apiGet = require('./service.get.js')

module.exports = {
  addApi,
  editApi,
  deleteApi,
  addModel,
  editModel,
  deleteModel,
}

async function addApi (params) {
  let data
  try {
    let exist = await apiGet.getExistApi(params, {})
    if (exist.data && exist.data.length) return {code: 1, msg: 'API和现有API冲突', data: exist}
    params._uid = uid()
    params._mt = +new Date()
    data = await ApiBase.update(exist.query, { $set: params }, { returnUpdatedDocs: true, upsert: true, multi: true })
    data = data[1]
  } catch (e) {
    throw e
  }

  reloadDatabase({ type: 'apiBase', id: data._id })
  return {code: 0, data}
}

async function editApi (id, params) {
  let data
  try {
    let exist = await apiGet.getExistApi(params, {id})
    if (exist.data && exist.data.length) return { code: 1, msg: 'API和现有API冲突', data: exist.data }
    params._mt = +new Date()
    data = await ApiBase.update({ _id: id }, { $set: params }, { returnUpdatedDocs: true, multi: true, upsert: true })
    data = data[1]
  } catch (e) {
    throw e
  }

  reloadDatabase({ type: 'apiBase', id: id })

  return { code: 0, data }
}

async function deleteApi (id) {
  let data = {}
  try {
    data.base = await ApiBase.remove({ _id: id }, { multi: true })
    data.model = await ApiModel.remove({ baseid: id }, { multi: true })
  } catch (e) {
    throw e
  }

  return {code: 0, data}
}

// model

async function addModel (params, unique) {
  let data
  try {
    if (!params.condition && unique) return {code: 4, msg: '必须填写contition'}
    params._uid = uid()
    params._mt = +new Date()
    if (params.data) params.data = JSON.stringify(params.data)
    await ApiBase.update({ _id: params.baseid }, { $set: { _mt: +new Date() } }, { returnUpdatedDocs: true, multi: true, upsert: true })
    data = await ApiModel.insert(params)
  } catch (e) {
    throw e
  }
  reloadDatabase({ type: 'apiModel', id: data._id })
  return {code: 0, data}
}

async function editModel (id, params) {
  let result
  try {
    if (!id) return {code: 5, msg: '请提供ID'}
    params._mt = +new Date()
    if (params.data) params.data = JSON.stringify(params.data)
    result = await ApiModel.update({ _id: id }, { $set: params }, { returnUpdatedDocs: true, multi: true, upsert: true })

    result = result[1]
    if (Array.isArray(result)) result = result[0]
    await ApiBase.update({ _id: result.baseid }, { $set: { _mt: +new Date() } }, { returnUpdatedDocs: true, multi: true, upsert: true })
  } catch (e) {
    throw e
  }
  reloadDatabase({ type: 'apiModel', id: id })

  return {code: 0, data: result}
}

async function deleteModel (id) {
  let result
  try {
    let oldData = await ApiModel.cfindOne({_id: id}).exec()
    result = await ApiModel.remove({ _id: id }, { returnUpdatedDocs: true, multi: true, upsert: true })
    await ApiBase.update({ _id: oldData.baseid }, { $set: { _mt: +new Date() } }, { returnUpdatedDocs: true, multi: true, upsert: true })
    return result
  } catch (e) {
    throw e
  }
}
