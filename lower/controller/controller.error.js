'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var errorUpload = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {
    var finalParams, data;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            finalParams = ctx.finalParams;
            _context.prev = 1;
            data = formatCtx(ctx, finalParams.message);

            data.err = {
              msg: finalParams.message,
              source: finalParams.source,
              lineno: finalParams.lineno,
              stack: finalParams.stack,
              colno: finalParams.colno
            };
            _context.next = 6;
            return db.collectorDB.insert(data);

          case 6:
            broadcast({ type: 'log', action: 'ADD_LOGS', logType: 'collector', data: data });
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](1);
            return _context.abrupt('return', ctx.respond.error('保存错误信息出错', { e: _context.t0 }));

          case 12:
            ctx.respond.success('提交成功');

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 9]]);
  }));

  return function errorUpload(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = require('../database');
var formatCtx = require('../util/formatCtx');
var broadcast = require('../service/service.ws').broadcast;

module.exports = {
  errorUpload: errorUpload
};