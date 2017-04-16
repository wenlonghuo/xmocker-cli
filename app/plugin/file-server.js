/**
 * 修改自koa-send模块
 * 改动说明：
 * 添加304代码，通过opts的always控制。
 * Module dependencies.
 */
'use strict'
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

/**
 * Send file at `path` with the
 * given `options` to the koa `ctx`.
 *
 * @param {Context} ctx
 * @param {String} path
 * @param {Object} [opts]
 * @return {Function}
 * @api public
 */

function send (ctx, path, opts) {
  return async function () {
    assert(ctx, 'koa context required')
    assert(path, 'pathname required')
    opts = opts || {}

    // options
    debug('send "%s" %j', path, opts);
    var root = opts.root ? normalize(resolve(opts.root)) : ''
    var trailingSlash = '/' == path[path.length - 1]
    path = path.substr(parse(path).root.length)
    var index = opts.index
    var maxage = opts.maxage || opts.maxAge || 0
    var hidden = opts.hidden || false
    var format = opts.format === false ? false : true
    var gzip = opts.gzip === false ? false : true
    var setHeaders = opts.setHeaders
    var plugin = opts.plugin

    if (setHeaders && typeof setHeaders !== 'function') {
      throw new TypeError('option setHeaders must be function')
    }

    var encoding = ctx.acceptsEncodings('gzip', 'deflate', 'identity')

    // normalize path
    path = decode(path)

    if (-1 == path) return ctx.throw('failed to decode', 400)

    // index file support
    if (index && trailingSlash) path += index

    path = resolvePath(root, path)

    // hidden file support, ignore
    if (!hidden && isHidden(root, path)) return

    // serve gzipped file when possible
    if (encoding === 'gzip' && gzip && (await fs.exists(path + '.gz'))) {
      path = path + '.gz'
      ctx.set('Content-Encoding', 'gzip')
      ctx.res.removeHeader('Content-Length')
    }

    // stat
    try {
      var stats = await fs.stat(path);
      // Format the path to serve static file servers
      // and not require a trailing slash for directories,
      // so that you can do both `/directory` and `/directory/`
      if (stats.isDirectory()) {
        if (format && index) {
          path += '/' + index
          stats = await fs.stat(path)
        } else {
          return
        }
      }
    } catch (err) {
      var notfound = ['ENOENT', 'ENAMETOOLONG', 'ENOTDIR'];
      if (~notfound.indexOf(err.code)) return
      err.status = 500
      throw err
    }

    if (setHeaders) setHeaders(ctx.res, path, stats);

    // stream
    ctx.set('Content-Length', stats.size);

    // 设置etag
    ctx.status = 200
    ctx.set('ETag', 't' + +stats.mtime + stats.size + '')
    if (ctx.fresh) {
      ctx.status = 304
      return
    }

    if (!ctx.response.get('Cache-Control')) ctx.set('Cache-Control', 'max-Age=' + (maxage / 1000 | 0))
    ctx.type = type(path)

    if (plugin) {
      try {
        var prev = await plugin.call(ctx, {ctx, path, stats}, opts)
        if (prev) return
      } catch (e) {
        throw e
      }
    }
    ctx.body = fs.createReadStream(path)
    return path
  }
}

/**
 * Check if it's hidden.
 */

function isHidden(root, path) {
  path = path.substr(root.length).split(sep);
  for(var i = 0; i < path.length; i++) {
    if(path[i][0] === '.') return true;
  }
  return false;
}

/**
 * File type.
 */

function type(file) {
  return extname(basename(file, '.gz'));
}

/**
 * Decode `path`.
 */

function decode(path) {
  try {
    return decodeURIComponent(path);
  } catch (err) {
    return -1;
  }
}
