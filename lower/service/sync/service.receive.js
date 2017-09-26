'use strict';

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var saveDownloadApi = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(apiData, projectUid, _ref2) {
    var apiUid = _ref2.apiUid,
        force = _ref2.force,
        forceRemove = _ref2.forceRemove;
    var proj, apiResult, hereApi, base, modelList, result, i, modelData;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            if (!(!apiData.base || !apiData.model)) {
              _context.next = 3;
              break;
            }

            return _context.abrupt('return');

          case 3:
            _context.next = 5;
            return projectGet.getProjectDetailByQuery({ _uid: projectUid });

          case 5:
            proj = _context.sent;

            if (proj) {
              _context.next = 8;
              break;
            }

            return _context.abrupt('return');

          case 8:
            if (apiUid) {
              _context.next = 13;
              break;
            }

            _context.next = 11;
            return copyApiList([apiData], proj._id, { force: force, forceRemove: forceRemove });

          case 11:
            apiResult = _context.sent;
            return _context.abrupt('return', { api: apiResult });

          case 13:
            _context.next = 15;
            return apiGet.getApiDetailByQuery({ _uid: apiUid, project: proj._id });

          case 15:
            hereApi = _context.sent;

            if (hereApi) {
              _context.next = 18;
              break;
            }

            return _context.abrupt('return');

          case 18:
            base = (0, _assign2.default)({}, apiData, { model: undefined });
            modelList = apiData.model;
            _context.next = 22;
            return apiEdit.editApi(hereApi._id, base);

          case 22:
            result = _context.sent;

            if (!result.code) {
              _context.next = 25;
              break;
            }

            return _context.abrupt('return', result);

          case 25:

            result.data.model = [];

            i = 0;

          case 27:
            if (!(i < modelList.length)) {
              _context.next = 35;
              break;
            }

            _context.next = 30;
            return apiCopy.copyModel(modelList[i], hereApi._id);

          case 30:
            modelData = _context.sent;

            result.data.model.push(modelData);

          case 32:
            i++;
            _context.next = 27;
            break;

          case 35:
            return _context.abrupt('return', { api: result.data });

          case 38:
            _context.prev = 38;
            _context.t0 = _context['catch'](0);
            throw _context.t0;

          case 41:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 38]]);
  }));

  return function saveDownloadApi(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var saveDownloadApiList = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(apiList, projectUid, _ref4) {
    var force = _ref4.force,
        forceRemove = _ref4.forceRemove;
    var proj, apiResult;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return projectGet.getProjectDetailByQuery({ _uid: projectUid });

          case 3:
            proj = _context2.sent;

            if (proj) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt('return');

          case 6:
            _context2.next = 8;
            return copyApiList(apiList, proj._id, { force: force, forceRemove: forceRemove });

          case 8:
            apiResult = _context2.sent;


            reloadDatabase({ type: 'project', id: proj._id, dbs: ['project', 'apiBase', 'apiModel'] });

            return _context2.abrupt('return', { api: apiResult });

          case 13:
            _context2.prev = 13;
            _context2.t0 = _context2['catch'](0);
            throw _context2.t0;

          case 16:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 13]]);
  }));

  return function saveDownloadApiList(_x4, _x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var copyApiList = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(list, projectId, _ref6) {
    var force = _ref6.force,
        forceRemove = _ref6.forceRemove;

    var pushResult, i, api, result, _pushResult$ok;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            pushResult = { ok: [], fail: [] };
            i = 0;

          case 3:
            if (!(i < list.length)) {
              _context3.next = 12;
              break;
            }

            api = list[i];
            _context3.next = 7;
            return apiCopy.copyApiToProjectByData(api.base, api.model, projectId, { force: force, forceRemove: forceRemove });

          case 7:
            result = _context3.sent;

            if (result.code) {
              pushResult.fail.push({ api: api, message: result.msg, data: result.data });
            } else {
              (_pushResult$ok = pushResult.ok).push.apply(_pushResult$ok, (0, _toConsumableArray3.default)(result.data));
            }

          case 9:
            i++;
            _context3.next = 3;
            break;

          case 12:
            return _context3.abrupt('return', pushResult);

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

  return function copyApiList(_x7, _x8, _x9) {
    return _ref5.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var projectGet = require('../project/service.get');
var apiGet = require('../api/service.get');
var apiCopy = require('../api/service.copy');
var apiEdit = require('../api/service.edit');
var reloadDatabase = require('../service.ctrlProc').reload.add;

module.exports = {
  saveDownloadApiList: saveDownloadApiList,
  saveDownloadApi: saveDownloadApi,
  copyApiList: copyApiList
};