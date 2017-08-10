'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('mz/fs');
var zlib = require('zlib');
var readFiles = require('./readfiles');

readFiles('./dist/', function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(file) {
    var originalFile, gzFile, output;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!/\.gz$/.test(file)) {
              _context.next = 2;
              break;
            }

            return _context.abrupt('return');

          case 2:
            originalFile = fs.createReadStream(file);
            gzFile = fs.WriteStream(file + '.gz');
            output = zlib.createGzip();
            _context.next = 7;
            return originalFile.pipe(output).pipe(gzFile);

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());