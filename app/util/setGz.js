
var fs = require('mz/fs');
var zlib = require('zlib')
var readFiles = require('./readfiles')

readFiles('./dist/', async function (file){
  if(/\.gz$/.test(file))return;
  var originalFile = fs.createReadStream(file);
  var gzFile = fs.WriteStream(file + '.gz')
  const output = zlib.createGzip();
  await originalFile.pipe(output).pipe(gzFile);
});

