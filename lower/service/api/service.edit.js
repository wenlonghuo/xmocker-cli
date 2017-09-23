'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var addApi = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(params) {
    var data, exist;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            data = void 0;
            _context.prev = 1;
            _context.next = 4;
            return apiGet.getExistApi(params, {});

          case 4:
            exist = _context.sent;

            if (!(exist.data && exist.data.length)) {
              _context.next = 7;
              break;
            }

            return _context.abrupt('return', { code: 1, msg: 'API和现有API冲突', data: exist });

          case 7:
            params._uid = uid();
            params._mt = +new Date();
            _context.next = 11;
            return ApiBase.update(exist.query, { $set: params }, { returnUpdatedDocs: true, upsert: true, multi: true });

          case 11:
            data = _context.sent;

            data = data[1];
            _context.next = 18;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context['catch'](1);
            throw _context.t0;

          case 18:

            reloadDatabase({ type: 'apiBase', id: data._id });
            return _context.abrupt('return', { code: 0, data: data });

          case 20:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 15]]);
  }));

  return function addApi(_x) {
    return _ref.apply(this, arguments);
  };
}();

var editApi = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(id, params) {
    var data, exist;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            data = void 0;
            _context2.prev = 1;
            _context2.next = 4;
            return apiGet.getExistApi(params, { id: id });

          case 4:
            exist = _context2.sent;

            if (!(exist.data && exist.data.length)) {
              _context2.next = 7;
              break;
            }

            return _context2.abrupt('return', { code: 1, msg: 'API和现有API冲突', data: exist.data });

          case 7:
            params._mt = +new Date();
            _context2.next = 10;
            return ApiBase.update({ _id: id }, { $set: params }, { returnUpdatedDocs: true, multi: true, upsert: true });

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

            reloadDatabase({ type: 'apiBase', id: id });

            return _context2.abrupt('return', { code: 0, data: data });

          case 19:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[1, 14]]);
  }));

  return function editApi(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var deleteApi = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(id) {
    var data;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            data = {};
            _context3.prev = 1;
            _context3.next = 4;
            return ApiBase.remove({ _id: id }, { multi: true });

          case 4:
            data.base = _context3.sent;
            _context3.next = 7;
            return ApiModel.remove({ baseid: id }, { multi: true });

          case 7:
            data.model = _context3.sent;
            _context3.next = 13;
            break;

          case 10:
            _context3.prev = 10;
            _context3.t0 = _context3['catch'](1);
            throw _context3.t0;

          case 13:
            return _context3.abrupt('return', { code: 0, data: data });

          case 14:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[1, 10]]);
  }));

  return function deleteApi(_x4) {
    return _ref3.apply(this, arguments);
  };
}();

var addModel = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(params, unique) {
    var data;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            data = void 0;
            _context4.prev = 1;

            if (!(!params.condition && unique)) {
              _context4.next = 4;
              break;
            }

            return _context4.abrupt('return', { code: 4, msg: '必须填写contition' });

          case 4:
            params._uid = uid();
            params._mt = +new Date();
            if (params.data) params.data = (0, _stringify2.default)(params.data);
            _context4.next = 9;
            return ApiBase.update({ _id: params.baseid }, { $set: { _mt: +new Date() } }, { returnUpdatedDocs: true, multi: true, upsert: true });

          case 9:
            _context4.next = 11;
            return ApiModel.insert(params);

          case 11:
            data = _context4.sent;
            _context4.next = 17;
            break;

          case 14:
            _context4.prev = 14;
            _context4.t0 = _context4['catch'](1);
            throw _context4.t0;

          case 17:
            reloadDatabase({ type: 'apiModel', id: data._id });
            return _context4.abrupt('return', { code: 0, data: data });

          case 19:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[1, 14]]);
  }));

  return function addModel(_x5, _x6) {
    return _ref4.apply(this, arguments);
  };
}();

var editModel = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(id, params) {
    var result;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            result = void 0;
            _context5.prev = 1;

            if (id) {
              _context5.next = 4;
              break;
            }

            return _context5.abrupt('return', { code: 5, msg: '请提供ID' });

          case 4:
            params._mt = +new Date();
            if (params.data) params.data = (0, _stringify2.default)(params.data);
            _context5.next = 8;
            return ApiModel.update({ _id: id }, { $set: params }, { returnUpdatedDocs: true, multi: true, upsert: true });

          case 8:
            result = _context5.sent;


            result = result[1];
            if (Array.isArray(result)) result = result[0];
            _context5.next = 13;
            return ApiBase.update({ _id: result.baseid }, { $set: { _mt: +new Date() } }, { returnUpdatedDocs: true, multi: true, upsert: true });

          case 13:
            _context5.next = 18;
            break;

          case 15:
            _context5.prev = 15;
            _context5.t0 = _context5['catch'](1);
            throw _context5.t0;

          case 18:
            reloadDatabase({ type: 'apiModel', id: id });

            return _context5.abrupt('return', { code: 0, data: result });

          case 20:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this, [[1, 15]]);
  }));

  return function editModel(_x7, _x8) {
    return _ref5.apply(this, arguments);
  };
}();

var deleteModel = function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(id) {
    var result, oldData;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            result = void 0;
            _context6.prev = 1;
            _context6.next = 4;
            return ApiModel.cfindOne({ _id: id }).exec();

          case 4:
            oldData = _context6.sent;
            _context6.next = 7;
            return ApiModel.remove({ _id: id }, { returnUpdatedDocs: true, multi: true, upsert: true });

          case 7:
            result = _context6.sent;
            _context6.next = 10;
            return ApiBase.update({ _id: oldData.baseid }, { $set: { _mt: +new Date() } }, { returnUpdatedDocs: true, multi: true, upsert: true });

          case 10:
            return _context6.abrupt('return', result);

          case 13:
            _context6.prev = 13;
            _context6.t0 = _context6['catch'](1);
            throw _context6.t0;

          case 16:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this, [[1, 13]]);
  }));

  return function deleteModel(_x9) {
    return _ref6.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = require('../../database');
var ApiBase = db.apiBase;
var ApiModel = db.apiModel;

var reloadDatabase = require('../service.ctrlProc').reload.add;
var uid = require('../../util/common').uid();

var apiGet = require('./service.get.js');

module.exports = {
  addApi: addApi,
  editApi: editApi,
  deleteApi: deleteApi,
  addModel: addModel,
  editModel: editModel,
  deleteModel: deleteModel
};