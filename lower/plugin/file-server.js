
'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('koa-send');
var resolvePath = require('resolve-path');
var assert = require('assert');
var path = require('path');
var normalize = path.normalize;
var basename = path.basename;
var extname = path.extname;
var resolve = path.resolve;
var parse = path.parse;
var sep = path.sep;
var fs = require('mz/fs');

module.exports = send;

function send(ctx, path, opts) {
  return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var root, trailingSlash, index, maxage, hidden, format, gzip, setHeaders, plugin, encoding, stats, notfound, prev;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            assert(ctx, 'koa context required');
            assert(path, 'pathname required');
            opts = opts || {};

            debug('send "%s" %j', path, opts);
            root = opts.root ? normalize(resolve(opts.root)) : '';
            trailingSlash = '/' == path[path.length - 1];

            path = path.substr(parse(path).root.length);
            index = opts.index;
            maxage = opts.maxage || opts.maxAge || 0;
            hidden = opts.hidden || false;
            format = opts.format === false ? false : true;
            gzip = opts.gzip === false ? false : true;
            setHeaders = opts.setHeaders;
            plugin = opts.plugin;

            if (!(setHeaders && typeof setHeaders !== 'function')) {
              _context.next = 16;
              break;
            }

            throw new TypeError('option setHeaders must be function');

          case 16:
            encoding = ctx.acceptsEncodings('gzip', 'deflate', 'identity');

            path = decode(path);

            if (!(-1 == path)) {
              _context.next = 20;
              break;
            }

            return _context.abrupt('return', ctx.throw('failed to decode', 400));

          case 20:
            if (index && trailingSlash) path += index;

            path = resolvePath(root, path);

            if (!(!hidden && isHidden(root, path))) {
              _context.next = 24;
              break;
            }

            return _context.abrupt('return');

          case 24:
            _context.t0 = encoding === 'gzip' && gzip;

            if (!_context.t0) {
              _context.next = 29;
              break;
            }

            _context.next = 28;
            return fs.exists(path + '.gz');

          case 28:
            _context.t0 = _context.sent;

          case 29:
            if (!_context.t0) {
              _context.next = 33;
              break;
            }

            path = path + '.gz';
            ctx.set('Content-Encoding', 'gzip');
            ctx.res.removeHeader('Content-Length');

          case 33:
            _context.prev = 33;
            _context.next = 36;
            return fs.stat(path);

          case 36:
            stats = _context.sent;

            if (!stats.isDirectory()) {
              _context.next = 46;
              break;
            }

            if (!(format && index)) {
              _context.next = 45;
              break;
            }

            path += '/' + index;
            _context.next = 42;
            return fs.stat(path);

          case 42:
            stats = _context.sent;
            _context.next = 46;
            break;

          case 45:
            return _context.abrupt('return');

          case 46:
            _context.next = 55;
            break;

          case 48:
            _context.prev = 48;
            _context.t1 = _context['catch'](33);
            notfound = ['ENOENT', 'ENAMETOOLONG', 'ENOTDIR'];

            if (!~notfound.indexOf(_context.t1.code)) {
              _context.next = 53;
              break;
            }

            return _context.abrupt('return');

          case 53:
            _context.t1.status = 500;
            throw _context.t1;

          case 55:

            if (setHeaders) setHeaders(ctx.res, path, stats);

            ctx.set('Content-Length', stats.size);

            ctx.status = 200;
            ctx.set('ETag', 't' + +stats.mtime + stats.size + '');

            if (!ctx.fresh) {
              _context.next = 62;
              break;
            }

            ctx.status = 304;
            return _context.abrupt('return');

          case 62:

            if (!ctx.response.get('Cache-Control')) ctx.set('Cache-Control', 'max-Age=' + (maxage / 1000 | 0));
            ctx.type = type(path);

            if (!plugin) {
              _context.next = 76;
              break;
            }

            _context.prev = 65;
            _context.next = 68;
            return plugin.call(ctx, { ctx: ctx, path: path, stats: stats }, opts);

          case 68:
            prev = _context.sent;

            if (!prev) {
              _context.next = 71;
              break;
            }

            return _context.abrupt('return');

          case 71:
            _context.next = 76;
            break;

          case 73:
            _context.prev = 73;
            _context.t2 = _context['catch'](65);
            throw _context.t2;

          case 76:
            ctx.body = fs.createReadStream(path);
            return _context.abrupt('return', path);

          case 78:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[33, 48], [65, 73]]);
  }));
}

function isHidden(root, path) {
  path = path.substr(root.length).split(sep);
  for (var i = 0; i < path.length; i++) {
    if (path[i][0] === '.') return true;
  }
  return false;
}

function type(file) {
  return extname(basename(file, '.gz'));
}

function decode(path) {
  try {
    return decodeURIComponent(path);
  } catch (err) {
    return -1;
  }
}