// define是个宏定义，表示画定一个函数
define(function (require, exports, module) {
    
    console.log("------>>>>我是test02<<<<<<<");
    var sex = "男",
        name = "max";
    

    // console.log("我的问题1：为什么test01里用exports.XX抛出变量，而这里用return？");
    // require这种a依赖b,b又依赖a的情况，果然是会死循环
    // console.log("我的问题2：test02里的name会和test01里的冲突？还是重写？");
    // 获取的时候会是两个对象，所以不存在冲突或覆盖
    console.log("------>>>>test02结束<<<<<<<");
    var test01_re = require('test01');
    console.log(test01_re);

    return {
        sex: sex,
        name: name
    }
});
// 循环依赖会再考核题里出现，现在可以先看起来了
// var test01_re = require('test01');
// console.log(test01_re);