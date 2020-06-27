#!/usr/bin/env node

require('colors');

const path = require('path');
const fs = require('fs');

const commander = require('commander');
const inquirer = require('inquirer');
const ejs = require('ejs')

console.log('WELCOME To SKR-CLI'.rainbow);

commander.version('1.0.0')
	.description('这是一个最简单的Node.js脚手架')
	.option('-A, --author', 'author of skr-cli')
	.parse(process.argv)
	.action(()=>{
		console.log('superman285'.rainbow);
	})


commander.command('init')
	.alias('i')
	.description('初始化项目')
	.action(()=>{
		inquirer.prompt([
			{
				type: 'input',
				name: 'name',
				message: 'HomePage name?'
			}
		]).then(answers=>{

			const tmplDir = path.join(__dirname, 'templates');

			const destDir = process.cwd();

			fs.readdir(tmplDir, (err, files)=>{
				if (err) {
					throw err;
				}
				files.forEach(file=> {
					ejs.renderFile(path.join(tmplDir, file), answers,(err,result)=>{
						if (err) {
							throw err;
						}
						fs.writeFileSync(path.join(destDir, file),result)
					})
				})
				console.log('New template files added ✨'.green)
			})

		})
	})

commander.parse(process.argv)
