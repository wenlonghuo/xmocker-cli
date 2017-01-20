var defaultOption = {
  root: '../',
  build: '/build/',
  js: '/{script,general}/',
  css: '/{general,style}/',
  html: '/{general,html}/',
  image: '/{general,image}/',
}

var aft = {
  js: '/*.js',
  css: '/*.css',
  html: '/*.html',
  image: '/*.{jpg,png,gif,webp}',
}

function fixPath(option, aft) {
  var pre = option.root;
  var rootList = option.withRoot;
  for (key of Object.keys(option)) {
    if (key === 'root' || key === 'withRoot')continue;
    if (!isArr(option[key])) {
      option[key] = [option[key] || './'];
    }
    option[key].forEach(function (item, index) {
      option[key][index] = pre + item;
      var pathStr = option[key][index];
      if (aft[key]) {
        if (!/(\/\*\..+)$/.test(pathStr)) { // 没有后缀名
          var reg = /(\/!\(\w*\)\$\/?)$/;// 匹配某个目录下非某个文件夹所有文件
          if (reg.test(pathStr)) {
            var fstr = reg.exec(pathStr)[0].slice(1).replace('$', '') + '/**' + aft[key];
            option[key][index] = pathStr.replace(reg, '/{' + aft[key].slice(1) + ',' + fstr + '}');
          } else {
            option[key][index] += '/**' + aft[key];
          }
        }
      }
    });
  }
  option.build = option.build[0];
  return option;
}

function isArr(a) {
  return Object.prototype.toString.call(a) === '[object Array]'
}

module.exports = function (buildOption) {
  buildOption = Object.assign(defaultOption, buildOption);

  // 为路径自动添加根路径
  buildOption.withRoot = buildOption.withRoot || [];
  if (typeof buildOption.withRoot === 'string') {
    buildOption.withRoot = ['build', 'js', 'css', 'html', 'image'];
  }
  if (isArr(buildOption.withRoot)) {
    buildOption = fixPath(buildOption, aft);
  }
  // clo = Object.assign(clo, buildOption);
  return buildOption;
}