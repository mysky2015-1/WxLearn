/*
 * @Author: Administrator
 * @Date:   2018-10-30 20:40:51
 * @Last Modified by:   Administrator
 * @Last Modified time: 2018-11-01 22:10:22
 */
(function (root) {
    var testExp = /^\s*(<[\w\W]+>)[^>]*$/;
    // 作用就是提取标签，exec获取匹配的结果，test是返回true/false
    // <(\w+)\s*\/?>  <dddd />
    // (?:)匹配但不捕获 ，加这个就不捕获</div>  不加就捕获出来
    // (?:<\/\1>|)反向引用
    var rejectExp = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
    var version = "1.0.1";
    var jQuery = function (selector, context) {
        return new jQuery.prototype.init(selector, context);
    }

    jQuery.fn = jQuery.prototype = { //原型对象
        length: 0,
        jquery: version,
        selector: "",
        init: function (selector, context) {
            context = context || document;
            var match, elem, index = 0;
            //$()  $(undefined)  $(null) $(false)  
            if (!selector) {
                return this;
            }

            if (typeof selector === "string") {
                if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
                    match = [selector]
                }
                //创建DOM
                if (match) {
                    //this 
                    // merge是通过extend扩展的 
                    jQuery.merge(this, jQuery.parseHTML(selector, context));
                    //查询DOM节点
                } else {
                    elem = document.querySelectorAll(selector);
                    var elems = Array.prototype.slice.call(elem);
                    this.length = elems.length;
                    for (; index < elems.length; index++) {
                        this[index] = elems[index];
                    }
                    this.context = context;
                    this.selector = selector;
                }
            } else if (selector.nodeType) {
                this.context = this[0] = selector;
                this.length = 1;
                return this;
            } else if (jQuery.isFunction(selector)) {
                rootjQuery.ready(selector);
                // return rootjQuery.ready !== undefined ? jQuery.ready(selector) : selector(jQuery);
            }

        },
        css: function () {
            console.log("di~~didi~~")
        },
        ready: function (fn) {
            // 检测dom是否加载完毕
            document.addEventListener("DOMContentLoaded", jQuery.ready, false);
            if (jQuery.isready) {
                fn.call(document);
            } else {
                jQuery.readylist.push(fn); //把函数丢到jquery的队列里去
            }
        }
    }

    jQuery.fn.init.prototype = jQuery.fn;


    jQuery.extend = jQuery.prototype.extend = function () {
        var target = arguments[0] || {};
        var length = arguments.length;
        var i = 1;
        var deep = false; //默认为浅拷贝 
        var option;
        var name;
        var copy;
        var src;
        var copyIsArray;
        var clone;

        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1];
            i = 2;
        }

        if (typeof target !== "object") {
            target = {};
        }

        if (length == i) {
            target = this;
            i--; //0   
        }

        for (; i < length; i++) {
            if ((option = arguments[i]) !== null) {
                for (name in option) {
                    src = target[name];
                    copy = option[name];
                    if (deep && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : [];
                        } else {
                            clone = src && jQuery.isPlainObject(src) ? src : {};
                        }
                        target[name] = jQuery.extend(deep, clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    }

    jQuery.extend({
        //类型检测     
        isPlainObject: function (obj) {
            return typeof obj === "object";
        },

        isArray: function (obj) {
            return toString.call(obj) === "[object Array]";
        },

        isFunction: function (fn) {
            return toString.call(fn) === "[object Function]";
        },
        //类数组转化成正真的数组  
        markArray: function (arr, results) {
            var ret = results || [];
            if (arr != null) {
                jQuery.merge(ret, typeof arr === "string" ? [arr] : arr);
            }
            return ret;
        },

        //合并数组
        merge: function (first, second) {
            var l = second.length,
                i = first.length,
                j = 0;

            if (typeof l === "number") {
                for (; j < l; j++) {
                    first[i++] = second[j];
                }
            } else {
                while (second[j] !== undefined) {
                    first[i++] = second[j++];
                }
            }

            first.length = i;

            return first;
        },

        parseHTML: function (data, context) {
            if (!data || typeof data !== "string") {
                return null;
            }
            //过滤掉<a>   <a>   => a  提取标签名
            var parse = rejectExp.exec(data);
            console.log(parse)
            return [context.createElement(parse[1])];
        },
        isFunction: function (fn) {
            return toString.call(fn) === "[object Function]";
        },
        isready: false,
        readylist: [],
        ready: function () {
            // 事件函数
            jQuery.isready = true;
            jQuery.readylist.forEach(function (callback) {
                callback.call(document);
            });
            jQuery.readylist = null;
        }

    });

    root.$ = root.jQuery = jQuery;
    var rootjQuery = jQuery(document);
})(this);