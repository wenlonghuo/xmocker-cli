'use strict';

var fs = require('fs');
function getAllFiles(dir, callback) {
  var filesArr = [];
  dir = function dir(dirpath, fn) {
    var files = fs.readdirSync(dirpath);
    async(files, function (item, next) {
      var info = fs.statSync(dirpath + item);
      if (info.isDirectory()) {
        dir(dirpath + item + '/', function () {
          next();
        });
      } else {
        filesArr.push(dirpath + item);
        callback && callback(dirpath + item);
        next();
      }
    }, function (err) {
      !err && fn && fn();
    });
  }(dir);
  return filesArr;
}

function async(arr, callback1, callback2) {
  if (Object.prototype.toString.call(arr) !== '[object Array]') {
    return callback2(new Error('第一个参数必须为数组'));
  }
  if (arr.length === 0) return callback2(null);
  (function walk(i) {
    if (i >= arr.length) {
      return callback2(null);
    }
    callback1(arr[i], function () {
      walk(++i);
    });
  })(0);
}

module.exports = getAllFiles;