'use strict'
const Koa = require('koa');
const app = new Koa()
const fs = require('fs');
const http = require('http');
const path = require('path')

const sendFile = require('./util/file-server.js');

// 全局变量定义区，待后续可改为配置
const apiPORT = 6000;
const appPORT = 6001;

// passport认证

app.proxy = true
// sessions

// body parser
const bodyParser = require('koa-bodyparser')
app.use(bodyParser())


// 静态服务器 添加默认为Index.html
// app.use(async function(ctx, next){

//   return next().then(function(){
//     sendFile(ctx, ctx.path, {root: './dist/',index: 'index.html'})
//   });
// })




// 调用路由

app.use(require('./router').routes())


// 建立是的监听及server
const httpServer = http.createServer(app.callback());

httpServer.listen(appPORT, function() {
    console.log('HTTP Server is running on: http://localhost:%s', appPORT);
});