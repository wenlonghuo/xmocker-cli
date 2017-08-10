'use strict'
module.exports = function combineArray (to, from, {toKey = '_id', fromKey = 'id', key = 'key'}) {
  if (!Array.isArray(to) || !Array.isArray(from)) return to
  to.forEach(function (item) {
    item[key] = from.filter((fromItem) => fromItem[fromKey] === item[toKey])
  })
  return to
}
