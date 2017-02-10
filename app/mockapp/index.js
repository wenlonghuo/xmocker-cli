'use strict'
const Koa = require('koa');
const app = new Koa()
const fs = require('fs');
const path = require('path')
const http = require('http')
const minimist = require('minimist');
const sendFile = require('../util/file-server.js');
const spawn = require('child_process').spawn;
// 全局变量定义区，待后续可改为配置
var args = minimist(process.argv.slice(2));

console.log = function log(data) {
  let msg = {
    _type: 'console',
    time: +new Date(),
    data: data
  };
  process.send(msg);
}


for(let key in args) {
    let str = args[key];
    
    if(typeof str === "string" && str[0] === '"' && str[str.length-1] === '"'){
        args[key] = str.slice(1, str.length-1);
    }
}

const apiPORT = args.port || 6000;
const projectDir = args.fileServerPath;
let gulpServer;
// passport认证

app.proxy = true
// sessions

// body parser
const bodyParser = require('koa-bodyparser')
app.use(bodyParser())

// 调用路由
// 静态服务器 添加默认为Index.html
app.use(async function(ctx, next){
  return next().then(sendFile(ctx, ctx.path, {root: projectDir,index: 'index.html'}));
})
// log(projectDir)
app.use(require('./router.js').routes())



// 建立是的监听及server
const httpServer = http.createServer(app.callback());

httpServer.listen(apiPORT, function(e) {
    process.send({_type: 'cmd', data: 'finished'});
});

module.exports = httpServer;

process.on('message', function(msg){
    if(typeof msg === 'object' && msg._type === 'cmd'){
        if(msg.data === 'kill'){
            if(gulpServer){
                gulpServer.kill();
                process.exit(1);
            }else {
                process.exit(1);
            }
        }
    }
})

