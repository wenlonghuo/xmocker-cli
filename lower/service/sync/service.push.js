'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var pushApiToServerByIdList = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(apiIds, remoteProjectUid, _ref2) {
    var force = _ref2.force,
        forceRemove = _ref2.forceRemove;
    var apiQuery, apiData, list;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            apiQuery = {
              pageSize: 10000,
              pageNo: 0
            };
            _context.next = 4;
            return apiGet.getApiByQuery({ _id: { $in: apiIds } }, apiQuery, true);

          case 4:
            apiData = _context.sent;
            list = apiData.list.map(function (item) {
              return {
                base: (0, _assign2.default)({}, item, { model: undefined }),
                model: item.model
              };
            });
            _context.next = 8;
            return pushApiListToServerByData(list, remoteProjectUid, { force: force, forceRemove: forceRemove });

          case 8:
            return _context.abrupt('return', _context.sent);

          case 11:
            _context.prev = 11;
            _context.t0 = _context['catch'](0);
            throw _context.t0;

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 11]]);
  }));

  return function pushApiToServerByIdList(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var pushApiToServerById = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(apiId, remoteProjectUid, _ref4) {
    var remoteApiUid = _ref4.remoteApiUid,
        force = _ref4.force,
        forceRemove = _ref4.forceRemove;
    var apiData, data;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return apiGet.getApiById(apiId);

          case 3:
            apiData = _context2.sent;

            if (apiData) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt('return', { code: 1, msg: 'API不存在' });

          case 6:
            data = {
              base: (0, _assign2.default)({}, apiData, { model: undefined }),
              model: apiData.model
            };
            _context2.next = 9;
            return pushApiToServerByData(data, remoteProjectUid, { remoteApiUid: remoteApiUid, force: force, forceRemove: forceRemove });

          case 9:
            return _context2.abrupt('return', _context2.sent);

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2['catch'](0);
            throw _context2.t0;

          case 15:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 12]]);
  }));

  return function pushApiToServerById(_x4, _x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var pushApiToServerByData = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(apiData, remoteProjectUid, _ref6) {
    var remoteApiUid = _ref6.remoteApiUid,
        force = _ref6.force,
        forceRemove = _ref6.forceRemove;
    var url, params;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            url = '/mock/serverReceiveApi';
            params = {
              data: apiData,
              project: remoteProjectUid,
              apiUid: remoteApiUid,
              force: force,
              forceRemove: forceRemove
            };
            _context3.next = 5;
            return request.put(url, params);

          case 5:
            return _context3.abrupt('return', _context3.sent);

          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3['catch'](0);
            throw _context3.t0;

          case 11:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[0, 8]]);
  }));

  return function pushApiToServerByData(_x7, _x8, _x9) {
    return _ref5.apply(this, arguments);
  };
}();

var pushApiListToServerByData = function () {
  var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(apiList, remoteProjectUid, _ref8) {
    var force = _ref8.force,
        forceRemove = _ref8.forceRemove;
    var url, params;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            url = '/mock/serverReceiveApiList';
            params = {
              data: apiList,
              project: remoteProjectUid,
              force: force,
              forceRemove: forceRemove
            };
            _context4.next = 5;
            return request.put(url, params);

          case 5:
            return _context4.abrupt('return', _context4.sent);

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4['catch'](0);
            throw _context4.t0;

          case 11:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[0, 8]]);
  }));

  return function pushApiListToServerByData(_x10, _x11, _x12) {
    return _ref7.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var request = require('./service.request').request;
var apiGet = require('../api/service.get');

module.exports = {
  pushApiToServerById: pushApiToServerById,
  pushApiToServerByIdList: pushApiToServerByIdList,
  pushApiToServerByData: pushApiToServerByData,
  pushApiListToServerByData: pushApiListToServerByData
};