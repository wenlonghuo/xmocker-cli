'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var getProject = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(option) {
    var quene, index, doc, id;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            quene = [{ name: 'apiModel', key: 'baseid' }, { name: 'apiBase', key: 'project' }, { name: 'project', key: '_id' }];
            index = quene.findIndex(function (q) {
              return q.name === option.type;
            });
            doc = void 0;
            id = option.id;

          case 4:
            if (!(index < quene.length && index >= 0 && id)) {
              _context4.next = 14;
              break;
            }

            _context4.next = 7;
            return getDocById(quene[index].name, id).catch(function (e) {
              throw e;
            });

          case 7:
            doc = _context4.sent;

            if (doc) {
              _context4.next = 10;
              break;
            }

            throw new Error('cannot find doc by id : ' + id);

          case 10:
            id = doc[quene[index].key];
            index++;
            _context4.next = 4;
            break;

          case 14:
            if (!procList.find(function (proc) {
              return proc.id === doc._id;
            })) {
              _context4.next = 16;
              break;
            }

            return _context4.abrupt('return', doc);

          case 16:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function getProject(_x3) {
    return _ref4.apply(this, arguments);
  };
}();

var getDocById = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(collection, id) {
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return db[collection].cfindOne({ _id: id }).exec();

          case 2:
            return _context5.abrupt('return', _context5.sent);

          case 3:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function getDocById(_x4, _x5) {
    return _ref5.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = require('../database');

var serviceProc = require('./service.proc.js');
var getProcById = serviceProc.getProcById;
var procList = serviceProc.state.proc;

var ExecQuene = function () {
  function ExecQuene(func) {
    (0, _classCallCheck3.default)(this, ExecQuene);

    this.exector = func;
    this.state = 0;
    this.team = _promise2.default.resolve();
    this.add = this.add.bind(this);
  }

  (0, _createClass3.default)(ExecQuene, [{
    key: 'add',
    value: function add() {
      var _this = this,
          _arguments = arguments;

      this.team.then((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _this.exector.apply(_this, _arguments);

              case 2:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      })));
    }
  }]);
  return ExecQuene;
}();

var reload = new ExecQuene(function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(option) {
    var type, info, proc;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            type = option.type;
            _context2.next = 3;
            return getProject(option);

          case 3:
            info = _context2.sent;

            if (info) {
              _context2.next = 7;
              break;
            }

            console.error('[!!!!error] 获取信息信息失败，配置为:', (0, _stringify2.default)(option));
            return _context2.abrupt('return');

          case 7:
            proc = getProcById(info._id);

            if (proc) {
              _context2.next = 10;
              break;
            }

            return _context2.abrupt('return');

          case 10:
            proc.reloadApis([type]);

          case 11:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}());

var restart = new ExecQuene(function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(option) {
    var info;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return getProject(option);

          case 3:
            info = _context3.sent;

            if (info) serviceProc.addToRestart(info, option).catch(function (e) {
              return console.log(info, option, e);
            });
            _context3.next = 10;
            break;

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3['catch'](0);

            console.log(_context3.t0);

          case 10:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[0, 7]]);
  }));

  return function (_x2) {
    return _ref3.apply(this, arguments);
  };
}());

module.exports = {
  reload: reload,
  restart: restart
};