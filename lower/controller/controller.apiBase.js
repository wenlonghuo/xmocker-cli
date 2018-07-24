'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getApiDetail = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {
    var finalParams, result;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            finalParams = ctx.finalParams;
            _context.prev = 1;

            if (finalParams.id) {
              _context.next = 4;
              break;
            }

            return _context.abrupt('return', ctx.respond.error('请提供API的ID'));

          case 4:
            _context.next = 6;
            return apiGet.getApiById(finalParams.id);

          case 6:
            result = _context.sent;

            if (result) {
              _context.next = 9;
              break;
            }

            return _context.abrupt('return', ctx.respond.error('查询的API不存在或者已删除'));

          case 9:
            ctx.respond.success('获取API详情成功', { result: result });
            _context.next = 15;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context['catch'](1);
            return _context.abrupt('return', ctx.respond.error('查询api详细信息出错', { e: _context.t0 }));

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 12]]);
  }));

  return function getApiDetail(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var getApiList = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(ctx, next) {
    var finalParams, result;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            finalParams = ctx.finalParams;
            _context2.prev = 1;

            if (finalParams.project) {
              _context2.next = 4;
              break;
            }

            return _context2.abrupt('return', ctx.respond.error('请提供项目的ID'));

          case 4:
            _context2.next = 6;
            return apiGet.getApiByProject(finalParams.project, finalParams, true);

          case 6:
            result = _context2.sent;
            return _context2.abrupt('return', ctx.respond.success('获取API列表成功', result));

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2['catch'](1);
            return _context2.abrupt('return', ctx.respond.error('查询api列表出错', { e: _context2.t0 }));

          case 13:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[1, 10]]);
  }));

  return function getApiList(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var getApiBase = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(ctx, next) {
    var finalParams, option, query, result;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            finalParams = ctx.finalParams;
            option = (0, _assign2.default)({}, finalParams);
            query = {
              project: finalParams.project
            };


            if (finalParams.name) {
              query.name = { $in: finalParams.name.split(',') };
            }

            _context3.prev = 4;
            _context3.next = 7;
            return apiGet.getApiByQuery(query, option);

          case 7:
            result = _context3.sent;
            return _context3.abrupt('return', ctx.respond.success('获取API列表成功', result));

          case 11:
            _context3.prev = 11;
            _context3.t0 = _context3['catch'](4);
            return _context3.abrupt('return', ctx.respond.error('查询api列表出错', { e: _context3.t0 }));

          case 14:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[4, 11]]);
  }));

  return function getApiBase(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var searchApiBase = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(ctx, next) {
    var finalParams, option, words, project, regex, query, result;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            finalParams = ctx.finalParams;
            option = (0, _assign2.default)({}, finalParams);
            words = finalParams.words;
            project = finalParams.project;
            regex = new RegExp(words, 'i');
            query = {
              $or: [{
                project: project,
                name: { $regex: regex }
              }, {
                project: project,
                description: { $regex: regex }
              }]
            };
            _context4.prev = 6;
            _context4.next = 9;
            return apiGet.getApiByQuery(query, option);

          case 9:
            result = _context4.sent;
            return _context4.abrupt('return', ctx.respond.success('搜索API列表成功', result));

          case 13:
            _context4.prev = 13;
            _context4.t0 = _context4['catch'](6);
            return _context4.abrupt('return', ctx.respond.error('搜索API出错', { e: _context4.t0 }));

          case 16:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[6, 13]]);
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
            _context5.prev = 1;
            _context5.next = 4;
            return apiEdit.addApi(finalParams);

          case 4:
            data = _context5.sent;

            if (!data.code) {
              _context5.next = 7;
              break;
            }

            return _context5.abrupt('return', ctx.respond.error(data));

          case 7:
            return _context5.abrupt('return', ctx.respond.success('添加api基础信息成功', { result: data.data }));

          case 10:
            _context5.prev = 10;
            _context5.t0 = _context5['catch'](1);
            return _context5.abrupt('return', ctx.respond.error('添加api基础信息出错', { e: _context5.t0 }));

          case 13:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this, [[1, 10]]);
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

            finalParams.id = undefined;

            data = void 0;
            _context6.prev = 4;
            _context6.next = 7;
            return apiEdit.editApi(id, finalParams);

          case 7:
            data = _context6.sent;

            if (!data.code) {
              _context6.next = 10;
              break;
            }

            return _context6.abrupt('return', ctx.respond.error(data));

          case 10:
            return _context6.abrupt('return', ctx.respond.success('编辑api基础信息成功', { result: data.data }));

          case 13:
            _context6.prev = 13;
            _context6.t0 = _context6['catch'](4);
            return _context6.abrupt('return', ctx.respond.error('编辑api基础信息出错', { e: _context6.t0 }));

          case 16:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this, [[4, 13]]);
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
            _context7.prev = 1;
            _context7.next = 4;
            return apiEdit.deleteApi(finalParams.id);

          case 4:
            data = _context7.sent;

            if (!data.code) {
              _context7.next = 7;
              break;
            }

            return _context7.abrupt('return', ctx.respond.error(data));

          case 7:
            return _context7.abrupt('return', ctx.respond.success('删除API成功', { result: data.data }));

          case 10:
            _context7.prev = 10;
            _context7.t0 = _context7['catch'](1);
            return _context7.abrupt('return', ctx.respond.error('删除api基础信息出错', { e: _context7.t0 }));

          case 13:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this, [[1, 10]]);
  }));

  return function deleteApiBase(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();

var copyApi = function () {
  var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(ctx, next) {
    var finalParams, apiIds, projList, result;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            finalParams = ctx.finalParams;
            apiIds = finalParams.from.split(',');
            projList = finalParams.to.split(',');
            _context8.prev = 3;
            _context8.next = 6;
            return apiCopy.copyApi(apiIds, projList, finalParams);

          case 6:
            result = _context8.sent;

            if (!result.code) {
              _context8.next = 9;
              break;
            }

            return _context8.abrupt('return', ctx.respond.error(result));

          case 9:
            return _context8.abrupt('return', ctx.respond.success('复制API成功', result.data));

          case 12:
            _context8.prev = 12;
            _context8.t0 = _context8['catch'](3);
            return _context8.abrupt('return', ctx.respond.error('复制api出错', { e: _context8.t0 }));

          case 15:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this, [[3, 12]]);
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
              message: '项目尚未启动'
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

var apiGet = require('../service/api/service.get.js');
var apiEdit = require('../service/api/service.edit.js');
var apiCopy = require('../service/api/service.copy.js');

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