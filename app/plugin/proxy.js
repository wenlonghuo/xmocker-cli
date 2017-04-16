'use strict'
const httpProxy = require('http-proxy')
const through2 = require('through2')
const unzip = require('zlib').unzipSync

module.exports = function proxyTo () {
  let proxy = httpProxy.createProxyServer({changeOrigin: true})
  const web = proxy.web
  proxy.on('proxyRes', function (proxyRes, req, res) {
    res.bufferBody = []
    if (proxyRes.headers['content-encoding']) res.isGZ = true
    proxyRes.pipe(through2.obj(function (chunk, enc, callback) {
      res.bufferBody.push(chunk)
      callback()
    }))
  })
  // promisefy request
  proxy.web = function () {
    let args = arguments
    let res = arguments[1]
    return new Promise(function (resolve, reject) {
      web.call(proxy, ...args, function (res) {
        reject(res)
      })
      res.on('finish', function () {
        if (res.bufferBody && res.bufferBody.length) {
          let buffer = Buffer.concat(res.bufferBody)
          if (res.isGZ) buffer = unzip(buffer)
          res.body = buffer.toString('utf8')
        }
        resolve()
      })
    })
  }

  // restream body
  proxy.on('proxyReq', function (proxyReq, req, res, options) {
    if (req.body) {
      let bodyData = JSON.stringify(req.body)
      // incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
      proxyReq.setHeader('Content-Type', 'application/json')
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))
      // stream the content
      proxyReq.write(bodyData)
    }
  })
  return proxy
}
