

module.exports.getMockHis = {
  name: {
    type: 'string',
    required: true,
    noEmpty: true,
    cname: '接口名称',
  },
  project: {
    type: 'string',
    required: true,
    noEmpty: true,
    cname: '项目名称',
  },
  modelId: {
    type: 'string',
    required: true,
    noEmpty: true,
    cname: '接口模型Id',
  },
  time: {
    type: 'number',
    cname: '添加时间',
  },
  data: {
    type: 'object',
    cname: 'mock历史数据',
  }
}



