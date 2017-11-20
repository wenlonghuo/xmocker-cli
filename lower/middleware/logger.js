'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var timer = require('../util/timer');
var isDev = process.env.NODE_ENV === 'development';
var chalk = isDev ? require('chalk') : null;

var level = 10;
var logList = {
  DEBUG: 12,
  INFO: 8,
  PROXY: 6,
  ERROR: 2
};
var TEAM_LEN = 10000;
var SAVE_LEN = 5000;
var DELAY = 100;

var stringify = require('../util/stringify');
var formatCtx = require('../util/formatCtx');
var db = require('../database');

function time() {
  var str = '[' + timer() + '] ';
  return isDev ? chalk.yellow(str) : str;
}

var logQueue = {
  error: [],
  info: [],
  record: [],
  proxy: [],
  logging: false,
  push: function push(type, obj) {
    var queueName = type;
    var queue = this[queueName];
    if (!queue) {
      console.error('队列不存在' + queueName);
      return;
    }
    if (queue.length > TEAM_LEN) queue.splice(queue.length - TEAM_LEN, queue.length);
    queue.push(obj);
    if (!this.logging) this.exector();
  },
  exector: function exector() {
    var _this = this;

    return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
      var data;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this.logging = true;

              if (_this.length) {
                _context.next = 4;
                break;
              }

              _this.logging = false;
              return _context.abrupt('return');

            case 4:
              _context.next = 6;
              return _this.delay(DELAY);

            case 6:
              data = void 0;
              _context.prev = 7;
              _context.next = 10;
              return _this.saveLogs();

            case 10:
              data = _context.sent;
              _context.next = 16;
              break;

            case 13:
              _context.prev = 13;
              _context.t0 = _context['catch'](7);

              console.error(_context.t0);

            case 16:
              if (data && _this.length) {
                _this.exector();
              } else {
                _this.logging = false;
              }

            case 17:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this, [[7, 13]]);
    }))();
  },
  delay: function delay(time) {
    var _this2 = this;

    return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt('return', new _promise2.default(function (resolve) {
                setTimeout(function () {
                  resolve();
                }, ~~time);
              }));

            case 1:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this2);
    }))();
  },
  saveLogs: function saveLogs() {
    var _this3 = this;

    return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
      var error, info, record, proxy;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return _this3.save2Db(db.errorDB, _this3.error);

            case 3:
              error = _context3.sent;
              _context3.next = 6;
              return _this3.save2Db(db.hisDB, _this3.info);

            case 6:
              info = _context3.sent;
              _context3.next = 9;
              return _this3.save2Db(db.recordDB, _this3.record);

            case 9:
              record = _context3.sent;
              _context3.next = 12;
              return _this3.save2Db(db.proxyDB, _this3.proxy);

            case 12:
              proxy = _context3.sent;
              return _context3.abrupt('return', { error: error, info: info, record: record, proxy: proxy });

            case 16:
              _context3.prev = 16;
              _context3.t0 = _context3['catch'](0);
              throw _context3.t0;

            case 19:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, _this3, [[0, 16]]);
    }))();
  },

  get length() {
    return this.error.length + this.info.length + this.record.length + this.proxy.length;
  },
  save2Db: function save2Db(DbName, queue) {
    var _this4 = this;

    return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
      var list, time, data, p;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (queue.length) {
                _context4.next = 2;
                break;
              }

              return _context4.abrupt('return');

            case 2:
              list = queue.splice(0, SAVE_LEN);
              time = new Date();
              data = void 0;
              _context4.prev = 5;
              p = _promise2.default.race([DbName.insert(list), _this4.delay(60 * 1000)]);
              _context4.next = 9;
              return p;

            case 9:
              data = _context4.sent;
              _context4.next = 15;
              break;

            case 12:
              _context4.prev = 12;
              _context4.t0 = _context4['catch'](5);
              throw _context4.t0;

            case 15:
              if (data) {
                _context4.next = 18;
                break;
              }

              console.error('保存数据库超时:' + DbName.filename);
              return _context4.abrupt('return');

            case 18:
              return _context4.abrupt('return', { len: data.length, left: queue.length, time: new Date() - time });

            case 19:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, _this4, [[5, 12]]);
    }))();
  }
};

var Logger = function () {
  function Logger(ctx) {
    (0, _classCallCheck3.default)(this, Logger);

    this.ctx = ctx;
  }

  (0, _createClass3.default)(Logger, [{
    key: 'debug',
    value: function debug() {
      if (level >= logList.DEBUG) {
        var str = this.convert2Str.apply(this, arguments);
        console.log(str);
      }
    }
  }, {
    key: 'info',
    value: function info() {
      if (level >= logList.INFO) {
        logQueue.push('info', arguments[0]);
      }
      if (isDev) {
        var str = this.convert2Str.apply(this, arguments);
        console.log(str);
      }
    }
  }, {
    key: 'proxy',
    value: function proxy() {
      if (level >= logList.PROXY) {
        logQueue.push('proxy', arguments[0]);
        if (!isDev) return;
      }
      if (isDev) {
        var str = this.convert2Str.apply(this, arguments);
        console.log(str);
      }
    }
  }, {
    key: 'error',
    value: function error() {
      if (level >= logList.ERROR) {
        logQueue.push('error', arguments[0]);
        if (!isDev) return;
        var str = this.convert2Str.apply(this, arguments);
        console.error(str);
      }
    }
  }, {
    key: 'record',
    value: function record() {
      logQueue.push('record', arguments[0]);
    }
  }, {
    key: 'convert2Str',
    value: function convert2Str() {
      if (isDev && (0, _typeof3.default)(arguments[0]) === 'object' && arguments[0]) delete arguments[0].res;
      return stringify.apply(undefined, [time()].concat(Array.prototype.slice.call(arguments)));
    }
  }, {
    key: 'getErrorInfo',
    value: function getErrorInfo() {
      var message = void 0;
      var data = {
        info: '',
        err: {}
      };
      var arg = arguments;
      if (typeof arguments[0] === 'string') {
        message = arguments[0];
        arg = [].slice.call(arg, 1);
      }
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(arg), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var obj = _step.value;

          if (obj instanceof Error) {
            data.err = {
              msg: obj.message,
              stack: obj.stack
            };
          } else {
            data.info += (0, _stringify2.default)(obj);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return {
        time: timer(),
        message: message,
        data: data
      };
    }
  }]);
  return Logger;
}();

global.logger = new Logger();

module.exports = function () {
  return function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(ctx, next) {
      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              ctx.logger = new Logger(ctx);
              ctx.info = ctx.info || {};

              return _context5.abrupt('return', next().then(function () {
                if (ctx.status >= 300) return;
                if (ctx.info.record) {
                  var info = formatCtx(ctx, ctx.info && ctx.info.message || ctx.body && ctx.body.message, ctx.info);
                  (0, _assign2.default)(info, ctx.info.record);
                  info.new = ctx.info.record.new || ctx.body;
                  info.message = ctx.info.record.message || ctx.body && ctx.body.message;
                  ctx.logger.record(info);
                } else {
                  var obj = formatCtx(ctx, ctx.info && ctx.info.message || ctx.body && ctx.body.message, ctx.info);
                  var code = obj.res && obj.res.code;
                  if (code) {
                    ctx.logger.error(obj);
                  }
                }
              }));

            case 3:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    function logger(_x, _x2) {
      return _ref.apply(this, arguments);
    }

    return logger;
  }();
};
module.exports.Logger = Logger;