'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getProjectListDiff = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var url, projList, res;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        url = '/mock/serverDiffProj';
                        _context.next = 4;
                        return Project.cfind({}).exec();

                    case 4:
                        projList = _context.sent;
                        _context.next = 7;
                        return request.put(url, { data: projList });

                    case 7:
                        res = _context.sent;
                        return _context.abrupt('return', res);

                    case 11:
                        _context.prev = 11;
                        _context.t0 = _context['catch'](0);
                        throw _context.t0;

                    case 14:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[0, 11]]);
    }));

    return function getProjectListDiff() {
        return _ref.apply(this, arguments);
    };
}();

var getApiListDiff = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(projectUid) {
        var url, proj, projectId, option, api, apiList, res;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.prev = 0;
                        url = '/mock/serverDiffApi';
                        _context2.next = 4;
                        return projectGet.getProjectDetailByQuery({ _uid: projectUid });

                    case 4:
                        proj = _context2.sent;

                        if (proj) {
                            _context2.next = 7;
                            break;
                        }

                        throw new Error('项目的UID不正确');

                    case 7:
                        projectId = proj._id;
                        option = {
                            pageSize: 10000,
                            pageNo: 0,
                            order: 1,
                            sortBy: '_mt'
                        };
                        _context2.next = 11;
                        return apiGet.getApiByProject(projectId, option, true);

                    case 11:
                        api = _context2.sent;

                        if (api) {
                            _context2.next = 14;
                            break;
                        }

                        return _context2.abrupt('return');

                    case 14:
                        apiList = api.list;
                        _context2.next = 17;
                        return request.put(url, { data: apiList, id: projectUid });

                    case 17:
                        res = _context2.sent;
                        return _context2.abrupt('return', res);

                    case 21:
                        _context2.prev = 21;
                        _context2.t0 = _context2['catch'](0);
                        throw _context2.t0;

                    case 24:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[0, 21]]);
    }));

    return function getApiListDiff(_x) {
        return _ref2.apply(this, arguments);
    };
}();

var downloadProject = function () {
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(remoteUid) {
        var url, proj, type, res, serverProj, serverApi, params, result, newProj, projResult, apiResult;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.prev = 0;
                        url = '/mock/serverGetProj';
                        _context3.next = 4;
                        return projectGet.getProjectDetailByQuery({ _uid: remoteUid });

                    case 4:
                        proj = _context3.sent;
                        type = proj ? 'base' : 'detail';
                        _context3.next = 8;
                        return request.get(url, { id: remoteUid, type: type });

                    case 8:
                        res = _context3.sent;

                        if (!res.code) {
                            _context3.next = 11;
                            break;
                        }

                        return _context3.abrupt('return', res);

                    case 11:
                        serverProj = res.data.proj;
                        serverApi = res.data.api;

                        if (!proj) {
                            _context3.next = 19;
                            break;
                        }

                        params = {
                            urls: serverProj.urls,
                            proxyTable: serverProj.proxyTable,
                            gulp: serverProj.gulp
                        };
                        _context3.next = 17;
                        return Project.update({ _id: proj._id }, params);

                    case 17:
                        result = _context3.sent;
                        return _context3.abrupt('return', { project: result[1] });

                    case 19:
                        newProj = (0, _assign2.default)({}, serverProj, { parentId: undefined, _id: undefined });
                        _context3.next = 22;
                        return Project.insert(newProj);

                    case 22:
                        projResult = _context3.sent;
                        _context3.next = 25;
                        return syncReceive.copyApiList(serverApi, projResult._id, {});

                    case 25:
                        apiResult = _context3.sent;
                        return _context3.abrupt('return', { proj: projResult, api: apiResult });

                    case 29:
                        _context3.prev = 29;
                        _context3.t0 = _context3['catch'](0);
                        throw _context3.t0;

                    case 32:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this, [[0, 29]]);
    }));

    return function downloadProject(_x2) {
        return _ref3.apply(this, arguments);
    };
}();

var downloadApi = function () {
    var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(apiUids, projectUid, projectId, _ref5) {
        var force = _ref5.force,
            forceRemove = _ref5.forceRemove;
        var url, res, serverApi, apiResult;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.prev = 0;
                        url = '/mock/serverGetApi';
                        _context4.next = 4;
                        return request.get(url, { ids: apiUids, project: projectUid });

                    case 4:
                        res = _context4.sent;

                        if (!res.code) {
                            _context4.next = 7;
                            break;
                        }

                        return _context4.abrupt('return', res);

                    case 7:
                        serverApi = res.data.api;
                        _context4.next = 10;
                        return syncReceive.copyApiList(serverApi, projectId, { force: force, forceRemove: forceRemove });

                    case 10:
                        apiResult = _context4.sent;


                        reloadDatabase({ type: 'project', id: projectId, dbs: ['project', 'apiBase', 'apiModel'] });

                        return _context4.abrupt('return', { api: apiResult });

                    case 15:
                        _context4.prev = 15;
                        _context4.t0 = _context4['catch'](0);
                        throw _context4.t0;

                    case 18:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, this, [[0, 15]]);
    }));

    return function downloadApi(_x3, _x4, _x5, _x6) {
        return _ref4.apply(this, arguments);
    };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = require('../../database');
var Project = db.project;

var request = require('./service.request').request;
var projectGet = require('../project/service.get');
var apiGet = require('../api/service.get');
var syncReceive = require('./service.receive');
var reloadDatabase = require('../service.ctrlProc').reload.add;

module.exports = {
    getProjectListDiff: getProjectListDiff,
    getApiListDiff: getApiListDiff,
    downloadProject: downloadProject,
    downloadApi: downloadApi
};