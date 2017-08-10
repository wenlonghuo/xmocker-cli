module.exports = {
  get: {},
  post: {},
  put: {},
  delete: {},
}

module.exports.post.errorUpload = {
  type: 'object',
  properties: {
    href: {
      type: 'string',
    },
    ua: {
      type: 'string',
    },
    message: {
      type: 'string',
    },
    source: {
      type: 'string',
    },
    lineno: {
      type: 'string',
    },
    colno: {
      type: 'string',
    },
    stack: {
      type: 'string',
    },
  },
}
