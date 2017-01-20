'use strict'

const Datastore = require('../db/promiseNeDb')
let td = +new Date() - 1000 * 60 * 60 * 24 * 3;
// api 基础数据
const ErrStore = new Datastore({filename: 'db/log/err', autoload: true, onload: function(){
  ErrStore.remove({time: {$lte:td}}, {multi: true}).catch(function(e){console.log(e)})
}});
// api 基础数据
const HisStore = new Datastore({filename: 'db/log/his', autoload: true, onload: function(){
  HisStore.remove({time: {$lte:td}}, {multi: true}).catch(function(e){console.log(e)})
}});


let through2 = require('through2')

let errStream =  through2(function(chunk, enc, cb){
  process.stdout.write(chunk)
  cb(null, chunk)
})


let errGulp =  through2(function(chunk, enc, cb){
  process.stdout.write(chunk)
  cb(null, chunk)
})

let logGulp =  through2( function(chunk, enc, cb){
  process.stdout.write(chunk)
  cb(null, chunk)
})

let errLog = LogFunc(ErrStore);
let errTeam = errLog.team;

let hisLog = LogFunc(HisStore)
let hisTeam = hisLog.team;

let logLevel = 10;
let childLog =  function(data){
  if(typeof data === 'object'){
    if(data.level < logLevel){

      if(data._type === 'error'){
        errTeam.push(data);
        console.log('[%s] %s',new Date(data.time).toLocaleTimeString(),data.data)
        console.log(' %s',data.err.msg)
        console.log(' 项目：[%s], api：[%s], 分支：[%s]', data.project, data.api, data.apiModel)
        console.log(' 传入参数:', data.req)
        if(!errLog.state)errLog();
      } else if(data._type === 'his'){
        hisTeam.push(data);
        if(!hisLog.state)hisLog();
      } else if(data._type === 'console'){
        console.log(data);
      }
    }
  }else {
    console.log(data);
  }
}

let maxLen = 100;
function LogFunc(db){
  let running;
  let team = [];
  let func =  function(){
    let msg = team.splice(0, maxLen);
    if(!msg.length){
      running = false;
      return;
    }
    running = true;
    db.insert(msg).then(function(){
      setTimeout(func, 0)
    }, function(e){
      console.log(e)
      setTimeout(func, 0)
    });
  }
  func.team = team;
  Object.defineProperty(func, 'state', {
    get: function(){
      return running;
    }
  })
  return func
}

module.exports = function(msg){
  process.stdout.write(msg)
}

module.exports.errStream = errStream;

module.exports.childLog = childLog;

module.exports.errGulp = errGulp;

module.exports.logGulp = logGulp;