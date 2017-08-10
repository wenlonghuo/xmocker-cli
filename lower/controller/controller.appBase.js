'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var online = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            ctx.body = {
              code: 0,
              data: 'online'
            };
            return _context.abrupt('return', next());

          case 2:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function online(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var reloadDatabase = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(ctx, next) {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            (0, _keys2.default)(db).forEach(function (name) {
              if (db[name].loadDatabase) {
                db[name].loadDatabase();
              }
            });
            ctx.respond.success('重载成功');

          case 2:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function reloadDatabase(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var getAppStatus = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(ctx, next) {
    var procInfo;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            procInfo = [];

            processList.forEach(function (proc) {
              procInfo.push({
                procInfo: proc.proj,
                createdTime: proc.createdTime,
                pid: proc.pid,
                status: proc.status
              });
            });
            procInfo.sort(function (a, b) {
              return a.procInfo.name > b.procInfo.name;
            });
            ctx.respond.success('获取状态成功', { runningProject: procInfo });

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function getAppStatus(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var getAppBase = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(ctx, next) {
    var finalParams, result;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            finalParams = ctx.finalParams;
            result = void 0;
            _context4.prev = 2;
            _context4.next = 5;
            return AppBase.cfindOne(finalParams).exec();

          case 5:
            result = _context4.sent;
            _context4.next = 11;
            break;

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4['catch'](2);
            return _context4.abrupt('return', ctx.respond.error('查询基础信息出错', { e: _context4.t0 }));

          case 11:
            ctx.respond.success('获取app基础信息成功', { result: result });

          case 12:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[2, 8]]);
  }));

  return function getAppBase(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var editAppBase = function () {
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
            return AppBase.update({}, { $set: finalParams }, { returnUpdatedDocs: true, upsert: true });

          case 5:
            result = _context5.sent;

            result = result[1];
            _context5.next = 12;
            break;

          case 9:
            _context5.prev = 9;
            _context5.t0 = _context5['catch'](2);
            return _context5.abrupt('return', ctx.respond.error('保存基础信息出错', { e: _context5.t0 }));

          case 12:

            ctx.respond.success('更新基础信息成功', { result: result });

          case 13:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this, [[2, 9]]);
  }));

  return function editAppBase(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

var upgradeFromV0 = function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(ctx, next) {
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return upgrade();

          case 3:
            _context6.next = 8;
            break;

          case 5:
            _context6.prev = 5;
            _context6.t0 = _context6['catch'](0);
            return _context6.abrupt('return', ctx.respond.error('更新失败，请查看日志' + _context6.t0.message, { e: _context6.t0 }));

          case 8:
            ctx.respond.success('导入成功', {});

          case 9:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this, [[0, 5]]);
  }));

  return function upgradeFromV0(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = require('../database');
var AppBase = db.appBase;

var service = require('../service');
var processList = service.proc.state.proc;
var upgrade = service.upgrade.upgradeFromV0;

module.exports = {
  getAppBase: getAppBase,
  editAppBase: editAppBase,
  getAppStatus: getAppStatus,
  online: online,
  reloadDatabase: reloadDatabase,
  upgradeFromV0: upgradeFromV0
};