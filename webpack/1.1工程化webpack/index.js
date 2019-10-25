#!/usr/local/bin/node
let program = require('commander')
// 这个版本我们需要用到inquirer,交互式安装
let createProject = require('./createProject')
let inquirer = require('inquirer')
