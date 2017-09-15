'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var clientGetProjList = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {
    var finalParams, data;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            finalParams = ctx.finalParams;
            _context.prev = 1;
            _context.next = 4;
            return syncGet.getRemoteData('/mock/serverGetProjList', finalParams);

          case 4:
            data = _context.sent;

            ctx.body = data;
            return _context.abrupt('return');

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](1);
            return _context.abrupt('return', ctx.respond.error('获取项目列表失败', { e: _context.t0 }));

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 9]]);
  }));

  return function clientGetProjList(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var clientGetProjDetail = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(ctx, next) {
    var finalParams, data;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            finalParams = ctx.finalParams;
            _context2.prev = 1;
            _context2.next = 4;
            return syncGet.getRemoteData('/mock/serverGetProjDetail', finalParams);

          case 4:
            data = _context2.sent;

            ctx.body = data;
            return _context2.abrupt('return');

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2['catch'](1);
            return _context2.abrupt('return', ctx.respond.error('获取项目列表失败', { e: _context2.t0 }));

          case 12:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[1, 9]]);
  }));

  return function clientGetProjDetail(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var clientGetApiListByProject = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(ctx, next) {
    var finalParams, data;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            finalParams = ctx.finalParams;
            _context3.prev = 1;
            _context3.next = 4;
            return syncGet.getRemoteData('/mock/serverGetApiListByProject', finalParams);

          case 4:
            data = _context3.sent;

            ctx.body = data;
            return _context3.abrupt('return');

          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3['catch'](1);
            return _context3.abrupt('return', ctx.respond.error('获取项目列表失败', { e: _context3.t0 }));

          case 12:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[1, 9]]);
  }));

  return function clientGetApiListByProject(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var clientGetApiListByIds = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(ctx, next) {
    var finalParams, data;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            finalParams = ctx.finalParams;
            _context4.prev = 1;
            _context4.next = 4;
            return syncGet.getRemoteData('/mock/serverGetApiListByIds', finalParams);

          case 4:
            data = _context4.sent;

            ctx.body = data;
            return _context4.abrupt('return');

          case 9:
            _context4.prev = 9;
            _context4.t0 = _context4['catch'](1);
            return _context4.abrupt('return', ctx.respond.error('获取项目列表失败', { e: _context4.t0 }));

          case 12:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[1, 9]]);
  }));

  return function clientGetApiListByIds(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var clientGetProjDiff = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(ctx, next) {
    var res;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return syncDownload.getProjectListDiff();

          case 3:
            res = _context5.sent;

            ctx.body = res;
            return _context5.abrupt('return');

          case 8:
            _context5.prev = 8;
            _context5.t0 = _context5['catch'](0);
            return _context5.abrupt('return', ctx.respond.error('获取项目差异出错', { e: _context5.t0 }));

          case 11:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this, [[0, 8]]);
  }));

  return function clientGetProjDiff(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

var clientGetApiDiff = function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(ctx, next) {
    var finalParams, projUid, res;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            finalParams = ctx.finalParams;
            projUid = finalParams.id;
            _context6.prev = 2;

            if (projUid) {
              _context6.next = 5;
              break;
            }

            return _context6.abrupt('return', ctx.respond.error('请提供项目UID'));

          case 5:
            _context6.next = 7;
            return syncDownload.getApiListDiff(projUid);

          case 7:
            res = _context6.sent;

            if (res) {
              _context6.next = 10;
              break;
            }

            return _context6.abrupt('return', ctx.respond.error('项目不存在'));

          case 10:
            ctx.body = res;
            return _context6.abrupt('return');

          case 14:
            _context6.prev = 14;
            _context6.t0 = _context6['catch'](2);
            return _context6.abrupt('return', ctx.respond.error('获取API差异出错', { e: _context6.t0 }));

          case 17:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this, [[2, 14]]);
  }));

  return function clientGetApiDiff(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

var clientDownLoadProj = function () {
  var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(ctx, next) {
    var finalParams, projUid, data;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            finalParams = ctx.finalParams;
            projUid = finalParams.id;
            _context7.prev = 2;

            if (projUid) {
              _context7.next = 5;
              break;
            }

            return _context7.abrupt('return', ctx.respond.error('请提供项目UID'));

          case 5:
            _context7.next = 7;
            return syncDownload.downloadProject(projUid);

          case 7:
            data = _context7.sent;

            if (!data.code) {
              _context7.next = 11;
              break;
            }

            ctx.body = data;
            return _context7.abrupt('return');

          case 11:
            return _context7.abrupt('return', ctx.respond.success('下载项目成功', {}));

          case 14:
            _context7.prev = 14;
            _context7.t0 = _context7['catch'](2);
            return _context7.abrupt('return', ctx.respond.error('下载项目出错', { e: _context7.t0 }));

          case 17:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this, [[2, 14]]);
  }));

  return function clientDownLoadProj(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();

var clientDownLoadProjBase = function () {
  var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(ctx, next) {
    var finalParams, projUid, data;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            finalParams = ctx.finalParams;
            projUid = finalParams.id;
            _context8.prev = 2;

            if (projUid) {
              _context8.next = 5;
              break;
            }

            return _context8.abrupt('return', ctx.respond.error('请提供项目UID'));

          case 5:
            _context8.next = 7;
            return syncDownload.downloadProject(projUid);

          case 7:
            data = _context8.sent;

            if (!data.code) {
              _context8.next = 11;
              break;
            }

            ctx.body = data;
            return _context8.abrupt('return');

          case 11:
            return _context8.abrupt('return', ctx.respond.success('下载项目成功', {}));

          case 14:
            _context8.prev = 14;
            _context8.t0 = _context8['catch'](2);
            return _context8.abrupt('return', ctx.respond.error('下载项目出错', { e: _context8.t0 }));

          case 17:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this, [[2, 14]]);
  }));

  return function clientDownLoadProjBase(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();

var clientDownLoadApi = function () {
  var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(ctx, next) {
    var finalParams, ids, projUid, localProject, data, message;
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            finalParams = ctx.finalParams;
            ids = finalParams.ids;
            projUid = finalParams.project;
            localProject = finalParams.localProject;
            _context9.prev = 4;

            if (projUid) {
              _context9.next = 7;
              break;
            }

            return _context9.abrupt('return', ctx.respond.error('请提供本地项目UID'));

          case 7:
            if (localProject) {
              _context9.next = 9;
              break;
            }

            return _context9.abrupt('return', ctx.respond.error('请提供本地项目ID'));

          case 9:
            if (ids) {
              _context9.next = 11;
              break;
            }

            return _context9.abrupt('return', ctx.respond.error('请提供API的UID'));

          case 11:
            _context9.next = 13;
            return syncDownload.downloadApi(ids, projUid, localProject, finalParams);

          case 13:
            data = _context9.sent;

            if (!data.code) {
              _context9.next = 17;
              break;
            }

            ctx.body = data;
            return _context9.abrupt('return');

          case 17:
            message = '\u4E0B\u8F7DAPI\u6210\u529F ' + data.api.ok.length + ', \u5931\u8D25 ' + data.api.fail.length;
            return _context9.abrupt('return', ctx.respond.success(message, data));

          case 21:
            _context9.prev = 21;
            _context9.t0 = _context9['catch'](4);
            return _context9.abrupt('return', ctx.respond.error('下载API出错', { e: _context9.t0 }));

          case 24:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, this, [[4, 21]]);
  }));

  return function clientDownLoadApi(_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}();

var clientPushApiListById = function () {
  var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(ctx, next) {
    var finalParams, ids, projUid, data;
    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            finalParams = ctx.finalParams;
            ids = finalParams.ids;
            projUid = finalParams.project;
            _context10.prev = 3;

            ids = ids.split(',');

            if (projUid) {
              _context10.next = 7;
              break;
            }

            return _context10.abrupt('return', ctx.respond.error('请提供项目UID'));

          case 7:
            if (ids.length) {
              _context10.next = 9;
              break;
            }

            return _context10.abrupt('return', ctx.respond.error('请提供API的UID'));

          case 9:
            _context10.next = 11;
            return syncPush.pushApiToServerByIdList(ids, projUid, finalParams);

          case 11:
            data = _context10.sent;

            ctx.body = data;
            return _context10.abrupt('return');

          case 16:
            _context10.prev = 16;
            _context10.t0 = _context10['catch'](3);
            return _context10.abrupt('return', ctx.respond.error('下载API出错', { e: _context10.t0 }));

          case 19:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, this, [[3, 16]]);
  }));

  return function clientPushApiListById(_x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}();

var clientPushApiById = function () {
  var _ref11 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11(ctx, next) {
    var finalParams, id, projUid, data;
    return _regenerator2.default.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            finalParams = ctx.finalParams;
            id = finalParams.id;
            projUid = finalParams.project;
            _context11.prev = 3;

            if (projUid) {
              _context11.next = 6;
              break;
            }

            return _context11.abrupt('return', ctx.respond.error('请提供项目UID'));

          case 6:
            if (id) {
              _context11.next = 8;
              break;
            }

            return _context11.abrupt('return', ctx.respond.error('请提供API的UID'));

          case 8:
            _context11.next = 10;
            return syncPush.pushApiToServerById(id, projUid, finalParams);

          case 10:
            data = _context11.sent;

            ctx.body = data;
            return _context11.abrupt('return');

          case 15:
            _context11.prev = 15;
            _context11.t0 = _context11['catch'](3);
            return _context11.abrupt('return', ctx.respond.error('下载API出错', { e: _context11.t0 }));

          case 18:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, this, [[3, 15]]);
  }));

  return function clientPushApiById(_x21, _x22) {
    return _ref11.apply(this, arguments);
  };
}();

var clientPushApiByData = function () {
  var _ref12 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12(ctx, next) {
    var finalParams, apiData, projUid, data;
    return _regenerator2.default.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            finalParams = ctx.finalParams;
            apiData = finalParams.data;
            projUid = finalParams.project;
            _context12.prev = 3;

            if (projUid) {
              _context12.next = 6;
              break;
            }

            return _context12.abrupt('return', ctx.respond.error('请提供项目UID'));

          case 6:
            if (apiData) {
              _context12.next = 8;
              break;
            }

            return _context12.abrupt('return', ctx.respond.error('请提供API数据'));

          case 8:
            _context12.next = 10;
            return syncPush.pushApiToServerByData(apiData, projUid, finalParams);

          case 10:
            data = _context12.sent;

            ctx.body = data;
            return _context12.abrupt('return');

          case 15:
            _context12.prev = 15;
            _context12.t0 = _context12['catch'](3);
            return _context12.abrupt('return', ctx.respond.error('下载API出错', { e: _context12.t0 }));

          case 18:
          case 'end':
            return _context12.stop();
        }
      }
    }, _callee12, this, [[3, 15]]);
  }));

  return function clientPushApiByData(_x23, _x24) {
    return _ref12.apply(this, arguments);
  };
}();

var clientPushApiListByData = function () {
  var _ref13 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee13(ctx, next) {
    var finalParams, apiData, projUid, data;
    return _regenerator2.default.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            finalParams = ctx.finalParams;
            apiData = finalParams.data;
            projUid = finalParams.project;
            _context13.prev = 3;

            if (projUid) {
              _context13.next = 6;
              break;
            }

            return _context13.abrupt('return', ctx.respond.error('请提供项目UID'));

          case 6:
            if (apiData) {
              _context13.next = 8;
              break;
            }

            return _context13.abrupt('return', ctx.respond.error('请提供API数据'));

          case 8:
            _context13.next = 10;
            return syncPush.pushApiListToServerByData(apiData, projUid, finalParams);

          case 10:
            data = _context13.sent;

            ctx.body = data;
            return _context13.abrupt('return');

          case 15:
            _context13.prev = 15;
            _context13.t0 = _context13['catch'](3);
            return _context13.abrupt('return', ctx.respond.error('下载API出错', { e: _context13.t0 }));

          case 18:
          case 'end':
            return _context13.stop();
        }
      }
    }, _callee13, this, [[3, 15]]);
  }));

  return function clientPushApiListByData(_x25, _x26) {
    return _ref13.apply(this, arguments);
  };
}();

var serverGetProjList = function () {
  var _ref14 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee14(ctx, next) {
    var finalParams, data;
    return _regenerator2.default.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            finalParams = ctx.finalParams;
            _context14.prev = 1;
            _context14.next = 4;
            return projectGet.getProjectByQuery({}, finalParams);

          case 4:
            data = _context14.sent;
            return _context14.abrupt('return', ctx.respond.success('获取项目列表成功', data));

          case 8:
            _context14.prev = 8;
            _context14.t0 = _context14['catch'](1);
            return _context14.abrupt('return', ctx.respond.error('获取项目列表失败', { e: _context14.t0 }));

          case 11:
          case 'end':
            return _context14.stop();
        }
      }
    }, _callee14, this, [[1, 8]]);
  }));

  return function serverGetProjList(_x27, _x28) {
    return _ref14.apply(this, arguments);
  };
}();

var serverGetProj = function () {
  var _ref15 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee15(ctx, next) {
    var finalParams, id, type, data;
    return _regenerator2.default.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            finalParams = ctx.finalParams;
            id = finalParams.id;
            type = finalParams.type || 'detail';
            _context15.prev = 3;
            _context15.next = 6;
            return syncGet.getProjectByUid(id, type === 'detail');

          case 6:
            data = _context15.sent;
            return _context15.abrupt('return', ctx.respond.success('成功', data));

          case 10:
            _context15.prev = 10;
            _context15.t0 = _context15['catch'](3);
            return _context15.abrupt('return', ctx.respond.error('下载项目信息出错', { e: _context15.t0 }));

          case 13:
          case 'end':
            return _context15.stop();
        }
      }
    }, _callee15, this, [[3, 10]]);
  }));

  return function serverGetProj(_x29, _x30) {
    return _ref15.apply(this, arguments);
  };
}();

var serverGetApiListByProject = function () {
  var _ref16 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee16(ctx, next) {
    var finalParams, id, data;
    return _regenerator2.default.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            finalParams = ctx.finalParams;
            id = finalParams.id;
            _context16.prev = 2;

            if (id) {
              _context16.next = 5;
              break;
            }

            return _context16.abrupt('return', ctx.respond.error('下载的API长度不能为空'));

          case 5:
            _context16.next = 7;
            return syncGet.getApiListByProjectUid(id, finalParams);

          case 7:
            data = _context16.sent;
            return _context16.abrupt('return', ctx.respond.success('获取API列表成功', data));

          case 11:
            _context16.prev = 11;
            _context16.t0 = _context16['catch'](2);
            return _context16.abrupt('return', ctx.respond.error('下载api信息出错', { e: _context16.t0 }));

          case 14:
          case 'end':
            return _context16.stop();
        }
      }
    }, _callee16, this, [[2, 11]]);
  }));

  return function serverGetApiListByProject(_x31, _x32) {
    return _ref16.apply(this, arguments);
  };
}();

var serverGetApi = function () {
  var _ref17 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee17(ctx, next) {
    var finalParams, ids, project, data;
    return _regenerator2.default.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            finalParams = ctx.finalParams;
            ids = finalParams.ids.split(',');
            project = finalParams.project;
            _context17.prev = 3;

            if (ids.length) {
              _context17.next = 6;
              break;
            }

            return _context17.abrupt('return', ctx.respond.error('下载的API长度不能为空'));

          case 6:
            if (project) {
              _context17.next = 8;
              break;
            }

            return _context17.abrupt('return', ctx.respond.error('请提供项目的UID'));

          case 8:
            _context17.next = 10;
            return syncGet.getApiListByUid(ids, project);

          case 10:
            data = _context17.sent;

            if (data) {
              _context17.next = 13;
              break;
            }

            return _context17.abrupt('return', ctx.respond.error('项目不存在'));

          case 13:
            return _context17.abrupt('return', ctx.respond.success('获取API列表成功', { api: data }));

          case 16:
            _context17.prev = 16;
            _context17.t0 = _context17['catch'](3);
            return _context17.abrupt('return', ctx.respond.error('下载api信息出错', { e: _context17.t0 }));

          case 19:
          case 'end':
            return _context17.stop();
        }
      }
    }, _callee17, this, [[3, 16]]);
  }));

  return function serverGetApi(_x33, _x34) {
    return _ref17.apply(this, arguments);
  };
}();

var serverDiffApi = function () {
  var _ref18 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee18(ctx, next) {
    var finalParams, projUid, fromApi, data;
    return _regenerator2.default.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            finalParams = ctx.finalParams;
            projUid = finalParams.id;
            fromApi = finalParams.data;
            _context18.prev = 3;

            if (projUid) {
              _context18.next = 6;
              break;
            }

            return _context18.abrupt('return', ctx.respond.error('下载的项目UID不存在'));

          case 6:
            if (fromApi) {
              _context18.next = 8;
              break;
            }

            return _context18.abrupt('return', ctx.respond.error('下载的API信息不存在'));

          case 8:
            _context18.next = 10;
            return syncDiff.diffApiListDataByTime({ _uid: projUid }, fromApi);

          case 10:
            data = _context18.sent;

            if (data) {
              _context18.next = 13;
              break;
            }

            return _context18.abrupt('return', ctx.respond.error('项目不存在'));

          case 13:
            return _context18.abrupt('return', ctx.respond.success('获取API列表成功', data));

          case 16:
            _context18.prev = 16;
            _context18.t0 = _context18['catch'](3);
            return _context18.abrupt('return', ctx.respond.error('获取API差异出错', { e: _context18.t0 }));

          case 19:
          case 'end':
            return _context18.stop();
        }
      }
    }, _callee18, this, [[3, 16]]);
  }));

  return function serverDiffApi(_x35, _x36) {
    return _ref18.apply(this, arguments);
  };
}();

var serverDiffProj = function () {
  var _ref19 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee19(ctx, next) {
    var finalParams, fromApi, data;
    return _regenerator2.default.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            finalParams = ctx.finalParams;
            fromApi = finalParams.data;
            _context19.prev = 2;

            if (fromApi) {
              _context19.next = 5;
              break;
            }

            return _context19.abrupt('return', ctx.respond.error('下载的项目信息不存在'));

          case 5:
            _context19.next = 7;
            return syncDiff.diffProjectListDataByTime({}, fromApi);

          case 7:
            data = _context19.sent;
            return _context19.abrupt('return', ctx.respond.success('获取项目列表成功', data));

          case 11:
            _context19.prev = 11;
            _context19.t0 = _context19['catch'](2);
            return _context19.abrupt('return', ctx.respond.error('获取项目差异出错', { e: _context19.t0 }));

          case 14:
          case 'end':
            return _context19.stop();
        }
      }
    }, _callee19, this, [[2, 11]]);
  }));

  return function serverDiffProj(_x37, _x38) {
    return _ref19.apply(this, arguments);
  };
}();

var serverReceiveApi = function () {
  var _ref20 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee20(ctx, next) {
    var finalParams, apiData, projectUid, data;
    return _regenerator2.default.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            finalParams = ctx.finalParams;
            apiData = finalParams.data;
            projectUid = finalParams.project;
            _context20.prev = 3;

            if (apiData) {
              _context20.next = 6;
              break;
            }

            return _context20.abrupt('return', ctx.respond.error('请提供API'));

          case 6:
            if (projectUid) {
              _context20.next = 8;
              break;
            }

            return _context20.abrupt('return', ctx.respond.error('请提供项目的UID'));

          case 8:
            _context20.next = 10;
            return syncReceive.saveDownloadApi(apiData, projectUid, finalParams);

          case 10:
            data = _context20.sent;

            if (data) {
              _context20.next = 13;
              break;
            }

            return _context20.abrupt('return', ctx.respond.error('API或项目不存在'));

          case 13:
            if (!data.code) {
              _context20.next = 15;
              break;
            }

            return _context20.abrupt('return', ctx.respond.error(data));

          case 15:
            return _context20.abrupt('return', ctx.respond.success('接收API成功', data));

          case 18:
            _context20.prev = 18;
            _context20.t0 = _context20['catch'](3);
            return _context20.abrupt('return', ctx.respond.error('接收API失败', { e: _context20.t0 }));

          case 21:
          case 'end':
            return _context20.stop();
        }
      }
    }, _callee20, this, [[3, 18]]);
  }));

  return function serverReceiveApi(_x39, _x40) {
    return _ref20.apply(this, arguments);
  };
}();

var serverReceiveApiList = function () {
  var _ref21 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee21(ctx, next) {
    var finalParams, apiData, projectUid, data;
    return _regenerator2.default.wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            finalParams = ctx.finalParams;
            apiData = finalParams.data;
            projectUid = finalParams.project;
            _context21.prev = 3;

            if (apiData) {
              _context21.next = 6;
              break;
            }

            return _context21.abrupt('return', ctx.respond.error('请提供API'));

          case 6:
            if (projectUid) {
              _context21.next = 8;
              break;
            }

            return _context21.abrupt('return', ctx.respond.error('请提供项目的UID'));

          case 8:
            _context21.next = 10;
            return syncReceive.saveDownloadApiList(apiData, projectUid, finalParams);

          case 10:
            data = _context21.sent;

            if (data) {
              _context21.next = 13;
              break;
            }

            return _context21.abrupt('return', ctx.respond.error('API或项目不存在'));

          case 13:
            if (!data.code) {
              _context21.next = 15;
              break;
            }

            return _context21.abrupt('return', ctx.respond.error(data));

          case 15:
            return _context21.abrupt('return', ctx.respond.success('接收API成功', data));

          case 18:
            _context21.prev = 18;
            _context21.t0 = _context21['catch'](3);
            return _context21.abrupt('return', ctx.respond.error('接收API失败', { e: _context21.t0 }));

          case 21:
          case 'end':
            return _context21.stop();
        }
      }
    }, _callee21, this, [[3, 18]]);
  }));

  return function serverReceiveApiList(_x41, _x42) {
    return _ref21.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var projectGet = require('../service/project/service.get');

var syncGet = require('../service/sync/service.get');
var syncDiff = require('../service/sync/service.diff');
var syncDownload = require('../service/sync/service.download');
var syncReceive = require('../service/sync/service.receive');
var syncPush = require('../service/sync/service.push');

module.exports = {
  clientGetProjList: clientGetProjList,
  clientGetProjDetail: clientGetProjDetail,
  clientGetApiListByProject: clientGetApiListByProject,
  clientGetApiListByIds: clientGetApiListByIds,

  clientGetProjDiff: clientGetProjDiff,
  clientGetApiDiff: clientGetApiDiff,

  clientDownLoadProj: clientDownLoadProj,
  clientDownLoadProjBase: clientDownLoadProjBase,
  clientDownLoadApi: clientDownLoadApi,

  clientPushApiListById: clientPushApiListById,
  clientPushApiById: clientPushApiById,
  clientPushApiByData: clientPushApiByData,
  clientPushApiListByData: clientPushApiListByData,

  serverGetProjList: serverGetProjList,
  serverGetApiListByProject: serverGetApiListByProject,
  serverGetProj: serverGetProj,
  serverGetApi: serverGetApi,

  serverDiffProj: serverDiffProj,
  serverDiffApi: serverDiffApi,
  serverReceiveApi: serverReceiveApi,
  serverReceiveApiList: serverReceiveApiList
};