'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = require('./index.js');
var controller = router.controller.appBase;
var formatParam = router.formatParam;
var inspect = require('util').inspect;

router.get('/online', controller.online);

router.get('/reloadDatabase', controller.reloadDatabase);

router.get('/appBase', formatParam, controller.getAppBase);

router.put('/appBase', formatParam, controller.editAppBase);

router.put('/upgradeV0', formatParam, controller.upgradeFromV0);

router.put('/killMain', function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            process.exit(1);

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

router.get('/appStatus', formatParam, controller.getAppStatus);

router.post('/error', function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(ctx, next) {
    var time;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            time = new Date().toLocaleTimeString();

            console.log('\n[' + time + '] \u7F51\u9875\u51FA\u73B0\u9519\u8BEF\u5566\uFF0C\u4E0B\u9762\u662F\u9519\u8BEF\u4FE1\u606F ~~~');
            console.log(inspect(ctx.request.body, { colors: true, depth: null }));
            ctx.body = 'ok';

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());