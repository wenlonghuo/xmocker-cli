'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getRemoteData = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(url, params) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return request.get(url, params);

          case 3:
            return _context.abrupt('return', _context.sent);

          case 6:
            _context.prev = 6;
            _context.t0 = _context['catch'](0);
            throw _context.t0;

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 6]]);
  }));

  return function getRemoteData(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var getProjectByUid = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(uid, detail) {
    var data, result, apiQuery, apiData, apiList;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            data = {};
            _context2.next = 4;
            return projectGet.getProjectDetailByQuery({ _uid: uid });

          case 4:
            result = _context2.sent;

            data.proj = result;

            if (!detail) {
              _context2.next = 13;
              break;
            }

            apiQuery = {
              pageSize: 10000,
              pageNo: 0
            };
            _context2.next = 10;
            return apiGet.getApiByProject(result._id, apiQuery, true);

          case 10:
            apiData = _context2.sent;
            apiList = apiData.list;


            data.api = apiList.map(function (item) {
              var base = (0, _assign2.default)({}, item, { model: undefined });
              var model = item.model;
              return { base: base, model: model };
            });

          case 13:
            return _context2.abrupt('return', data);

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

  return function getProjectByUid(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var getApiListByProjectUid = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(uid, option) {
    var proj, result;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return projectGet.getProjectDetailByQuery({ _uid: uid });

          case 3:
            proj = _context3.sent;

            if (proj) {
              _context3.next = 6;
              break;
            }

            return _context3.abrupt('return');

          case 6:
            _context3.next = 8;
            return apiGet.getApiByProject(proj._id, option, true);

          case 8:
            result = _context3.sent;


            result.list = result.list.map(function (item) {
              var model = item.model;
              var base = (0, _assign2.default)({}, item, { model: undefined });
              return { base: base, model: model };
            });
            return _context3.abrupt('return', result);

          case 13:
            _context3.prev = 13;
            _context3.t0 = _context3['catch'](0);
            throw _context3.t0;

          case 16:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[0, 13]]);
  }));

  return function getApiListByProjectUid(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var getApiListByUid = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(uids, projectUid) {
    var proj, query, apiQuery, result, resultData;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return projectGet.getProjectDetailByQuery({ _uid: projectUid });

          case 3:
            proj = _context4.sent;

            if (proj) {
              _context4.next = 6;
              break;
            }

            return _context4.abrupt('return');

          case 6:
            if (Array.isArray(uids)) {
              _context4.next = 8;
              break;
            }

            throw new Error('uid必须是数组');

          case 8:
            query = {
              _uid: { $in: uids },
              project: proj._id
            };
            apiQuery = {
              pageSize: 10000,
              pageNo: 0
            };
            _context4.next = 12;
            return apiGet.getApiByQuery(query, apiQuery, true);

          case 12:
            result = _context4.sent;


            result = result.list;

            resultData = result.map(function (item) {
              var model = item.model;
              var base = (0, _assign2.default)({}, item, { model: undefined });
              return { base: base, model: model };
            });
            return _context4.abrupt('return', resultData);

          case 18:
            _context4.prev = 18;
            _context4.t0 = _context4['catch'](0);
            throw _context4.t0;

          case 21:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[0, 18]]);
  }));

  return function getApiListByUid(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var request = require('./service.request').request;
var apiGet = require('../api/service.get');
var projectGet = require('../project/service.get');

module.exports = {
  getProjectByUid: getProjectByUid,
  getApiListByUid: getApiListByUid,
  getApiListByProjectUid: getApiListByProjectUid,
  getRemoteData: getRemoteData
};