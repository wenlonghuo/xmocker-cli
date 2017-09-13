'use strict'

const apiGet = require('../api/service.get')
const projectGet = require('../project/service.get')

module.exports = {
  getProjectByUid,
  getApiListByUid,
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
      let apiList = await apiGet.getApiByProject(result._id, apiQuery, true)

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

async function getApiListByUid (uids) {
  try {
    if (!Array.isArray(uids)) throw new Error('uid必须是数组')
    let query = {
      _uid: {$in: uids},
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
