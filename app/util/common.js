'use strict'

function uid () {
  let max = 1000000
  let cnt = 0
  return function () {
    cnt++
    if (cnt >= max) cnt = 0
    return (+new Date() * max + cnt).toString(36)
  }
}

function killPort (port) {
  let cmd = process.platform === 'win32' ? 'netstat -ano' : 'ps aux'
  let exec = require('child_process').exec

  return new Promise(function (resolve) {
    let rd
    exec(cmd, function (err, stdout, stderr) {
      if (err) {
        console.log(err)
        resolve(null)
        return
      }
      let lines = stdout.split('\n')
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i]
        let p = line.trim().split(/\s+/)
        let address = p[1]

        if (address !== undefined) {
          if (address.split(':')[1] == port) {
            exec('taskkill /F /pid ' + p[4], function (err, stdout, stderr) {
              let msg = err ? '释放指定端口失败！！' : '占用指定端口的程序被成功杀掉！' + p[4]
              resolve(msg)
            })
            rd = true
            break
          }
        }
      }
      if (!rd) resolve('成功杀掉进程')
    })
  })
}

module.exports = {
  uid: uid,
  killPort: killPort,
}
