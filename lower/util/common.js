'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function uid() {
  var max = 1000000;
  var cnt = 0;
  return function () {
    cnt++;
    if (cnt >= max) cnt = 0;
    return (+new Date() * max + cnt).toString(36);
  };
}

function killPort(port) {
  var cmd = process.platform === 'win32' ? 'netstat -ano' : 'ps aux';
  var exec = require('child_process').exec;

  return new _promise2.default(function (resolve) {
    var rd = void 0;
    exec(cmd, function (err, stdout, stderr) {
      if (err) {
        console.log(err);
        resolve(null);
        return;
      }
      var lines = stdout.split('\n');

      var _loop = function _loop(i) {
        var line = lines[i];
        var p = line.trim().split(/\s+/);
        var address = p[1];

        if (address !== undefined) {
          if (address.split(':')[1] == port) {
            exec('taskkill /F /pid ' + p[4], function (err, stdout, stderr) {
              var msg = err ? '释放指定端口失败！！' : '占用指定端口的程序被成功杀掉！' + p[4];
              resolve(msg);
            });
            rd = true;
          }
        }
      };

      for (var i = 0; i < lines.length; i++) {
        _loop(i);
      }
      if (!rd) resolve('成功杀掉进程');
    });
  });
}

function killPID(pid) {
  var exec = require('child_process').exec;

  return new _promise2.default(function (resolve) {
    exec('taskkill /F /pid ' + pid, function (err, stdout, stderr) {
      var msg = err ? '释放指定端口失败！！' : '占用指定端口的程序被成功杀掉！' + pid;
      resolve(msg);
    });
  });
}

function getDeepVal(obj, str) {
  if ((typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) !== 'object' || typeof str !== 'string') return;
  var arr = str.split('.');
  var val = obj;
  for (var i = 0; i < arr.length; i++) {
    val = val[arr[i]];
    if ((typeof val === 'undefined' ? 'undefined' : (0, _typeof3.default)(val)) !== 'object' && i !== arr.length - 1) return;
  }
  return val;
}

var codeDirecory = {
  punctuation: [[32, 15], [58, 6], [91, 5], [123, 3], [160, 31], [215, 0], [247, 0]],
  number: [[48, 0]],
  letter: [[65, 25], [97, 25]],
  chinese: [[19968, 20941]]
};

function randomCode() {
  var len = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ['letter', 'chinese', 'number', 'punctuation'];

  var i = 0;
  var str = '';
  var base = void 0,
      range = void 0,
      order = void 0,
      arr = void 0,
      lower = void 0;
  var typeLen = type.length - 1;
  if (typeLen < 0) {
    return '';
  }

  while (i < len) {
    i++;
    order = Math.round(Math.random() * typeLen);
    arr = codeDirecory[type[order]] || codeDirecory.letter;

    var randomInfo = void 0;
    var randomLen = arr.length - 1;

    if (randomLen > 0) {
      randomInfo = arr[Math.round(Math.random() * randomLen)];
    } else {
      randomInfo = arr[0];
    }
    base = randomInfo[0];
    range = randomInfo[1];
    lower = parseInt(Math.random() * range);
    str += String.fromCharCode(base + lower);
  }
  return str;
}

module.exports = {
  uid: uid,
  killPort: killPort,
  killPID: killPID,
  getDeepVal: getDeepVal,
  randomCode: randomCode
};