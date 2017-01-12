'use strict'
const spawn = require('child_process').spawn;
let processList = [];

function addNewProcess(option){
    if(!option)return;
    let processInfo = processList.find(function(proc){return proc.option && proc.option.port === option.port && proc.status});
    if(processInfo && processInfo.status)return;

    let index = processList.findIndex(function(proc){return proc.id === option._id});
    if(index >=0){
      processList.splice(index, 1);
    }

    let param = [];
    param.push(' --port=' + (option.port || 6000));
    param.push(' --path=' + (option.path || ''));
    // 服务器
    const server = spawn('node', ['--harmony-async-await', __dirname + '/mockapp', ...param], {
        stdio: 'pipe',
        shell: true
    });

    processInfo = {
      id: option._id,
      option: option,
      server: server,
      createdTime: new Date(),
      status: 1,
      pid: server.pid,
    }
    processList.push(processInfo);
    let hasResolved;

    return new Promise(function(resolve){
       server.stdout.on('data', function(msg){
        if(msg.toString() === 'cmd:finished'){
          console.log('Project '+ option.name + ' started sucess, pid:' + server.pid + ", port: " + option.port);
          if(!hasResolved){
            resolve(processInfo);
            hasResolved = true;
          }
        } else {
          process.stdout.write(msg);
        }
      });

      setTimeout(function(){
        if(!hasResolved){
          resolve(processInfo);
          hasResolved = true;
        }
      },2000);

      server.stderr.on('data', function(msg){
        process.stdout.write(msg);
        processInfo.status = 0;
        if(!hasResolved){
          hasResolved = true;
          resolve();
        }
      });
    });
}

function restartProcess(doc){

  return killProcess(doc).then(function(processInfo){
    if(processInfo){
      let index = processList.findIndex(function(proc){return proc.id === doc._id});
      if(index >=0){
        processList.splice(index, 1);
        return addNewProcess(doc)
      }
    }else {
      return addNewProcess(doc)
    }
  });
}

function killProcess(doc){
  let id = doc._id;
  let processInfo = processList.find(function(proc){return proc.id === id});
  if(!processInfo || !processInfo.status){
    console.error('process is not started: ' + id);
    return new Promise(function(resolve){resolve()});
  }
  
  let server = processInfo.server;

  return new Promise(function(resolve){
    server.on('close', function(){
      console.log('Project was stopped '+ processInfo.option.name + ' , pid:' + server.pid + ", port: " + processInfo.option.port);
      processInfo.status = 0;
      resolve(processInfo);
    });

    if(server.stdin){
      server.stdin.write('kill');
    }else {
      resolve(null);
    }
  });
}


module.exports = {
  addNewProcess: addNewProcess,
  restartProcess: restartProcess,
  killProcess: killProcess,
  processList: processList,
}