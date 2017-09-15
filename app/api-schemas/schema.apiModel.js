module.exports = {
  get: {},
  post: {},
  put: {},
  delete: {},
}

module.exports.get.apiModel = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      required: true,
      minLength: 1,
    },
    project: {
      type: 'string',
      required: true,
      minLength: 1,
    },
  },
}

module.exports.get.apiModelList = {
  type: 'object',
  properties: {
    baseid: {
      type: 'string',
      required: true,
      minLength: 1,
    },
    pageSize: {
      type: 'number',
      default: 1000,
    },
    pageNo: {
      type: 'number',
      default: 0,
    },
    order: {
      type: 'number',
    },
    sortBy: {
      type: 'string',
    },
  },
}

module.exports.post.apiModel = {
  type: 'object',
  properties: {
    baseid: {
      type: 'string',
      required: true,
      minLength: 1,
      title: 'api的id',
    },
    name: {
      type: 'string',
      title: '名称',
    },
    condition: {
      type: 'string',
      title: '识别条件',
    },
    afterFunc: {
      type: ['string', 'null'],
      title: '输出过滤函数',
    },
    inputParam: {
      type: ['object', 'null'],
      title: '输入参数schema',
    },
    outputParam: {
      type: ['object', 'null'],
      title: '输出参数schema',
    },
    data: {
      type: ['object', 'null'],
      title: '样板数据',
    },
  },
}

module.exports.put.apiModel = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      required: true,
      minLength: 1,
    },
    baseid: {
      type: 'string',
      minLength: 1,
      title: 'api的id',
    },
    name: {
      type: 'string',
      title: '名称',
    },
    condition: {
      type: 'string',
      title: '识别条件',
    },
    afterFunc: {
      type: ['string', 'null'],
      title: '输出过滤函数',
    },
    inputParam: {
      type: ['object', 'null'],
      title: '输入参数schema',
    },
    outputParam: {
      type: ['object', 'null'],
      title: '输出参数schema',
    },
    data: {
      type: ['object', 'null'],
      title: '样板数据',
    },
  },
}

module.exports.delete.apiModel = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      required: true,
      minLength: 1,
    },
  },
}
