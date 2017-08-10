'use strict';

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isDev = process.env.NODE_ENV === 'development';
var inspect = require('util').inspect;
var chalk = require('chalk');

var prettyObject = isDev ? prettyObjectDev : prettyObjectProd;

function prettyObjectProd(obj) {
  if (obj && obj.toJSON) obj = obj.toJSON();
  if ((typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) !== 'object') return String(obj);
  if (obj instanceof Error) {
    return obj.message + '\n ' + obj.stack;
  }
  return (0, _stringify2.default)(obj);
}

function prettyObjectDev(obj) {
  if (obj && obj.toJSON) obj = obj.toJSON();
  if ((typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) !== 'object' || !obj || obj instanceof Error || !obj.time) return inspect(obj);
  var str = '\n';
  for (var key in obj) {
    var head = chalk.green(key);
    var body = obj[key];
    if (body && body.toJSON) body = body.toJSON();
    body = inspect(body, { depth: 20, colors: true });
    str += head + ' -> ' + body + '\n';
  }
  return str;
}

module.exports = function stringify() {
  var str = '';
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)(arguments), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var arg = _step.value;

      str += (typeof arg === 'undefined' ? 'undefined' : (0, _typeof3.default)(arg)) === 'object' ? prettyObject(arg) : String(arg);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return str;
};

module.exports.stringifyPretty = function stringifyPretty() {
  var str = '';
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = (0, _getIterator3.default)(arguments), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var arg = _step2.value;

      str += (typeof arg === 'undefined' ? 'undefined' : (0, _typeof3.default)(arg)) === 'object' ? prettyObjectDev(arg) : String(arg);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return str;
};