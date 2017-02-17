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

function getDeepVal (obj, str) {
  if (typeof obj !== 'object' || typeof str !== 'string') return
  let arr = str.split('.')
  let val = obj
  for (let i = 0; i < arr.length; i++) {
    val = val[arr[i]]
    if (typeof val !== 'object' && i !== arr.length - 1) return
  }
  return val
}


// 生成随机字符串

let codeDirecory = {
  punctuation: [
    [32, 15],
    [58, 6],
    [91, 5],
    [123, 3],
    [160, 31],
    [215, 0],
    [247, 0],
  ],
  number: [
    [48, 0],
  ],
  letter: [
    [65, 25],
    [97, 25],
  ],
  chinese: [
    [19968, 20941],
  ],
}

function randomCode (len = 10, type = ['letter', 'chinese', 'number', 'punctuation']) {
  let i = 0
  let str = ''
  let base, range, order, arr, lower
  let typeLen = type.length - 1
  if (typeLen < 0) {
    return ''
  }

  while (i < len) {
    i++
    order = Math.round(Math.random() * typeLen)
    arr = codeDirecory[type[order]] || codeDirecory.letter

    let randomInfo
    let randomLen = arr.length - 1

    if (randomLen > 0) {
      randomInfo = arr[Math.round(Math.random() * randomLen)]
    } else {
      randomInfo = arr[0]
    }
    base = randomInfo[0]
    range = randomInfo[1]
    lower = parseInt(Math.random() * range)
    str += String.fromCharCode(base + lower)
  }
  return str
}

module.exports = {
  uid: uid,
  killPort: killPort,
  getDeepVal: getDeepVal,
  randomCode: randomCode,
}
