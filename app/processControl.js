'use strict'
const spawn = require('child_process').spawn;
const path = require('path')
const _ = require('lodash')
let processList = [];
let gulpList = [];

function addNewProcess(option) {
  if (!option) return;
  let processInfo = processList.find(function(proc) { 
    return proc.option && proc.option.port === option.port && proc.status 
  });
  if (processInfo && processInfo.status) return;

  let index = processList.findIndex(function(proc) { return proc.id === option._id });
  if (index >= 0) {
    processList.splice(index, 1);
  }
  startGulp(option);
  return startMockServer(option)
}

function restartProcess(doc) {

  return killProcess(doc).then(function(processInfo) {
    if (processInfo) {
      let index = processList.findIndex(function(proc) { return proc.id === doc._id });
      if (index >= 0) {
        processList.splice(index, 1);
        return addNewProcess(doc)
      }
    } else {
      return addNewProcess(doc)
    }
  });
}

function killProcess(doc) {
  let id = doc._id;
  let processInfo = processList.find(function(proc) { return proc.id === id });
  if (!processInfo || !processInfo.status) {
    console.error('process is not started: ' + id);
    return new Promise(function(resolve) { resolve() });
  }

  let server = processInfo.server;
  let hasResolved;

  return new Promise(function(resolve) {
    processInfo.closeEvents.push(function(server) {
      if (!hasResolved) {
        hasResolved = true
        resolve(processInfo);
      }
    });

    if (server.stdin && processInfo.status) {
      server.stdin.write('kill');
      setTimeout(function() {
        if (!hasResolved) {
          hasResolved = true
          resolve(null);
        }
      }, 5000)
    } else {
      if (!hasResolved) {
        hasResolved = true
        resolve(null);
      }
    }
  });
}

function setEventForObj(obj) {
  if (typeof obj !== 'object') return;
  Object.defineProperty(obj, 'status', {
    set: function(value) {
      if (value) {
        if (obj['openEvents'].length) {
          obj['openEvents'].forEach(function(f) {
            f.call(obj, obj.server)
          })
        }
      } else {
        if (obj['closeEvents'].length) {
          obj['closeEvents'].forEach(function(f) {
            f.call(obj, obj.server)
          })
        }
      }
      this._value = value
    },
    get: function() {
      return this._value
    }
  })
  obj.closeEvents = [];
  obj.openEvents = [];
}

function startMockServer(option){
  if (!option) return;
  let processInfo;

  let param = [];
  param.push(' --port=' + (option.port || 6000));
  let fPath = option.path;
  if (option.gulp && option.gulp.buildPath) {
    fPath = path.join(fPath, option.gulp.buildPath)
  }
  param.push(' --fileServerPath=' + (fPath || ''));
  param.push(' --projectId=' + (option._id || ''));
  
  // 服务器
  const server = spawn('node', ['--harmony-async-await', __dirname + '/mockapp', ...param], {
    stdio: 'pipe',
    shell: true
  });

  server.stderr.pipe(process.stderr)

  processInfo = {
    id: option._id,
    option: option,
    server: server,
    createdTime: new Date(),
    pid: server.pid,
  }
  setEventForObj(processInfo)
  processList.push(processInfo);
  let hasResolved;

  return new Promise(function(resolve) {
    server.on('exit', function() {
      console.log('Project was stopped ' + processInfo.option.name + ' , pid:' + server.pid 
        + ", port: " + processInfo.option.port);
      processInfo.status = false;
    });

    processInfo.openEvents.push(function(server) {
      if (!hasResolved) {
        hasResolved = true;
        resolve(processInfo);
      }
    })

    processInfo.closeEvents.push(function(server) {
      if (!hasResolved) {
        hasResolved = true;
        resolve();
      }
    })

    server.stdout.on('data', function(msg) {
      if (msg.toString() === 'cmd:finished') {
        console.log('Project ' + option.name + ' started sucess, pid:' + server.pid + ", port: " + option.port);
        processInfo.status = true;
      } else {
        process.stdout.write(msg);
      }
    });

    setTimeout(function() {
      if (!hasResolved) {
        hasResolved = true;
        resolve(processInfo);
      }
    }, 5000);

  });
}

function startGulp(gulpOption, operation = {force: false}){
    if(!gulpOption.path)return;

    let gulpIndex = gulpList.findIndex(function(g){return g._id = gulpOption._id})
    
    if(gulpIndex < 0){
      gulpList.push(gulpOption);
    } else {
      let targetGulp = gulpList[gulpIndex];
      if(_.isEqual(gulpOption, targetGulp)){
        if(!operation.force)return;
      } else {
        gulpList.splice(gulpIndex, 1)
        gulpList.push(gulpOption);
      }
    }

    let option = gulpOption.gulp;
    let params = [];
    for(let key in option){
        params.push('--'+ key + '="' + option[key] + '"');
    }

    params.push('--root=' + gulpOption.path)
    
    let gulpPath = option.path || path.join(__dirname, '../tools/gulp');
    gulpPath = path.join(gulpPath, './node_modules/.bin');
    let gulpServer = spawn('gulp', [gulpOption.task || 'dev', ...params], {
        stdio: 'pipe',
        shell: true,
        cwd: gulpPath,
    });

    gulpServer.stdout.pipe(process.stdout)
    gulpServer.stderr.pipe(process.stdout)
}


module.exports = {
  addNewProcess: addNewProcess,
  restartProcess: restartProcess,
  killProcess: killProcess,
  processList: processList,
}