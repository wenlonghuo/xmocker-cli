'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function timer(date) {
  if ((typeof date === 'undefined' ? 'undefined' : (0, _typeof3.default)(date)) !== 'object') date = date == null ? new Date() : new Date(date);
  if (isNaN(date.getTime())) date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  var str = date.toISOString();
  return str.slice(0, 10) + ' ' + str.slice(11, 23);
};

module.exports.formatArrTime = function formatArrTime() {
  var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ['createdAt', 'updatedAt'];
  var len = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 16;

  var result = [];
  result = arr.map(function (item) {
    if (item.toJSON) item = item.toJSON();
    keys.forEach(function (key) {
      if (item[key]) {
        item[key] = item[key].slice(0, len);
      }
    });
    return item;
  });
  return result;
};