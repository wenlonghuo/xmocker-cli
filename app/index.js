'use strict'
const Koa = require('koa');
const app = new Koa()
const fs = require('fs');
const http = require('http');
const path = require('path')
const WebSocket = require('ws')

const processControl = require('./controller/processControl')
const sendFile = require('./util/file-server.js');
const db = require('./db');
const log = require('./util/log')
// passport认证

app.proxy = true
// sessions

// body parser
const bodyParser = require('koa-bodyparser')
app.use(bodyParser())


// 静态服务器 添加默认为Index.html
app.use(async function(ctx, next){
  return next().then(sendFile(ctx, ctx.path, {root: './dist/',index: 'index.html'}));
})

// 调用路由

app.use(require('./router').routes())


// 建立是的监听及server
const httpServer = http.createServer(app.callback());
const wss = new WebSocket.Server({server: httpServer})

log.broad(wss);
wss.on('connection', log.ws)

// 查询appbase
db.appBase.cfindOne({}).exec().then(function(doc){
    doc = doc || {};
    let appPORT = doc.managePort || 6001;
    httpServer.listen(appPORT, function() {
        console.log('后台管理界面运行于: http://localhost:%s', appPORT);
    });

    let queryObj = doc.defaultProject? {_id: doc.defaultProject}: {};
    db.appProject.cfindOne(queryObj).exec().then(function(doc){
        if(!doc){
            console.log('没有默认项目，添加后可自动启动');
            return;
        }
        processControl.restartProcess(doc);
    })
});


