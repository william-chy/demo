const gulp = require('gulp');
const shell = require('gulp-shell');
const chalk = require('chalk');
const assert = require('assert');
const fs = require('fs');

const writable = fs.createWriteStream('file.js');
gulp.src('./webpack.config.js').pipe(
  gulp.dest('new')
).pipe(
  shell(['git status','echo 成功'])
    .on('pipe', (src) => {
      console.error('有数据正通过管道流入写入器');
    })
    .on('end', (cb) => {
      writable.end(); //结束可写流防止内存泄漏
      console.log(chalk.green(`成功! \n`));
    }),
);
