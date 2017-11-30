'use strict'
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const gulp = require('gulp')
const gutil = require('gulp-util')
const tap = require('gulp-tap')
const browserify = require('browserify')

const dealOption = require('./setGulpOption')
const request = require('superagent')

const taskTypes = [
  {type: 'image', name: 'image-copy'},
  {type: 'js', name: 'scripts'},
  {type: 'css', name: 'css'},
  {type: 'html', name: 'rev-html'},
]

const REG_TYPES = {
  js: /require\(['"]([^()]*)['"]\)/g,
  css: /@import\s+url\(['"]?([^()]*)['"]?\)/g,
  html: /(?!src|href)=['"]([^'"]*\.(css|js))['"]/g,
}

const state = {
  running: false,
  inited: false,
}

// 缓存区域
const cachedData = {
  types: ['image', 'css', 'js', 'html'],
}
cachedData.types.forEach(key => {
  cachedData[key] = {
    todoList: [],
    relations: {},
    result: [],
  }
})

let sourceOption, lineOption

function provide (option, customOption) {
  sourceOption = customOption || dealOption(option)
  lineOption = option
  const source = {
    clean: [sourceOption.buildPath + '/**/*'],
    root: sourceOption.root,
    buildPath: sourceOption.buildPath,
    source: sourceOption,
    lineOption,
    watch: [...sourceOption.js, ...sourceOption.css, ...sourceOption.html, ...sourceOption.image],
    fileChange,
    jsPipe () {
      return tap((file) => {
        let filename = file.path
        if (!path.isAbsolute(filename)) {
          filename = path.resolve(sourceOption.root, filename)
        }
        if (!state.inited) {
          let data = getFileInfoSync(filename, { type: 'js', root: sourceOption.root })
          addRelation(cachedData.js, filename, data)
        }
        file.contents = browserify(filename, { debug: true }).bundle()
        file.contents.on('error', (e) => {
          gutil.log(e)
          file.contents = null
        })
      })
    },
    cssPipe () {
      return tap(function (file) {
        let filename = file.path
        if (!path.isAbsolute(filename)) {
          filename = path.resolve(sourceOption.root, filename)
        }
        if (!state.inited) {
          let data = getFileInfoSync(filename, { type: 'css', root: sourceOption.root })
          addRelation(cachedData.css, filename, data)
        }
      })
    },
    htmlPipe () {
      return tap(function (file) {
        let filename = file.path
        if (!path.isAbsolute(filename)) {
          filename = path.resolve(sourceOption.root, filename)
        }

        if (!state.inited) {
          let data = getFileInfoSync(filename, { type: 'html', root: sourceOption.root })
          addRelation(cachedData.html, filename, data)
        }
      })
    },
  }
  Object.defineProperties(source, {
    clearn: {
      get () {
        return [sourceOption.buildPath + '/**/*']
      },
    },
    image: {
      get () {
        return state.inited ? cachedData.image.result : sourceOption.image
      },
    },
    css: {
      get () {
        return state.inited ? cachedData.css.result : sourceOption.css
      },
    },
    js: {
      get () {
        return state.inited ? cachedData.js.result : sourceOption.js
      },
    },
    html: {
      get () {
        let list = state.inited ? cachedData.html.result : sourceOption.html
        return [sourceOption.buildPath + '/rev/**/*.json', ...list]
      },
    },
  })
  return source
}

// 文件变动，用于接管gulp的watch
function fileChange (e) {
  let name = path.extname(e).slice(1)
  if (name && cachedData[name]) {
    cachedData[name].todoList.push(e)
  }

  setTimeout(exector, 0)
  state.inited = true
}

// 执行器
function exector () {
  if (state.running) return
  state.running = true // 我了个乖乖，居然一直没有加，也没发现，太低级了
  const root = sourceOption.root
  const pList = []
  cachedData.types.forEach(type => {
    const typeInfo = cachedData[type]
    typeInfo.result = []
    const p = getTodoFiles(typeInfo, {type, root})
    pList.push(p)
  })
  Promise.all(pList)
    .then(callGulpTask)
    .then(() => {
      state.running = false
      const isOver = cachedData.types.every(item => !cachedData[item].result.length)
      if (isOver) return
      return setTimeout(exector, 300)
    })
    .catch(e => {
      console.log(e)
      state.running = false
    })
}

function callGulpTask () {
  let tasks = []
  let needHtml
  let htmlTask = taskTypes[taskTypes.length - 1].name
  taskTypes.forEach(info => {
    if (cachedData[info.type].result.length) {
      tasks.push(info.name)
      if (info.type === 'js' || info.type === 'css') needHtml = true
    }
  })

  if (!tasks.length) {
    gutil.log('没有更新的任务')
    return
  }

  let info = ''
  cachedData.types.forEach(type => {
    if (cachedData[type].result.length) {
      info += '\n    ' + type + '\n\t' + cachedData[type].result.join('\n\t')
    }
  })

  gutil.log('执行更新任务' + info)
  // js和css添加html任务
  if (needHtml) tasks.push(htmlTask)
  return new Promise((resolve, reject) => {
    tasks.push(function afterBuild () {
      afterGulp()
      resolve()
    })
    const task = gulp.series.apply(null, tasks)
    task()
  })
}

function afterGulp () {
  gutil.log(' ———— 任务执行完毕，继续监听...')
  // 自动刷新功能
  request.post(`http://localhost:${lineOption.port}/_setPageList`)
    .send({ html: [] })
    .end(function (err, res) {
      if (err) console.log(err)
    })
  if (lineOption.injectHtml) {
    request.get(`http://localhost:${lineOption.port}/_refreshPage`)
      .query({})
      .end(function (err, res) {
        if (err) console.log(err)
      })
  }
}
// 添加文件关系
function addRelation (info, filename, {children, hash}) {
  info.relations[filename] = {
    children: children,
    hash: hash,
  }
}

// 获取需要更新的文件列表
function getTodoFiles (info, {type, root}) {
  let list = info.todoList.splice(0, info.todoList.length)
  const pList = []

  if (type === 'image') {
    list.forEach(filename => {
      setAffectedFile(filename, {type, root})
    })
    return Promise.resolve()
  }

  list.forEach(filename => {
    const p = getFileInfo(filename, { type, root })
      .then(file => {
        // 更新关系列表
        if (info.relations[filename] && file.hash === info.relations[filename].hash) return
        addRelation(info, filename, file)
        setAffectedFile(filename, {type, root})
      })
      .catch(e => {
        console.error(e)
        info.todoList.push(...list)
      })
    pList.push(p)
  })

  return Promise.all(pList)
}

// 获取引用了当前文件的文件
function setAffectedFile (file, {type, root}) {
  if (!path.isAbsolute(file)) {
    file = path.resolve(root, file)
  }
  // 添加本文件
  cachedData[type].result.push(file)

  let level = 0
  // 限制最大引用次数为20次
  const maxLevel = 20
  const result = [file]
  deepGetParent()
  // 获取多层父节点
  function deepGetParent () {
    let hasNew
    result.forEach(queFile => {
      cachedData.types.forEach(key => {
        let info = cachedData[key]
        let relations = info.relations

        Object.keys(relations).forEach(filename => {
          if (~result.indexOf(filename)) return
          if (relations[filename].children && relations[filename].children[queFile]) {
            info.result.push(filename)
            result.push(filename)
            hasNew = true
          }
        })
      })
    })
    level++
    // 有新加入的
    if (hasNew && level < maxLevel) {
      return deepGetParent()
    }
  }
}

// 获取文件的hash值
function getFileInfo (file, {type, root}) {
  return readFile(file)
    .then(data => {
      return {
        children: getChildFile(file, data, { type, root }),
        hash: crypto.createHash('md5').update(data).digest('hex'),
        data,
      }
    })
}
// 获取文件的hash值， 同步版本
function getFileInfoSync (file, {type, root}) {
  const data = readFileSync(file)
  if (!data) return
  return {
    children: getChildFile(file, data, { type, root }),
    hash: crypto.createHash('md5').update(data).digest('hex'),
    data,
  }
}

// 读取文件
function readFile (file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}
// 读取文件同步版本
function readFileSync (file) {
  try {
    return fs.readFileSync(file)
  } catch (e) {
    console.error(e)
  }
}
// 获取文件的子文件类型
function getChildFile (filePath, data, {type, root}) {
  const reg = REG_TYPES[type]
  const list = {}
  let result = reg.exec(data)

  while (result) {
    if (result[1]) {
      let child = fixFileName(filePath, result[1], {type, root})
      list[child] = true
    }
    result = reg.exec(data)
  }
  return list
}
// 填充文件名称
function fixFileName (file, relation, {type, root}) {
  let absPath

  if (/^(\.\/|\.\.\/)/.test(relation)) {
    absPath = path.resolve(path.dirname(file), relation)
  } else {
    absPath = path.join(root, relation)
  }
  if (!path.extname(absPath) && type != null) {
    absPath += '.' + type
  }
  try {
    return fs.realpathSync(absPath)
  } catch (e) {
    return
  }
}

module.exports = provide
module.exports.fileChange = fileChange
