module.exports = {
  get: {},
  post: {},
  put: {},
  delete: {},
}

module.exports.get.log = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      minLength: 1,
    },
    project: {
      type: 'string',
    },
    api: {
      type: 'string',
    },
    apiModel: {
      type: 'string',
    },
    ip: {
      type: 'string',
    },
    client: {
      type: 'object',
    },
    pageSize: {
      type: 'number',
      default: 20,
      required: true,
    },
    pageNo: {
      type: 'number',
      default: 0,
      required: true,
    },
  },
}
