'use strict'
const spawn = require('child_process').spawn;


function startServer(){
  // 服务器
  const server = spawn('node', ['--harmony-async-await', './app/index.js'], {
    stdio: 'inherit',
    shell: true
  });

  server.on('exit', function(err){
    setTimeout(startServer, 1000);
  });
}

startServer();
