module.exports = {
  get: {},
  post: {},
  put: {},
  delete: {},
}

module.exports.get.clientGetProjDiff = {
}

module.exports.get.clientGetApiDiff = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      name: '项目uid',
      required: true,
      title: '项目uid',
    },
  },
}

module.exports.put.clientDownLoadProj = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      name: '项目uid',
      required: true,
      title: '项目uid',
    },
  },
}

module.exports.put.clientDownLoadProjBase = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      name: '项目uid',
      required: true,
      title: '项目uid',
    },
  },
}


module.exports.put.clientDownLoadApi = {
  type: 'object',
  properties: {
    ids: {
      type: 'string',
      name: 'api uid列表',
      minLength: 1,
      required: true,
      title: 'api uid列表',
    },
    project: {
      type: 'string',
      name: '项目uid',
      required: true,
      title: '项目uid',
    },
    force: {
      type: 'number',
    },
    forceRemove: {
      type: 'number',
    },
  },
}

module.exports.get.serverGetProj = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      name: '项目uid',
      required: true,
      title: '项目uid',
    },
    type: {
      type: 'string',
      name: '类型',
      title: '获取类型，分为base和detail',
    },
  },
}

module.exports.get.serverGetApi = {
  type: 'object',
  properties: {
    ids: {
      type: 'string',
      name: 'api uid列表',
      required: true,
      title: 'api uid列表',
    },
  },
}

module.exports.put.serverDiffProj = {
  type: 'object',
  properties: {
    data: {
      type: 'array',
      name: '项目列表',
      required: true,
      title: '项目列表',
    },
  },
}

module.exports.put.serverDiffApi = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      name: '项目uid',
      required: true,
      title: '项目uid',
    },
    data: {
      type: 'array',
      name: 'api详细信息',
      required: true,
      title: 'api详细信息',
    },
  },
}
