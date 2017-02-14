

module.exports.getAppProject = {
  pageSize: {
    type: 'number',
    required: true,
  },
  pageNo: {
    type: 'number',
    required: true,
  },
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
  error: {
    type: 'object',
    cname: '错误提示信息格式',
  },
  gulp: {
    type: 'object',
    cname: 'gulp信息',
    child: {
      path: {
        type: 'string',
        cname: 'gulp文件路径',
      },
      buildPath: {
        type: 'string',
        cname: 'gulp目标路径',
      },
      cmd: {
        type: 'string',
        cname: 'gulp任务',
      },
      params: {
        type: 'string',
        cname: '其他参数',
      },
      js: {
        type: 'string',
        cname: 'js文件夹路径',
      },
      css: {
        type: 'string',
        cname: 'js文件夹路径',
      },
      html: {
        type: 'string',
        cname: 'js文件夹路径',
      },
      image: {
        type: 'string',
        cname: 'js文件夹路径',
      },
    },
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
        cname: 'webpack指令',
      },
    },
  },
}

module.exports.editAppProject = {
  id: {
    type: 'string',
    required: true,
    noEmpty: true,
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
  error: {
    type: 'object',
    cname: '错误提示信息格式',
  },
  gulp: {
    type: 'object',
    cname: 'gulp信息',
    child: {
      path: {
        type: 'string',
        cname: 'gulp文件路径',
      },
      buildPath: {
        type: 'string',
        cname: 'gulp目标路径',
      },
      cmd: {
        type: 'string',
        cname: 'gulp任务',
      },
      params: {
        type: 'string',
        cname: '其他参数',
      },
      js: {
        type: 'string',
        cname: 'js文件夹路径',
      },
      css: {
        type: 'string',
        cname: 'js文件夹路径',
      },
      html: {
        type: 'string',
        cname: 'js文件夹路径',
      },
      image: {
        type: 'string',
        cname: 'js文件夹路径',
      },
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
        cname: 'webpack指令',
      }
    }
  },
}

module.exports.deleteAppProject = {
  id: {
    type: 'string',
    required: true,
    noEmpty: true,
  },
}

module.exports.startAppProject = {
  id: {
    type: 'string',
    required: true,
    noEmpty: true,
  },
  force: {
    type: 'boolean',
  },
}

module.exports.stopAppProject = {
  id: {
    type: 'string',
    required: true,
    noEmpty: true,
  },
}

module.exports.setDefaultApiParam = {
  project: {
    type: 'string',
    required: true,
    noEmpty: true,
  },
  inputParam: {
    type: 'object',
  },
  outputParam: {
    type: 'object',
  },
  name: {
    type: 'string',
  },
}


