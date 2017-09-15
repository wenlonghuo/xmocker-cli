'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var start = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(proj) {
    var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var info, index;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(!proj || !proj.port)) {
              _context.next = 2;
              break;
            }

            throw new Error('项目不存在或项目端口不存在');

          case 2:
            if (option.force) {
              _context.next = 7;
              break;
            }

            info = getChangedConfig(proj);

            if (!info) {
              _context.next = 7;
              break;
            }

            info.proc.proj = proj;
            return _context.abrupt('return', info.proc.reconfig(info.option));

          case 7:
            if (!isStarted(proj)) {
              _context.next = 10;
              break;
            }

            _context.next = 10;
            return stop(proj, option);

          case 10:
            index = getProcIndex(state.proc, proj);

            if (~index) state.proc.splice(index, 1);
            return _context.abrupt('return', startMocker(proj, option));

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function start(_x) {
    return _ref.apply(this, arguments);
  };
}();

var stop = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(proj) {
    var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var index, proc, message;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            index = state.proc.findIndex(function (proc) {
              return proc.id === proj._id;
            });
            proc = void 0;

            if (~index) {
              if (option.force) {
                proc = state.proc.splice(index, 1)[0];
              } else {
                proc = state.proc[index];
              }
            }

            if (!(!proc || !proc.status)) {
              _context2.next = 6;
              break;
            }

            message = '项目尚未启动：[' + proj.name + '] ' + ', 端口号: ' + proj.port;
            throw message;

          case 6:

            removeGulp(proj, state.gulp, option);
            return _context2.abrupt('return', proc.exit().then(function (mock) {
              console.log('项目退出成功：[' + proj.name + '] ' + ', 端口号: ' + proj.port);
            }));

          case 8:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function stop(_x3) {
    return _ref2.apply(this, arguments);
  };
}();

var restartExector = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
    var handle, list, proj, force, option;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            handle = handleTeam.shift();
            list = handle.list, proj = handle.proj;
            force = handle.list.some(function (hd) {
              return hd.option.force;
            });
            option = { force: force };
            _context3.prev = 4;
            _context3.next = 7;
            return start(proj, option);

          case 7:
            execGulp(proj, option);
            list.forEach(function (item) {
              item.resolve(proj);
            });
            _context3.next = 14;
            break;

          case 11:
            _context3.prev = 11;
            _context3.t0 = _context3['catch'](4);

            list.forEach(function (item) {
              item.reject(_context3.t0);
            });

          case 14:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[4, 11]]);
  }));

  return function restartExector() {
    return _ref3.apply(this, arguments);
  };
}();

var startMocker = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(proj) {
    var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var config, mocker;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!(!proj || !proj.port)) {
              _context4.next = 2;
              break;
            }

            throw new Error('项目不存在或项目端口不存在');

          case 2:
            config = {
              source: { type: 'database', projectId: proj._id }
            };
            mocker = new Mocker(config);

            mocker.id = proj._id;
            mocker.proj = proj;
            state.proc.push(mocker);

            return _context4.abrupt('return', mocker.start(log.mocker).then(function (config) {
              console.log('项目启动成功: [' + proj.name + '] , 进程id： ' + mocker.server.pid + ', 端口号：' + proj.port);
              return mocker;
            }).catch(function (e) {
              console.log('项目启动失败：[' + proj.name + '] , 进程id：' + mocker.server.pid + ', 端口号: ' + proj.port);
            }));

          case 8:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function startMocker(_x6) {
    return _ref4.apply(this, arguments);
  };
}();

var execGulp = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(proj) {
    var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var hasStarted, gOption, info, gulpPath, cwd, cmdGulp, gulpServer;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (proj.path) {
              _context5.next = 2;
              break;
            }

            return _context5.abrupt('return');

          case 2:
            _context5.next = 4;
            return removeGulp(proj, state.gulp, option);

          case 4:
            hasStarted = _context5.sent;

            if (!hasStarted) {
              _context5.next = 7;
              break;
            }

            return _context5.abrupt('return');

          case 7:
            gOption = proj.gulp;

            if ((0, _keys2.default)(gOption).length) {
              _context5.next = 10;
              break;
            }

            return _context5.abrupt('return');

          case 10:
            info = {
              injectHtml: proj.injectHtml,
              port: proj.port,
              gulp: proj.gulp,
              path: proj.path.trim()
            };
            gulpPath = gOption.path || path.join(__dirname, '../../tool/gulp');
            cwd = path.join(gulpPath, './node_modules/.bin');
            cmdGulp = '/bin/sh ./gulp';

            if (isWin) cmdGulp = 'gulp.cmd';
            gulpServer = spawn(cmdGulp, [proj.task || 'dev', '--option="' + convertCode((0, _stringify2.default)(info)) + '"'], {
              stdio: 'inherit',
              shell: true,
              cwd: cwd
            });


            state.gulp.push({ server: gulpServer, id: proj._id, proj: proj });
            gulpServer.on('error', function (e) {
              console.error(e);
            });

            return _context5.abrupt('return', gulpServer);

          case 19:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function execGulp(_x8) {
    return _ref5.apply(this, arguments);
  };
}();

var removeGulp = function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(proj, list) {
    var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var gulpIndex, gulp, gulpInfo;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            gulpIndex = list.findIndex(function (g) {
              return g.id === proj._id;
            });

            if (!~gulpIndex) {
              _context6.next = 18;
              break;
            }

            gulp = list[gulpIndex];
            gulpInfo = gulp.proj;

            if (!(_.isEqual(proj.gulp, gulpInfo.gulp) && proj.path === gulpInfo.path && proj.port === gulpInfo.port && proj.injectHtml === gulpInfo.injectHtml)) {
              _context6.next = 7;
              break;
            }

            if (option.force) {
              _context6.next = 7;
              break;
            }

            return _context6.abrupt('return', true);

          case 7:
            if (!gulp.server) {
              _context6.next = 18;
              break;
            }

            _context6.prev = 8;

            list.splice(gulpIndex, 1);
            _context6.next = 12;
            return fkill(gulp.server.pid, { force: true }).catch(function (err) {
              console.log(err);
            });

          case 12:
            _context6.next = 18;
            break;

          case 14:
            _context6.prev = 14;
            _context6.t0 = _context6['catch'](8);

            console.log(_context6.t0);
            console.log('结束gulpServer出错');

          case 18:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this, [[8, 14]]);
  }));

  return function removeGulp(_x10, _x11) {
    return _ref6.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isDev = process.env.NODE_ENV === 'development';
var spawn = require('child_process').spawn;
var path = require('path');
var _ = require('lodash');
var log = require('./service.log');
var fkill = require('fkill');
var Mocker = isDev ? require('../../xmocker') : require('xmocker');

var isWin = process.platform === 'win32';
var state = {
  proc: [],
  gulp: []
};

var executor = new _promise2.default(function (resolve) {
  resolve();
});
var handleTeam = [];

function addToRestart(proj) {
  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { force: false };

  if (!proj) return _promise2.default.reject('project doesnot exist');
  return new _promise2.default(function (resolve, reject) {
    var id = proj._id;
    var index = handleTeam.findIndex(function (p) {
      return p.id === id;
    });
    if (~index) {
      var info = handleTeam[index];
      info.proj = proj;
      info.list.push({ resolve: resolve, reject: reject, option: option });
    } else {
      handleTeam.push({ id: id, proj: proj, list: [{ resolve: resolve, reject: reject, option: option }] });
      executor = executor.then(restartExector);
    }
  });
}

function getProcIndex(list, proj) {
  if (!Array.isArray(list) || (typeof proj === 'undefined' ? 'undefined' : (0, _typeof3.default)(proj)) !== 'object') throw new Error('input is not legal');
  var samePort = list.find(function (item) {
    return item.proj && item.proj.port === proj.port && item.status > 1;
  });
  if (samePort && samePort.id !== proj._id) throw new Error('Conflict: same port ' + samePort.proj.name + '(' + samePort.proj.shortcut + '), please make sure the port is different!');
  return list.findIndex(function (item) {
    return item.id === proj._id;
  });
}

function isStarted(proj) {
  return ~state.proc.findIndex(function (item) {
    return item.id === proj._id && item.status > 1;
  });
}

function getChangedConfig(proj) {
  var proc = getProcById(proj._id);
  if (!proc || proc.status < 2) return;
  var oldProj = proc.proj;
  var needRestart = ['port', 'path', 'staticPath'].some(function (key) {
    return !_.isEqual(proj[key], oldProj[key]);
  });
  if (needRestart) return;

  var optKeys = [{ key: 'proxyTo', optKey: 'proxy404' }, { key: 'proxyMode', optKey: 'proxyType' }, { key: 'linkViews', optKey: 'urls' }, { key: 'inject', optKey: 'injectHtml' }, { key: 'proxyTable', optKey: 'proxyTable' }];
  var option = {};
  optKeys.forEach(function (op) {
    if (!_.isEqual(proj[op.optKey], oldProj[op.optKey])) option[op.key] = proj[op.optKey];
  });
  return { proc: proc, option: option };
}

function convertCode(param) {
  var p = param || '';
  return encodeURIComponent(p);
}

function getProcById(id) {
  return state.proc.find(function (item) {
    return item.id === id;
  });
}

module.exports = {
  addToRestart: addToRestart,
  start: start,
  stop: stop,
  state: state,
  getProcById: getProcById
};