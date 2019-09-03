//master.js
const childProcess = require('child_process');
var numCPUs = require('os').cpus().length;
var taskEnv = process.argv[2];

var arr = [ 1, 2, 3, 4, 5, 6 ];
var packageRecursion = function() {
  if (arr.length < 1) return;
  for (var i = 0; i < numCPUs; i++) {
    if (arr.length < 1) return;
    const worker = childProcess.fork('worker.js');
    worker.on('message', function(mes) {
      console.log(`子进程运行结果: ${mes}`);
    });
    worker.send(arr.pop());
  }
  if (arr.length < 1) return;
  packageRecursion();
};
packageRecursion();
// var child = [];
// for (var i = 0; i < numCPUs; i++) {
//   child[i] = exec('echo hello ' + name, function(err, stdout, stderr) {
//     if (err) throw err;
//     console.log(this.process.pid);
//     console.log('输出' + stdout);
//     if (stderr) console.error('错误' + stderr);
//   });
// }
