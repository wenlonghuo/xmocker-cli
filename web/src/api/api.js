import Axios from 'axios'
import Message from 'iview/src/components/message'
export const axios = Axios.create({
  baseURL: '/mock'
})

axios.interceptors.response.use(function (response) {
  if (response.data.code) Message.error(response.data.message)
  return response.data
}, function (error) {
  return Promise.reject(error)
})

// lib
export const editLib = params => axios.put('/lib', params)
export const addLib = params => axios.post('/lib', params)
export const getLib = params => axios.request({url: '/lib', params})
export const getLibDetail = params => axios.request({url: '/libDetail', params})
export const deleteLib = params => axios.request({url: '/lib', 'method': 'delete', params})

// project
export const editProject = params => axios.put('/project', params)
export const addProject = params => axios.post('/project', params)
export const getProject = params => axios.request({url: '/project', params})
export const deleteProject = params => axios.request({url: '/project', 'method': 'delete', params})
export const startProject = params => axios.put('/startProject', params)
export const stopProject = params => axios.put('/stopProject', params)

// api
export const getApi = params => axios.request({url: '/api', params})
export const searchApi = params => axios.request({url: '/search/api', params})
export const getApiDetail = params => axios.request({url: '/apiDetail', params})
export const editApiBase = params => axios.put('/apiBase', params)
export const copyApi = params => axios.put('/copyApi', params)
export const setApiStatus = params => axios.put('/apiStatus', params)
export const getApiModel = params => axios.request({url: '/apiModelList', params})
export const addApiBase = params => axios.post('/apiBase', params)
export const editApiModel = params => axios.put('/apiModel', params)
export const addApiModel = params => axios.post('/apiModel', params)
export const deleteApi = params => axios.request({url: '/api', 'method': 'delete', params})
export const deleteApiModel = params => axios.request({url: '/apiModel', 'method': 'delete', params})

// sync
export const clientGetProjDiff = params => axios.request({url: '/clientGetProjDiff', params})
export const clientGetApiDiff = params => axios.request({url: '/clientGetApiDiff', params})
export const clientDownLoadProjBase = params => axios.put('/clientDownLoadProjBase', params)
export const clientDownLoadProj = params => axios.put('/clientDownLoadProj', params)
export const clientDownLoadApi = params => axios.put('/clientDownLoadApi', params)

// set base
export const setBase = params => axios.put('/appBase', params)
export const getBase = params => axios.request({url: '/appBase', params})

// import
export const upgrade = params => axios.put('/upgradeV0', params)

// log
export const getLog = params => axios.request({ url: '/log', params })

// search
export const search = params => axios.request({ url: '/search', params })
