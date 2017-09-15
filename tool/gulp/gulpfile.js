'use strict'

const gulp = require('gulp')

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
// const plumber = require('gulp-plumber')
const request = require('superagent')
let htmlList = []
const provide = require('./gulp-provideFile.js')

var args = minimist(process.argv.slice(2))
var initOption = decodeURIComponent(args.option) || '{}'
initOption = JSON.parse(initOption)

var hdErr = function () {
  var args = Array.prototype.slice.call(arguments)

  notify.onError({
    title: 'compile error',
    message: '',
  }).apply(this, args)// 替换为当前对象

  this.emit()// 提交
}

var option = provide(initOption)
// 清除打包目录
gulp.task('clean-code', function () {
  return del(option.clean, { force: true })
})

// push image
gulp.task('image-copy', function () {
  return gulp.src(option.image, { base: option.root })
    .pipe(gulp.dest(option.buildPath))
})

// CSS
// 压缩代码
// 合并import
gulp.task('css', function () {
  return gulp.src(option.css, { base: option.root })
    .pipe(option.cssPipe())
    .pipe(minify({
      'target': option.root, // 必加，否则会出现路径错误
      'root': option.root, // 必加，否则会出现路径错误
      // 'rebaseTo': option.root, // 必加，否则会出现路径错误
      // "relativeTo":  path.join(process.cwd(), '../style/common'),
    }).on('error', hdErr))
    .pipe(autoprefixer({
      'browsers': ['iOS >= 7', 'Android >= 4.1'],
      ignoreError: true,
    }))
    .pipe(rev())
      .pipe(gulp.dest(option.buildPath))
    .pipe(rev.manifest({
      path: option.buildPath + '/rev/css/rev-manifest.json',
      merge: true, // merge with the existing manifest if one exists
    }))
      .pipe(rename('rev-manifest.json')) // 必须有，不然生成的文件名带有路，无法复制到文件中
      .pipe(gulp.dest(option.buildPath + '/rev/css'))
})

// html 引用变更
// 压缩html
gulp.task('rev-html', function (cb) {
  htmlList = []
  return gulp.src(option.html, { base: option.root })
    .pipe(option.htmlPipe())
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
  return gulp.src(option.js, { read: false, base: option.root }) // 不需要读取文件内容，browserify 会处理这个问题
  // .pipe(plumber())
  // 使用 gulp-tap 转换文件内容
  // .pipe(tap(function (file) {
  //   // if (!cacheFiles.inited) readRelation(file.path)
  //   file.contents = browserify(file.path, { debug: true }).bundle()
  // }))
  .pipe(option.jsPipe())
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
    .pipe(gulp.dest(option.buildPath + '/rev/js'))
})

gulp.task('init', gulp.series('clean-code', 'image-copy', 'css', 'scripts', 'rev-html', function (cb) {
  cb()
}))

// 监听文件变化任务，自定义
gulp.task('dev', gulp.series('init', function watchingTask (re) {
  request.post(`http://localhost:${initOption.port}/_setPageList`)
          .send({html: htmlList})
          .end(function (err, res) {
            if (err) console.log(err)
          })
  var watcherjs = gulp.watch(option.watch, function (re) {

  })
  // 监视与 scripts 任务中同样的文件
  watcherjs.on('change', option.fileChange)
  gutil.log((' 启动监听，目录为: \njs:\n\t' +
    option.source.js.join('\n\t') + '\ncss:\n\t' +
    option.source.css.join('\n\t') + '\nhtml:\n\t' +
    option.source.html.join('\n\t') + '\nimage:\n  ' +
    option.source.image.join('\n   ')))
}))

process.stdin.on('data', function (d) {
  let word = new Buffer(d).toString()
  if (word === 'kill') {
    process.exit(1)
  }
})

process.on('unhandledRejection', (e) => {
  console.log(e)
})
