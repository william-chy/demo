#!/usr/bin/env node
console.log(process.argv);
// switch (process.argv[3]) {
//   case '--build':
//     console.log('正在打包');
//     break;
//   default:
//     console.log('没匹配参数:process.argv[3]');
//     break;
// }


const program = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
program
  	.version('0.1.0')
	.option('-u, --username <username>', 'this is the username.')
  	.option('-p, --password <password>', 'this is the password.')
  	.action(function(argv1, argv2) {
		console.log(chalk.red('user: ' + program.username + ', pass: ' + program.password + ', argv1: ' + argv1 + ', argv2: ' + argv2));
  	});
program
  	.command('login')
  	.action(function(argv1) {
		inquirer.prompt([{
			type: 'input',
			name: 'username',
			message: 'input username: '
		}, {
			type: 'password',
			name: 'password',
			message: 'input password: '
		}]).then(async function(result) {
			const { confirm } = await inquirer.prompt([{
				type: 'confirm',
				name: 'confirm',
				message: 'confirm? '
			}]);
			console.log(confirm ? 'confirmed!': 'unconfirmed..');
		});
	});
program.parse(process.argv);