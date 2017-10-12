'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var uaParser = require('ua-parser-js');
var isDev = process.env.NODE_ENV === 'development';
var timer = require('./timer');

function baseInfo(ctx) {
  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var ua = uaParser(ctx.headers['user-agent']);

  var msg = {
    time: timer(),
    req: {
      method: ctx.method,
      path: ctx.path,
      url: ctx.url,
      href: ctx.request.header['referer']
    },
    ip: ctx.ip,
    client: ua
  };
  return msg;
}

module.exports = function formatCtx(ctx, message) {
  var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var e = option.e;
  var params = (0, _assign2.default)({}, ctx.params, ctx.query, ctx.request.body);

  var msg = baseInfo(ctx, option);
  msg.reqParsed = params;
  msg.res = ctx.body;
  msg.message = message;
  if (e) {
    msg.err = {
      msg: e.message,
      stack: e.stack
    };
  }

  if (!isDev && option.forbidReq) {
    var keys = option.forbidReq.split(' ');
    keys.forEach(function (key) {
      delete msg.req[key];
    });
  }
  if (!isDev && option.forbidRes) {
    msg = (0, _assign2.default)({}, msg, { req: undefined });
  }
  return msg;
};

module.exports.baseInfo = baseInfo;