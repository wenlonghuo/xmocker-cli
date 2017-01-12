

module.exports.getAppProject = {
  pageSize: {
    type: 'number',
    required: true
  },
  pageNo: {
    type: 'number',
    required: true
  }
}

module.exports.addAppProject = {
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

module.exports.editAppProject = {
  id: {
    type: 'string',
    required: true,
    noEmpty: true
  },
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

module.exports.deleteAppProject = {
  id: {
    type: 'string',
    required: true,
    noEmpty: true
  },
}

module.exports.startAppProject = {
  id: {
    type: 'string',
    required: true,
    noEmpty: true
  },
}

module.exports.stopAppProject = {
  id: {
    type: 'string',
    required: true,
    noEmpty: true
  },
}


