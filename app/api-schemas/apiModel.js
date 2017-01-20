

module.exports.getApiModel = {
  name: {
    type: 'string',
    required: true,
    noEmpty: true
  },
  project: {
    type: 'string',
    required: true,
    noEmpty: true
  },
}

module.exports.addApiModel = {
  baseid: {
    type: 'string',
    required: true,
    noEmpty: true,
    cname: 'api的id'
  },
  name: {
    type: 'string',
    cname: '名称'
  },
  condition: {
    type: 'string',
    cname: '识别条件'
  },
  inputParam: {
    type: 'object',
    cname: '输入参数schema',
  },
  outputParam: {
    type: 'object',
    cname: '输出参数schema',
  },
  data: {
    type: 'array',
    required: true,
    cname: '样板数据'
  },
}

module.exports.editApiModel = {
  id: {
    type: 'string',
    required: true,
    noEmpty: true
  },
  name: {
    type: 'string',
    cname: '名称'
  },
  baseid: {
    type: 'string',
    required: true,
    noEmpty: true,
    cname: 'api的id'
  },
  condition: {
    type: 'string',
    cname: '识别条件'
  },
  inputParam: {
    type: 'object',
    cname: '输入参数schema',
  },
  outputParam: {
    type: 'object',
    cname: '输出参数schema',
  },
  data: {
    type: 'array',
    required: true,
    cname: '样板数据'
  },
}

module.exports.deleteApiModel = {
  id: {
    type: 'string',
    required: true,
    noEmpty: true
  },
}



