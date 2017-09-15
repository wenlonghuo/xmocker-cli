'use strict'

const apiGet = require('../api/service.get')
const projectGet = require('../project/service.get')

module.exports = {
  diffApiListDataByTime,
  diffProjectListDataByTime,
  diffApiByData,
}
/**
 * 获取API数据在指定项目下的冲突问题, 返回冲突的API列表
 * @param {Object} query 
 * @param {Object} data 
 */
async function diffApiByData (query, data) {
  try {
    let proj = await projectGet.getProjectDetailByQuery(query)
    if (!proj) return

    let res = await apiGet.getExistApi(data)
    let serverData = res.data

    let result = serverData.map(item => {
      let status = item._mt === data._mt ? 0 : (item._mt < data._mt ? 1 : -1)
      return {status, data: item}
    })
    return result
  } catch (e) {
    throw e
  }
}

async function diffApiListDataByTime (query, apis) {
  try {
    let proj = await projectGet.getProjectDetailByQuery(query)
    if (!proj) return

    const apiQuery = {
      pageSize: 10000,
      pageNo: 0,
    }
    let apiList = await apiGet.getApiByProject(proj._id, apiQuery, true)
    let server = apiList.list
    let client = apis.map(item => {
      if (item.base) {
        return Object.assign({}, item.base, { model: item.model })
      }
      return item
    })

    let result = diffTimeStamp(client, server, {isApi: true})
    return result
  } catch (e) {
    throw e
  }
}

async function diffProjectListDataByTime (query, client) {
  try {
    query = query || {}
    const projQuery = {
      pageSize: 10000,
      pageNo: 0,
    }
    let apiList = await projectGet.getProjectByQuery(query, projQuery)
    let server = apiList.list

    let result = diffTimeStamp(client, server)

    return result
  } catch (e) {
    throw e
  }
}

/**
 * diff 两列表的timestamp
 * @param {*} clientList 
 * @param {*} serverList 
 * @param {*} option 
 */
function diffTimeStamp (clientList, serverList, option = {}) {
  let infosObj = {}
  let result = {
    unchanged: [],
    behind: [],
    ahead: [],
    serverSide: [],
    clientSide: [],
    untaged: [],
  }
  // set all keys to an empty object;
  serverList.forEach(item => {
    let uid = item._uid
    infosObj[uid] = { server: item }
  })

  clientList.forEach(item => {
    let uid = item._uid
    infosObj[uid] = infosObj[uid] || {}
    infosObj[uid].client = item
  })

  Object.keys(infosObj).forEach(function (uid) {
    let info = infosObj[uid]
    let server = info.server
    let client = info.client

    let data = {
      server,
      client,
    }
    if (option.isApi) {
      if (data.server) data.server = { base: Object.assign({}, data.server, { model: undefined }), model: data.server.model }
      if (data.client) data.client = { base: Object.assign({}, data.client, { model: undefined }), model: data.client.model }
    }

    if (server && client) {
      let serverTime = server._mt
      let clientTime = client._mt

      if (serverTime === clientTime) {
        result.unchanged.push(data)
      } else if (serverTime > clientTime) {
        result.behind.push(data)
      } else if (serverTime < clientTime) {
        result.ahead.push(data)
      } else {
        if (serverTime) {
          result.behind.push(data)
        } else if (clientTime) {
          result.ahead.push(data)
        } else {
          result.untaged.push(data)
        }
      }
    } else if (server) {
      result.serverSide.push(data)
    } else if (client) {
      result.clientSide.push(data)
    }
  })

  return result
}
