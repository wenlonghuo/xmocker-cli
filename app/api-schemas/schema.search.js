module.exports = {
  get: {},
  post: {},
  put: {},
  delete: {},
}

module.exports.get.search = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
    },
    keyword: {
      type: 'string',
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
