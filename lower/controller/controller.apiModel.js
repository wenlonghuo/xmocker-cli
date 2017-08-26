'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getApiModel = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {
    var finalParams, list;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            finalParams = ctx.finalParams;
            list = void 0;
            _context.prev = 2;
            _context.next = 5;
            return ApiModel.cfind(finalParams).exec();

          case 5:
            list = _context.sent;
            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context['catch'](2);
            return _context.abrupt('return', ctx.respond.error('查询api分支信息出错', { e: _context.t0 }));

          case 11:

            ctx.respond.success('获取分支成功', { list: list });

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[2, 8]]);
  }));

  return function getApiModel(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var getApiModelList = function () {
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
            return ApiModel.count(finalParams);

          case 10:
            total = _context2.sent;
            _context2.next = 13;
            return ApiModel.cfind(finalParams).sort({ name: 1 }).skip(skip).limit(size).exec();

          case 13:
            data = _context2.sent;
            _context2.next = 19;
            break;

          case 16:
            _context2.prev = 16;
            _context2.t0 = _context2['catch'](7);
            return _context2.abrupt('return', ctx.respond.error('查询api基础信息出错', { e: _context2.t0 }));

          case 19:
            res = {
              list: data,
              pagination: {
                total: total,
                pageCnt: Math.ceil(total / size),
                pageNo: no
              }
            };

            ctx.respond.success('获取分支列表成功', res);

          case 21:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[7, 16]]);
  }));

  return function getApiModelList(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var addApiModel = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(ctx, next) {
    var finalParams, result;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            finalParams = ctx.finalParams;
            result = void 0;
            _context3.prev = 2;

            finalParams._uid = uid();
            finalParams._mt = +new Date();
            if (finalParams.data) finalParams.data = (0, _stringify2.default)(finalParams.data);
            _context3.next = 8;
            return ApiBase.update({ _id: finalParams.baseid }, { $set: { _mt: +new Date() } });

          case 8:
            _context3.next = 10;
            return ApiModel.insert(finalParams);

          case 10:
            result = _context3.sent;
            _context3.next = 16;
            break;

          case 13:
            _context3.prev = 13;
            _context3.t0 = _context3['catch'](2);
            return _context3.abrupt('return', ctx.respond.error('添加api分支信息出错', { e: _context3.t0 }));

          case 16:
            reloadDatabase({ type: 'apiModel', id: result._id });

            ctx.respond.success('添加api分支成功', { result: result });

          case 18:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[2, 13]]);
  }));

  return function addApiModel(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var editApiModel = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(ctx, next) {
    var finalParams, id, result;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            finalParams = ctx.finalParams;
            id = finalParams.id;

            delete finalParams.id;
            result = void 0;
            _context4.prev = 4;

            finalParams._mt = +new Date();
            if (finalParams.data) finalParams.data = (0, _stringify2.default)(finalParams.data);
            _context4.next = 9;
            return ApiModel.update({ _id: id }, { $set: finalParams }, { returnUpdatedDocs: true });

          case 9:
            result = _context4.sent;


            result = result[1];
            _context4.next = 13;
            return ApiBase.update({ _id: result.baseid }, { $set: { _mt: +new Date() } });

          case 13:
            _context4.next = 18;
            break;

          case 15:
            _context4.prev = 15;
            _context4.t0 = _context4['catch'](4);
            return _context4.abrupt('return', ctx.respond.error('编辑api分支信息出错', { e: _context4.t0 }));

          case 18:
            reloadDatabase({ type: 'apiModel', id: id });

            ctx.respond.success('编辑api分支成功', { result: result });

          case 20:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[4, 15]]);
  }));

  return function editApiModel(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var deleteApiModel = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(ctx, next) {
    var finalParams, result;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            finalParams = ctx.finalParams;
            result = void 0;
            _context5.prev = 2;
            _context5.next = 5;
            return ApiModel.remove({ _id: finalParams.id }, { multi: true });

          case 5:
            result = _context5.sent;
            _context5.next = 11;
            break;

          case 8:
            _context5.prev = 8;
            _context5.t0 = _context5['catch'](2);
            return _context5.abrupt('return', ctx.respond.error('删除api分支信息出错', { e: _context5.t0 }));

          case 11:

            ctx.respond.success('编辑api分支成功', { result: result });

          case 12:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this, [[2, 8]]);
  }));

  return function deleteApiModel(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = require('../database');
var ApiModel = db.apiModel;
var ApiBase = db.apiBase;

var uid = require('../util/common').uid();
var reloadDatabase = require('../service/service.ctrlProc').reload.add;

module.exports = {
  getApiModel: getApiModel,
  addApiModel: addApiModel,
  editApiModel: editApiModel,
  deleteApiModel: deleteApiModel,
  getApiModelList: getApiModelList
};