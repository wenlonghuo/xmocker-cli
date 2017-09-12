'use strict'
const db = require('../../database')
const ApiBase = db.apiBase
const ApiModel = db.apiModel

const reloadDatabase = require('../service.ctrlProc').reload.add
const uid = require('../../util/common').uid()

const apiGet = require('./service.get.js')

module.exports = {
  copyApi,
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

    delete apiData._id
    apiData.project = projectId
    // 先尝试进行插入
    let result = await copyApiData(apiData)
    let modelList = apiData.model
    if (!result.code) {
      // 插入正常
      let newId = result.data._id
      for (let i = 0; i < modelList.length; i++) {
        modelList[i].baseid = newId
        await copyModel(modelList[i])
      }
      return { code: 0 }
    }
    // 冲突
    if (!force) return { code: 10, msg: 'API已经存在', data: result.data }
    // 覆盖原有API
    let conflictList = result.data.data
    for (let j = 0; j < conflictList.length; j++) {
      let existData = conflictList[j]
      let existId = existData._id
      apiData._mt = +new Date()
      await ApiBase.update({ _id: existId }, { $set: apiData }, { returnUpdatedDocs: true })
      if (forceRemove) {
        // 强制删除所有的分支
        await ApiModel.remove({ baseid: existId }, { multi: true })
      }
      for (let i = 0; i < modelList.length; i++) {
        modelList[i].baseid = existId
        await copyModel(modelList[i])
      }
    }
    return { code: 0 }
  } catch (e) {
    throw e
  }
}

async function copyApiData (params) {
  let data
  try {
    let exist = await apiGet.getExistApi(params, {})
    if (exist.data && exist.data.length) return { code: 1, msg: 'API和现有API冲突', data: exist }
    if (!params._uid) params._uid = uid()
    params._mt = +new Date()
    data = await ApiBase.update(exist.query, { $set: params }, { returnUpdatedDocs: true, upsert: true })
    data = data[1]
  } catch (e) {
    throw e
  }
  return { code: 0, data }
}

async function copyModel (params) {
  let data
  try {
    // if (!params.condition && unique) return { code: 4, msg: '必须填写contition' }
    delete params._id
    if (!params._uid) params._uid = uid()
    params._mt = +new Date()
    data = await ApiModel.insert(params)
  } catch (e) {
    throw e
  }
  return { code: 0, data }
}