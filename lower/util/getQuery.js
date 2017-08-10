'use strict';

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var queryType = {
  project: {
    type: 'regexp'
  },
  api: {
    type: 'regexp'
  },
  apiModel: {
    type: 'regexp'
  },
  ip: {
    type: 'regexp'
  },
  client: {
    type: 'object',
    children: {
      browser: {
        type: 'object',
        children: {
          name: {
            type: 'regexp'
          },
          version: {
            type: 'regexp'
          }
        }
      },
      device: {
        type: 'object',
        children: {
          model: {
            type: 'regexp'
          },
          type: {
            type: 'regexp'
          },
          major: {
            type: 'regexp'
          }
        }
      },
      os: {
        type: 'object',
        children: {
          name: {
            type: 'regexp'
          },
          version: {
            type: 'regexp'
          }
        }
      }
    }
  }
};

function setQuery(schema, data) {
  var query = {};
  (0, _keys2.default)(schema).forEach(function (key) {
    var val = data[key];
    var sval = schema[key];
    if (val) {
      if (sval.type === 'regexp') {
        query[key] = { $regex: new RegExp(val, 'i') };
      } else if (sval.type === 'object') {
        if (typeof val === 'string' && val) {
          query[key] = setListOrQuery(sval.children, val);
        } else if ((typeof val === 'undefined' ? 'undefined' : (0, _typeof3.default)(val)) === 'object') {
          var childQuery = setQuery(sval.children, val);
          if (childQuery && (0, _keys2.default)(childQuery).length) query[key] = childQuery;
        }
      }
    }
  });
  return query;
}

function setListOrQuery(schema, str) {
  var query = { $or: [] };
  (0, _keys2.default)(schema).forEach(function (key) {
    var sval = schema[key];
    var obj = {};
    if (sval.type === 'regexp') {
      obj[key] = { $regex: new RegExp(str, 'i') };
      query.$or.push(obj);
    } else if (sval.type === 'object') {
      obj[key] = setListOrQuery(sval.children, str);
      if (obj[key]) query.$or.push(obj);
    }
  });
  if (query.$or.length) return query;
}

function convertObject2Dot() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var normal = {};
  var multi = [];
  (0, _keys2.default)(obj).forEach(function (key) {
    var val = obj[key];
    if (val.$regex) {
      normal[key] = val;
    } else {
      var chains = getKeyChain(val, key);
      chains.forEach(function (chain) {
        if (chain.key) {
          normal[chain.key] = chain.val;
        } else if (chain.$or) {
          multi.push.apply(multi, (0, _toConsumableArray3.default)(chain.$or));
        }
      });
    }
  });
  if (!multi.length) return normal;
  multi.forEach(function (m) {
    (0, _assign2.default)(m, normal);
  });
  return { $or: multi };
}

function getKeyChain() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var startName = arguments[1];

  var arr = [];
  (0, _keys2.default)(obj).forEach(function (key) {
    var val = obj[key];
    var nowName = startName ? startName + '.' + key : key;
    if (val.$regex) {
      arr.push({ key: nowName, val: val });
    } else if (val.$or) {
      val.$or.forEach(function (item) {
        var data = getKeyChain(item, nowName);
        var orArr = [];
        data.forEach(function (subItem) {
          orArr.push((0, _defineProperty3.default)({}, subItem.key, subItem.val));
        });
        if (orArr.length) arr.push({ $or: orArr });
      });
    } else {
      var data = getKeyChain(val, nowName);
      arr.push.apply(arr, (0, _toConsumableArray3.default)(data));
    }
  });
  return arr;
}

module.exports = setQuery;
module.exports.schema = queryType;
module.exports.getKeyChain = getKeyChain;
module.exports.getQuery = function (data) {
  var obj = setQuery(queryType, data);
  return convertObject2Dot(obj);
};