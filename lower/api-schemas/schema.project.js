'use strict';

module.exports = {
  get: {},
  post: {},
  put: {},
  delete: {}
};

module.exports.get.project = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    pageSize: {
      type: 'number',
      required: true
    },
    pageNo: {
      type: 'number'
    }
  }
};

module.exports.get.stateProject = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    }
  }
};

module.exports.post.project = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      required: true,
      minLength: 1,
      title: '项目名称'
    },
    shortcut: {
      type: 'string',
      minLength: 1,
      title: '项目简称，用于快捷启动'
    },
    path: {
      type: 'string',
      title: '项目路径'
    },
    port: {
      type: 'number',
      title: '端口'
    },
    parentId: {
      type: 'string',
      title: '父项目的ID'
    },
    proxyTo: {
      type: 'string',
      title: '404代理地址'
    },
    injectHtml: {
      type: 'boolean',
      title: 'html注入脚本'
    },
    proxyTable: {
      type: 'array',
      title: '代理',
      items: {
        api: {
          type: 'string',
          required: true
        },
        target: {
          type: 'string',
          reuqired: true
        }
      }
    },
    staticPath: {
      type: 'array',
      title: '静态资源路径',
      items: {
        type: 'string'
      }
    },
    urls: {
      type: 'array',
      title: '常用url',
      items: {
        name: {
          type: 'string',
          required: true,
          title: '链接名称'
        },
        url: {
          type: 'string',
          title: '链接路径'
        },
        apis: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        list: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        path: {
          type: 'string',
          title: '链接路径'
        },
        params: {
          type: 'object'
        }
      }
    },
    gulp: {
      type: 'object',
      title: 'gulp信息',
      properties: {
        path: {
          type: 'string',
          title: 'gulp文件路径'
        },
        buildPath: {
          type: 'string',
          title: 'gulp目标路径'
        },
        cmd: {
          type: 'string',
          title: 'gulp任务'
        }
      },
      additionalProperties: {}
    }
  }
};

module.exports.put.project = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      required: true,
      minLength: 1
    },
    name: {
      type: 'string',
      minLength: 1,
      title: '项目名称'
    },
    shortcut: {
      type: 'string',
      minLength: 1,
      title: '项目简称，用于快捷启动'
    },
    path: {
      type: 'string',
      title: '项目路径'
    },
    port: {
      type: 'number',
      title: '端口'
    },
    parentId: {
      type: 'string',
      title: '父项目的ID'
    },
    proxyTo: {
      type: 'string',
      title: '404代理地址'
    },
    proxyType: {
      type: 'number',
      title: '当前代理类型'
    },
    injectHtml: {
      type: 'boolean',
      title: 'html注入脚本'
    },
    proxyTable: {
      type: 'array',
      title: '代理',
      items: {
        api: {
          type: 'string',
          required: true
        },
        target: {
          type: 'string',
          reuqired: true
        }
      }
    },
    staticPath: {
      type: 'array',
      title: '静态资源路径',
      items: {
        type: 'string'
      }
    },
    urls: {
      type: 'array',
      title: '常用url',
      items: {
        name: {
          type: 'string',
          required: true,
          title: '链接名称'
        },
        url: {
          type: 'string',
          title: '链接路径'
        },
        apis: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        list: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        path: {
          type: 'string',
          title: '链接路径'
        },
        params: {
          type: 'object'
        }
      }
    },
    gulp: {
      type: 'object',
      title: 'gulp信息',
      properties: {
        path: {
          type: 'string',
          title: 'gulp文件路径'
        },
        buildPath: {
          type: 'string',
          title: 'gulp目标路径'
        },
        cmd: {
          type: 'string',
          title: 'gulp任务'
        }
      },
      additionalProperties: {}
    }
  }
};

module.exports.delete.project = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      required: true,
      minLength: 1
    }
  }
};

module.exports.put.startProject = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      required: true,
      minLength: 1
    },
    force: {
      type: 'boolean'
    }
  }
};

module.exports.put.stopProject = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      required: true,
      minLength: 1
    }
  }
};

module.exports.put.setDefaultApiParam = {
  type: 'object',
  properties: {
    project: {
      type: 'string',
      required: true,
      minLength: 1
    },
    inputParam: {
      type: 'object'
    },
    outputParam: {
      type: 'object'
    },
    name: {
      type: 'string'
    }
  }
};