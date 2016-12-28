const spawn = require('child_process').spawn;

// 服务器
const server = spawn('node', ['--harmony-async-await', './app/index.js'], {
  stdio: 'inherit',
  shell: true
});

server.on('error', function(err){
  console.log(err);
  process.exit(1);
});