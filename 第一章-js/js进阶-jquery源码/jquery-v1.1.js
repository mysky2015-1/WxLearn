// @last Modified by zhaomi-nec
// @last Modified time： 2019-5-117：49

(function (root) {
    var testExp = /^\s*(<[\w\W]+>)[^>]*$/;
    var rejectExp = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
    var version = "1.1.0";
    var jQuery = function (selector, context) {
        return new jQuery.prototype.init(selector, context);
    }

    jQuery.fn = jQuery.prototype = {
        length: 0,
        jquery: version,
        selector: "",
        // 模拟jquery实现选择器，内置queryselector，jquery本身使用的是sizzle
        init: function (selector, context) {
            context = context || document;
            var match, elem, index = 0;
            // $()  $(undefined) $(null) $(false)
            if (!selector) {
                return this;
            }
            if (typeof selector === "string") {
                if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length > 2) {
                    match = [selector];
                }
            }
            if (match) {
                // 合并数组 object array2
                jQuery.merge(this, jQuery.parseHTML(selector, context));

            } else {
                // 查询节点
                elem

            }
        },
        css: function () {

        }
    }
    jQuery.fn.extend = jQuery.extend = function () {
        var target = arguments[0] || {};
        var length = arguments.length;
        var i = 1,
            option,
            name,
            deep = false,
            copy, src, copyIsArray, clone;
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1];
            i = 2;
        }
        if (typeof target !== "object") {
            target = {};
        }
        // 参数个数
        if (length === i) {
            target = this;
            i--;
        }
        // 深拷贝
        // 浅拷贝
        for (; i < length; i++) {
            if ((option = arguments[i]) != null) {
                for (name in option) {
                    copy = option[name];
                    src = target[name];
                    console.log(copy);
                    console.log(src);
                    if (deep && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : [];
                        } else {
                            clone = src && jQuery.isPlainObject(src) ? src : {};
                        }

                        target[name] = jQuery.extend(deep, clone, copy);
                        //执行一次浅拷贝target = {name: "nax", list: {…}}, name = "list", deep = true, clone = {age: "30", sex: "男"}, copy = {sex: "男"}

                        console.log(target[name]);
                    } else if (copy != undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;

    }

    jQuery.fn.init.prototype = jQuery.fn;
    jQuery.extend({
        // 类型检测
        isPlainObject: function (obj) {
            return toString.call(obj) === "[object Object]";
        },
        isArray: function (obj) {
            return toString.call(obj) === "[object Array]";
        }
    });
    root.$ = root.jQuery = jQuery;
})(this);