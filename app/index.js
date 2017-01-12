'use strict'
const Koa = require('koa');
const app = new Koa()
const fs = require('fs');
const http = require('http');
const path = require('path')
const processControl = require('./processControl')
const sendFile = require('./util/file-server.js');

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

const db = require('./db')


db.appBase.cfindOne({}).exec().then(function(doc){
    doc = doc || {};
    let appPORT = doc.managePort || 6001;
    httpServer.listen(appPORT, function() {
        console.log('HTTP background Server is running on: http://localhost:%s', appPORT);
    });

    let queryObj = doc.defaultProject? {_id: doc.defaultProject}: {};
    db.appProject.cfindOne(queryObj).exec().then(function(doc){
        if(!doc){
            console.warn('no default project, you can add one to start');
            return;
        }
        
        processControl.addNewProcess(doc);
    })
});



