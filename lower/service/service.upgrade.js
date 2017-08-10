'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var upgradeFromV0 = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var fileExist, db0, projList, i, proj, fPid, query, nProj;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            fileExist = fs.existsSync(path.join(__dirname, '../../../db/app/project'));

            if (fileExist) {
              _context.next = 3;
              break;
            }

            throw new Error('v0版本的数据不存在，请检查文件是否存在');

          case 3:
            db0 = require('../../database/v0');
            _context.prev = 4;
            _context.next = 7;
            return db0.appProject.cfind({}).exec();

          case 7:
            projList = _context.sent;
            i = 0;

          case 9:
            if (!(i < projList.length)) {
              _context.next = 29;
              break;
            }

            proj = projList[i];
            fPid = proj._id;

            if (!proj._uid) proj._uid = uid();
            proj._mt = +new Date();

            delete proj._id;
            delete proj.state;
            delete proj.error;
            delete proj.repeatTime;
            delete proj.webpack;

            query = { name: proj.name, shortcut: proj.shortcut, path: proj.path, port: proj.port };
            _context.next = 22;
            return db.project.update(query, { $set: proj }, { returnUpdatedDocs: true, upsert: true });

          case 22:
            nProj = _context.sent;

            nProj = nProj[1]._id;
            _context.next = 26;
            return upgradeApiFromV0({ id: fPid, db: db0.apiBase }, { id: nProj, db: db.apiBase }, db0);

          case 26:
            i++;
            _context.next = 9;
            break;

          case 29:
            _context.next = 34;
            break;

          case 31:
            _context.prev = 31;
            _context.t0 = _context['catch'](4);
            throw _context.t0;

          case 34:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[4, 31]]);
  }));

  return function upgradeFromV0() {
    return _ref.apply(this, arguments);
  };
}();

var upgradeApiFromV0 = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
    var f = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var db0 = arguments[2];
    var fid, fdb, tid, tdb, fBase, i, base, fBaseId, query, apiId;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            fid = f.id;
            fdb = f.db;
            tid = t.id;
            tdb = t.db;

            if (!(!fid || !fdb || !tid || !tdb)) {
              _context2.next = 6;
              break;
            }

            throw new Error('id or db does not exist');

          case 6:
            _context2.next = 8;
            return fdb.cfind({ project: fid }).exec();

          case 8:
            fBase = _context2.sent;
            i = 0;

          case 10:
            if (!(i < fBase.length)) {
              _context2.next = 29;
              break;
            }

            base = fBase[i];
            fBaseId = base._id;

            if (!base._uid) base._uid = uid();
            delete base._id;
            base.project = tid;
            base._mt = +new Date();
            if (base.path) base.pathEqual = base.name;
            base.method = base.method.toUpperCase();

            query = { path: base.path, pathEqual: base.pathEqual, url: base.url, method: base.method, project: base.project };
            _context2.next = 22;
            return tdb.update(query, { $set: base }, { returnUpdatedDocs: true, upsert: true });

          case 22:
            apiId = _context2.sent;

            apiId = apiId[1]._id;
            _context2.next = 26;
            return upgradeApiModelFromV0({ id: fBaseId, db: db0.apiModel }, { id: apiId, db: db.apiModel });

          case 26:
            i++;
            _context2.next = 10;
            break;

          case 29:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function upgradeApiFromV0() {
    return _ref2.apply(this, arguments);
  };
}();

var upgradeApiModelFromV0 = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
    var f = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var fid, fdb, tid, tdb, fModel, i, model, query;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            fid = f.id;
            fdb = f.db;
            tid = t.id;
            tdb = t.db;

            if (!(!fid || !fdb || !tid || !tdb)) {
              _context3.next = 6;
              break;
            }

            throw new Error('id or db does not exist');

          case 6:
            _context3.next = 8;
            return fdb.cfind({ baseid: fid }).exec();

          case 8:
            fModel = _context3.sent;
            i = 0;

          case 10:
            if (!(i < fModel.length)) {
              _context3.next = 24;
              break;
            }

            model = fModel[i];


            if (!model._uid) model._uid = uid();
            delete model._id;
            model.baseid = tid;
            model._mt = +new Date();
            if (Array.isArray(model.data)) model.data = model.data[0];
            model.inputParam = correctInput(model.inputParam);

            query = { baseid: model.baseid, name: model.name, condition: model.condition };
            _context3.next = 21;
            return tdb.update(query, { $set: model }, { returnUpdatedDocs: true, upsert: true });

          case 21:
            i++;
            _context3.next = 10;
            break;

          case 24:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function upgradeApiModelFromV0() {
    return _ref3.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
var path = require('path');
var db = require('../database');
var uid = require('../util/common').uid();

module.exports = {
  upgradeFromV0: upgradeFromV0
};

function correctInput(input) {
  var obj = {
    type: 'object',
    properties: set2NewKey(input)
  };
  return obj;
}

function set2NewKey(obj) {
  var result = {};
  (0, _keys2.default)(obj).forEach(function (item) {
    if (item.type !== 'object') {
      result[item] = obj[item];
    } else {
      var info = result[item];
      var nObj = info.child;
      delete info.child;
      result.title = info.cname || info.name;
      delete info.cname;
      delete info.name;
      if (nObj) info.properties = set2NewKey(nObj);
    }
  });
  return result;
}