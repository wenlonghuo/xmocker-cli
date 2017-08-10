'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var searchLog = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {
    var finalParams, size, no, skip, type, sort, list, total, query, res;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            finalParams = ctx.finalParams;
            size = ~~finalParams.pageSize;
            no = ~~finalParams.pageNo;
            skip = ~~(size * no);
            type = finalParams.type;


            delete finalParams.pageSize;
            delete finalParams.pageNo;

            sort = { time: -1 };
            list = void 0, total = void 0;

            if (logDb[type]) {
              _context.next = 11;
              break;
            }

            return _context.abrupt('return', ctx.respond.error('查询的日志类型不存在！'));

          case 11:
            _context.prev = 11;
            query = getQuery(finalParams);
            _context.next = 15;
            return logDb[type].count(query);

          case 15:
            total = _context.sent;
            _context.next = 18;
            return logDb[type].cfind(query).sort(sort).skip(skip).limit(size).exec();

          case 18:
            list = _context.sent;
            _context.next = 24;
            break;

          case 21:
            _context.prev = 21;
            _context.t0 = _context['catch'](11);
            return _context.abrupt('return', ctx.respond.error('搜索日志出错', { e: _context.t0 }));

          case 24:
            res = {
              list: list,
              pagination: {
                total: total,
                pageCnt: Math.ceil(total / size),
                pageNo: no
              }
            };

            ctx.respond.success('搜索api成功', res);

          case 26:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[11, 21]]);
  }));

  return function searchLog(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = require('../database');
var logDb = {
  'error': db.errorDB,
  'his': db.hisDB,
  'proxy': db.proxyDB,
  'record': db.recordDB,
  'collector': db.collectorDB
};

var getQuery = require('../util/getQuery').getQuery;

module.exports = {
  searchLog: searchLog
};