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

const apiPORT = args.port || 6000;
const projectDir = args.fileServerPath;

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

app.use(require('./router.js').routes())



// 建立是的监听及server
const httpServer = http.createServer(app.callback());

httpServer.listen(apiPORT, function() {
    process.stdout.write('cmd:finished');
});

module.exports = httpServer;


process.stdin.on('data', function(data){
    let  signal = data.toString();
    if(signal === 'kill')
        process.exit(1);
    if(signal.indexOf('data:') === 0){
        let gulpOption = JSON.parse(signal.slice(5));
        startGulp(gulpOption)
    }
});

function startGulp(gulpOption){
    if(!gulpOption.path)return;
    let option = gulpOption.gulp;
    let params = [];
    for(let key in option){
        params.push('--'+ key + '="' + option[key] + '"');
    }

    params.push('--root=' + gulpOption.path)

    let gulpPath = path.join(__dirname, '../../tools/gulp');
    const server = spawn('gulp', [gulpOption.task || 'dev', ...params], {
        stdio: 'inherit',
        shell: true,
        cwd: option.path || gulpPath,
    });
    
}