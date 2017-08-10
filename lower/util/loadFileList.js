'use strict';

var fs = require('fs');
var path = require('path');

module.exports = function loadFileList(dir, prefix, func) {
  var files = fs.readdirSync(dir);
  var result = {};

  files.forEach(function (file) {
    if (path.extname(file) === '.js') {
      var name = path.basename(file);
      var ctrlName = name.split('.')[1];
      if (ctrlName) {
        try {
          if (func) {
            result[ctrlName] = func(path.join(dir, file));
          } else {
            result[ctrlName] = require(path.join(dir, file));
          }
        } catch (e) {
          console.log(e);
          console.error('\u52A0\u8F7D\u9875\u9762\u51FA\u9519\uFF1A' + dir + '/' + file + ', ' + e.message);
        }
      }
    }
  });
  return result;
};