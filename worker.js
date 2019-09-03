// var exec = require('child_process').exec;

// process.on('message', function(mes) {
//   exec('echo hello ' + mes, function(err, stdout, stderr) {
//     if (err) throw err;
//     console.log(this.process.pid);
//     process.send('输出' + stdout);
//     if (stderr) process.send('错误' + stderr);
//   });
// });

const [ a, b, ...rest ] = [ 1, 2, 3, 4, 5, 6 ];
console.log(rest);
