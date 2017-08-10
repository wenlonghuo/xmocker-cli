module.exports = function timer (date) {
  if (typeof date !== 'object') date = date == null ? new Date() : new Date(date)
  if (isNaN(date.getTime())) date = new Date()
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  let str = date.toISOString()
  return str.slice(0, 10) + ' ' + str.slice(11, 23)
}

module.exports.formatArrTime = function formatArrTime (arr = [], keys = ['createdAt', 'updatedAt'], len = 16) {
  let result = []
  result = arr.map(item => {
    if (item.toJSON) item = item.toJSON()
    keys.forEach(key => {
      if (item[key]) {
        item[key] = item[key].slice(0, len)
      }
    })
    return item
  })
  return result
}
