'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getLibDetail = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {
    var finalParams, result;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            finalParams = ctx.finalParams;
            result = void 0;
            _context.prev = 2;
            _context.next = 5;
            return Lib.cfindOne({ _id: finalParams.id }).exec();

          case 5:
            result = _context.sent;
            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context['catch'](2);
            return _context.abrupt('return', ctx.respond.error('查询lib详细信息出错', { e: _context.t0 }));

          case 11:

            ctx.respond.success('获取Lib详情成功', { result: result });
            return _context.abrupt('return', next());

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[2, 8]]);
  }));

  return function getLibDetail(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var getLibList = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(ctx, next) {
    var finalParams, size, no, skip, data, total, res;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            finalParams = ctx.finalParams;
            size = ~~finalParams.pageSize;
            no = ~~finalParams.pageNo;
            skip = ~~(size * no);


            delete finalParams.pageSize;
            delete finalParams.pageNo;

            data = void 0, total = void 0;
            _context2.prev = 7;
            _context2.next = 10;
            return Lib.count(finalParams);

          case 10:
            total = _context2.sent;
            _context2.next = 13;
            return Lib.cfind(finalParams).sort({ name: 1 }).skip(skip).limit(size).exec();

          case 13:
            data = _context2.sent;
            _context2.next = 19;
            break;

          case 16:
            _context2.prev = 16;
            _context2.t0 = _context2['catch'](7);
            return _context2.abrupt('return', ctx.respond.error('查询lib出错', { e: _context2.t0 }));

          case 19:
            res = {
              list: data,
              pagination: {
                total: total,
                pageCnt: Math.ceil(total / size),
                pageNo: no
              }
            };

            ctx.respond.success('获取lib列表成功', res);

          case 21:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[7, 16]]);
  }));

  return function getLibList(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var searchLib = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(ctx, next) {
    var finalParams, size, no, skip, words, type, regex, query, data, total, res;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            finalParams = ctx.finalParams;
            size = ~~finalParams.pageSize;
            no = ~~finalParams.pageNo;
            skip = ~~(size * no);


            delete finalParams.pageSize;
            delete finalParams.pageNo;

            words = finalParams.words;
            type = finalParams.type;
            regex = new RegExp(words, 'i');
            query = {
              type: type,
              name: { $regex: regex }
            };
            data = void 0, total = void 0;
            _context3.prev = 11;
            _context3.next = 14;
            return Lib.count(query);

          case 14:
            total = _context3.sent;
            _context3.next = 17;
            return Lib.cfind(query).sort({ name: 1 }).skip(skip).limit(size).exec();

          case 17:
            data = _context3.sent;
            _context3.next = 23;
            break;

          case 20:
            _context3.prev = 20;
            _context3.t0 = _context3['catch'](11);
            return _context3.abrupt('return', ctx.respond.error('搜索API出错', { e: _context3.t0 }));

          case 23:
            res = {
              list: data,
              pagination: {
                total: total,
                pageCnt: Math.ceil(total / size),
                pageNo: no
              }
            };

            ctx.respond.success('搜索成功', res);

          case 25:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[11, 20]]);
  }));

  return function searchLib(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var addLib = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(ctx, next) {
    var finalParams, result;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            finalParams = ctx.finalParams;
            result = void 0;
            _context4.prev = 2;

            finalParams._uid = uid();
            finalParams._mt = +new Date();
            _context4.next = 7;
            return Lib.insert(finalParams);

          case 7:
            result = _context4.sent;
            _context4.next = 13;
            break;

          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4['catch'](2);
            return _context4.abrupt('return', ctx.respond.error('添加lib出错', { e: _context4.t0 }));

          case 13:

            ctx.respond.success('添加Lib成功', { result: result });

          case 14:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[2, 10]]);
  }));

  return function addLib(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var editLib = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(ctx, next) {
    var finalParams, id, result;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            finalParams = ctx.finalParams;
            id = finalParams.id;

            delete finalParams.id;

            result = void 0;
            _context5.prev = 4;

            finalParams._mt = +new Date();
            _context5.next = 8;
            return Lib.update({ _id: id }, { $set: finalParams }, { returnUpdatedDocs: true });

          case 8:
            result = _context5.sent;

            result = result[1];
            _context5.next = 15;
            break;

          case 12:
            _context5.prev = 12;
            _context5.t0 = _context5['catch'](4);
            return _context5.abrupt('return', ctx.respond.error('编辑lib出错', { e: _context5.t0 }));

          case 15:
            ctx.respond.success('编辑Lib成功', { result: result });

          case 16:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this, [[4, 12]]);
  }));

  return function editLib(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

var deleteLib = function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(ctx, next) {
    var finalParams, result;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            finalParams = ctx.finalParams;
            result = void 0;
            _context6.prev = 2;
            _context6.next = 5;
            return Lib.remove({ _id: finalParams.id }, { multi: true });

          case 5:
            result = _context6.sent;
            _context6.next = 11;
            break;

          case 8:
            _context6.prev = 8;
            _context6.t0 = _context6['catch'](2);
            return _context6.abrupt('return', ctx.respond.error('删除api基础信息出错', { e: _context6.t0 }));

          case 11:
            ctx.respond.success('删除成功', { result: result });

          case 12:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this, [[2, 8]]);
  }));

  return function deleteLib(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = require('../database');
var Lib = db.Lib;

var uid = require('../util/common').uid();

module.exports = {
  getLibDetail: getLibDetail,
  getLibList: getLibList,
  searchLib: searchLib,
  addLib: addLib,
  editLib: editLib,
  deleteLib: deleteLib
};