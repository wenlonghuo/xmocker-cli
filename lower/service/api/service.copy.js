'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var copyApi = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(apiIds, projList, _ref2) {
    var force = _ref2.force,
        forceRemove = _ref2.forceRemove;

    var conflictList, i, projectId, projInfo, j, apiId, result, _projInfo$apis;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            conflictList = [];
            _context.prev = 1;
            i = 0;

          case 3:
            if (!(i < projList.length)) {
              _context.next = 21;
              break;
            }

            projectId = projList[i];
            projInfo = { id: projectId, apis: [] };
            j = 0;

          case 7:
            if (!(j < apiIds.length)) {
              _context.next = 16;
              break;
            }

            apiId = apiIds[j];
            _context.next = 11;
            return copyApiToProjectById(apiId, projectId, { force: force, forceRemove: forceRemove });

          case 11:
            result = _context.sent;

            if (result.code === 10) {
              (_projInfo$apis = projInfo.apis).push.apply(_projInfo$apis, (0, _toConsumableArray3.default)(result.data.data));
            }

          case 13:
            j++;
            _context.next = 7;
            break;

          case 16:
            reloadDatabase({ type: 'project', id: projectId, dbs: ['project', 'apiBase', 'apiModel'] });
            conflictList.push(projInfo);

          case 18:
            i++;
            _context.next = 3;
            break;

          case 21:
            return _context.abrupt('return', { code: 0, data: { list: conflictList } });

          case 24:
            _context.prev = 24;
            _context.t0 = _context['catch'](1);
            throw _context.t0;

          case 27:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 24]]);
  }));

  return function copyApi(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var copyApiToProjectById = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(id, projectId, _ref4) {
    var force = _ref4.force,
        forceRemove = _ref4.forceRemove;
    var apiData, modelList;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return apiGet.getApiById(id);

          case 3:
            apiData = _context2.sent;

            if (apiData) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt('return', { code: 2, msg: 'API不存在或者已删除' });

          case 6:
            if (!(apiData.project === projectId)) {
              _context2.next = 8;
              break;
            }

            return _context2.abrupt('return', { code: 9, msg: '该API属于被复制的项目' });

          case 8:
            modelList = apiData.model;
            _context2.next = 11;
            return copyApiToProjectByData(apiData, modelList, projectId, { force: force, forceRemove: forceRemove });

          case 11:
            return _context2.abrupt('return', _context2.sent);

          case 14:
            _context2.prev = 14;
            _context2.t0 = _context2['catch'](0);
            throw _context2.t0;

          case 17:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 14]]);
  }));

  return function copyApiToProjectById(_x4, _x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var copyApiToProjectByData = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
    var apiData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var modelList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var projectId = arguments[2];
    var _ref6 = arguments[3];
    var force = _ref6.force,
        forceRemove = _ref6.forceRemove;
    var result, conflictList, rmIdArr;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return copyApiAndModel(apiData, modelList, projectId);

          case 3:
            result = _context3.sent;

            if (result.code) {
              _context3.next = 6;
              break;
            }

            return _context3.abrupt('return', result);

          case 6:
            if (force) {
              _context3.next = 8;
              break;
            }

            return _context3.abrupt('return', result);

          case 8:
            conflictList = result.data.data;

            if (!forceRemove) {
              _context3.next = 15;
              break;
            }

            rmIdArr = conflictList.map(function (item) {
              return item._id;
            });
            _context3.next = 13;
            return ApiBase.remove({ _id: { $in: rmIdArr } }, { multi: true });

          case 13:
            _context3.next = 15;
            return ApiModel.remove({ baseid: { $in: rmIdArr } }, { multi: true });

          case 15:
            _context3.next = 17;
            return copyApiAndModel(apiData, modelList, projectId, true);

          case 17:
            result = _context3.sent;
            return _context3.abrupt('return', result);

          case 21:
            _context3.prev = 21;
            _context3.t0 = _context3['catch'](0);
            throw _context3.t0;

          case 24:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[0, 21]]);
  }));

  return function copyApiToProjectByData() {
    return _ref5.apply(this, arguments);
  };
}();

var copyApiAndModel = function () {
  var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(params, modelList, projectId, force) {
    var data, result, apiList, i, apiId, j, modelData;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            data = [];
            _context4.prev = 1;
            _context4.next = 4;
            return copyApiData(params, projectId, force);

          case 4:
            result = _context4.sent;

            if (!result.code) {
              _context4.next = 7;
              break;
            }

            return _context4.abrupt('return', result);

          case 7:
            apiList = result.data;


            if (!Array.isArray(apiList)) apiList = [apiList];

            data.push.apply(data, (0, _toConsumableArray3.default)(apiList));

            i = 0;

          case 11:
            if (!(i < data.length)) {
              _context4.next = 26;
              break;
            }

            apiId = data[i]._id;

            data[i].model = [];
            j = 0;

          case 15:
            if (!(j < modelList.length)) {
              _context4.next = 23;
              break;
            }

            _context4.next = 18;
            return copyModel(modelList[j], apiId);

          case 18:
            modelData = _context4.sent;

            data[i].model.push(modelData.data);

          case 20:
            j++;
            _context4.next = 15;
            break;

          case 23:
            i++;
            _context4.next = 11;
            break;

          case 26:
            return _context4.abrupt('return', { code: 0, data: data });

          case 29:
            _context4.prev = 29;
            _context4.t0 = _context4['catch'](1);
            throw _context4.t0;

          case 32:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[1, 29]]);
  }));

  return function copyApiAndModel(_x9, _x10, _x11, _x12) {
    return _ref7.apply(this, arguments);
  };
}();

var copyApiData = function () {
  var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(api, projectId, force) {
    var data, params, exist;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            data = void 0;
            _context5.prev = 1;
            params = (0, _assign2.default)({}, api);

            delete params._id;
            delete params.model;
            params.project = projectId;
            _context5.next = 8;
            return apiGet.getExistApi(params, {});

          case 8:
            exist = _context5.sent;

            if (!(exist.data && exist.data.length && !force)) {
              _context5.next = 11;
              break;
            }

            return _context5.abrupt('return', { code: 10, msg: 'API和现有API冲突', data: exist });

          case 11:
            if (!params._uid) params._uid = uid();
            if (!params._mt) params._mt = +new Date();
            _context5.next = 15;
            return ApiBase.update(exist.query, { $set: params }, { returnUpdatedDocs: true, upsert: true, multi: true });

          case 15:
            data = _context5.sent;

            data = data[1];
            _context5.next = 22;
            break;

          case 19:
            _context5.prev = 19;
            _context5.t0 = _context5['catch'](1);
            throw _context5.t0;

          case 22:
            return _context5.abrupt('return', { code: 0, data: data });

          case 23:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this, [[1, 19]]);
  }));

  return function copyApiData(_x13, _x14, _x15) {
    return _ref8.apply(this, arguments);
  };
}();

var copyModel = function () {
  var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(model, apiId) {
    var data, params, query;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            data = void 0;
            _context6.prev = 1;
            params = (0, _assign2.default)({}, model);

            params.baseid = apiId;
            delete params._id;
            if (!params._uid) params._uid = uid();
            if (!params._mt) params._mt = +new Date();
            query = {
              baseid: params.baseid,
              _uid: params._uid
            };
            _context6.next = 10;
            return ApiModel.update(query, { $set: params }, { returnUpdatedDocs: true, upsert: true, multi: true });

          case 10:
            data = _context6.sent;
            _context6.next = 16;
            break;

          case 13:
            _context6.prev = 13;
            _context6.t0 = _context6['catch'](1);
            throw _context6.t0;

          case 16:
            return _context6.abrupt('return', { code: 0, data: data[1] });

          case 17:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this, [[1, 13]]);
  }));

  return function copyModel(_x16, _x17) {
    return _ref9.apply(this, arguments);
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
  copyApi: copyApi,
  copyModel: copyModel,
  copyApiToProjectById: copyApiToProjectById,
  copyApiToProjectByData: copyApiToProjectByData
};