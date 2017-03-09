#!/usr/bin/env node
'use strict'
const request = require('superagent')
let common = require('../app/util/common')
let db = require('../app/db')
let appProject = db.appProject
let appBase = db.appBase
let baseUrl = 'http://localhost:'

let handleFunc = {
  empty (cmd) {
    this.default(cmd)
  },
  kill (cmd) {
    if (!this._list) {
      console.log('主进程尚未启动，请先启动主进程, 帮助请使用 -h')
      return
    }
    let doc = this._doc
    if (!doc) {
      console.log('项目不存在，请检查项目后再执行')
      return
    }
    stopProj(doc._id).then(function (result) {
      if (!result) {
        console.log('停止项目出错')
        return
      }
      if (result.code) {
        console.log('停止项目失败：' + result.err)
      } else {
        console.log('停止项目成功')
      }
    })
  },
  killPort (cmd) {
    common.killPort(cmd.target[0])
  },
  listRun (cmd) {
    if (!this._list) {
      console.log('主进程未启动！')
      return
    }
    listProj(this._list.map((item) => item.procInfo))
  },
  list (cmd) {
    getProjectList().then(function (doc) {
      if (!doc) {
        console.log('查询列表失败')
      }
      listProj(doc)
    })
  },
  restart (cmd) {
    if (!cmd || !cmd.target || !cmd.target.length) {
      console.log('请输入要启动的项目')
      return
    }
    if (!this._list) {
      startServer(cmd)
    } else {
      let doc = this._doc
      if (!doc) {
        console.log('项目不存在，请检查项目后再执行')
        return
      }
      startProj(doc._id).then(function (result) {
        if (!result) {
          console.log('重启动项目出错')
          return
        }
        if (result.code) {
          console.log('重启动项目失败：' + result.err)
        } else {
          console.log('重启动项目成功')
        }
      })
    }
  },
  startTemp (cmd) {

  },
  start (cmd) {
    if (!cmd || !cmd.target || !cmd.target.length) {
      this.default(cmd)
      return
    }

    if (!this._list) {
      startServer(cmd)
    } else {
      let list = this._list
      if (list.find(function (p) { return p.procInfo.shortcut === cmd.target[0]})) {
        console.log('您已经启动该项目，需要重启请使用restart 或 -rs')
        return
      }
      let doc = this._doc
      if (!doc) {
        console.log('项目不存在，请检查项目后再执行')
        return
      }
      startProj(doc._id).then(function (result) {
        if (!result) {
          console.log('启动项目出错')
          return
        }
        if (result.code) {
          console.log('启动项目失败：' + result.err)
        } else {
          console.log('启动项目成功')
        }
      })
    }
  },
  default (cmd) {
    if (!this._list) {
      startServer(cmd)
    } else {
      console.log('您已经启动进程，无需再次启动， 输入-h可查看更多命令')
    }
  },
}

function getAppState () {
  return appBase.cfindOne({}).exec().then(function (doc) {
    doc = doc || {}
    let appPort = doc.managePort || 6001
    baseUrl = baseUrl + appPort + '/mock'
    return new Promise(function (resolve) {
      request.get(baseUrl + '/getAppStatus').end(function (err, res) {
        if (err) {
          if (err.code !== 'ECONNREFUSED') console.log(err)
          resolve(null)
        } else {
          resolve(res.body.data.runningProject)
        }
      })
    })
  })
}

function startProj (id) {
  return new Promise(function (resolve) {
    if (!id) return resolve()
    request.put(baseUrl + '/startAppProject').send({
      id: id,
      force: true,
    }).end(function (err, res) {
      if (err) {
        console.log(err)
        resolve(null)
      } else {
        resolve(res.body)
      }
    })
  })
}

function stopProj (id) {
  return new Promise(function (resolve) {
    request.put(baseUrl + '/stopAppProject').send({
      id: id,
      force: true,
    }).end(function (err, res) {
      if (err) {
        console.log(err)
        resolve(null)
      } else {
        resolve(res.body)
      }
    })
  })
}

function getProjectInfo (name) {
  return appProject.cfindOne({shortcut: name}).exec().then(function (doc) {
    if (!doc) {
      Promise.resolve(null)
      return
    }
    return Promise.resolve(doc)
  })
}

function getProjectList (name) {
  return appProject.cfind({}).exec().then(function (doc) {
    if (!doc) {
      Promise.resolve(null)
      return
    }
    return Promise.resolve(doc)
  })
}

function listProj (list) {
  process.stdout.write('项目列表\n 名称             \t简称      \t端口 \tid\n')
  list.forEach(function (item) {
    process.stdout.write(' ' + paddingLen(item.name, 20) + ' \t' + paddingLen(item.shortcut, 10) + ' \t' + paddingLen(item.port, 6) + ' \t' + item._id + '\n')
  })
}

function startServer (cmd) {
  var mocker = require('../bin/server')
  mocker(cmd)
}

module.exports.handle = function (cmd) {
  let func
  if (cmd) {
    let equal = cmd.equal
    if (equal.length == 2) {
      func = equal[0] + equal[1][0].toUpperCase() + equal[1].slice(1)
    } else {
      func = equal[0]
    }
  } else {
    func = 'default'
  }
  let forbidList = ['killPort', 'list']
  let idList = ['start', 'restart', 'kill']
  if (handleFunc[func]) {
    if (forbidList.indexOf(func) < 0) {
      getAppState().then(function (list) {
        if (list) list = list.filter((p) => p.status)
        handleFunc._list = list
        if (idList.indexOf(func) < 0) {
          handleFunc[func](cmd)
        } else {
          let name = cmd && cmd.target
          getProjectInfo(cmd.target[0]).then(function (doc) {
            handleFunc._doc = doc
            handleFunc[func](cmd)
          })
        }
      })
    } else {
      handleFunc[func](cmd)
    }
  }
}

function paddingLen (str, len) {
  str = str || ''
  let slen = new Buffer(str).length
  if (slen < len) {
    let a = []
    a[len - slen] = ''
    str += a.join(' ')
  }
  return str
}
