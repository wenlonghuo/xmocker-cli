'use strict'
const db = require('../../database')
const ApiBase = db.apiBase
const ApiModel = db.apiModel

const combineArray = require('../../util/combineArray.js')

module.exports = {
  getApiByProject,
  getApiByCondition,
  getApiByQuery,
  getApiById,
  getExistApi,
  getModelByQuery,
}

async function getApiById (id) {
  try {
    let baseData = await ApiBase.cfindOne({_id: id}).exec()
    if (!baseData) return
    let baseid = baseData._id
    let modelData = await ApiModel.cfind({ baseid: baseid }).exec()
    let data = Object.assign({}, baseData, {model: modelData})
    return data
  } catch (e) {
    throw e
  }
}

async function getApiByQuery (query, {pageSize, pageNo, order, sortBy}, showModels) {
  let size = ~~pageSize
  let no = ~~pageNo
  let skip = ~~(size * no)

  let sortInfo = {}
  if (sortBy) {
    sortInfo[sortBy] = order
  } else {
    sortInfo.name = 1
  }

  try {
    let total = await ApiBase.count(query)
    let data = await ApiBase.cfind(query).sort(sortInfo).skip(skip).limit(size).exec()
    if (showModels) {
      let ids = data.map((api) => { return api._id })
      let modelData = await ApiModel.cfind({ baseid: { $in: ids } }).sort({_mt: -1}).exec()
      data = combineArray(data, modelData, { fromKey: 'baseid', toKey: '_id', key: 'model' })
    }
    return {
      list: data,
      pagination: {
        total: total,
        pageCnt: Math.ceil(total / size),
        pageNo: no,
      },
    }
  } catch (e) {
    throw e
  }
}

async function getApiByCondition (params, {pageSize, pageNo, order, sortBy}, showModels) {
  const query = {
    url: params.url,
    method: params.method,
    project: params.project,
  }

  if (params.path) {
    query.path = params.path
    query.pathEqual = params.pathEqual
  }

  try {
    return await getApiByQuery(query, { pageSize, pageNo, order, sortBy }, showModels)
  } catch (e) {
    throw e
  }
}

async function getApiByProject (projectId, {pageSize, pageNo, order, sortBy}, showModels) {
  const query = {
    project: projectId,
  }

  try {
    return await getApiByQuery(query, { pageSize, pageNo, order, sortBy })
  } catch (e) {
    throw e
  }
}

async function getExistApi (params, {id}) {
  const query = {
    url: params.url,
    method: params.method,
    project: params.project,
  }

  if (params.path) {
    query.path = params.path
    query.pathEqual = params.pathEqual
  }

  if (id) {
    query._id = {$ne: id}
  }

  try {
    let data = await ApiBase.cfind(query).exec()
    return {data, query}
  } catch (e) {
    throw e
  }
}

// model 系列

async function getModelByQuery (query, { pageSize, pageNo, order, sortBy }) {
  let size = ~~pageSize
  let no = ~~pageNo
  let skip = ~~(size * no)

  let sortInfo = {}
  if (sortBy) {
    sortInfo[sortBy] = order
  } else {
    sortInfo.name = 1
  }

  try {
    let total = await ApiModel.count(query)
    let data = await ApiModel.cfind(query).sort(sortInfo).skip(skip).limit(size).exec()
    return {
      list: data,
      pagination: {
        total: total,
        pageCnt: Math.ceil(total / size),
        pageNo: no,
      },
    }
  } catch (e) {
    throw e
  }
}

