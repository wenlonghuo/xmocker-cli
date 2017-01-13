'use strict'
var gulp = require('gulp');
var browserify = require('browserify');
var gutil = require('gulp-util');
var tap = require('gulp-tap');
var buffer = require('gulp-buffer');
var rename = require("gulp-rename");
var gulpSequence = require('gulp-sequence')
var clean = require('gulp-clean');
var minify = require('gulp-clean-css');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var minimist = require('minimist');
var combiner = require('stream-combiner2');
var path = require('path');
const colors = require('colors');

const dealOption = require('./setGulpOption')

var fs = require('fs');
const crypto = require('crypto');
var cacheFiles = {
  relation: {}
};

var args = minimist(process.argv.slice(2));

var option = Object.assign({} ,args);

for(var key in option){
  if(typeof option[key] === 'string')option[key] = option[key].split(',')
}
option = dealOption(option)
option.buildPath =option.buildPath[0]
option.root =option.root[0]
console.log(option);

// 清除打包目录
gulp.task('clean-code', function (cb) {
  var combined = combiner.obj([
    gulp.src(option.buildPath, {
      "read": false
    }),
    clean({
      "force": true
    })
  ]);
  return combined;
});

// push image
gulp.task('image-copy', function () {
  var combined = combiner.obj([
    gulp.src([...option.img, option.root + '/favicon.ico'], {base: option.root}),
    gulp.dest(option.buildPath)
  ]);
  return combined;
});

// CSS
// 压缩代码
// 合并import
gulp.task('css', function () {
  var combined = combiner.obj([
    gulp.src(option.css, {base: option.root}),
    minify({
      "advanced": false, // set as 'clean-css' configuration API
      "keepBreaks": true,
      "root": option.root,
      "target": option.root,// 必加，否则会出现路径错误
      // "relativeTo":  path.join(process.cwd(), '../style/common'),
    }),
    rev(),
    gulp.dest(option.buildPath),
    rev.manifest(),
    gulp.dest(option.buildPath + '/rev/css'),
  ]);
  return combined;
});

// html 引用变更
// 压缩html
gulp.task('rev-html', function (cb) {
  var combined = combiner.obj([
    gulp.src([option.buildPath + '/rev/**/*.json',...option.html], {base: option.root}),
    revCollector({
    	replaceReved: true
  	}),
    gulp.dest(option.buildPath),
  ]);
  return combined;
});

// js压缩任务
gulp.task('scripts', function () {
  var combined = combiner.obj([
    // gulp.src(option.js, {read: false,base: option.root}), // 不需要读取文件内容，browserify 会处理这个问题
    gulp.src((cacheFiles.inited ? cacheFiles.js : option.js), {read: false, base: option.root}), // 不需要读取文件内容，browserify 会处理这个问题

    // 使用 gulp-tap 转换文件内容
    tap(function (file) {
      if (!cacheFiles.inited)readRelation(file.path);
      file.contents = browserify(file.path, {debug: true}).bundle();
    }),

    // 转换 stram 内容为 buff 内容（因为 gulp-sourcemaps 不支持 stream 形式的内容）
    buffer(),
    rev(),
    gulp.dest(option.buildPath),

    rev.manifest({
      path: option.buildPath + '/rev/js/rev-manifest.json',
      merge: true // merge with the existing manifest if one exists
    }),
    rename('rev-manifest.json'),// 必须有，不然生成的文件名带有路，无法复制到文件中
    gulp.dest(option.buildPath + 'rev/js'),
  ]);
  combined.on('error', console.error.bind(console));
  return combined;
});

// 建立自动处理的任务
gulp.task('script-change', function (cb) {
  return gulpSequence('scripts', 'rev-html')(cb);
});

gulp.task('style-change', function (cb) {
  return gulpSequence('css', 'rev-html')(cb);
});

gulp.task('html-change', function (cb) {
  return gulpSequence('rev-html')(cb);
});

gulp.task('image-change', function (cb) {
  return gulpSequence('image-copy')(cb);
});

gulp.task('scriptAndStyle-change', function (cb) {
  return gulpSequence(['scripts', 'css'], 'rev-html')(cb);
});

gulp.task('init', function (cb) {
  return gulpSequence('clean-code', ['image-copy', 'css', 'scripts'], 'rev-html')(cb);
});

// 监听文件变化任务，自定义
gulp.task('dev', ['init'], function () {
  var fileList = [], tmpFileList = [], timeHd, isRunning, runningHd;
  // 初始化缓存文档
  cacheFiles.inited = true;
  cacheFiles.js = [];

  var fileHash = {};
  var watcherjs = gulp.watch([...option.js,...option.css, ...option.html, ...option.img],['']); 
  // 监视与 scripts 任务中同样的文件
  watcherjs.on('change', function (event) {
    if (isRunning) {
      tmpFileList.push(event);
    } else {
      fileList = fileList.concat(tmpFileList);
      tmpFileList = [];
      fileList.push(event);
    }
    doTask();
  });
  gutil.log((' 启动监听，目录为: \njs:\n	' +
    option.js.join('\n	') + '\ncss:\n	' +
    option.css.join('\n	') + '\nhtml:\n	' +
    option.html.join('\n	') +'\nimage:\n  '+
    option.img.join('\n   ')).yellow
  );

  function setTask() {
    var ctype = {}, task = '', rchanged = false;
    gutil.log((' ———— 监听到文件变动，检测md5中....').yellow);
    fileList.forEach(function (f) {
      var file = f.path;
      try {
        var str = fs.readFileSync(file);
      } catch (e) {
        console.log('读取文件失败，' + file);
        if(f.type !== 'deleted')return;
      }

      if(str){
        let md5 = crypto.createHash('md5').update(str).digest('hex');
        if (fileHash[file] !== md5) {
          fileHash[file] = md5;
          rchanged = true;
        }
      }

      if(f.type == 'deleted'){
        rchanged = true;
      }
      
      var tp = path.extname(file).slice(1);
      if(/jpg|png|gif|webp/.test(tp)){
        ctype.image = true;
      }else{
        ctype[tp] = true;
      }
    
      if (tp === 'js') {
        readRelation(file);
      }
    });

    if (!rchanged) {
      gutil.log((' ———— 未检测到更新的文件').yellow);
      return '';
    }

    // 设置队列
    if (ctype.js) {
      setFileList(fileList);// console.log(cacheFiles.relation,cacheFiles.js);
      gutil.log(('js重构建：\n 	' + cacheFiles.js.join('\n 	')).blue);
      delExistFile();
    }

    if (ctype.js && ctype.css) {
      task = 'scriptAndStyle-change';
    } else if (ctype.js) {
      task = 'script-change';
    } else if (ctype.css) {
      task = 'style-change';
    } else if (ctype.html) {
      task = 'html-change';
    } else if (ctype.image) {
      task = 'image-change';
    }
    return task;
  }

  function doTask() {
    if (isRunning) { // 正在运行则等1秒后再检查
      clearTimeout(runningHd);
      runningHd = setTimeout(function () {
        doTask()
      }, 1000);
      return;
    }

    clearTimeout(timeHd);
    timeHd = setTimeout(function () {
      isRunning = true;
      var taskname = setTask();
      if (!taskname) {
        gutil.log((' ———— 任务目标不存在，继续监听...').yellow);
        isRunning = false;
        return;
      }
      var task = gulp.tasks[taskname];
      task.fn.call(null, function () {
        fileList = [];
        isRunning = false;
        gutil.log((' ———— 任务执行完毕，继续监听...').yellow);
      });

    }, 1000);
  }

});

// 设置要更新的js文件
function setFileList(filearr) {
  cacheFiles.js = [];
  var nosame = {},
    filename,
    tmpList = [],
    fileList = filearr.map(function (a) {
      return a.path
    });

  fileList.forEach(function (item) { // todo: 复杂层次引用会导致数组过大
    var arr = findParentFile(item, cacheFiles.relation),
      childList;
    tmpList = tmpList.concat(arr);
    while (arr.length) {
      childList = [];
      arr.forEach(function (f) {
        var farr = findParentFile(item, cacheFiles.relation);
        childList = childList.concat();
      });
      tmpList = tmpList.concat(childList);
      arr = childList;
    }
  });
  fileList = fileList.concat(tmpList);

  fileList.forEach(function (item) {
    if (!nosame[item]) {
      cacheFiles.js.push(item);
      nosame[item] = true;
    }
  });

  function findParentFile(filename, obj) {
    var arr = [];
    for (file in obj) {
      if (obj[file] && obj[file][filename]) {
        arr.push(file);
      }
    }
    return arr;
  }

  function existInArr(arr, item) {
    for (var i = 0; i < arr.length; i++) {
      if (fs.realpathSync(arr[i]) === fs.realpathSync(item))return true;
    }
  }
}
// 删除已用文件
function delExistFile() {
  var filearr = cacheFiles.js;
  var revjson = {};
  try {
    var a = fs.readFileSync(option.buildPath + '/rev/js/rev-manifest.json');
    revjson = JSON.parse(a);
  } catch (e) {

  }
  var abs = fs.realpathSync(option.root);
  filearr.forEach(function (file) {
    var name = path.relative(abs, file);
    if (!name)return;
    name = name.replace(/\\/g, '/');
    if (revjson[name]) {
      try {
        fs.unlinkSync(path.resolve(option.buildPath, revjson[name]));
      } catch (e) {
        gutil.log('文件删除错误:' + path.resolve(option.buildPath, revjson[name]));
      }
    } else {
      gutil.log('未找到revjson项：' + name);
    }
  });
}
// 读取文件关系
function readRelation(file) {
  var filepath;
  try{filepath = fs.realpathSync(file);}
  catch(e){
    return;
  }
  if (!cacheFiles.relation[filepath]) {
    cacheFiles.relation[filepath] = {};
  }
  fs.readFile(filepath, function(err, data){
  	if(err) throw err;
	  var reg = /require\([\'\"]([^\(\)]*)[\'\"]\)/g;
	  var result = reg.exec(data);
	  while (result) {
	    var rfile = getFilePath(filepath, result[1]);
	    cacheFiles.relation[filepath][rfile] = true;
	    result = reg.exec(data);
	  }
	});

  function getFilePath(file, relation) {
    if (/^(\.\/|\.\.\/)/.test(relation)) {
      let tpath = path.resolve(path.dirname(file), relation);
      if (path.extname(tpath) !== '.js') {
        tpath += '.js';
      };
      return fs.realpathSync(tpath);
    } else {
      let tpath = path.join(option.root, relation);
      return fs.realpathSync(tpath);
    }
  }
}