'use strict';

module.exports = function combineArray(to, from, _ref) {
  var _ref$toKey = _ref.toKey,
      toKey = _ref$toKey === undefined ? '_id' : _ref$toKey,
      _ref$fromKey = _ref.fromKey,
      fromKey = _ref$fromKey === undefined ? 'id' : _ref$fromKey,
      _ref$key = _ref.key,
      key = _ref$key === undefined ? 'key' : _ref$key;

  if (!Array.isArray(to) || !Array.isArray(from)) return to;
  to.forEach(function (item) {
    item[key] = from.filter(function (fromItem) {
      return fromItem[fromKey] === item[toKey];
    });
  });
  return to;
};