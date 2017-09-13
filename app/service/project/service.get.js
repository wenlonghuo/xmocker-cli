'use strict'
const db = require('../../database')
const Project = db.project

module.exports = {
  getProjectDetailById,
  getProjectDetailByQuery,
  getProjectByQuery,
  getExistProject,
}

async function getProjectDetailByQuery (query) {
  if (!Object.keys(query).length) throw new Error('查询条件不能为空！！！')
  try {
    let data = await Project.cfindOne(query).exec()
    return data
  } catch (e) {

  }
}

async function getProjectDetailById (id) {
  try {
    return await getProjectDetailByQuery({_id: id})
  } catch (e) {

  }
}

/**
 * 根据查询条件返回API列表
 * @param {*} query 
 * @param {*} param1 
 */
async function getProjectByQuery (query, { pageSize, pageNo, order, sortBy }) {
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
    let total = await Project.count(query)
    let data = await Project.cfind(query).sort(sortInfo).skip(skip).limit(size).exec()
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
/**
 * 获取该条件下的Project是否已经存在
 * @param {*} params 
 * @param {*} 【id】指定ID 
 */
async function getExistProject (params, { id }) {
  const query = {
    shortcut: params.shortcut,
  }

  if (id) {
    query._id = { $ne: id }
  }

  try {
    let data = await Project.cfind(query).exec()
    return { data, query }
  } catch (e) {
    throw e
  }
}
