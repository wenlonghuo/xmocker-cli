'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function logError(ctx, code, msg) {
  var option = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if ((typeof msg === 'undefined' ? 'undefined' : (0, _typeof3.default)(msg)) === 'object' || msg == null) {
    option = msg || {};
    msg = code;
    code = -1;
  }
  ctx.info.e = option.e;
  ctx.body = {
    code: code,
    message: msg
  };
}

function success(ctx, msg, data) {
  ctx.info.message = msg;
  ctx.body = {
    code: 0,
    message: msg,
    data: data
  };
}

module.exports = function () {
  return function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              ctx.info = ctx.info || {};
              ctx.respond = ctx.respond || {};
              ctx.respond.success = success.bind(ctx, ctx);
              ctx.respond.error = logError.bind(ctx, ctx);
              return _context.abrupt('return', next());

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function sendMessage(_x2, _x3) {
      return _ref.apply(this, arguments);
    }

    return sendMessage;
  }();
};