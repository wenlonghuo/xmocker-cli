'use strict'
const os = require('os')
function getIp () {
  let netInfo = os.networkInterfaces()
  let localIp = 'localhost'
  if (netInfo) {
    let keys = Object.keys(netInfo)
    keys.filter((key) => {
      let list = netInfo[key]
      list.forEach((info) => {
        if (/^[\d]{1,3}\./.test(info.address)) {
          if (!/^127\./.test(info.address)) {
            localIp = info.address
          }
        }
      })
    })
  }
  return localIp
}
let ip = getIp()

module.exports = {
  ip,
}
