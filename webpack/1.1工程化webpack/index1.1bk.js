#!/usr/local/bin/node
let program = require('commander')
// 接下来就可以写一个create通用组件，放一堆的模板，随便新建
// let createProject = require('./create')
// 这是个基本的拷贝模板的js
let createProject = require('./createProject')
program.version('0.0.0')
  .option('-t,--type <name>','project type')
  .option('-n,--type <name>','project type')

program
  .command('create <name>')
  .action(function(name){
    createProject(name,program.type)
    console.log(name,program.type)
  })
program.parse(process.argv)
// console.log('hello webpack')