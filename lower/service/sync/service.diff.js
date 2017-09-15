'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var diffApiByData = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(query, data) {
    var proj, res, serverData, result;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return projectGet.getProjectDetailByQuery(query);

          case 3:
            proj = _context.sent;

            if (proj) {
              _context.next = 6;
              break;
            }

            return _context.abrupt('return');

          case 6:
            _context.next = 8;
            return apiGet.getExistApi(data);

          case 8:
            res = _context.sent;
            serverData = res.data;
            result = serverData.map(function (item) {
              var status = item._mt === data._mt ? 0 : item._mt < data._mt ? 1 : -1;
              return { status: status, data: item };
            });
            return _context.abrupt('return', result);

          case 14:
            _context.prev = 14;
            _context.t0 = _context['catch'](0);
            throw _context.t0;

          case 17:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 14]]);
  }));

  return function diffApiByData(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var diffApiListDataByTime = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(query, apis) {
    var proj, apiQuery, apiList, server, client, result;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return projectGet.getProjectDetailByQuery(query);

          case 3:
            proj = _context2.sent;

            if (proj) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt('return');

          case 6:
            apiQuery = {
              pageSize: 10000,
              pageNo: 0
            };
            _context2.next = 9;
            return apiGet.getApiByProject(proj._id, apiQuery, true);

          case 9:
            apiList = _context2.sent;
            server = apiList.list;
            client = apis.map(function (item) {
              if (item.base) {
                return (0, _assign2.default)({}, item.base, { model: item.model });
              }
              return item;
            });
            result = diffTimeStamp(client, server, { isApi: true });
            return _context2.abrupt('return', result);

          case 16:
            _context2.prev = 16;
            _context2.t0 = _context2['catch'](0);
            throw _context2.t0;

          case 19:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 16]]);
  }));

  return function diffApiListDataByTime(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var diffProjectListDataByTime = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(query, client) {
    var projQuery, apiList, server, result;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;

            query = query || {};
            projQuery = {
              pageSize: 10000,
              pageNo: 0
            };
            _context3.next = 5;
            return projectGet.getProjectByQuery(query, projQuery);

          case 5:
            apiList = _context3.sent;
            server = apiList.list;
            result = diffTimeStamp(client, server);
            return _context3.abrupt('return', result);

          case 11:
            _context3.prev = 11;
            _context3.t0 = _context3['catch'](0);
            throw _context3.t0;

          case 14:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[0, 11]]);
  }));

  return function diffProjectListDataByTime(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiGet = require('../api/service.get');
var projectGet = require('../project/service.get');

module.exports = {
  diffApiListDataByTime: diffApiListDataByTime,
  diffProjectListDataByTime: diffProjectListDataByTime,
  diffApiByData: diffApiByData
};

function diffTimeStamp(clientList, serverList) {
  var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var infosObj = {};
  var result = {
    unchanged: [],
    behind: [],
    ahead: [],
    serverSide: [],
    clientSide: [],
    untaged: []
  };

  serverList.forEach(function (item) {
    var uid = item._uid;
    infosObj[uid] = { server: item };
  });

  clientList.forEach(function (item) {
    var uid = item._uid;
    infosObj[uid] = infosObj[uid] || {};
    infosObj[uid].client = item;
  });

  (0, _keys2.default)(infosObj).forEach(function (uid) {
    var info = infosObj[uid];
    var server = info.server;
    var client = info.client;

    var data = {
      server: server,
      client: client
    };
    if (option.isApi) {
      if (data.server) data.server = { base: (0, _assign2.default)({}, data.server, { model: undefined }), model: data.server.model };
      if (data.client) data.client = { base: (0, _assign2.default)({}, data.client, { model: undefined }), model: data.client.model };
    }

    if (server && client) {
      var serverTime = server._mt;
      var clientTime = client._mt;

      if (serverTime === clientTime) {
        result.unchanged.push(data);
      } else if (serverTime > clientTime) {
        result.behind.push(data);
      } else if (serverTime < clientTime) {
        result.ahead.push(data);
      } else {
        if (serverTime) {
          result.behind.push(data);
        } else if (clientTime) {
          result.ahead.push(data);
        } else {
          result.untaged.push(data);
        }
      }
    } else if (server) {
      result.serverSide.push(data);
    } else if (client) {
      result.clientSide.push(data);
    }
  });

  return result;
}