'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var through2 = require('through2');

var broadcast = require('./service.ws').broadcast;

var errStream = through2(function (chunk, enc, cb) {
  process.stdout.write(chunk);
  cb(null, chunk);
});

function mocker(data) {
  if ((typeof data === 'undefined' ? 'undefined' : (0, _typeof3.default)(data)) === 'object') {
    if (data.res && (0, _typeof3.default)(data.res) === 'object') {
      data.res = (0, _stringify2.default)(data.res);
    }
    broadcast({ type: 'log', action: 'ADD_LOGS', logType: data.type, data: data });

    var type = data.type === 'his' ? 'info' : data.type;
    if (logger[type]) {
      logger[type](data);
    }
  }
}

module.exports = function (msg) {
  process.stdout.write(msg);
};

module.exports.errStream = errStream;
module.exports.mocker = mocker;