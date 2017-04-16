'use strict'

module.exports = function execFunction (ctx, condition = '', params = {}) {
  if (condition.indexOf('return') < 0) condition = 'return ' + condition
  let entries = Object.entries(params)
  let keys = entries.map(en => en[0])
  let values = entries.map(en => en[1])
  let func

  keys.push(condition)
  try {
    func = new Function(...keys)
  } catch (e) {
    throw new Error(`分支判断函数不合法${e.message}`)
  }

  // 调用函数
  try {
    return func.apply(ctx, values)
  } catch (e) {
    throw new Error(`api分支执行判断条件的函数时出现错误：${e.message}`)
  }
}
