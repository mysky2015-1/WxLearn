define(function (require, exports, module) {
    var age = "18",
        name = "zm";
    console.log("======我是test01======");

    exports.age = age;
    exports.name = name;

    console.log(module);
    console.log("======test01结束======");
});