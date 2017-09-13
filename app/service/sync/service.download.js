'use strict'
const db = require('../../database')
const Project = db.project

const request = require('./service.request').request
const projectGet = require('../project/service.get')
const apiGet = require('../api/service.get')
const apiCopy = require('../api/service.copy')

module.exports = {
  getProjectListDiff,
  getApiListDiff,
  downloadProject,
  downloadApi,
}

async function getProjectListDiff () {
  try {
    let url = '/mock/serverDiffProj'

    let projList = await Project.cfind({}).exec()

    let res = await request.put(url, {data: projList})
    return res
  } catch (e) {
    throw e
  }
}

async function getApiListDiff (projectUid) {
  try {
    let url = '/mock/serverDiffApi'
    let proj = await projectGet.getProjectDetailByQuery({_uid: projectUid})
    if (!proj) throw new Error('项目的UID不正确')

    let projectId = proj._id
    let option = {
      pageSize: 10000,
      pageNo: 0,
      order: 1,
      sortBy: '_mt',
    }
    let api = await apiGet.getApiByProject(projectId, option, true)
    if (!api) return

    let apiList = api.list

    let res = await request.put(url, {data: apiList, id: projectUid})
    return res
  } catch (e) {
    throw e
  }
}
/**
 * 从服务端下载或更新项目
 * @param {*} remoteUid 
 */
async function downloadProject (remoteUid) {
  try {
    let url = '/mock/serverGetProj'
    let proj = await projectGet.getProjectDetailByQuery({ _uid: remoteUid })

    let type = proj ? 'base' : 'detail'

    let res = await request.get(url, {id: remoteUid, type})

    if (res.code) return res

    let serverProj = res.data.proj
    let serverApi = res.data.api

    // 项目已经存在，只更新部分信息
    if (proj) {
      let params = {
        urls: serverProj.urls,
        proxyTable: serverProj.proxyTable,
        gulp: serverProj.gulp,
      }
      let result = await Project.update({_id: proj._id}, params)
      return {project: result[1]}
    }
    let newProj = Object.assign({}, serverProj, {parentId: undefined, _id: undefined})
    let projResult = await Project.insert(newProj)

    let apiResult = await copyApiList(serverApi, projResult._id, {})

    return {proj: projResult, api: apiResult}
  } catch (e) {
    throw e
  }
}

/**
 * 从服务端下载API
 * @param {*} apiUids
 */
async function downloadApi (apiUids, projectId, {force, forceRemove}) {
  try {
    let url = '/mock/serverGetApi'

    let res = await request.get(url, { ids: apiUids })

    if (res.code) return res

    let serverApi = res.data.api

    let apiResult = await copyApiList(serverApi, projectId, {})

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
    let pushedList = []
    for (let i = 0; i < list.length; i++) {
      let api = list[i]
      let result = await apiCopy.copyApiToProjectByData(api.base, api.model, projectId, { force, forceRemove })
      pushedList.push(result)
    }
    return pushedList
  } catch (e) {
    throw e
  }
}
