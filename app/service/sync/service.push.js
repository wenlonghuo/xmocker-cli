'use strict'

const request = require('./service.request').request
const apiGet = require('../api/service.get')

module.exports = {
  pushApiToServerById,
  pushApiToServerByIdList,
  pushApiToServerByData,
  pushApiListToServerByData,
}

async function pushApiToServerByIdList (apiIds, remoteProjectUid, {force, forceRemove}) {
  try {
    const apiQuery = {
      pageSize: 10000,
      pageNo: 0,
    }
    let apiData = await apiGet.getApiByQuery({_id: {$in: apiIds}}, apiQuery, true)
    let list = apiData.list.map(item => {
      return {
        base: Object.assign({}, item, { model: undefined }),
        model: item.model,
      }
    })

    return await pushApiListToServerByData(list, remoteProjectUid, { force, forceRemove })
  } catch (e) {
    throw e
  }
}

async function pushApiToServerById (apiId, remoteProjectUid, {remoteApiUid, force, forceRemove}) {
  try {
    let apiData = await apiGet.getApiById(apiId)
    if (!apiData) return {code: 1, msg: 'API不存在'}

    let data = {
      base: Object.assign({}, apiData, {model: undefined}),
      model: apiData.model,
    }

    return await pushApiToServerByData(data, remoteProjectUid, { remoteApiUid, force, forceRemove })
  } catch (e) {
    throw e
  }
}

async function pushApiToServerByData (apiData, remoteProjectUid, {remoteApiUid, force, forceRemove}) {
  try {
    const url = '/mock/serverReceiveApi'
    const params = {
      data: apiData,
      project: remoteProjectUid,
      apiUid: remoteApiUid,
      force,
      forceRemove,
    }
    return await request.put(url, params)
  } catch (e) {
    throw e
  }
}

async function pushApiListToServerByData (apiList, remoteProjectUid, {force, forceRemove}) {
  try {
    const url = '/mock/serverReceiveApiList'
    const params = {
      data: apiList,
      project: remoteProjectUid,
      force,
      forceRemove,
    }
    return await request.put(url, params)
  } catch (e) {
    throw e
  }
}
