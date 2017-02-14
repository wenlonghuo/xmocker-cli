
module.exports.clientGetProjDiff = {
}

module.exports.clientGetApiDiff = {
  id: {
    type: 'string',
    name: '项目uid',
    required: true,
    cname: '项目uid',
  },
}

module.exports.clientDownLoadProj = {
  id: {
    type: 'string',
    name: '项目uid',
    required: true,
    cname: '项目uid',
  },
}

module.exports.clientDownLoadProjBase = {
  id: {
    type: 'string',
    name: '项目uid',
    required: true,
    cname: '项目uid',
  },
}


module.exports.clientDownLoadApi = {
  ids: {
    type: 'string',
    name: 'api uid列表',
    noEmpty: true,
    required: true,
    cname: 'api uid列表',
  },
  project: {
    type: 'string',
    name: '项目uid',
    required: true,
    cname: '项目uid',
  },
}

module.exports.serverGetProj = {
  id: {
    type: 'string',
    name: '项目uid',
    required: true,
    cname: '项目uid',
  },
  type: {
    type: 'string',
    name: '类型',
    cname: '获取类型，分为base和detail',
  },
}

module.exports.serverGetApi = {
  ids: {
    type: 'string',
    name: 'api uid列表',
    required: true,
    cname: 'api uid列表',
  }
}

module.exports.serverDiffProj = {
  data: {
    type: 'object',
    name: '项目列表',
    required: true,
    cname: '项目列表',
  }
}

module.exports.serverDiffApi = {
  id: {
    type: 'string',
    name: '项目uid',
    required: true,
    cname: '项目uid',
  },
  data: {
    type: 'object',
    name: 'api详细信息',
    required: true,
    cname: 'api详细信息',
  }
}



