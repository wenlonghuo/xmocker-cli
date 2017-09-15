'use strict';

module.exports = {
  get: {},
  post: {},
  put: {},
  delete: {}
};

module.exports.get.clientGetProjList = {
  type: 'object',
  properties: {
    order: {
      type: 'number'
    },
    sortBy: {
      type: 'string'
    },
    pageSize: {
      type: 'number',
      default: 20
    },
    pageNo: {
      type: 'number',
      default: 0
    }
  }
};

module.exports.get.clientGetProjDetail = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      name: '项目uid',
      required: true,
      title: '项目uid'
    },
    type: {
      type: 'string',
      name: '类型',
      title: '获取类型，分为base和detail'
    }
  }
};

module.exports.get.clientGetApiListByIds = {
  type: 'object',
  properties: {
    ids: {
      type: 'string',
      name: 'api uid列表',
      required: true,
      title: 'api uid列表'
    },
    project: {
      type: 'string',
      name: '项目 uid',
      required: true,
      title: '项目 uid'
    }
  }
};

module.exports.get.clientGetApiListByProject = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      name: '项目uid',
      required: true,
      title: '项目uid'
    },
    order: {
      type: 'number'
    },
    sortBy: {
      type: 'string'
    },
    pageSize: {
      type: 'number',
      default: 20
    },
    pageNo: {
      type: 'number',
      default: 0
    }
  }
};

module.exports.get.clientGetProjDiff = {};

module.exports.get.clientGetApiDiff = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      name: '项目uid',
      required: true,
      title: '项目uid'
    }
  }
};

module.exports.put.clientDownLoadProj = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      name: '项目uid',
      required: true,
      title: '项目uid'
    }
  }
};

module.exports.put.clientDownLoadProjBase = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      name: '项目uid',
      required: true,
      title: '项目uid'
    }
  }
};

module.exports.put.clientDownLoadApi = {
  type: 'object',
  properties: {
    ids: {
      type: 'string',
      name: 'api uid列表',
      minLength: 1,
      required: true,
      title: 'api uid列表'
    },
    project: {
      type: 'string',
      name: '项目uid',
      required: true,
      title: '项目uid'
    },
    localProject: {
      type: 'string',
      name: '本地项目ID',
      required: true,
      title: '本地项目ID'
    },
    force: {
      type: 'number'
    },
    forceRemove: {
      type: 'number'
    }
  }
};

module.exports.put.clientPushApiListById = {
  type: 'object',
  properties: {
    ids: {
      type: 'string',
      name: 'api uid列表',
      minLength: 1,
      required: true,
      title: 'api uid列表'
    },
    project: {
      type: 'string',
      name: '项目uid',
      required: true,
      title: '项目uid'
    },
    force: {
      type: 'number'
    },
    forceRemove: {
      type: 'number'
    }
  }
};

module.exports.put.clientPushApiById = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      name: 'api',
      minLength: 1,
      required: true,
      title: 'api uid列表'
    },
    project: {
      type: 'string',
      name: '项目uid',
      required: true,
      title: '项目uid'
    },
    apiUid: {
      type: 'string',
      name: 'apiUid',
      title: 'apiUid'
    },
    force: {
      type: 'number'
    },
    forceRemove: {
      type: 'number'
    }
  }
};

module.exports.put.clientPushApiByData = {
  type: 'object',
  properties: {
    data: {
      type: 'array',
      name: 'api',
      minLength: 1,
      required: true,
      title: 'api uid列表'
    },
    project: {
      type: 'string',
      name: '项目uid',
      required: true,
      title: '项目uid'
    },
    apiUid: {
      type: 'string',
      name: 'apiUid',
      title: 'apiUid'
    },
    force: {
      type: 'number'
    },
    forceRemove: {
      type: 'number'
    }
  }
};
module.exports.put.clientPushApiListByData = {
  type: 'object',
  properties: {
    data: {
      type: 'array',
      name: 'api数据',
      minLength: 1,
      required: true,
      title: 'api uid列表'
    },
    project: {
      type: 'string',
      name: '项目uid',
      required: true,
      title: '项目uid'
    },
    force: {
      type: 'number'
    },
    forceRemove: {
      type: 'number'
    }
  }
};

module.exports.get.serverGetProjList = {
  type: 'object',
  properties: {
    order: {
      type: 'number'
    },
    sortBy: {
      type: 'string'
    },
    pageSize: {
      type: 'number',
      default: 20
    },
    pageNo: {
      type: 'number',
      default: 0
    }
  }
};
module.exports.get.serverGetApiListByProject = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      name: '项目uid',
      required: true,
      title: '项目uid'
    },
    order: {
      type: 'number'
    },
    sortBy: {
      type: 'string'
    },
    pageSize: {
      type: 'number',
      default: 20
    },
    pageNo: {
      type: 'number',
      default: 0
    }
  }
};

module.exports.get.serverGetProj = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      name: '项目uid',
      required: true,
      title: '项目uid'
    },
    type: {
      type: 'string',
      name: '类型',
      title: '获取类型，分为base和detail'
    }
  }
};

module.exports.get.serverGetApi = {
  type: 'object',
  properties: {
    ids: {
      type: 'string',
      name: 'api uid列表',
      required: true,
      title: 'api uid列表'
    },
    project: {
      type: 'string',
      name: '项目 uid',
      title: '项目 uid'
    }
  }
};

module.exports.put.serverDiffProj = {
  type: 'object',
  properties: {
    data: {
      type: 'array',
      name: '项目列表',
      required: true,
      title: '项目列表'
    }
  }
};

module.exports.put.serverDiffApi = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      name: '项目uid',
      required: true,
      title: '项目uid'
    },
    data: {
      type: 'array',
      name: 'api详细信息',
      required: true,
      title: 'api详细信息'
    }
  }
};

module.exports.put.serverReceiveApi = {
  type: 'object',
  properties: {
    project: {
      type: 'string',
      name: '项目uid',
      required: true,
      title: '项目uid'
    },
    data: {
      type: 'object',
      name: 'api数据',
      required: true,
      title: 'api数据'
    },
    apiUid: {
      type: 'string',
      name: 'apiUid',
      title: 'apiUid'
    },
    force: {
      type: 'number'
    },
    forceRemove: {
      type: 'number'
    }
  }
};
module.exports.put.serverReceiveApiList = {
  type: 'object',
  properties: {
    project: {
      type: 'string',
      name: '项目uid',
      required: true,
      title: '项目uid'
    },
    data: {
      type: 'array',
      name: 'api数据列表',
      required: true,
      title: 'api数据列表'
    },
    force: {
      type: 'number'
    },
    forceRemove: {
      type: 'number'
    }
  }
};