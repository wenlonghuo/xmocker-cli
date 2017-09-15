'use strict';

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
    var finalParams, data;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            finalParams = ctx.finalParams;
            _context2.prev = 1;
            _context2.next = 4;
            return apiGet.getModelByQuery({ baseid: finalParams.baseid }, finalParams);

          case 4:
            data = _context2.sent;
            return _context2.abrupt('return', ctx.respond.success('获取分支列表成功', data));

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2['catch'](1);
            return _context2.abrupt('return', ctx.respond.error('分支列表出错', { e: _context2.t0 }));

          case 11:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[1, 8]]);
  }));

  return function getApiModelList(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var addApiModel = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(ctx, next) {
    var finalParams, data;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            finalParams = ctx.finalParams;
            _context3.prev = 1;
            _context3.next = 4;
            return apiEdit.addModel(finalParams, true);

          case 4:
            data = _context3.sent;

            if (!data.code) {
              _context3.next = 7;
              break;
            }

            return _context3.abrupt('return', ctx.respond.error(data));

          case 7:
            return _context3.abrupt('return', ctx.respond.success('添加API分支成功', { result: data.data }));

          case 10:
            _context3.prev = 10;
            _context3.t0 = _context3['catch'](1);
            return _context3.abrupt('return', ctx.respond.error('添加api分支信息出错', { e: _context3.t0 }));

          case 13:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[1, 10]]);
  }));

  return function addApiModel(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var editApiModel = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(ctx, next) {
    var finalParams, id, data;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            finalParams = ctx.finalParams;
            id = finalParams.id;

            delete finalParams.id;
            data = void 0;
            _context4.prev = 4;
            _context4.next = 7;
            return apiEdit.editModel(id, finalParams);

          case 7:
            data = _context4.sent;

            if (!data.code) {
              _context4.next = 10;
              break;
            }

            return _context4.abrupt('return', ctx.respond.error(data));

          case 10:
            return _context4.abrupt('return', ctx.respond.success('编辑API分支成功', { result: data.data }));

          case 13:
            _context4.prev = 13;
            _context4.t0 = _context4['catch'](4);
            return _context4.abrupt('return', ctx.respond.error('编辑api分支信息出错', { e: _context4.t0 }));

          case 16:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[4, 13]]);
  }));

  return function editApiModel(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var deleteApiModel = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(ctx, next) {
    var finalParams, data;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            finalParams = ctx.finalParams;
            data = void 0;
            _context5.prev = 2;
            _context5.next = 5;
            return apiEdit.deleteModel(finalParams.id);

          case 5:
            data = _context5.sent;

            if (!data.code) {
              _context5.next = 8;
              break;
            }

            return _context5.abrupt('return', ctx.respond.error(data));

          case 8:
            return _context5.abrupt('return', ctx.respond.success('删除API分支成功', { result: data.data }));

          case 11:
            _context5.prev = 11;
            _context5.t0 = _context5['catch'](2);
            return _context5.abrupt('return', ctx.respond.error('删除api分支信息出错', { e: _context5.t0 }));

          case 14:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this, [[2, 11]]);
  }));

  return function deleteApiModel(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = require('../database');
var ApiModel = db.apiModel;

var apiGet = require('../service/api/service.get');
var apiEdit = require('../service/api/service.edit');

module.exports = {
  getApiModel: getApiModel,
  addApiModel: addApiModel,
  editApiModel: editApiModel,
  deleteApiModel: deleteApiModel,
  getApiModelList: getApiModelList
};