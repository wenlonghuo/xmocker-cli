module.exports = {
  get: {},
  post: {},
  put: {},
  delete: {},
}

module.exports.get.libDetail = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      required: true,
    },
  },
}
module.exports.get.lib = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
    },
    projs: {
      type: 'array',
      title: '指定的项目',
    },
    pageSize: {
      type: 'number',
    },
    pageNo: {
      type: 'number',
    },
  },
}

module.exports.get.searchLib = {
  type: 'object',
  properties: {
    words: {
      type: 'string',
      minLength: 1,
    },
    type: {
      type: 'string',
      minLength: 1,
    },
    pageSize: {
      type: 'number',
      required: true,
    },
    pageNo: {
      type: 'number',
      required: true,
    },
  },
}

module.exports.post.lib = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      required: true,
      minLength: 1,
      title: '名称',
    },
    type: {
      type: 'string',
      required: true,
      title: '类型',
    },
    description: {
      type: 'string',
      title: '说明',
    },
    model: {
      type: 'object',
      title: '模板',
    },
    projs: {
      type: 'array',
      title: '归属于哪个项目',
    },
  },
}

module.exports.put.lib = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      required: true,
      minLength: 1,
    },
    name: {
      type: 'string',
      required: true,
      minLength: 1,
      title: '名称',
    },
    type: {
      type: 'string',
      required: true,
      title: '类型',
    },
    description: {
      type: 'string',
      title: '说明',
    },
    model: {
      type: 'object',
      title: '模板',
    },
    projs: {
      type: 'array',
      title: '归属于哪个项目',
    },
  },
}

module.exports.delete.lib = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      required: true,
      minLength: 1,
    },
  },
}
