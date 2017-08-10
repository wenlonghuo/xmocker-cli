'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getApiDetail = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {
    var finalParams, baseData, apiBases, modelData;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            finalParams = ctx.finalParams;
            baseData = void 0;
            _context.prev = 2;
            _context.next = 5;
            return apiBase.cfind({ _id: finalParams.id }).exec();

          case 5:
            baseData = _context.sent;
            apiBases = baseData.map(function (api) {
              return api._id;
            });
            _context.next = 9;
            return apiModel.cfind({ baseid: { $in: apiBases } }).exec();

          case 9:
            modelData = _context.sent;

            baseData = combineArray(baseData, modelData, { fromKey: 'baseid', toKey: '_id', key: 'model' });
            _context.next = 16;
            break;

          case 13:
            _context.prev = 13;
            _context.t0 = _context['catch'](2);
            return _context.abrupt('return', ctx.respond.error('查询api详细信息出错', { e: _context.t0 }));

          case 16:
            ctx.respond.success('获取API列表成功', { result: baseData[0] });
            return _context.abrupt('return', next());

          case 18:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[2, 13]]);
  }));

  return function getApiDetail(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var getApiList = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(ctx, next) {
    var finalParams, size, no, skip, data, total, apiBases, modelData, res;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            finalParams = ctx.finalParams;
            size = ~~finalParams.pageSize;
            no = ~~finalParams.pageNo;
            skip = ~~(size * no);


            delete finalParams.pageSize;
            delete finalParams.pageNo;

            data = void 0, total = void 0;
            _context2.prev = 7;
            _context2.next = 10;
            return apiBase.count(finalParams);

          case 10:
            total = _context2.sent;
            _context2.next = 13;
            return apiBase.cfind(finalParams).sort({ name: 1 }).skip(skip).limit(size).exec();

          case 13:
            data = _context2.sent;
            apiBases = data.map(function (api) {
              return api._id;
            });
            _context2.next = 17;
            return apiModel.cfind({ baseid: { $in: apiBases } }).exec();

          case 17:
            modelData = _context2.sent;

            data = combineArray(data, modelData, { fromKey: 'baseid', toKey: '_id', key: 'model' });
            _context2.next = 24;
            break;

          case 21:
            _context2.prev = 21;
            _context2.t0 = _context2['catch'](7);
            return _context2.abrupt('return', ctx.respond.error('查询api基础信息出错', { e: _context2.t0 }));

          case 24:
            res = {
              list: data,
              pagination: {
                total: total,
                pageCnt: Math.ceil(total / size),
                pageNo: no
              }
            };


            ctx.respond.success('获取api列表成功', res);
            return _context2.abrupt('return', next());

          case 27:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[7, 21]]);
  }));

  return function getApiList(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var getApiBase = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(ctx, next) {
    var finalParams, size, no, skip, data, total, res;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            finalParams = ctx.finalParams;
            size = ~~finalParams.pageSize;
            no = ~~finalParams.pageNo;
            skip = ~~(size * no);


            delete finalParams.pageSize;
            delete finalParams.pageNo;

            if (finalParams.name) {
              finalParams.name = { $in: finalParams.name.split(',') };
            }

            data = void 0, total = void 0;
            _context3.prev = 8;
            _context3.next = 11;
            return apiBase.count(finalParams);

          case 11:
            total = _context3.sent;
            _context3.next = 14;
            return apiBase.cfind(finalParams).sort({ name: 1 }).skip(skip).limit(size).exec();

          case 14:
            data = _context3.sent;
            _context3.next = 20;
            break;

          case 17:
            _context3.prev = 17;
            _context3.t0 = _context3['catch'](8);
            return _context3.abrupt('return', ctx.respond.error('查询api基础信息出错', { e: _context3.t0 }));

          case 20:
            res = {
              list: data,
              pagination: {
                total: total,
                pageCnt: Math.ceil(total / size),
                pageNo: no
              }
            };

            ctx.respond.success('获取api列表成功', res);
            return _context3.abrupt('return', next());

          case 23:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[8, 17]]);
  }));

  return function getApiBase(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var searchApiBase = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(ctx, next) {
    var finalParams, size, no, skip, words, project, regex, query, data, total, apiBases, modelData, res;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            finalParams = ctx.finalParams;
            size = ~~finalParams.pageSize;
            no = ~~finalParams.pageNo;
            skip = ~~(size * no);


            delete finalParams.pageSize;
            delete finalParams.pageNo;

            words = finalParams.words;
            project = finalParams.project;
            regex = new RegExp(words, 'i');
            query = {
              project: project,
              name: { $regex: regex }
            };
            data = void 0, total = void 0;
            _context4.prev = 11;
            _context4.next = 14;
            return apiBase.count(query);

          case 14:
            total = _context4.sent;
            _context4.next = 17;
            return apiBase.cfind(query).sort({ name: 1 }).skip(skip).limit(size).exec();

          case 17:
            data = _context4.sent;
            apiBases = data.map(function (api) {
              return api._id;
            });
            _context4.next = 21;
            return apiModel.cfind({ baseid: { $in: apiBases } }).exec();

          case 21:
            modelData = _context4.sent;

            data = combineArray(data, modelData, { fromKey: 'baseid', toKey: '_id', key: 'model' });
            _context4.next = 28;
            break;

          case 25:
            _context4.prev = 25;
            _context4.t0 = _context4['catch'](11);
            return _context4.abrupt('return', ctx.respond.error('搜索API出错', { e: _context4.t0 }));

          case 28:
            res = {
              list: data,
              pagination: {
                total: total,
                pageCnt: Math.ceil(total / size),
                pageNo: no
              }
            };

            ctx.respond.success('搜索api成功', res);
            return _context4.abrupt('return', next());

          case 31:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[11, 25]]);
  }));

  return function searchApiBase(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var addApiBase = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(ctx, next) {
    var finalParams, data;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            finalParams = ctx.finalParams;
            data = void 0;
            _context5.prev = 2;

            finalParams._uid = uid();
            finalParams._mt = +new Date();
            _context5.next = 7;
            return apiBase.insert(finalParams);

          case 7:
            data = _context5.sent;
            _context5.next = 13;
            break;

          case 10:
            _context5.prev = 10;
            _context5.t0 = _context5['catch'](2);
            return _context5.abrupt('return', ctx.respond.error('添加api基础信息出错', { e: _context5.t0 }));

          case 13:
            reloadDatabase({ type: 'apiBase', id: data._id });

            ctx.respond.success('添加api基础信息成功', { result: data });
            return _context5.abrupt('return', next());

          case 16:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this, [[2, 10]]);
  }));

  return function addApiBase(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

var editApiBase = function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(ctx, next) {
    var finalParams, id, data;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            finalParams = ctx.finalParams;
            id = finalParams.id;

            delete finalParams.id;

            data = void 0;
            _context6.prev = 4;

            finalParams._mt = +new Date();
            _context6.next = 8;
            return apiBase.update({ _id: id }, { $set: finalParams }, { returnUpdatedDocs: true });

          case 8:
            data = _context6.sent;

            data = data[1];
            _context6.next = 15;
            break;

          case 12:
            _context6.prev = 12;
            _context6.t0 = _context6['catch'](4);
            return _context6.abrupt('return', ctx.respond.error('编辑api基础信息出错', { e: _context6.t0 }));

          case 15:

            reloadDatabase({ type: 'apiBase', id: id });

            ctx.respond.success('编辑api基础信息成功', { result: data });
            return _context6.abrupt('return', next());

          case 18:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this, [[4, 12]]);
  }));

  return function editApiBase(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

var deleteApiBase = function () {
  var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(ctx, next) {
    var finalParams, data;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            finalParams = ctx.finalParams;
            data = void 0;
            _context7.prev = 2;
            _context7.next = 5;
            return apiBase.remove({ _id: finalParams.id }, { multi: true });

          case 5:
            data = _context7.sent;
            _context7.next = 8;
            return apiModel.remove({ baseid: finalParams.id }, { multi: true });

          case 8:
            data = _context7.sent;
            _context7.next = 14;
            break;

          case 11:
            _context7.prev = 11;
            _context7.t0 = _context7['catch'](2);
            return _context7.abrupt('return', ctx.respond.error('删除api基础信息出错', { e: _context7.t0 }));

          case 14:

            ctx.respond.success('删除api成功', { result: data });
            return _context7.abrupt('return', next());

          case 16:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this, [[2, 11]]);
  }));

  return function deleteApiBase(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();

var copyApi = function () {
  var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(ctx, next) {
    var finalParams, apiIds, projList, apiBaseList, apiModelList, i, j, api, proj, apiId, k, oriApiId, query, model, _query;

    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            finalParams = ctx.finalParams;
            apiIds = finalParams.from.split(',');
            projList = finalParams.to.split(',');
            _context8.prev = 3;
            _context8.next = 6;
            return apiBase.cfind({ _id: { $in: apiIds } }).exec();

          case 6:
            apiBaseList = _context8.sent;
            apiModelList = void 0;
            i = void 0, j = void 0, api = void 0, proj = void 0, apiId = void 0, k = void 0;
            i = 0;

          case 10:
            if (!(i < projList.length)) {
              _context8.next = 52;
              break;
            }

            proj = projList[i];
            j = 0;

          case 13:
            if (!(j < apiBaseList.length)) {
              _context8.next = 48;
              break;
            }

            api = apiBaseList[j];

            if (!(api.project === proj)) {
              _context8.next = 17;
              break;
            }

            return _context8.abrupt('continue', 45);

          case 17:
            oriApiId = api._id;

            delete api._id;
            api.project = proj;
            if (!api._uid) api._uid = uid();
            api._mt = +new Date();
            query = { path: api.path, pathEqual: api.pathEqual, url: api.url, method: api.method, project: proj };
            _context8.next = 25;
            return apiBase.update(query, { $set: api }, { returnUpdatedDocs: true, upsert: true });

          case 25:
            apiId = _context8.sent;

            apiId = apiId[1];

            if (apiId) {
              _context8.next = 29;
              break;
            }

            throw new Error('save apibase failed ' + (0, _stringify2.default)(api));

          case 29:
            _context8.next = 31;
            return apiModel.cfind({ baseid: oriApiId }).exec();

          case 31:
            apiModelList = _context8.sent;
            k = 0;

          case 33:
            if (!(k < apiModelList.length)) {
              _context8.next = 45;
              break;
            }

            model = apiModelList[k];

            delete model._id;
            model.baseid = apiId._id;
            if (!model._uid) model._uid = uid();
            model._mt = +new Date();
            _query = { baseid: model.baseid, name: model.name, condition: model.condition };
            _context8.next = 42;
            return apiModel.update(_query, { $set: model }, { returnUpdatedDocs: true, upsert: true });

          case 42:
            k++;
            _context8.next = 33;
            break;

          case 45:
            j++;
            _context8.next = 13;
            break;

          case 48:
            reloadDatabase({ type: 'project', id: proj });

          case 49:
            i++;
            _context8.next = 10;
            break;

          case 52:
            _context8.next = 57;
            break;

          case 54:
            _context8.prev = 54;
            _context8.t0 = _context8['catch'](3);
            return _context8.abrupt('return', ctx.respond.error('复制api出错', { e: _context8.t0 }));

          case 57:

            ctx.respond.success('复制api成功', { result: '' });
            return _context8.abrupt('return', next());

          case 59:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this, [[3, 54]]);
  }));

  return function copyApi(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();

var setApiStatus = function () {
  var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(ctx, next) {
    var finalParams, id, proc;
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            finalParams = ctx.finalParams;
            id = finalParams.project;
            proc = getProcById(id);

            if (proc) {
              _context9.next = 6;
              break;
            }

            ctx.body = {
              code: -1,
              data: {
                tip: '项目尚未启动'
              }
            };
            return _context9.abrupt('return');

          case 6:
            _context9.prev = 6;
            _context9.next = 9;
            return proc.setApiReturn(finalParams);

          case 9:
            ctx.respond.success('提交成功', { result: '' });
            _context9.next = 15;
            break;

          case 12:
            _context9.prev = 12;
            _context9.t0 = _context9['catch'](6);

            ctx.respond.success('提交失败成功,' + _context9.t0.message, { e: _context9.t0 });

          case 15:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, this, [[6, 12]]);
  }));

  return function setApiStatus(_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = require('../database');
var apiBase = db.apiBase;
var apiModel = db.apiModel;

var service = require('../service');
var getProcById = service.proc.getProcById;
var reloadDatabase = service.ctrlProc.reload.add;
var uid = require('../util/common').uid();
var combineArray = require('../util/combineArray.js');

module.exports = {
  getApiBase: getApiBase,
  searchApiBase: searchApiBase,
  addApiBase: addApiBase,
  editApiBase: editApiBase,
  deleteApiBase: deleteApiBase,
  getApiDetail: getApiDetail,
  copyApi: copyApi,
  setApiStatus: setApiStatus,
  getApiList: getApiList
};