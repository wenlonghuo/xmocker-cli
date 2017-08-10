'use strict';

var log = require('../service').log;

function setError(option) {
  var ctx = option.ctx;
  var next = option.next;
  var err = option.err;
  var e = option.e;
  var code = option.code || -1;

  var errObj = {
    code: code,
    err: err
  };

  var info = {
    _type: 'error',
    level: 4,
    time: +new Date(),
    data: err,
    req: {
      params: ctx.finalParams,
      url: ctx.url,
      method: ctx.method
    },
    res: errObj,
    err: {
      msg: String(e),
      stack: String(e ? e.stack : '')
    }
  };

  log.childLog(info);

  ctx.body = errObj;
  return next();
}

module.exports = {
  setError: setError
};