
module.exports.getApiDetail = {
  id: {
    type: 'string',
    required: true,
    noEmpty: true
  },
}

module.exports.getApiBase = {
  name: {
    type: 'string',
    noEmpty: true
  },
  project: {
    type: 'string',
    noEmpty: true
  },
  pageSize: {
    type: 'number',
    required: true
  },
  pageNo: {
    type: 'number',
    required: true
  }
}

module.exports.addApiBase = {
  url: {
    type: 'string',
    required: true,
    noEmpty: true,
    cname: 'api的url路径'
  },
  name: {
    type: 'string',
    required: true,
    noEmpty: true,
    cname: 'api名称'
  },
  project: {
    type: 'string',
    required: true,
    noEmpty: true,
    cname: 'api所属项目',
  },
  method: {
    type: 'string',
    required: true,
    cname: '方法',
  },
  path: {
    type: 'string',
    cname: 'api识别路径',
    description: '如果不填写，请求路径等于url时则判断为符合，否则会从param中的值中获取，可以.隔开'
  },
  keywords: {
    type: 'string',
    cname: '关键词',
  },
  description: {
    type: 'string',
    required: true,
    noEmpty: true,
    cname: '接口描述'
  },
  createdBy: {
    type: 'string',
    cname: '创建人',
  },
}

module.exports.editApiBase = {
  id: {
    type: 'string',
    required: true,
    noEmpty: true
  },
  url: {
    type: 'string',
    required: true,
    noEmpty: true,
    cname: 'api的url路径'
  },
  name: {
    type: 'string',
    required: true,
    noEmpty: true,
    cname: 'api名称'
  },
  project: {
    type: 'string',
    required: true,
    noEmpty: true,
    cname: 'api所属项目',
  },
  method: {
    type: 'string',
    required: true,
    cname: '方法',
  },
  path: {
    type: 'string',
    cname: 'api识别路径',
    description: '如果不填写，请求路径等于url时则判断为符合，否则会从param中的值中获取，可以.隔开'
  },
  keywords: {
    type: 'string',
    cname: '关键词',
  },
  description: {
    type: 'string',
    required: true,
    noEmpty: true,
    cname: '接口描述'
  },
  createdBy: {
    type: 'string',
    cname: '创建人',
  },
}

module.exports.deleteApiBase = {
  id: {
    type: 'string',
    required: true,
    noEmpty: true
  },
}

module.exports.copyApi = {
  from: {
    type: 'string',
    required: true,
    noEmpty: true
  },
  to: {
    type: 'string',
    required: true,
    noEmpty: true
  },
}


