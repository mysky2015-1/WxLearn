// define是个宏定义，表示画定一个函数
define(function (require, exports, module) {
    console.log("======我是test02======");
    var sex = "男",
        name = "max";
    // console.log("我的问题1：为什么test01里用exports.XX抛出变量，而这里用return？");
    // require这种a依赖b,b又依赖a的情况，果然是会死循环

    // console.log("我的问题2：test02里的name会和test01里的冲突？还是重写？");
    // 获取的时候会是两个对象，所以不存在冲突或覆盖
    console.log(module);
    console.log("======test02结束======");
    return {
        sex: sex,
        name: name
    }
});