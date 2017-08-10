'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Koa = require('koa');
var app = new Koa();
var http = require('http');
var path = require('path');

var bodyParser = require('koa-bodyparser');

var startTime = new Date();

var sendFile = require('./plugin/file-server.js');
var db = require('./database');
var ws = require('./service/service.ws.js');
var router = require('./router');
var respond = require('./middleware/respond');
var logger = require('./middleware/logger');
var argv = require('minimist')(process.argv.slice(2));

var appPORT = void 0;

app.proxy = true;

app.use(bodyParser());

app.use(function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            ctx.set({
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, OPTIONS'
            });
            return _context.abrupt('return', next().then(sendFile(ctx, ctx.path, { root: path.join(__dirname, '../web/dist/'), index: 'index.html' })));

          case 2:
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

app.use(logger());
app.use(respond());

app.use(router.routes());

var httpServer = http.createServer(app.callback());

ws(httpServer);

db.appBase.cfindOne({}).exec().then(function (doc) {
  doc = doc || {};
  appPORT = doc.managePort || 6001;


  httpServer.listen(appPORT, function (e) {
    console.log('后台管理界面运行于: http://localhost:%s', appPORT, '耗时：', new Date() - startTime, 'ms');
  });

  var queryObj = {};
  var projs = argv.proj;
  if (projs) {
    projs = Array.isArray(projs) ? projs : [projs];
    queryObj.$or = [{ name: { $in: projs } }, { shortcut: { $in: projs } }];
  } else {
    return;
  }

  db.project.cfind(queryObj).exec().then(function (docs) {
    if (!docs) {
      console.log('未找到需要启动的项目');
      return;
    }
    var start = require('./service/service.proc').addToRestart;
    docs.forEach(function (p) {
      return start(p);
    });
  });
});

process.on('unhandledRejection', function (e) {
  throw e;
});