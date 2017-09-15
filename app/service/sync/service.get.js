'use strict'

const request = require('./service.request').request
const apiGet = require('../api/service.get')
const projectGet = require('../project/service.get')

module.exports = {
  getProjectByUid,
  getApiListByUid,
  getApiListByProjectUid,
  getRemoteData,
}

async function getRemoteData (url, params) {
  try {
    return await request.get(url, params)
  } catch (e) {
    throw e
  }
}

async function getProjectByUid (uid, detail) {
  try {
    let data = {}
    let result = await projectGet.getProjectDetailByQuery({_uid: uid})
    data.proj = result
    if (detail) {
      const apiQuery = {
        pageSize: 10000,
        pageNo: 0,
      }
      let apiData = await apiGet.getApiByProject(result._id, apiQuery, true)
      let apiList = apiData.list

      data.api = apiList.map(item => {
        let base = Object.assign({}, item, {model: undefined})
        let model = item.model
        return {base, model}
      })
    }

    return data
  } catch (e) {
    throw e
  }
}

async function getApiListByProjectUid (uid, option) {
  try {
    let proj = await projectGet.getProjectDetailByQuery({_uid: uid})
    if (!proj) return

    let result = await apiGet.getApiByProject(proj._id, option, true)

    result.list = result.list.map(item => {
      let model = item.model
      let base = Object.assign({}, item, {model: undefined})
      return {base, model}
    })
    return result
  } catch (e) {
    throw e
  }
}

async function getApiListByUid (uids, projectUid) {
  try {
    let proj = await projectGet.getProjectDetailByQuery({ _uid: projectUid })
    if (!proj) return

    if (!Array.isArray(uids)) throw new Error('uid必须是数组')
    let query = {
      _uid: {$in: uids},
      project: proj._id,
    }
    const apiQuery = {
      pageSize: 10000,
      pageNo: 0,
    }
    let result = await apiGet.getApiByQuery(query, apiQuery, true)

    result = result.list

    let resultData = result.map(item => {
      let model = item.model
      let base = Object.assign({}, item, {model: undefined})
      return {base, model}
    })
    return resultData
  } catch (e) {
    throw e
  }
}
