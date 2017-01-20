

module.exports.getAppBase = {

}

module.exports.getAppStatus = {

}

module.exports.editAppBase = {
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
  defaultProject:{
    type: 'string',
    cname: '默认project的id',
  },
  repeatTime: {
    type: 'number',
    cname: '重复次数',
  },
}



