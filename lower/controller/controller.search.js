'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var search = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {
    var finalParams, size, no, skip, type, words, regex, result, total, keys, i, key;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            finalParams = ctx.finalParams;
            size = ~~finalParams.pageSize;
            no = ~~finalParams.pageNo;
            skip = ~~(size * no);
            type = finalParams.type;


            delete finalParams.pageSize;
            delete finalParams.pageNo;

            words = finalParams.keyword;
            regex = new RegExp(words, 'i');
            result = void 0, total = void 0;
            _context.prev = 10;

            if (type) {
              _context.next = 24;
              break;
            }

            result = {};
            keys = (0, _keys2.default)(searchAction);
            i = 0;

          case 15:
            if (!(i < keys.length)) {
              _context.next = 23;
              break;
            }

            key = keys[i];
            _context.next = 19;
            return searchAction[key](regex, { skip: skip, size: size });

          case 19:
            result[key] = _context.sent;

          case 20:
            i++;
            _context.next = 15;
            break;

          case 23:
            return _context.abrupt('return', ctx.respond.success('搜索成功', result));

          case 24:
            if (searchAction[type]) {
              _context.next = 26;
              break;
            }

            return _context.abrupt('return', ctx.respond.error('未知的搜索类型！'));

          case 26:
            _context.next = 28;
            return searchAction[type](regex, { skip: skip, size: size });

          case 28:
            result = _context.sent;

            total = result.total;
            result = {
              list: result.list,
              pagination: {
                total: total,
                pageCnt: Math.ceil(total / size),
                pageNo: no
              }
            };
            ctx.respond.success('搜索成功', result);
            _context.next = 37;
            break;

          case 34:
            _context.prev = 34;
            _context.t0 = _context['catch'](10);
            return _context.abrupt('return', ctx.respond.error('搜索日志出错', { e: _context.t0 }));

          case 37:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[10, 34]]);
  }));

  return function search(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var searchProject = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(regex, _ref3) {
    var skip = _ref3.skip,
        size = _ref3.size;
    var query, total, list;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            query = {
              $or: [{ name: { $regex: regex } }, { shortcut: { $regex: regex } }]
            };
            _context2.prev = 1;
            total = void 0, list = void 0;
            _context2.next = 5;
            return Proj.count(query);

          case 5:
            total = _context2.sent;
            _context2.next = 8;
            return Proj.cfind(query).sort({ name: 1 }).skip(skip).limit(size).exec();

          case 8:
            list = _context2.sent;
            return _context2.abrupt('return', {
              list: list,
              total: total
            });

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2['catch'](1);
            throw _context2.t0;

          case 15:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[1, 12]]);
  }));

  return function searchProject(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var searchApi = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(regex, _ref5) {
    var skip = _ref5.skip,
        size = _ref5.size;
    var query, total, list;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            query = {
              $or: [{ name: { $regex: regex } }, { description: { $regex: regex } }]
            };
            _context3.prev = 1;
            total = void 0, list = void 0;
            _context3.next = 5;
            return ApiBase.count(query);

          case 5:
            total = _context3.sent;
            _context3.next = 8;
            return ApiBase.cfind(query).sort({ name: 1 }).skip(skip).limit(size).exec();

          case 8:
            list = _context3.sent;
            return _context3.abrupt('return', {
              list: list,
              total: total
            });

          case 12:
            _context3.prev = 12;
            _context3.t0 = _context3['catch'](1);
            throw _context3.t0;

          case 15:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[1, 12]]);
  }));

  return function searchApi(_x5, _x6) {
    return _ref4.apply(this, arguments);
  };
}();

var searchLib = function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(regex, _ref7) {
    var skip = _ref7.skip,
        size = _ref7.size;
    var query, total, list;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            query = {
              $or: [{ name: { $regex: regex } }, { description: { $regex: regex } }]
            };
            _context4.prev = 1;
            total = void 0, list = void 0;
            _context4.next = 5;
            return Lib.count(query);

          case 5:
            total = _context4.sent;
            _context4.next = 8;
            return Lib.cfind(query).sort({ name: 1 }).skip(skip).limit(size).exec();

          case 8:
            list = _context4.sent;
            return _context4.abrupt('return', {
              list: list,
              total: total
            });

          case 12:
            _context4.prev = 12;
            _context4.t0 = _context4['catch'](1);
            throw _context4.t0;

          case 15:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[1, 12]]);
  }));

  return function searchLib(_x7, _x8) {
    return _ref6.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = require('../database');
var Proj = db.project;
var ApiBase = db.apiBase;
var Lib = db.Lib;

module.exports = {
  search: search
};

var searchAction = {
  project: searchProject,
  api: searchApi,
  lib: searchLib
};