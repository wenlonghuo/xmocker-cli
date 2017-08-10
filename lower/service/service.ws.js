'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WebSocket = require('ws');
var wss = void 0;

function incoming(client, msg) {
  try {
    msg = JSON.parse(msg);
  } catch (e) {
    return;
  }
}

function broadcast(data) {
  if ((typeof data === 'undefined' ? 'undefined' : (0, _typeof3.default)(data)) === 'object') data = (0, _stringify2.default)(data);
  wss.clients.forEach(function (client) {
    if (client.readyState === 1) {
      client.send(data);
    }
  });
}

module.exports = function (httpServer) {
  wss = new WebSocket.Server({ server: httpServer });
  wss.on('connection', function wsConnect(wsClient) {
    wsClient.on('message', incoming.bind(null, wsClient));
  });
};

module.exports.broadcast = broadcast;