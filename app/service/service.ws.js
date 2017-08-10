'use strict'
const WebSocket = require('ws')
let wss
// websocket 通讯
function incoming (client, msg) {
  try {
    msg = JSON.parse(msg)
  } catch (e) {
    return
  }
}

function broadcast (data) {
  if (typeof data === 'object') data = JSON.stringify(data)
  wss.clients.forEach(function (client) {
    if (client.readyState === 1) {
      client.send(data)
    }
  })
}

module.exports = function (httpServer) {
  wss = new WebSocket.Server({ server: httpServer })
  wss.on('connection', function wsConnect (wsClient) {
    wsClient.on('message', incoming.bind(null, wsClient))
  })
}

module.exports.broadcast = broadcast
