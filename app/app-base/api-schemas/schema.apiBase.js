module.exports = {
  get: {},
  post: {},
  put: {},
  delete: {},
}

module.exports.get.apiDetail = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      required: true,
    },
  },
}
module.exports.get.api = {
  type: 'object',
  properties: {
    project: {
      type: 'string',
      required: true,
    },
    pageSize: {
      type: 'number',
    },
    pageNo: {
      type: 'number',
    },
  },
}

module.exports.get.apiBase = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      title: '名称列表',
    },
    project: {
      type: 'string',
      minLength: 1,
    },
    pageSize: {
      type: 'number',
    },
    pageNo: {
      type: 'number',
    },
  },
}

module.exports.get.searchApi = {
  type: 'object',
  properties: {
    words: {
      type: 'string',
      minLength: 1,
    },
    project: {
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



module.exports.post.apiBase = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      required: true,
      minLength: 1,
      title: 'api名称',
    },
    method: {
      type: 'string',
      required: true,
      title: '方法',
    },
    url: {
      type: 'string',
      required: true,
      minLength: 1,
      title: 'api的url路径',
    },
    project: {
      type: 'string',
      required: true,
      minLength: 1,
      title: 'api所属项目',
    },
    path: {
      type: 'string',
      title: 'api识别路径',
      description: '如果不填写，请求路径等于url时则判断为符合，否则会从param中的值中获取，可以.隔开',
    },
    pathEqual: {
      type: 'string',
      title: 'api识别路径',
      description: 'API路径',
    },
    delay: {
      type: 'number',
      title: '延迟',
    },
    description: {
      type: 'string',
      title: '接口描述',
    },
  },
}

module.exports.put.apiBase = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      required: true,
      minLength: 1,
    },
    name: {
      type: 'string',
      minLength: 1,
      title: 'api名称',
    },
    method: {
      type: 'string',
      title: '方法',
    },
    url: {
      type: 'string',
      minLength: 1,
      title: 'api的url路径',
    },
    project: {
      type: 'string',
      minLength: 1,
      title: 'api所属项目',
    },
    path: {
      type: 'string',
      title: 'api识别路径',
      description: '如果不填写，请求路径等于url时则判断为符合，否则会从param中的值中获取，可以.隔开',
    },
    pathEqual: {
      type: 'string',
      title: 'api识别路径',
      description: 'API路径',
    },
    delay: {
      type: 'number',
      title: '延迟',
    },
    description: {
      type: 'string',
      title: '接口描述',
    },
  },
}

module.exports.delete.api = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      required: true,
      minLength: 1,
    },
  },
}

module.exports.put.copyApi = {
  type: 'object',
  properties: {
    from: {
      type: 'string',
      required: true,
      minLength: 1,
    },
    to: {
      type: 'string',
      required: true,
      minLength: 1,
    },
  },
}

module.exports.put.apiStatus = {
  type: 'object',
  properties: {
    api: {
      type: 'string',
      required: true,
      minLength: 1,
    },
    project: {
      type: 'string',
      required: true,
      minLength: 1,
    },
    type: {
      type: 'number',
      required: true,
      minLength: 1,
    },
    id: {
      type: 'string',
      minLength: 1,
    },
    data: {
      type: 'object',
    },
  },
}

