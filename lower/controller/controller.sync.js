'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var clientGetProjDiff = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {
    var projData, host, url, req, res;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            projData = void 0;
            _context.prev = 1;
            _context.next = 4;
            return Project.cfind({}).exec();

          case 4:
            projData = _context.sent;
            _context.next = 10;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context['catch'](1);
            return _context.abrupt('return', ctx.respond.error({ ctx: ctx, next: next, err: '获取项目信息出错', e: _context.t0 }));

          case 10:
            _context.next = 12;
            return getServerInfo();

          case 12:
            host = _context.sent;
            url = host + '/mock/serverDiffProj';
            req = request.put(url).send({ data: projData });
            _context.next = 17;
            return req;

          case 17:
            res = _context.sent;

            ctx.body = res.body;
            return _context.abrupt('return', next());

          case 20:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 7]]);
  }));

  return function clientGetProjDiff(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var clientGetApiDiff = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(ctx, next) {
    var finalParams, projUid, toArr, proj, projId, toApi, aBids, toApiModel, host, url, req, res;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            finalParams = ctx.finalParams;
            projUid = finalParams.id;
            toArr = [];
            _context2.prev = 3;
            _context2.next = 6;
            return Project.cfindOne({ _uid: projUid }).exec();

          case 6:
            proj = _context2.sent;

            if (!proj) {
              _context2.next = 17;
              break;
            }

            projId = proj._id;
            _context2.next = 11;
            return ApiBase.cfind({ project: projId }).exec();

          case 11:
            toApi = _context2.sent;
            aBids = toApi.map(function (api) {
              return api._id;
            });
            _context2.next = 15;
            return ApiModel.cfind({ baseid: { $in: aBids } }).exec();

          case 15:
            toApiModel = _context2.sent;


            toApi.forEach(function (api) {
              var model = toApiModel.filter(function (ms) {
                return ms.baseid === api._id;
              });
              toArr.push({ base: api, model: model });
            });

          case 17:
            _context2.next = 22;
            break;

          case 19:
            _context2.prev = 19;
            _context2.t0 = _context2['catch'](3);
            return _context2.abrupt('return', ctx.respond.error({ ctx: ctx, next: next, err: '获取api信息出错', e: _context2.t0 }));

          case 22:
            _context2.next = 24;
            return getServerInfo();

          case 24:
            host = _context2.sent;
            url = host + '/mock/serverDiffApi';
            req = request.put(url).send({ id: projUid, data: toArr });
            _context2.next = 29;
            return req;

          case 29:
            res = _context2.sent;

            ctx.body = res.body;
            return _context2.abrupt('return', next());

          case 32:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[3, 19]]);
  }));

  return function clientGetApiDiff(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var clientDownLoadProj = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(ctx, next) {
    var finalParams, host, url, req, res, data, proj, apis, newP, projectId, i, api, base, model, rApiB, j;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            finalParams = ctx.finalParams;

            finalParams.type = 'detail';

            _context3.next = 4;
            return getServerInfo();

          case 4:
            host = _context3.sent;
            url = host + '/mock/serverGetProj';
            req = request.get(url).query(finalParams);
            _context3.next = 9;
            return req;

          case 9:
            res = _context3.sent;
            data = res.body.data;

            if (!(!res.body || res.body.code)) {
              _context3.next = 13;
              break;
            }

            return _context3.abrupt('return', ctx.respond.error('下载项目信息出错'));

          case 13:
            proj = data.proj;
            apis = data.api;


            delete proj._id;
            _context3.next = 18;
            return Project.update({ _uid: proj._uid }, { $set: proj }, { returnUpdatedDocs: true, upsert: true });

          case 18:
            newP = _context3.sent;


            newP = newP[1] ? newP[1] : newP;

            projectId = newP._id;
            i = 0;

          case 22:
            if (!(i < apis.length)) {
              _context3.next = 45;
              break;
            }

            api = apis[i];
            base = api.base;
            model = api.model;

            delete base._id;
            base.project = projectId;
            _context3.next = 30;
            return ApiBase.update({ _uid: base._uid }, { $set: base }, { returnUpdatedDocs: true, upsert: true });

          case 30:
            rApiB = _context3.sent;

            rApiB = rApiB[1] ? rApiB[1] : rApiB;

            if (!(rApiB && rApiB._id)) {
              _context3.next = 42;
              break;
            }

            j = 0;

          case 34:
            if (!(j < model.length)) {
              _context3.next = 42;
              break;
            }

            delete model[j]._id;
            model[j].baseid = rApiB._id;
            _context3.next = 39;
            return ApiModel.update({ _uid: model[j]._uid }, { $set: model[j] }, { upsert: true });

          case 39:
            j++;
            _context3.next = 34;
            break;

          case 42:
            i++;
            _context3.next = 22;
            break;

          case 45:

            ctx.respond.success('成功');

          case 46:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function clientDownLoadProj(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var clientDownLoadProjBase = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(ctx, next) {
    var finalParams, host, url, req, res, data, proj;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            finalParams = ctx.finalParams;

            finalParams.type = 'base';

            _context4.next = 4;
            return getServerInfo();

          case 4:
            host = _context4.sent;
            url = host + '/mock/serverGetProj';
            req = request.get(url).query(finalParams);
            _context4.next = 9;
            return req;

          case 9:
            res = _context4.sent;
            data = res.body.data;

            if (!(!res.body || res.body.code)) {
              _context4.next = 13;
              break;
            }

            return _context4.abrupt('return', ctx.respond.error('下载项目信息出错'));

          case 13:
            proj = data.proj;

            delete proj._id;
            delete proj.path;
            delete proj.port;
            delete proj.member;

            _context4.next = 20;
            return Project.update({ _uid: proj._uid }, { $set: proj }, { returnUpdatedDocs: true, upsert: true });

          case 20:

            ctx.respond.success('成功');

          case 21:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function clientDownLoadProjBase(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var clientDownLoadApi = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(ctx, next) {
    var finalParams, host, url, req, res, data, apis, proj, projectId, i, api, base, model, rApiB, j;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            finalParams = ctx.finalParams;
            _context5.next = 3;
            return getServerInfo();

          case 3:
            host = _context5.sent;
            url = host + '/mock/serverGetApi';
            req = request.get(url).query(finalParams);
            _context5.next = 8;
            return req;

          case 8:
            res = _context5.sent;
            data = res.body.data;

            if (!(!res.body || res.body.code)) {
              _context5.next = 12;
              break;
            }

            return _context5.abrupt('return', ctx.respond.error('下载api信息出错'));

          case 12:
            apis = data.api;
            _context5.next = 15;
            return Project.cfindOne({ _uid: finalParams.project }).exec();

          case 15:
            proj = _context5.sent;
            projectId = proj._id;
            i = 0;

          case 18:
            if (!(i < apis.length)) {
              _context5.next = 41;
              break;
            }

            api = apis[i];
            base = api.base;

            base.project = projectId;
            model = api.model;


            delete base._id;
            _context5.next = 26;
            return ApiBase.update({ _uid: base._uid }, { $set: base }, { returnUpdatedDocs: true, upsert: true });

          case 26:
            rApiB = _context5.sent;

            rApiB = rApiB[1];

            if (!(rApiB && rApiB._id)) {
              _context5.next = 38;
              break;
            }

            j = 0;

          case 30:
            if (!(j < model.length)) {
              _context5.next = 38;
              break;
            }

            delete model[j]._id;
            model[j].baseid = rApiB._id;
            _context5.next = 35;
            return ApiModel.update({ _uid: model[j]._uid }, { $set: model[j] }, { returnUpdatedDocs: true, upsert: true });

          case 35:
            j++;
            _context5.next = 30;
            break;

          case 38:
            i++;
            _context5.next = 18;
            break;

          case 41:
            ctx.respond.success('成功');
            return _context5.abrupt('return', next());

          case 43:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function clientDownLoadApi(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

var serverGetProj = function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(ctx, next) {
    var finalParams, id, type, projInfo, apiArr, procId, apiBs, apiBIds, apiMs;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            finalParams = ctx.finalParams;
            id = finalParams.id;
            type = finalParams.type || 'detail';
            projInfo = void 0;
            apiArr = [];
            _context6.prev = 5;
            _context6.next = 8;
            return Project.cfindOne({ _uid: id }).exec();

          case 8:
            projInfo = _context6.sent;

            if (!(type === 'detail')) {
              _context6.next = 19;
              break;
            }

            procId = projInfo._id;
            _context6.next = 13;
            return ApiBase.cfind({ project: procId }).exec();

          case 13:
            apiBs = _context6.sent;
            apiBIds = apiBs.map(function (api) {
              return api._id;
            });
            _context6.next = 17;
            return ApiModel.cfind({ baseid: { $in: apiBIds } }).exec();

          case 17:
            apiMs = _context6.sent;


            apiBs.forEach(function (api) {
              var model = apiMs.filter(function (ms) {
                return ms.baseid === api._id;
              });
              apiArr.push({ base: api, model: model });
            });

          case 19:
            _context6.next = 24;
            break;

          case 21:
            _context6.prev = 21;
            _context6.t0 = _context6['catch'](5);
            return _context6.abrupt('return', ctx.respond.error('下载项目信息出错', { e: _context6.t0 }));

          case 24:
            ctx.respond.success('成功', {
              proj: projInfo,
              api: apiArr,
              version: '1.0'
            });

          case 25:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this, [[5, 21]]);
  }));

  return function serverGetProj(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

var serverGetApi = function () {
  var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(ctx, next) {
    var finalParams, ids, apiArr, apiBs, apiBIds, apiMs;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            finalParams = ctx.finalParams;
            ids = finalParams.ids.split(',');
            apiArr = [];
            _context7.prev = 3;
            _context7.next = 6;
            return ApiBase.cfind({ _uid: { $in: ids } }).exec();

          case 6:
            apiBs = _context7.sent;
            apiBIds = apiBs.map(function (api) {
              return api._id;
            });
            _context7.next = 10;
            return ApiModel.cfind({ baseid: { $in: apiBIds } }).exec();

          case 10:
            apiMs = _context7.sent;


            apiBs.forEach(function (api) {
              var model = apiMs.filter(function (ms) {
                return ms.baseid === api._id;
              });
              apiArr.push({ base: api, model: model });
            });
            _context7.next = 17;
            break;

          case 14:
            _context7.prev = 14;
            _context7.t0 = _context7['catch'](3);
            return _context7.abrupt('return', ctx.respond.error('下载api信息出错', { e: _context7.t0 }));

          case 17:

            ctx.respond.success('成功', {
              api: apiArr,
              version: '1.0'
            });

          case 18:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this, [[3, 14]]);
  }));

  return function serverGetApi(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();

var serverDiffApi = function () {
  var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(ctx, next) {
    var finalParams, projUid, fromApi, result, toArr, proj, projId, toApi, aBids, toApiModel;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            finalParams = ctx.finalParams;
            projUid = finalParams.id;
            fromApi = finalParams.data;
            result = void 0;
            toArr = [];
            _context8.prev = 5;
            _context8.next = 8;
            return Project.cfindOne({ _uid: projUid }).exec();

          case 8:
            proj = _context8.sent;

            if (!proj) {
              _context8.next = 19;
              break;
            }

            projId = proj._id;
            _context8.next = 13;
            return ApiBase.cfind({ project: projId }).exec();

          case 13:
            toApi = _context8.sent;
            aBids = toApi.map(function (api) {
              return api._id;
            });
            _context8.next = 17;
            return ApiModel.cfind({ baseid: { $in: aBids } }).exec();

          case 17:
            toApiModel = _context8.sent;


            toApi.forEach(function (api) {
              var model = toApiModel.filter(function (ms) {
                return ms.baseid === api._id;
              });
              toArr.push({ base: api, model: model });
            });

          case 19:
            result = diffTimeStamp(fromApi, toArr, { idKeys: ['base', '_uid'], timeKeys: ['base', '_mt'] });
            _context8.next = 25;
            break;

          case 22:
            _context8.prev = 22;
            _context8.t0 = _context8['catch'](5);
            return _context8.abrupt('return', ctx.respond.error('下载api区别信息出错', { e: _context8.t0 }));

          case 25:

            ctx.respond.success('成功', result);

          case 26:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this, [[5, 22]]);
  }));

  return function serverDiffApi(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();

var serverDiffProj = function () {
  var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(ctx, next) {
    var finalParams, fromProj, result, toProj;
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            finalParams = ctx.finalParams;
            fromProj = finalParams.data;
            result = void 0;
            _context9.prev = 3;
            _context9.next = 6;
            return Project.cfind({}).exec();

          case 6:
            toProj = _context9.sent;

            result = diffTimeStamp(fromProj, toProj);
            _context9.next = 13;
            break;

          case 10:
            _context9.prev = 10;
            _context9.t0 = _context9['catch'](3);
            return _context9.abrupt('return', ctx.respond.error('下载项目区别信息出错', { e: _context9.t0 }));

          case 13:
            ctx.respond.success('成功', result);

          case 14:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, this, [[3, 10]]);
  }));

  return function serverDiffProj(_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = require('../database');
var Project = db.project;
var ApiModel = db.apiModel;
var ApiBase = db.apiBase;
var request = require('superagent');

module.exports = {
  clientGetProjDiff: clientGetProjDiff,
  clientGetApiDiff: clientGetApiDiff,
  clientDownLoadProj: clientDownLoadProj,
  clientDownLoadProjBase: clientDownLoadProjBase,
  clientDownLoadApi: clientDownLoadApi,
  serverGetProj: serverGetProj,
  serverGetApi: serverGetApi,
  serverDiffProj: serverDiffProj,
  serverDiffApi: serverDiffApi
};

function getServerInfo() {
  return new _promise2.default(function (resolve, reject) {
    db.appBase.cfindOne({}).exec().then(function (doc) {
      doc = doc || {};
      var addr = doc.remoteAddress || 'http://localhost:6001';

      resolve(addr);
    }, function () {
      resolve('http://localhost:6001');
    });
  });
}

function diffTimeStamp(fromArr, toArr) {
  var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var idKeys = option.idKeys || ['_uid'];
  var timeKeys = option.timeKeys || ['_mt'];

  var tempObj = {};
  var result = { unchanged: [], behind: [], ahead: [], serverSide: [], clientSide: [], unstaged: [] };

  toArr.forEach(function (p) {
    var tuid = getDeepValue(p, idKeys);
    tempObj[tuid] = { to: p };
  });

  fromArr.forEach(function (p) {
    var tuid = getDeepValue(p, idKeys);
    if (tempObj[tuid]) {
      tempObj[tuid].from = p;
    } else {
      tempObj[tuid] = { from: p };
    }
  });

  (0, _keys2.default)(tempObj).forEach(function (tuid) {
    var obj = tempObj[tuid];
    var to = obj.to;
    var from = obj.from;
    var info = { server: to, client: from };
    if (to && from) {
      var toTime = getDeepValue(to, timeKeys);
      var fromTime = getDeepValue(from, timeKeys);

      if (toTime === fromTime) {
        result.unchanged.push(info);
      } else if (toTime > fromTime) {
        result.behind.push(info);
      } else if (toTime < fromTime) {
        result.ahead.push(info);
      } else {
        if (toTime) {
          result.behind.push(info);
        } else if (fromTime) {
          result.ahead.push(info);
        } else {
          result.untaged.push(info);
        }
      }
    } else if (to) {
      result.serverSide.push(info);
    } else if (from) {
      result.clientSide.push(info);
    }
  });

  return result;

  function getDeepValue() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var arr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var tmp = obj;
    arr.forEach(function (a) {
      tmp = tmp[a];
    });
    return tmp;
  }
}