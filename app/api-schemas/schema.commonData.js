module.exports = {
  get: {},
  post: {},
  put: {},
  delete: {},
}

module.exports.get.commonData = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      required: true,
    },
  },
}

module.exports.get.searchCommonData = {
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



module.exports.post.commonData = {
  type: 'object',
  properties: {
    url: {
      type: 'string',
      required: true,
      minLength: 1,
      title: 'api的url路径',
    },
    name: {
      type: 'string',
      required: true,
      minLength: 1,
      title: 'api名称',
    },
    project: {
      type: 'string',
      required: true,
      minLength: 1,
      title: 'api所属项目',
    },
    method: {
      type: 'string',
      required: true,
      title: '方法',
    },
    path: {
      type: 'string',
      title: 'api识别路径',
      description: '如果不填写，请求路径等于url时则判断为符合，否则会从param中的值中获取，可以.隔开'
    },
    keywords: {
      type: 'string',
      title: '关键词',
    },
    description: {
      type: 'string',
      required: true,
      minLength: 1,
      title: '接口描述',
    },
    createdBy: {
      type: 'string',
      title: '创建人',
    },
  },
}

module.exports.put.commonData = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      required: true,
      minLength: 1,
    },
    url: {
      type: 'string',
      required: true,
      minLength: 1,
      title: 'api的url路径',
    },
    name: {
      type: 'string',
      required: true,
      minLength: 1,
      title: 'api名称',
    },
    project: {
      type: 'string',
      required: true,
      minLength: 1,
      title: 'api所属项目',
    },
    method: {
      type: 'string',
      required: true,
      title: '方法',
    },
    path: {
      type: 'string',
      title: 'api识别路径',
      description: '如果不填写，请求路径等于url时则判断为符合，否则会从param中的值中获取，可以.隔开',
    },
    keywords: {
      type: 'string',
      title: '关键词',
    },
    description: {
      type: 'string',
      required: true,
      minLength: 1,
      title: '接口描述',
    },
    createdBy: {
      type: 'string',
      title: '创建人',
    },
  },
}

module.exports.delete.commonData = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      required: true,
      minLength: 1,
    },
  },
}