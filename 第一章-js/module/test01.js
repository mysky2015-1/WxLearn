define(function (require, exports, module) {
    var age = "18",
        name = "zm";
    console.log("======我是test01======");

    exports.age = age;
    exports.name = name;
    var test02_re = require('test02');
    console.log("test1调用test2的----", test02_re);
    exports.sex = test02_re.sex;

    // console.log(module);
    console.log("======test01结束======");
});