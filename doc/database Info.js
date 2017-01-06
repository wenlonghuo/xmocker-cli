// app 基础信息
appBase = {
  remoteAddress: {
    type: 'string',
    cname: '远程访问地址',
  },
  remoteName: {
    type: 'string',
    cname: '远程登录用户名',
  },
  remotePassword: {
    type: 'string',
    cname: '远程登录密码',
  },
  managePort: {
    type: 'string',
    cname: '系统管理端口',
  },
  repeatTime: {
    type: 'number',
    cname: '重复次数',
  },
}
// 项目信息
AppProject = {
  name: {
    type: 'string',
    required: true,
    noEmpty: true,
    cname: '项目名称',
  },
  member: {
    type: 'string',
    cname: '项目成员',
  },
  path: {
    type: 'string',
    cname: '项目路径',
  },
  port: {
    type: 'number',
    cname: '端口',
  },
  state: {
    type: 'string',
    cname: '项目状态',
  },
  gulp: {
    type: 'object',
    cname: 'gulp信息',
    child: {
      path: {
        type: 'string',
        cname: 'gulp路径'
      },
      cmd: {
        type: 'string',
        cname: 'gulp命令'
      }
    }
  },
  webpack: {
    type: 'object',
    cname: 'webpack信息',
    child: {
      path: {
        type: 'string',
        cname: 'webpack文件路径',
      },
      cmd: {
        type: 'string',
        cname: 'webpack指令'
      }
    }
  },
}

// api 基础信息
ApiBase = {
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
// api 在某种模型下的信息
ApiModel = {
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

// mock 历史数据
MockHis = {
  name: {
    type: 'string',
    required: true,
    noEmpty: true,
    cname: '接口名称'
  },
  project: {
    type: 'string',
    required: true,
    noEmpty: true,
    cname: '项目名称'
  },
  modelId: {
    type: 'string',
    required: true,
    noEmpty: true,
    cname: '接口模型Id'
  },
  time: {
    type: 'number',
    cname: '添加时间',
  },
  data: {
    type: 'object',
    cname: 'mock历史数据'
  }
}