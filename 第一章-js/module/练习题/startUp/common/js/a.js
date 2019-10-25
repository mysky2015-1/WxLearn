define(function (require, exports, module) {
	var age = "30";
	var b = require("b");
	console.log("a.js里获取了b.js的值", b.sex);
	exports.age = age;
});