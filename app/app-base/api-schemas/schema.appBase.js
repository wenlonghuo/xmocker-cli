module.exports = {
  get: {},
  post: {},
  put: {},
  delete: {},
}
module.exports.get.online = {
}

module.exports.get.appBase = {

}

module.exports.get.appStatus = {

}

module.exports.put.upgradeV0 = {

}

module.exports.put.appBase = {
  type: 'object',
  properties: {
    remoteAddress: {
      type: 'string',
      title: '远程访问地址',
    },
    managePort: {
      type: 'number',
      title: '系统管理端口',
    },
  },
}



