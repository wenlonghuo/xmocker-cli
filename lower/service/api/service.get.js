'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getApiById = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(id) {
    var baseData, baseid, modelData, data;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return ApiBase.cfindOne({ _id: id }).exec();

          case 3:
            baseData = _context.sent;

            if (baseData) {
              _context.next = 6;
              break;
            }

            return _context.abrupt('return');

          case 6:
            baseid = baseData._id;
            _context.next = 9;
            return ApiModel.cfind({ baseid: baseid }).exec();

          case 9:
            modelData = _context.sent;
            data = (0, _assign2.default)({}, baseData, { model: modelData });
            return _context.abrupt('return', data);

          case 14:
            _context.prev = 14;
            _context.t0 = _context['catch'](0);
            throw _context.t0;

          case 17:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 14]]);
  }));

  return function getApiById(_x) {
    return _ref.apply(this, arguments);
  };
}();

var getApiByQuery = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(query, _ref3, showModels) {
    var pageSize = _ref3.pageSize,
        pageNo = _ref3.pageNo,
        order = _ref3.order,
        sortBy = _ref3.sortBy;
    var size, no, skip, sortInfo, total, data, ids, modelData;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
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

            _context2.prev = 5;
            _context2.next = 8;
            return ApiBase.count(query);

          case 8:
            total = _context2.sent;
            _context2.next = 11;
            return ApiBase.cfind(query).sort(sortInfo).skip(skip).limit(size).exec();

          case 11:
            data = _context2.sent;

            if (!showModels) {
              _context2.next = 18;
              break;
            }

            ids = data.map(function (api) {
              return api._id;
            });
            _context2.next = 16;
            return ApiModel.cfind({ baseid: { $in: ids } }).sort({ _mt: -1 }).exec();

          case 16:
            modelData = _context2.sent;

            data = combineArray(data, modelData, { fromKey: 'baseid', toKey: '_id', key: 'model' });

          case 18:
            return _context2.abrupt('return', {
              list: data,
              pagination: {
                total: total,
                pageCnt: Math.ceil(total / size),
                pageNo: no
              }
            });

          case 21:
            _context2.prev = 21;
            _context2.t0 = _context2['catch'](5);
            throw _context2.t0;

          case 24:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[5, 21]]);
  }));

  return function getApiByQuery(_x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var getApiDetailByQuery = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(query, showModels) {
    var data, id, modelData;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return ApiBase.cfindOne(query).exec();

          case 3:
            data = _context3.sent;

            if (data) {
              _context3.next = 6;
              break;
            }

            return _context3.abrupt('return');

          case 6:
            if (!showModels) {
              _context3.next = 12;
              break;
            }

            id = data._id;
            _context3.next = 10;
            return ApiModel.cfind({ baseid: id }).sort({ _mt: -1 }).exec();

          case 10:
            modelData = _context3.sent;

            data = (0, _assign2.default)({}, data, { model: modelData });

          case 12:
            return _context3.abrupt('return', data);

          case 15:
            _context3.prev = 15;
            _context3.t0 = _context3['catch'](0);
            throw _context3.t0;

          case 18:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[0, 15]]);
  }));

  return function getApiDetailByQuery(_x5, _x6) {
    return _ref4.apply(this, arguments);
  };
}();

var getApiByCondition = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(params, _ref6, showModels) {
    var pageSize = _ref6.pageSize,
        pageNo = _ref6.pageNo,
        order = _ref6.order,
        sortBy = _ref6.sortBy;
    var query;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            query = {
              url: params.url,
              method: params.method,
              project: params.project
            };


            if (params.path) {
              query.path = params.path;
              query.pathEqual = params.pathEqual;
            }

            _context4.prev = 2;
            _context4.next = 5;
            return getApiByQuery(query, { pageSize: pageSize, pageNo: pageNo, order: order, sortBy: sortBy }, showModels);

          case 5:
            return _context4.abrupt('return', _context4.sent);

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4['catch'](2);
            throw _context4.t0;

          case 11:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[2, 8]]);
  }));

  return function getApiByCondition(_x7, _x8, _x9) {
    return _ref5.apply(this, arguments);
  };
}();

var getApiByProject = function () {
  var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(projectId, _ref8, showModels) {
    var pageSize = _ref8.pageSize,
        pageNo = _ref8.pageNo,
        order = _ref8.order,
        sortBy = _ref8.sortBy;
    var query;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            query = {
              project: projectId
            };
            _context5.prev = 1;
            _context5.next = 4;
            return getApiByQuery(query, { pageSize: pageSize, pageNo: pageNo, order: order, sortBy: sortBy }, showModels);

          case 4:
            return _context5.abrupt('return', _context5.sent);

          case 7:
            _context5.prev = 7;
            _context5.t0 = _context5['catch'](1);
            throw _context5.t0;

          case 10:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this, [[1, 7]]);
  }));

  return function getApiByProject(_x10, _x11, _x12) {
    return _ref7.apply(this, arguments);
  };
}();

var getExistApi = function () {
  var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(params, _ref10) {
    var id = _ref10.id;
    var query, data;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            query = {
              url: params.url,
              method: params.method,
              project: params.project
            };


            if (params.path) {
              query.path = params.path;
              query.pathEqual = params.pathEqual;
            }

            if (id) {
              query._id = { $ne: id };
            }

            _context6.prev = 3;
            _context6.next = 6;
            return ApiBase.cfind(query).exec();

          case 6:
            data = _context6.sent;
            return _context6.abrupt('return', { data: data, query: query });

          case 10:
            _context6.prev = 10;
            _context6.t0 = _context6['catch'](3);
            throw _context6.t0;

          case 13:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this, [[3, 10]]);
  }));

  return function getExistApi(_x13, _x14) {
    return _ref9.apply(this, arguments);
  };
}();

var getModelByQuery = function () {
  var _ref11 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(query, _ref12) {
    var pageSize = _ref12.pageSize,
        pageNo = _ref12.pageNo,
        order = _ref12.order,
        sortBy = _ref12.sortBy;
    var size, no, skip, sortInfo, total, data;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
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

            _context7.prev = 5;
            _context7.next = 8;
            return ApiModel.count(query);

          case 8:
            total = _context7.sent;
            _context7.next = 11;
            return ApiModel.cfind(query).sort(sortInfo).skip(skip).limit(size).exec();

          case 11:
            data = _context7.sent;
            return _context7.abrupt('return', {
              list: data,
              pagination: {
                total: total,
                pageCnt: Math.ceil(total / size),
                pageNo: no
              }
            });

          case 15:
            _context7.prev = 15;
            _context7.t0 = _context7['catch'](5);
            throw _context7.t0;

          case 18:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this, [[5, 15]]);
  }));

  return function getModelByQuery(_x15, _x16) {
    return _ref11.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = require('../../database');
var ApiBase = db.apiBase;
var ApiModel = db.apiModel;

var combineArray = require('../../util/combineArray.js');

module.exports = {
  getApiByProject: getApiByProject,
  getApiByCondition: getApiByCondition,
  getApiByQuery: getApiByQuery,
  getApiById: getApiById,
  getApiDetailByQuery: getApiDetailByQuery,
  getExistApi: getExistApi,
  getModelByQuery: getModelByQuery
};