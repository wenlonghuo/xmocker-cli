'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var removeFile = require('fs').unlinkSync;
var Datastore = require('nedb-promise');
var join = require('path').join;
var timer = require('../util/timer');
var userDirectory = join(process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'], '.mocker/v1/db');

function createDatabase(dir, name, option) {
  var opt = { filename: join(dir, name), autoload: true };
  (0, _assign2.default)(opt, option);
  return new Datastore(opt);
}

function removeDb(dir, name) {
  var filename = join(dir, name);
  removeFile(filename);
}

function initDatabase() {
  var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var dir = option.location || userDirectory;
  var createDb = createDatabase.bind(null, dir);

  var apiBase = createDb('/apiBase');

  var apiModel = createDb('/apiModel');

  var appBase = createDb('/appBase');

  var project = createDb('/project');

  var Lib = createDb('/lib');

  var commonDB = createDb('/commonDB');

  var dynDB = createDb('/dynDB');

  var collectorDB = createDb('/log/collectorDB');

  var recordDB = createDb('/log/recordDB');

  var td = +new Date() - 1000 * 60 * 60 * 24 * 5;
  var tdStr = timer(td);

  var proxyDB = createDb('/log/proxyDB', {
    onload: function onload(e) {
      if (e) {
        console.error('proxyDB: ', e);
        console.error('the file will be removed now, you may need to restart service');
        removeDb(dir, '/log/proxyDB');
        return;
      }
      proxyDB.remove({ time: { $lte: td } }, { multi: true }).catch(function (e) {
        console.log(e);
      });
      proxyDB.remove({ time: { $lte: tdStr } }, { multi: true }).catch(function (e) {
        console.log(e);
      });
    }
  });
  var errorDB = createDb('/log/error', {
    onload: function onload(e) {
      if (e) {
        console.error('errordb: ', e);
        console.error('the file will be removed now, you may need to restart service');
        removeDb(dir, '/log/error');
        return;
      }
      errorDB.remove({ time: { $lte: td } }, { multi: true }).catch(function (e) {
        console.log(e);
      });
      errorDB.remove({ time: { $lte: tdStr } }, { multi: true }).catch(function (e) {
        console.log(e);
      });
    }
  });
  var hisDB = createDb('/log/his', {
    onload: function onload(e) {
      if (e) {
        console.error('hisDb: ', e);
        console.error('the file will be removed now, you may need to restart service');
        removeDb(dir, '/log/his');
        return;
      }
      hisDB.remove({ time: { $lte: td } }, { multi: true }).catch(function (e) {
        console.log(e);
      });
      hisDB.remove({ time: { $lte: tdStr } }, { multi: true }).catch(function (e) {
        console.log(e);
      });
    }
  });

  return {
    apiBase: apiBase,
    apiModel: apiModel,
    appBase: appBase,
    project: project,
    commonDB: commonDB,
    dynDB: dynDB,
    recordDB: recordDB,
    proxyDB: proxyDB,
    errorDB: errorDB,
    hisDB: hisDB,
    Lib: Lib,
    collectorDB: collectorDB
  };
}

module.exports = initDatabase();