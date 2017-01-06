'use strict'
const Koa = require('koa');
const app = new Koa()
const fs = require('fs');
const http = require('http');
const path = require('path')
const minimist = require('minimist');
// 全局变量定义区，待后续可改为配置
var args = minimist(process.argv.slice(2));

const apiPORT = args.port || 6000;

// passport认证

app.proxy = true
// sessions

// body parser
const bodyParser = require('koa-bodyparser')
app.use(bodyParser())

// 调用路由

app.use(require('./router').routes())


// 建立是的监听及server
const httpServer = http.createServer(app.callback());

httpServer.listen(apiPORT, function() {
    console.log('HTTP mock Server is running on: http://localhost:%s', apiPORT);
});

module.exports = httpServer;