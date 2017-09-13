'use strict'
const db = require('../../database')
const ApiBase = db.apiBase
const ApiModel = db.apiModel

const reloadDatabase = require('../service.ctrlProc').reload.add
const uid = require('../../util/common').uid()

const apiGet = require('./service.get.js')

module.exports = {
  copyApi,
  copyApiToProjectById,
  copyApiToProjectByData,
}

/**
 * 将API复制到多个项目中
 */
async function copyApi (apiIds, projList, { force, forceRemove }) {
  let conflictList = []
  try {
    for (let i = 0; i < projList.length; i++) {
      let projectId = projList[i]
      let projInfo = { id: projectId, apis: [] }
      for (let j = 0; j < apiIds.length; j++) {
        let apiId = apiIds[j]
        let result = await copyApiToProjectById(apiId, projectId, { force, forceRemove })
        if (result.code === 10) {
          projInfo.apis.push(...result.data.data)
        }
      }
      reloadDatabase({ type: 'project', id: projectId })
      conflictList.push(projInfo)
    }
    return { code: 0, data: { list: conflictList } }
  } catch (e) {
    throw e
  }
}

/**
 * 根据API id将API复制到指定项目中
 */

async function copyApiToProjectById (id, projectId, { force, forceRemove }) {
  try {
    // 获取api 信息
    let apiData = await apiGet.getApiById(id)
    if (!apiData) return {code: 2, msg: 'API不存在或者已删除'}
    if (apiData.project === projectId) return { code: 9, msg: '该API属于被复制的项目' }

    let modelList = apiData.model
    return await copyApiToProjectByData(apiData, modelList, projectId, {force, forceRemove})
  } catch (e) {
    throw e
  }
}
/**
 * 根据API信息将API复制到指定项目中
 */

async function copyApiToProjectByData (apiData = {}, modelList = [], projectId, { force, forceRemove }) {
  try {
    let result = await copyApiAndModel(apiData, modelList, projectId)

    if (!result.code) {
      // 插入正常
      return result
    }

    // 冲突
    if (!force) return result

    // 覆盖原有API
    let conflictList = result.data.data

    // 强制覆盖，要删除原有API
    if (forceRemove) {
      let rmIdArr = conflictList.map(item => item._id)
      await ApiBase.remove({ _id: { $in: rmIdArr } }, { multi: true })
      await ApiModel.remove({ baseid: { $in: rmIdArr } }, { multi: true })
    }
    // 再次进行强制更新
    result = await copyApiAndModel(apiData, modelList, projectId, true)

    return result
  } catch (e) {
    throw e
  }
}

// 复制API和下面的model
async function copyApiAndModel (params, modelList, projectId, force) {
  let data = {model: []}
  try {
    // 复制API数据
    let result = await copyApiData(params, projectId, force)
    if (result.code) return result

    let apiList = result.data
    if (!apiList) return { code: 0, data: data }

    if (!Array.isArray(apiList)) apiList = [apiList]

    data.api = apiList

    for (let i = 0; i < apiList.length; i++) {
      let apiId = apiList[i]._id
      let modelData = await copyModel(modelList[i], apiId)
      data.model.push(modelData)
    }
    return {code: 0, data: data}
  } catch (e) {
    throw e
  }
}

// 根据参数复制API到项目
async function copyApiData (api, projectId, force) {
  let data
  try {
    let params = Object.assign({}, api)
    delete params._id
    delete params.model
    params.project = projectId
    let exist = await apiGet.getExistApi(params, {})
    if (exist.data && exist.data.length && !force) return { code: 10, msg: 'API和现有API冲突', data: exist }
    if (!params._uid) params._uid = uid()
    params._mt = +new Date()
    data = await ApiBase.update(exist.query, { $set: params }, { returnUpdatedDocs: true, upsert: true, multi: true })
    data = data[1]
  } catch (e) {
    throw e
  }
  return { code: 0, data }
}
// 根据参数和apiId复制至数据库
async function copyModel (model, apiId) {
  let data
  try {
    let params = Object.assign({}, model)
    params.baseid = apiId
    if (!params._uid) params._uid = uid()
    delete params._id
    params._mt = +new Date()
    let query = {
      baseid: params.baseid,
      _uid: params._uid,
    }
    data = await ApiModel.update(query, { $set: params }, { returnUpdatedDocs: true, upsert: true, multi: true })
  } catch (e) {
    throw e
  }
  return { code: 0, data: data[1] }
}
