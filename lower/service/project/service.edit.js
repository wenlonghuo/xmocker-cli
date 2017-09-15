'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var addProject = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(params) {
    var data, exist;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            data = void 0;
            _context.prev = 1;
            _context.next = 4;
            return projectGet.getExistProject(params, {});

          case 4:
            exist = _context.sent;

            if (!(exist.data && exist.data.length)) {
              _context.next = 7;
              break;
            }

            return _context.abrupt('return', { code: 1, msg: '项目简称和当前项目冲突', data: exist });

          case 7:
            params._uid = uid();
            params._mt = +new Date();
            _context.next = 11;
            return Project.insert(params);

          case 11:
            data = _context.sent;
            _context.next = 17;
            break;

          case 14:
            _context.prev = 14;
            _context.t0 = _context['catch'](1);
            throw _context.t0;

          case 17:
            return _context.abrupt('return', { code: 0, data: data });

          case 18:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 14]]);
  }));

  return function addProject(_x) {
    return _ref.apply(this, arguments);
  };
}();

var editProject = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(id, params) {
    var data, exist;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            data = void 0;
            _context2.prev = 1;
            _context2.next = 4;
            return projectGet.getExistProject(params, { id: id });

          case 4:
            exist = _context2.sent;

            if (!(exist.data && exist.data.length)) {
              _context2.next = 7;
              break;
            }

            return _context2.abrupt('return', { code: 1, msg: '项目简称和当前项目冲突', data: exist.data });

          case 7:
            params._mt = +new Date();
            _context2.next = 10;
            return Project.update({ _id: id }, { $set: params }, { returnUpdatedDocs: true, multi: true, upsert: true });

          case 10:
            data = _context2.sent;

            data = data[1];
            _context2.next = 17;
            break;

          case 14:
            _context2.prev = 14;
            _context2.t0 = _context2['catch'](1);
            throw _context2.t0;

          case 17:

            restart({ type: 'project', id: id });
            return _context2.abrupt('return', { code: 0, data: data });

          case 19:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[1, 14]]);
  }));

  return function editProject(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var deleteProject = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
    var ids = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var data, apis, apiIds;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            data = {};
            _context3.prev = 1;
            _context3.next = 4;
            return Project.remove({ _id: { $in: ids } });

          case 4:
            data.project = _context3.sent;
            _context3.next = 7;
            return ApiBase.cfind({ project: { $in: ids } }).exec();

          case 7:
            apis = _context3.sent;
            apiIds = apis.map(function (item) {
              return item._id;
            });

            if (apiIds.length) {
              _context3.next = 11;
              break;
            }

            return _context3.abrupt('return');

          case 11:
            _context3.next = 13;
            return ApiBase.remove({ _id: apiIds }, { multi: true });

          case 13:
            data.base = _context3.sent;
            _context3.next = 16;
            return ApiModel.remove({ baseid: apiIds }, { multi: true });

          case 16:
            data.model = _context3.sent;
            _context3.next = 22;
            break;

          case 19:
            _context3.prev = 19;
            _context3.t0 = _context3['catch'](1);
            throw _context3.t0;

          case 22:
            return _context3.abrupt('return', { code: 0, data: data });

          case 23:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[1, 19]]);
  }));

  return function deleteProject() {
    return _ref3.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = require('../../database');
var Project = db.project;
var ApiBase = db.apiBase;
var ApiModel = db.apiModel;

var restart = require('../service.ctrlProc').restart.add;
var uid = require('../../util/common').uid();

var projectGet = require('./service.get');

module.exports = {
  addProject: addProject,
  editProject: editProject,
  deleteProject: deleteProject
};