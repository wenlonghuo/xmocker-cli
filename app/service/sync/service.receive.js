'use strict'

const projectGet = require('../project/service.get')
const apiGet = require('../api/service.get')
const apiCopy = require('../api/service.copy')
const apiEdit = require('../api/service.edit')
const reloadDatabase = require('../service.ctrlProc').reload.add

module.exports = {
  saveDownloadApiList,
  saveDownloadApi,
  copyApiList,
}

/**
 * 保存上传进来的单个API
 * @param {*} apiUids
 */
async function saveDownloadApi (apiData, projectUid, { apiUid, force, forceRemove }) {
  try {
    if (!apiData.base || !apiData.model) return
    let proj = await projectGet.getProjectDetailByQuery({_uid: projectUid})

    if (!proj) return

    if (!apiUid) {
      let apiResult = await copyApiList([apiData], proj._id, { force, forceRemove })

      return { api: apiResult }
    }

    let hereApi = await apiGet.getApiDetailByQuery({_uid: apiUid, project: proj._id})
    if (!hereApi) return

    let base = Object.assign({}, apiData, {model: undefined})
    let modelList = apiData.model

    // 编辑API
    let result = await apiEdit.editApi(hereApi._id, base)
    if (result.code) return result

    result.data.model = []

    for (let i = 0; i < modelList.length; i++) {
      let modelData = await apiCopy.copyModel(modelList[i], hereApi._id)
      result.data.model.push(modelData)
    }
    return {api: result.data}
  } catch (e) {
    throw e
  }
}

/**
 * 保存上传进来的API列表
 * @param {*} apiUids
 */
async function saveDownloadApiList (apiList, projectUid, { force, forceRemove }) {
  try {
    let proj = await projectGet.getProjectDetailByQuery({ _uid: projectUid })

    if (!proj) return

    let apiResult = await copyApiList(apiList, proj._id, { force, forceRemove })

    reloadDatabase({ type: 'project', id: proj._id, dbs: ['project', 'apiBase', 'apiModel'] })

    return { api: apiResult }
  } catch (e) {
    throw e
  }
}

/**
 * 复制API列表至指定项目
 * @param {*} list
 * @param {*} projectId
 * @param {*} param2
 */
async function copyApiList (list, projectId, { force, forceRemove }) {
  try {
    let pushResult = {ok: [], fail: []}
    for (let i = 0; i < list.length; i++) {
      let api = list[i]
      let result = await apiCopy.copyApiToProjectByData(api.base, api.model, projectId, { force, forceRemove })
      if (result.code) {
        pushResult.fail.push({api, message: result.msg, data: result.data})
      } else {
        pushResult.ok.push(...result.data)
      }
    }
    return pushResult
  } catch (e) {
    throw e
  }
}
