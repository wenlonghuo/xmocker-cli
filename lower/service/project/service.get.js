'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getProjectDetailByQuery = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(query) {
    var data;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if ((0, _keys2.default)(query).length) {
              _context.next = 2;
              break;
            }

            throw new Error('查询条件不能为空！！！');

          case 2:
            _context.prev = 2;
            _context.next = 5;
            return Project.cfindOne(query).exec();

          case 5:
            data = _context.sent;
            return _context.abrupt('return', data);

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](2);

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[2, 9]]);
  }));

  return function getProjectDetailByQuery(_x) {
    return _ref.apply(this, arguments);
  };
}();

var getProjectDetailById = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(id) {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return getProjectDetailByQuery({ _id: id });

          case 3:
            return _context2.abrupt('return', _context2.sent);

          case 6:
            _context2.prev = 6;
            _context2.t0 = _context2['catch'](0);

          case 8:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 6]]);
  }));

  return function getProjectDetailById(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var getProjectByQuery = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(query, _ref4) {
    var pageSize = _ref4.pageSize,
        pageNo = _ref4.pageNo,
        order = _ref4.order,
        sortBy = _ref4.sortBy;
    var size, no, skip, sortInfo, total, data;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            size = ~~pageSize;
            no = ~~pageNo;
            skip = ~~(size * no);
            sortInfo = {};

            if (sortBy) {
              sortInfo[sortBy] = order;
            } else {
              sortInfo.name = 1;
            }

            _context3.prev = 5;
            _context3.next = 8;
            return Project.count(query);

          case 8:
            total = _context3.sent;
            _context3.next = 11;
            return Project.cfind(query).sort(sortInfo).skip(skip).limit(size).exec();

          case 11:
            data = _context3.sent;
            return _context3.abrupt('return', {
              list: data,
              pagination: {
                total: total,
                pageCnt: Math.ceil(total / size),
                pageNo: no
              }
            });

          case 15:
            _context3.prev = 15;
            _context3.t0 = _context3['catch'](5);
            throw _context3.t0;

          case 18:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[5, 15]]);
  }));

  return function getProjectByQuery(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();

var getExistProject = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(params, _ref6) {
    var id = _ref6.id;
    var query, data;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            query = {
              shortcut: params.shortcut
            };


            if (id) {
              query._id = { $ne: id };
            }

            _context4.prev = 2;
            _context4.next = 5;
            return Project.cfind(query).exec();

          case 5:
            data = _context4.sent;
            return _context4.abrupt('return', { data: data, query: query });

          case 9:
            _context4.prev = 9;
            _context4.t0 = _context4['catch'](2);
            throw _context4.t0;

          case 12:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[2, 9]]);
  }));

  return function getExistProject(_x5, _x6) {
    return _ref5.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = require('../../database');
var Project = db.project;

module.exports = {
  getProjectDetailById: getProjectDetailById,
  getProjectDetailByQuery: getProjectDetailByQuery,
  getProjectByQuery: getProjectByQuery,
  getExistProject: getExistProject
};