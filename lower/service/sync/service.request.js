'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getRemoteUrl = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(url) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getRemoteUrl(_x) {
    return _ref.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = require('../../database');
var AppBase = db.appBase;
var axios = require('axios');

module.exports = {
  getServerInfo: getServerInfo,
  getRemoteUrl: getRemoteUrl,
  request: {
    get: axiosGet,
    put: axiosPut
  }
};

function getServerInfo() {
  return AppBase.cfindOne({}).exec().then(function (doc) {
    doc = doc || {};
    var addr = doc.remoteAddress || 'http://localhost:6001';
    return addr;
  }).catch(function (e) {
    return 'http://localhost:6001';
  });
}

function axiosGet(url, params) {
  return getServerInfo().then(function (server) {
    var remoteUrl = server + url;
    return axios.request({ url: remoteUrl, params: params }).then(function (res) {
      return res.data;
    });
  });
}
function axiosPut(url, data) {
  return getServerInfo().then(function (server) {
    var remoteUrl = server + url;
    return axios.request({ url: remoteUrl, method: 'PUT', data: data }).then(function (res) {
      return res.data;
    });
  });
}