let ws, wss

// websocket 初始连接函数
function wsConnect (wsClient) {
  ws = wsClient
  wsClient.on('message', incoming)
}

// websocket 通讯
function incoming (msg) {
  try {
    msg = JSON.parse(msg)
  } catch (e) {
    return
  }
}

module.exports.broad = function (hd) {
  wss = hd
  wss.on('connection', wsConnect)

  // Broadcast to all.
  wss.broadcast = function broadcast (data) {
    if (typeof data !== 'string') data = JSON.stringify(data)
    wss.clients.forEach(function each (client) {
      if (client.readyState === 1) {
        client.send(data)
      }
    })
  }

  module.exports.wss = wss
}
