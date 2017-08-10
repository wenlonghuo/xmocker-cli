'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loadFileList = require('../util/loadFileList');
var schema = {};
loadFileList(__dirname, 'schema', function (file) {
  var obj = require(file);
  (0, _keys2.default)(obj).forEach(function (type) {
    if (!schema[type]) schema[type] = {};
    (0, _keys2.default)(obj[type]).forEach(function (name) {
      schema[type][name] = obj[type][name];
    });
  });
  return obj;
});

module.exports = schema;