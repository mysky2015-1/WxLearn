/*
 * callbacks的原理，其实就是一个听话的容器
 */

(function (root) {
    var testExp = /^\s*(<[\w\W]+>)[^>]*$/;
    // 作用就是提取标签，exec获取匹配的结果，test是返回true/false
    // <(\w+)\s*\/?>  <dddd />
    // (?:)匹配但不捕获 ，加这个就不捕获</div>  不加就捕获出来
    // (?:<\/\1>|)反向引用
    var rejectExp = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
    var version = "1.0.1";
    var optionscache = {};
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
        },

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
        callbacks: function (options) {
            // 首先判断一下options是否是字符串，如果不是就创建一个空对象（然后判断一下缓存里是否存在options，如果没有就创建一个，否则就从缓存里获取），最终把结果赋值给options， 最终我们会得到类似options.stopOnfalse的设置
            options = typeof options === "string" ? (optionscache[options] || createOptions(options)) : {};
            var list = []; //队列存储容器，添加处理函数
            var index, length, testting, memory, start, starts; //执行初始化的位置

            // 执行callbacks处理函数
            var fire = function (data) {
                // 查看是否设置了立即执行的参数，如果是的话就把data传给memory
                memory = options.memory && data;
                index = starts || 0;
                console.log("index:" + index);
                start = 0;
                length = list.length;
                testting = true;
                console.log(list);
                // 循环list，函数队列数组
                for (; index < length; index++) {
                    // 如果函数的上下文环境和参数返回的是false，或者callbacks设置了stopOnfalse，那么就返回
                    if (list[index].apply(data[0], data[1]) === false && options.stopOnfalse) {
                        break;
                    }
                }

            };
            var self = {
                add: function () {

                    //把类数组转化成真正的数组
                    // console.log(arguments);  -->Arguments [ƒ, callee: ƒ, Symbol(Symbol.iterator): ƒ]
                    var args = Array.prototype.slice.call(arguments);
                    // console.log(args);   -->[ƒ]
                    start = list.length;
                    // console.log("start:" + start);
                    // 循环这个args数组里的项，如果是函数就放到list里
                    args.forEach(function (fn) {
                        if (toString.call(fn) === "[object Function]") {
                            // 去重的判断
                            if (!options.unique || !self.has(fn, list)) {
                                list.push(fn);
                            }

                        }
                    });
                    if (memory) {
                        starts = start;
                        fire(memory); //如果memory为真，就立即执行
                    }
                },
                // 执行队列里的函数靠的是外层的fire方法，但是内部的fire方法可以控制我再执行时的参数传递和上下文
                fireWith: function (context, arguments) {
                    var args = [context, arguments];
                    if (!options.once || !testting) {
                        fire(args);
                    }
                },
                fire: function () {
                    self.fireWith(this, arguments);
                },
                has: function (fn, array) {
                    return jQuery.inArray(fn, array) > -1;
                }
            }
            return self;

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
        },
        inArray: function (fn, arr) {
            return arr == null ? -1 : [].indexOf.call(arr, fn);
        }

    });

    root.$ = root.jQuery = jQuery;
    var rootjQuery = jQuery(document);

    function createOptions(options) {
        // 在缓存中创建options
        var object = optionscache[options] = {}; //把传入的参数作为对象传给object
        // 多个参数，通过split 分割空格传入的参数
        options.split(/\s+/).forEach(function (value) {
            console.log(value);
            object[value] = true;
        });
        return object;
    }
    root.$ = $;
})(this)