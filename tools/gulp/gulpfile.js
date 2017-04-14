'use strict'
const fs = require('fs')
const gulp = require('gulp')
const browserify = require('browserify')
const gutil = require('gulp-util')
const tap = require('gulp-tap')
const buffer = require('gulp-buffer')
const rename = require('gulp-rename')
const del = require('del')
const minify = require('gulp-clean-css')
const rev = require('gulp-rev')
const revCollector = require('gulp-rev-collector')
const autoprefixer = require('gulp-autoprefixer')
const notify = require('gulp-notify')
const minimist = require('minimist')
const path = require('path')
const plumber = require('gulp-plumber')
const request = require('superagent')

const dealOption = require('./setGulpOption')

const crypto = require('crypto')
var cacheFiles = {
  relation: {},
}

var htmlList = []

var args = minimist(process.argv.slice(2))
var otherOption = args.otherOption || '{}'
otherOption = JSON.parse(otherOption)

var option = Object.assign({}, args)

var hdErr = function () {
  var args = Array.prototype.slice.call(arguments)

  notify.onError({
    title: 'compile error',
    message: '<%=error.message %>',
  }).apply(this, args)// 替换为当前对象

  this.emit()// 提交
}

option = dealOption(option)

// 清除打包目录
gulp.task('clean-code', function () {
  return del([option.buildPath + '/**/*'], { force: true })
})

// push image
gulp.task('image-copy', function () {
  return gulp.src([...option.image], { base: option.root })
    .pipe(gulp.dest(option.buildPath))
})

// CSS
// 压缩代码
// 合并import
gulp.task('css', function () {
  return gulp.src(option.css, { base: option.root })
    .pipe(autoprefixer({
      'browsers': [
        '> 5%',
        'last 4 versions',
      ],
    }))
    .on('error', hdErr)
    .pipe(minify({
      'advanced': false, // set as 'clean-css' configuration API
      'keepBreaks': true,
      'root': option.root,
      'target': option.root, // 必加，否则会出现路径错误
      // "relativeTo":  path.join(process.cwd(), '../style/common'),
    }).on('error', hdErr))
    .pipe(rev())
    .pipe(gulp.dest(option.buildPath))
    .pipe(rev.manifest())
    .pipe(gulp.dest(option.buildPath + '/rev/css'))
})

// html 引用变更
// 压缩html
gulp.task('rev-html', function (cb) {
  htmlList = []
  return gulp.src([option.buildPath + '/rev/**/*.json', ...option.html], { base: option.root })
    .pipe(revCollector({
      replaceReved: true,
    }))
    .pipe(tap(function (file) {
      var str = '/' + path.relative(option.root, file.path)
      str = str.replace(/\\/g, '/')
      htmlList.push(str)
    }))
    .pipe(gulp.dest(option.buildPath))
})

// js压缩任务
gulp.task('scripts', function () {
  // gulp.src(option.js, {read: false,base: option.root}), // 不需要读取文件内容，browserify 会处理这个问题
  return gulp.src((cacheFiles.inited ? cacheFiles.js : option.js), { read: false, base: option.root }) // 不需要读取文件内容，browserify 会处理这个问题
  .pipe(plumber())
  // 使用 gulp-tap 转换文件内容
  .pipe(tap(function (file) {
    if (!cacheFiles.inited) readRelation(file.path)
    file.contents = browserify(file.path, { debug: true }).bundle()
  }))
  .on('error', hdErr)

  // 转换 stram 内容为 buff 内容（因为 gulp-sourcemaps 不支持 stream 形式的内容）
  .pipe(buffer())
    .pipe(rev())
    .pipe(gulp.dest(option.buildPath))

  .pipe(rev.manifest({
    path: option.buildPath + '/rev/js/rev-manifest.json',
    merge: true, // merge with the existing manifest if one exists
  }))
    .pipe(rename('rev-manifest.json')) // 必须有，不然生成的文件名带有路，无法复制到文件中
    .pipe(gulp.dest(option.buildPath + 'rev/js'))
})

// 建立自动处理的任务
gulp.task('script-change', gulp.series('scripts', 'rev-html', function (cb) {
  cb()
}))

gulp.task('style-change', gulp.series('css', 'rev-html', function (cb) {
  cb()
}))

gulp.task('html-change', gulp.series('rev-html', function (cb) {
  cb()
}))

gulp.task('image-change', gulp.series('image-copy', function (cb) {
  cb()
}))

gulp.task('scriptAndStyle-change', gulp.series('scripts', 'css', 'rev-html', function (cb) {
  cb()
}))

gulp.task('init', gulp.series('clean-code', 'image-copy', 'css', 'scripts', 'rev-html', function (cb) {
  cb()
}))

// 监听文件变化任务，自定义
gulp.task('dev', gulp.series('init', function watchingTask (re) {
  request.post(`http://localhost:${otherOption.port}/_setPageList`)
          .send({html: htmlList})
          .end(function (err, res) {
            if (err) console.log(err)
          })
  var fileList = []
  var tmpFileList = []
  var timeHd, isRunning, runningHd
  // 初始化缓存文档
  cacheFiles.inited = true
  cacheFiles.js = []

  var fileHash = {}
  var watcherjs = gulp.watch([...option.js, ...option.css, ...option.html, ...option.image], function (re) {

  })
  // 监视与 scripts 任务中同样的文件
  watcherjs.on('change', function (event) {
    if (isRunning) {
      tmpFileList.push(event)
    } else {
      fileList = fileList.concat(tmpFileList)
      tmpFileList = []
      fileList.push(event)
    }
    doTask()
  })
  gutil.log((' 启动监听，目录为: \njs:\n\t' +
    option.js.join('\n\t') + '\ncss:\n\t' +
    option.css.join('\n\t') + '\nhtml:\n\t' +
    option.html.join('\n\t') + '\nimage:\n  ' +
    option.image.join('\n   ')))

  function setTask () {
    var ctype = {}
    var task = ''
    var rchanged = false
    gutil.log(' ———— 监听到文件变动，检测md5中....')
    fileList.forEach(function (f) {
      var file = f
      try {
        var str = fs.readFileSync(file)
      } catch (e) {
        console.log('读取文件失败，' + file)
        if (f.type !== 'deleted') return
      }

      if (str) {
        let md5 = crypto.createHash('md5').update(str).digest('hex')
        if (fileHash[file] !== md5) {
          fileHash[file] = md5
          rchanged = true
        }
      }

      if (f.type === 'deleted') {
        rchanged = true
      }

      var tp = path.extname(file).slice(1)
      if (/jpg|png|gif|webp/.test(tp)) {
        ctype.image = true
      } else {
        ctype[tp] = true
      }

      if (tp === 'js') {
        readRelation(file)
      }
    })

    if (!rchanged) {
      gutil.log(' ———— 未检测到更新的文件')
      return ''
    }

    // 设置队列
    if (ctype.js) {
      setFileList(fileList) // console.log(cacheFiles.relation,cacheFiles.js)
      gutil.log('js重构建：\n\t\t' + cacheFiles.js.join('\n\t\t'))
      delExistFile()
    }

    if (ctype.js && ctype.css) {
      task = 'scriptAndStyle-change'
    } else if (ctype.js) {
      task = 'script-change'
    } else if (ctype.css) {
      task = 'style-change'
    } else if (ctype.html) {
      task = 'html-change'
    } else if (ctype.image) {
      task = 'image-change'
    }
    return task
  }

  function doTask () {
    if (isRunning) { // 正在运行则等1秒后再检查
      clearTimeout(runningHd)
      runningHd = setTimeout(function () {
        doTask()
      }, 300)
      return
    }

    clearTimeout(timeHd)
    timeHd = setTimeout(function () {
      isRunning = true
      var taskname = setTask()
      if (!taskname) {
        gutil.log(' ———— 任务目标不存在，继续监听...')
        isRunning = false
        return
      }
      var task = gulp.series(taskname, function (cb) { cb() })

      task(function () {
        fileList = []
        isRunning = false
        gutil.log(' ———— 任务执行完毕，继续监听...')
        // 自动刷新功能
        if (otherOption.autoRefresh) {
          request.get(`http://localhost:${otherOption.port}/_refreshPage`)
            .query({})
            .end(function (err, res) {
              if (err) console.log(err)
            })
        }
        request.post(`http://localhost:${otherOption.port}/_setPageList`)
          .send({html: htmlList})
          .end(function (err, res) {
            if (err) console.log(err)
          })
      })
    }, 300)
  }
}))

// 设置要更新的js文件
function setFileList (filearr) {
  cacheFiles.js = []
  var nosame = {}
  var tmpList = []
  var fileList = filearr

  fileList.forEach(function (item) { // todo: 复杂层次引用会导致数组过大
    var arr = findParentFile(item, cacheFiles.relation)
    var childList
    tmpList = tmpList.concat(arr)
    while (arr.length) {
      childList = []
      arr.forEach(function (f) {
        // var farr = findParentFile(item, cacheFiles.relation)
        childList = childList.concat()
      })
      tmpList = tmpList.concat(childList)
      arr = childList
    }
  })
  fileList = fileList.concat(tmpList)

  fileList.forEach(function (item) {
    if (!nosame[item]) {
      cacheFiles.js.push(item)
      nosame[item] = true
    }
  })

  function findParentFile (filename, obj) {
    var arr = []
    for (var file in obj) {
      if (obj[file] && obj[file][filename]) {
        arr.push(file)
      }
    }
    return arr
  }
}
// 删除已用文件
function delExistFile () {
  var filearr = cacheFiles.js
  var revjson = {}
  try {
    var a = fs.readFileSync(option.buildPath + '/rev/js/rev-manifest.json')
    revjson = JSON.parse(a)
  } catch (e) {

  }
  var abs = fs.realpathSync(option.root)
  filearr.forEach(function (file) {
    var name = path.relative(abs, file)
    if (!name) return
    name = name.replace(/\\/g, '/')
    if (revjson[name]) {
      try {
        fs.unlinkSync(path.resolve(option.buildPath, revjson[name]))
      } catch (e) {
        gutil.log('文件删除错误:' + path.resolve(option.buildPath, revjson[name]))
      }
    } else {
      gutil.log('未找到revjson项：' + name)
    }
  })
}
// 读取文件关系
function readRelation (file) {
  var filepath
  try { filepath = fs.realpathSync(file) } catch (e) {
    return
  }
  if (!cacheFiles.relation[filepath]) {
    cacheFiles.relation[filepath] = {}
  }
  fs.readFile(filepath, function (err, data) {
    if (err) throw err
    var reg = /require\(['"]([^()]*)['"]\)/g
    var result = reg.exec(data)
    while (result) {
      var rfile = getFilePath(filepath, result[1])
      cacheFiles.relation[filepath][rfile] = true
      result = reg.exec(data)
    }
  })

  function getFilePath (file, relation) {
    if (/^(\.\/|\.\.\/)/.test(relation)) {
      let tpath = path.resolve(path.dirname(file), relation)
      if (path.extname(tpath) !== '.js') {
        tpath += '.js'
      }
      return fs.realpathSync(tpath)
    } else {
      let tpath = path.join(option.root, relation)
      try {
        var p = fs.realpathSync(tpath)
      } catch (e) {
        return +new Date()
      }
      return p
    }
  }
}

process.stdin.on('data', function (d) {
  let word = new Buffer(d).toString()
  if (word === 'kill') {
    process.exit(1)
  }
})
