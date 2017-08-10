'use strict';

module.exports = {
  get: {},
  post: {},
  put: {},
  delete: {}
};

module.exports.get.apiModel = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      required: true,
      minLength: 1
    },
    project: {
      type: 'string',
      required: true,
      minLength: 1
    }
  }
};

module.exports.get.apiModelList = {
  type: 'object',
  properties: {
    baseid: {
      type: 'string',
      required: true,
      minLength: 1
    }
  }
};

module.exports.post.apiModel = {
  type: 'object',
  properties: {
    baseid: {
      type: 'string',
      required: true,
      minLength: 1,
      title: 'api的id'
    },
    name: {
      type: 'string',
      title: '名称'
    },
    condition: {
      type: 'string',
      title: '识别条件'
    },
    afterFunc: {
      type: 'string',
      title: '输出过滤函数'
    },
    inputParam: {
      type: 'object',
      title: '输入参数schema'
    },
    outputParam: {
      type: 'object',
      title: '输出参数schema'
    },
    data: {
      type: 'object',
      required: true,
      title: '样板数据'
    }
  }
};

module.exports.put.apiModel = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      required: true,
      minLength: 1
    },
    baseid: {
      type: 'string',
      minLength: 1,
      title: 'api的id'
    },
    name: {
      type: 'string',
      title: '名称'
    },
    condition: {
      type: 'string',
      title: '识别条件'
    },
    afterFunc: {
      type: 'string',
      title: '输出过滤函数'
    },
    inputParam: {
      type: 'object',
      title: '输入参数schema'
    },
    outputParam: {
      type: 'object',
      title: '输出参数schema'
    },
    data: {
      type: 'object',
      title: '样板数据'
    }
  }
};

module.exports.delete.apiModel = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      required: true,
      minLength: 1
    }
  }
};