'use strict'
const spawn = require('child_process').spawn;

function startServer(){
  // 服务器
  let args = ['--harmony-async-await', './app/index.js'];
  if(process.versions.node.split(".")[0] < 7){
    args = ['./app/lower-start.js']
  }
  const server = spawn('node', args, {
    stdio: 'inherit',
    shell: true
  });

  server.on('exit', function(err){
    setTimeout(startServer, 1000);
  });
}

startServer();
