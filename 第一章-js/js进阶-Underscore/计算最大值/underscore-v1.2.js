(function (root) {
    // 源码一开始的时候便储存之前的 _ 对象

    // var root = typeof self == 'object' && self.self === self && self ||
    //     typeof global == 'object' && global.global === global && global ||
    //     this || {};
    var push = Array.prototype.push;
    // 如何实现链式调用，始终处理的是this
    // 实现数组去重，区分大小写之后，再求平方根
    var _ = function (obj) {
        if (obj instanceof _) {
            return obj;
        }
        if (!(this instanceof _)) {
            return new _(obj);
        }
        this._wrapped = obj;
    }
    var previousUnderscore = root._;




    // 数组去重
    _.uniq = _.unique = function (array, isSorted, iteratee, context) {
        // 没有传入 isSorted 参数
        if (!_.isBoolean(isSorted)) {
            context = iteratee;
            iteratee = isSorted;
            isSorted = false;
        }
        // 如果有迭代函数
        if (iteratee != null)
            iteratee = cb(iteratee, context);
        var result = [];

        // 用来过滤重复值
        var seen;


        for (var i = 0; i < array.length; i++) {
            var computed = iteratee ? iteratee(array[i], i, array) : array[i];
            // 如果是有序数组,则当前元素只需跟上一个元素对比即可
            // 用 seen 变量保存上一个元素
            if (isSorted) {
                if (!i || seen !== computed) result.push(computed);
                // seen 保存当前元素,供下一次对比
                seen = computed; //  1
            } else if (result.indexOf(computed) === -1) {
                result.push(computed);
            }
        }

        return result;
    }

    // 链式调用
    _.chain = function (obj) {
        var instance = _(obj);
        instance._chain = true;
        return instance;
    }

    // 辅助函数
    var result = function (instance, obj) {
        return instance._chain ? _(obj).chain() : obj;
    }
    _.prototype.value = function () {
        return this._wrapped;
    }
    _.functions = function (obj) {
        var result = [],
            key;
        for (key in obj) {
            result.push(key);
        }
        return result;
    }

    // _.map([1, 2, 3], function (value, index, object) {
    //     return value * 3
    // }, obj)

    _.map = function (obj, iteratee, context) {
        // args.push("zm");
        // return args;
        // 生成不同功能的迭代器
        var iteratee = _.isFunction(iteratee) ? cb(iteratee, context) : _.identity;
        // iteratee 最终会是optimizeCb里的匿名函数
        // 分辨obj是数组还是对象，
        var keys = !_.isArray(obj) && Object.keys(obj);
        // console.log(keys);// 如果是数组则返回false，如果是对象则返回对象的value组成的数组
        var length = (keys || obj).length;
        var result = Array(length);
        for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            // console.log(currentKey); 如果是对象的话就获取对象value的循环，是数组的话就获取index值
            result[index] = iteratee(obj[currentKey], index, obj);
            // 最后把通过迭代器处理过后的值赋值给result
        }
        return result;
    }
    var cb = function (iteratee, context, count) {

        if (iteratee == null) {
            return _.identity;
        }
        if (_.isFunction(iteratee)) {
            return optimizeCb(iteratee, context, count);
        }
    }
    var optimizeCb = function (func, context, count) {
        if (context == void 0) {
            return func;
        }
        switch (count == null ? 3 : count) {
            case 1:
                return function (value) {
                    return func.call(context, value);
                };
            case 3:
                return function (value, index, obj) {
                    return func.call(context, value, index, obj);
                };
            case 4:
                return function (memo, value, index, obj) {
                    // 迭代器 这里的memo指向的是传参里的memo
                    return func.call(context, memo, value, index, obj);
                };
        }
    }
    // 默认迭代器
    _.identity = function (value) {
        return value;
    }
    // rest 参数包装
    _.restArguments = function (func) {
        // rest 参数位置
        var startIndex = func.length - 1;
        return function () {
            var length = arguments.length - startIndex,
                rest = Array(length),
                index = 0;
            // rest数组中的成员 rest==[2,3,4]
            for (; index < length; index++) {
                rest[index] = arguments[index + startIndex];
            }
            // 非rest参数成员的值--对应  args === 2[]
            var args = Array(startIndex + 1);
            for (index = 0; index < startIndex; index++) {
                args[index] = arguments[index];
            }
            args[startIndex] = rest;
            return func.apply(this, args);
        }
    }
    // 没什么用的delay
    _.delay = function (func, wait) {
        var args = [].slice.call(arguments, 2);
        return setTimeout(function () {
            func.apply(null, args);
        }, wait);
    };
    // 从右到左的运算
    _.compose = function () {
        var args = arguments;
        // 倒着开始
        var start = arguments.length - 1;
        return function () {
            var i = start;
            var result = args[i].apply(null, arguments); //把匿名函数的参数最后一个函数计算出来的结果
            // console.log(result);
            // 倒序循环，把每一次的结果当做参数返回给下一次的计算
            while (i--) {
                result = args[i].call(null, result);
            }
            return result;
        }
    }
    // 实体编码
    var escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '`': '&#x60;'
    }
    var createEscaper = function (map) {
        var escaper = function (match) {
            return escapeMap[match];
        }
        var source = "(?:" + Object.keys(map).join("|") + ")";
        // 正则校验
        var testRegExp = new RegExp(source, "g");
        // console.log(testRegExp);
        return function (string) {
            return testRegExp.test(string) ? string.replace(testRegExp, escaper) : string;
        }
    }
    _.escape = createEscaper(escapeMap);



    // 真值检测
    var createReduce = function (dir) {
        var reduce = function (obj, iteratee, memo, init) {
            // console.log(obj);        (3) [1, 5, 6]
            // console.log(iteratee);   ƒ (memo, value, index, obj) {return memo + value; //1+2}
            // console.log(memo);      -1
            // console.log(init);      true

            var keys = !_.isArray(obj) && Object.keys(obj), //判断调用对象是否为数组，如果不是数组就把对象转成数组形式
                length = (keys || obj).length, // 获取数组(或转成数组的对象)的长度
                index = dir > 0 ? 0 : length - 1; //获取开始方向，默认dir是1，则循环从0开始，否则则从最后一位开始
            if (!init) { //当参数小于3个的时候
                memo = obj[keys ? keys[index] : index]; //开始循环的值为obj[index(或者对象中下标index开始)]
                index += dir; //1 index根据循环方法加或者减
            }
            for (; index >= 0 && index < length; index += dir) { // index=1 length=3 ;index=2 length=3 ;
                var currentKey = keys ? keys[index] : index; // 1;2;
                memo = iteratee(memo, obj[currentKey], currentKey, obj); //memo 0;1+2;3+3累加
            }
            return memo;

        }
        return function (obj, iteratee, memo, context) { // 开始调用
            var init = arguments.length >= 3; //获得init，如果参数小于3，则为false
            return reduce(obj, optimizeCb(iteratee, context, 4), memo, init);
        }
    }
    _.reduce = createReduce(1); //可选的1或-1，1就是从前往后，-1是从后往前
    // predicate  真值检测 （重点：返回值）predicate是拿到迭代器的返回值的结果
    _.filter = _.select = function (obj, predicate, context) {
        // console.log("predicate : " + predicate);
        // console.log("context : " + context);
        var results = [];
        predicate = cb(predicate, context);

        _.each(obj, function (value, index, list) {

            if (predicate(value, index, list)) {
                // console.log(value);
                results.push(value);
            }
        })
        return results;
    }
    //去掉数组中所有的假值   _.identity = function(value){return value};
    _.compact = function (array) {
        return _.filter(array, _.identity);
    };
    // 返回某个范围内的数值组成的数组
    // start 开始，stop结束  step步长
    _.range = function (start, stop, step) {
        if (stop == null) {
            // 只传一个值，的时候默认是从0~
            stop = start || 0;
            start = 0;
        }
        step = step || 1;
        // 返回数的长度，返回大于等于参数x的最小整数，向上取整 10/2 5
        var length = Math.max(Math.ceil((stop - start) / step), 0);
        // 返回的数组
        var range = Array(length);
        for (var index = 0; index < length; index++, start += step) {
            range[index] = start;
        }
        return range;
    }
    //摊平数组
    var flatten = function (array, shallow) {
        var ret = [];
        var index = 0;
        for (var i = 0; i < array.length; i++) {
            var value = array[i]; //展开一次
            if (_.isArray(value) || _.isArguments(value)) {
                //递归全部展开
                if (!shallow) {
                    value = flatten(value, shallow);
                }
                var j = 0,
                    len = value.length;
                ret.length += len;
                while (j < len) {
                    ret[index++] = value[j++];
                }
            } else {
                ret[index++] = value;
            }
        }
        return ret;
    }
    _.flatten = function (array, shallow) {
        // shallow 深摊平还是浅摊平
        return flatten(array, shallow);
    }
    //返回数组中除了最后一个元素外的其他全部元素。 在arguments对象上特别有用。
    _.initial = function (array, n) {
        return [].slice.call(array, 0, Math.max(0, array.length - (n == null ? 1 : n)));
    };
    //返回数组中除了第一个元素之外的其他全部元素。传递 n 参数将返回从n开始的剩余所有元素
    _.rest = function (array, n, guard) {
        return [].slice.call(array, n == null ? 1 : n);
    };


    _.each = function (target, callback) {
        // console.log(target);
        var key, i = 0;
        if (_.isArray(target)) {
            var length = target.length;
            for (; i < length; i++) {
                callback.call(target, target[i], i);
            }
        } else {
            for (key in target) {
                callback.call(target, key, target[key]);
            }
        }
    }
    // 设置查询顺序 1从前往后，-1从后往前
    function creatPredicateIndexFinder(dir) {
        return function (array, predicate, context) {
            predicate = cb(predicate, context);
            var length = array.length;
            // 根据方向确定遍历的起始位置
            var index = dir > 0 ? 0 : length - 1;
            for (; index >= 0 && index < length; index += dir) {
                // 找到第一个符合条件的元素
                // 并返回下标值
                if (predicate(array[index], index, array)) {
                    return index;
                }
            }
            return -1;
        }
    }


    // 
    _.findIndex = creatPredicateIndexFinder(1);
    _.findLastIndex = creatPredicateIndexFinder(-1);
    _.isNaN = function (obj) {
        return _.isNumber(obj) && obj !== obj;
    }


    //白名单
    _.pick = function (object, oiteratee, context) {
        var result = {};
        var iteratee, keys;
        if (object == null) {
            return result;
        }

        if (_.isFunction(oiteratee)) {
            keys = _.allKeys(object);
            //生成迭代器  oiteratee  封装
            iteratee = optimizeCb(oiteratee, context);
        } else {
            keys = [].slice.call(arguments, 1);
            iteratee = function (value, key, object) {
                return key in object;
            }
        }

        for (var i = 0, length = keys.length; i < length; i++) {
            var key = keys[i];
            var value = object[key];
            //满足条件
            if (iteratee(value, key, object)) {
                result[key] = value;
            }
        }
        return result;
    }
    //使用模板标识符<% %>  evalute  js逻辑捕获    
    // interpolate  变量捕获   escape 逃逸的字符捕获  模式1| 模式2
    //以默认配置为优先 以用户配置为覆盖
    var templateSettings = {
        evalute: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g,
    }
    var escapeExp = /\\|'|\r|\n/g;
    // 需要逃逸的字符,这里不是很懂，什么叫逃逸，避免搜索到的意思吗？
    var escapes = {
        "\\": "\\",
        "\r": "r",
        "'": "'",
        "\n": "n"
    }
    var escapeChar = function (macth) {
        return "\\" + escapes[macth];
    }
    _.template = function (templateString, settings) {
        // _.extend的作用是对一个空对象扩展，把后面一个对象里的内容替换前一个对象里对应的内容，并赋值给一个空对象
        // 这里的意思就是优先使用默认设置的配置，如果用户有新加自定义的，那就用自定义的覆盖默认的配置
        settings = _.extend({}, templateSettings, settings);

        var matcher = new RegExp([
            settings.interpolate.source,
            settings.escape.source,
            settings.evalute.source
        ].join("|"), "g");
        // console.log(matcher);
        // 执行头
        var source = "_p+='",
            index = 0;
        // 怎么来解析呢
        templateString.replace(matcher, function (match, interpolate, escape, evalute, offset) {
            source += templateString.slice(index, offset).replace(escapeExp, escapeChar);
            index = offset + match.length;
            console.log("escape", escape);
            if (escape) {
                source += "';\n _p+='" + escape + "";
            } else if (interpolate) {
                source += "'+\n((_t=(" + interpolate + ")) == null ? '':_t)+\n'";

            } else if (evalute) {
                source += "';\n" + evalute + "\n _p+='";
            }

        });
        source += "';";
        source = "with(obj){\n" + source + "}\n";
        source = "var _t,_p='';" + source + "return _p;\n";

        // 渲染函数
        var render = new Function("obj", source),
            template = function (data) {
                return render.call(null, data);
            };
        return template

    }


    function createIndexFinder(dir, predicateFind, sortedIndex) {
        // API 调用形式
        // _.indexOf(array,value,[isSorted])
        return function (array, item, idx) {
            var i = 0,
                length = array.length;
            // 第三个参数true用二分查找优化 否则遍历查找
            if (sortedIndex && _.isBoolean(idx) && length) {
                // 能用二分查找加速的条件
                // 用_.sortedIndex 找到有序数组中item 正好插入的位置
                idx = sortedIndex(array, item);
                return array[idx] === item ? idx : -1;
            }
            // 特殊情况 如果要查找的元素是NaN 类型  NaN !== NaN
            if (item !== item) {
                idx = predicateFind(slice.call(array, i, length), _.isNaN);
                return idx >= 0 ? idx + i : -1;
            }
            // 正常遍历
            let index=0
            for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
                console.log(index++);
                if (array[idx] === item) {
                    return idx;
                }
            }
            retuen - 1;
        }
    }
    _.sortedIndex = function (array, obj, iteratee, context) {
        // 重点:cb函数 if (iteratee == null) {return function(value){return value;}}
        iteratee = cb(iteratee, context, 1);
        var value = iteratee(obj);
        var low = 0,
            i=0,
            high = array.length;
        // 二分查找
        while (low < high) { //4  4 
            console.log("----",i++)
            var mid = Math.floor((low + high) / 2); //4
            if (iteratee(array[mid]) < value) //  5 < 5
                low = mid + 1; //4
            else
                high = mid; //4
        }

        return low; //4
    };


    // _.findIndex 特殊情况下的处理方案 NaN
    // _.sortedIndex 针对排序的数组做的二分查找 优化性能
    _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
    _.lastIndexOf = createIndexFinder(1, _.findLastIndex);
    _.noConflict = function () {
        root._ = previousUnderscore;
        return this;
    };

    _.random = function (min, max) {

        // 如果只有一个值的话，就返回0~这个值的随机数
        if (max == null) {
            max = min;
            min = 0;
        }
        return min + Math.floor(Math.random() * (max - min + 1));
    }


    _.has = function (obj, key) {
        return obj != null && hasOwnProperty.call(obj, key);
    }

    // 检测对象上的属性是否可枚举
    var hasEnumBug = !{
        toString: null
    }.propertyIsEnumerable('toString');
    var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
        'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'
    ];
    // 获取obj对象上所有属性的名称（可枚举的属性）
    // Object.keys() Es5上就有这个方法，但是这个方法不兼容ie9

    var ArrayProto = Array.prototype,
        ObjProto = Object.prototype;
    var collectNonEnumProps = function (obj, keys) {
        var nonEnumIdx = nonEnumerableProps.length;
        var constructor = obj.constructor;
        var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;
        var prop = 'constructor';
        if (has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

        while (nonEnumIdx--) {
            prop = nonEnumerableProps[nonEnumIdx];
            if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
                keys.push(prop);
            }
        }
        console.log(keys);
    };

    _.keys = function (obj) {

        if (!_.isObject(obj)) return [];
        // 判断浏览器是否支持Object.keys()优先使用
        if (Object.keys) {
            return Object.keys(obj);
        }
        // if (nativeKeys) return nativeKeys(obj);
        var keys = [];
        for (var key in obj)
            // if (has(obj, key)) keys.push(key);
            if (hasOwnProperty.call(obj, key)) keys.push(key);
        //  Ahem, IE < 9.
        if (hasEnumBug) collectNonEnumProps(obj, keys);

        // max老师示范
        // var prop ;
        //     //IE>9  bug
        //     if (!hasEnumbug) {
        //         for (var i = 0, length = nonEnumerableProps.length; i < length; i++) {
        //             prop = nonEnumerableProps[i];
        //             if (obj[prop] !== obj.__proto__[prop]) {
        //                 result.push(prop);
        //             }
        //         }
        //     }

        return keys;
    };
    _.value = function (obj) {
        // 此方法只针对对象自身上的属性值
        if (!_.isObject(obj)) return []; //如果不是对象，则返回，这个方法只针对对象
        if (Object.keys) {
            var keys_obj = Object.keys(obj),
                len = keys_obj.length,
                values = [];
            for (var k = 0; k < len; k++) {
                values.push(obj[keys_obj[k]]);
            }
            return values;
        }
    }
    _.allKeys = function (obj) {
        if (!_.isObject(obj)) return [];
        var keys = [];
        for (var key in obj) keys.push(key);
        // 如果不可枚举的属性 去判断这个属性是否和obj里的保留方法冲突，针对ie9以下某版本
        if (hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
    };

    // 作业，练习，values 获取对象的自身和原型链上的值

    _.allValue = function (obj) {
        // 此方法针对对象自身+对象原型链上的值
    }

    // 用于创建分配器功能的内部功能。
    var createAssigner = function (keysFunc, defaults) {
        return function (obj) {
            var length = arguments.length;
            if (defaults) obj = Object(obj);
            // 如果参数小于2，直接返回
            if (length < 2 || obj == null) return obj;
            for (var index = 1; index < length; index++) {
                var source = arguments[index],
                    // 这里的keysFunc就是 createAssigner(_.allKeys)里的_.allKeys
                    keys = keysFunc(source),
                    l = keys.length;
                for (var i = 0; i < l; i++) {
                    var key = keys[i];
                    if (!defaults || obj[key] === void 0) obj[key] = source[key];
                }
            }
            return obj;
        };
    };
    //  对象扩展 对自身和原型链上的对象的可枚举扩展
    _.extend = createAssigner(_.allKeys);
    // 只查找对象自身上的可枚举扩展
    _.extendOwn = _.assign = createAssigner(_.keys);

    // 反转对象的键和值。值必须是可序列化的。   
    _.invert = function (obj) {
        var result = {};
        var keys = _.keys(obj);
        console.log(keys);
        console.log(obj);
        for (var i = 0, length = keys.length; i < length; i++) {
            result[obj[keys[i]]] = keys[i];
        }
        return result;
    };

    // 浅拷贝
    _.clone = function (obj) {
        // 检测数据类型是数组还是对象，如果是数组的话，调用数组对象的slice方法，切割
        if (!_.isObject(obj)) return obj;
        return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
    }
    // 深拷贝
    _.deepclone = function (obj) {
        // 待克隆的是数组还是对象
        if (_.isArray(obj)) {
            // 映射到一个新的数组当中，相当于深拷贝
            return _.map(obj, function (elem) {
                return _.isArray(elem) || _.isObject(elem) ? _.deepclone(elem) : elem;
            });
        } else if (_.isObject(obj)) {
            return _.reduce(obj, function (memo, value, key) {
                // underscore的迭代器就是增强的回调函数
                console.log(key);
                console.log(value);
                memo[key] = _.isArray(value) || _.isObject(value) ? _.deepclone(value) : value;
                return memo;
            }, {});
        } else {
            return obj
        }
    }
    // 数组洗牌
    _.sample = function (array, n) {
        if (n == null) {
            return array[_.random(array.length - 1)];
        }
        var sample = _.clone(array),
            length = sample.length,
            last = length - 1;
        n = Math.max(Math.min(n, length), 0); //随机个数和数组长度之间取断的那个
        for (var index = 0; index < n; index++) {
            // 循环生成随机数
            var rand = _.random(index, last),
                temp = sample[index];
            sample[index] = sample[rand];
            sample[rand] = temp;
        }
        return sample.slice(0, n);
    }
    // 返回乱序之后的副本
    _.shuffle = function (array) {
        return _.sample(array, Infinity);
    }
    // 返回一个函数的副本
    _.partial = function (func) {
        // 提取参数
        var args = [].slice.call(arguments, 1); //提取partial第二个参数开始的参数
        // console.log(args);[5]
        var bound = function () {
            var index = 0;
            //     length = args.length,
            //     ret = Array(length);
            // for (var i = 0; i < length; i++) {
            //     ret[i] = args[i]; //循环把partial的参数复制到ret里 ret=[5]
            // }

            while (index < arguments.length) { // 判断bound（即partialAdd）方法的参数是否大于index
                args.push(arguments[index++]); //[5,10]
            }
            console.log(args);
            return func.apply(this, args); //最后调用func函数，并把上边的两个参数给它
        }
        return bound;
    }

    // 获取当前的时间戳
    _.now = function () {
        return new Date().getTime();
    };

    var restArguments = function (func, startIndex) {
        startIndex = startIndex == null ? func.length - 1 : +startIndex;
        return function () {
            var length = Math.max(arguments.length - startIndex, 0),
                rest = Array(length),
                index = 0;
            for (; index < length; index++) {
                rest[index] = arguments[index + startIndex];
            }
            switch (startIndex) {
                case 0:
                    return func.call(this, rest);
                case 1:
                    return func.call(this, arguments[0], rest);
                case 2:
                    return func.call(this, arguments[0], arguments[1], rest);
            }
            var args = Array(startIndex + 1);
            for (index = 0; index < startIndex; index++) {
                args[index] = arguments[index];
            }
            args[startIndex] = rest;
            return func.apply(this, args);
        };
    };

    // throttle_.throttle(function, wait, [options]) 
    // 创建并返回一个像节流阀一样的函数，当重复调用函数的时候，
    //  至少每隔 wait毫秒调用一次该函数。对于想控制一些触发频率较高的事件有帮助。

    _.throttle = function (func, wait, options) {
        // 默认情况下，throttle将在你调用的第一时间尽快执行这个function，并且，如果你在wait周期内调用任意次数的函数，都将尽快的被覆盖。
        var lastTime = 0, //上一次在执行回调的时间戳初始值
            context, args, result,
            timeout = null;
        if (!options) {
            options = {};
        }
        var later = function () {
            lastTime = options.leading === false ? 0 : _.now();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        }
        var throttled = function () {
            var now = _.now();
            // 立即执行 or等待wait
            // options是立即执行还是，等待毫秒之后执行？
            // option.leading == false  等待了wait毫秒之后执行 ，默认立即执行
            // 如果你想禁用第一次首先执行的话，传递{leading: false}，
            if (!lastTime && options.leading === false) {
                // 如果立即执行的话，就将lastTime设置成当前时间戳
                lastTime = now;
            }
            // 距离下一次调用func还需要等待多长时间
            var remaining = wait - (now - lastTime);

            // 如果没设置leading的话，leading为undefind 则wait-now值为一个负数
            // 滚动触发后，第二次调用remaining就会递减now-lastTime就是上次调用和这次调用的时间差
            context = this;
            args = arguments;
            console.log(remaining);
            if (remaining <= 0 || remaining > wait) {
                console.log("--调用func-第一次一次调用");
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                // 立即调用func函数
                lastTime = now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
                // 还有如果你想禁用最后一次执行的话，传递{trailing: false}。
                console.log("--控制频率的定时器- 最后一次调用");
                //控制频率的定时器
                timeout = setTimeout(later, remaining);
            }
            return result;
        }
        // 如果需要取消预定的 throttle ，可以在 throttle 函数上调用 .cancel()。
        throttled.cancel = function () {
            clearTimeout(timeout);
            lastTime = 0;
            timeout = context = args = null;
        }

        // 最后一次要不要执行
        // 默认回去执行，options.trailing == false 不会执行
        return throttled;
    }



    // debounce_.debounce(function, wait, [immediate]) 
    // 返回 function 函数的防反跳版本, 将延迟函数的执行(真正的执行)在函数最后一次调用时刻的 wait 毫秒之后. 对于必须在一些输入（多是一些用户操作）停止到达之后执行的行为有帮助。 例如: 渲染一个Markdown格式的评论预览, 当窗口停止改变大小之后重新计算布局, 等等.

    // 在 wait 间隔结束时，将使用最近传递给 debounced（去抖动）函数的参数调用该函数。

    // 传参 immediate 为 true， debounce会在 wait 时间间隔的开始调用这个函数 。（注：并且在 waite 的时间之内，不会再次调用。）在类似不小心点了提交按钮两下而提交了两次的情况下很有用。 （感谢 @ProgramKid 的翻译建议）

    // var lazyLayout = _.debounce(calculateLayout, 300);
    // $(window).resize(lazyLayout);
    // 如果需要取消预定的 debounce ，可以在 debounce 函数上调用 .cancel()。
    // _memoize
    // 储存中间运算结果，提高效率
    // 参数hasher 是一个function通过返回值来记录key
    // _.memoize(function,[hashFunction])
    // 适用于需求大量重复求值的场景
    // 比如递归求解斐波那锲数

    _.debounce = function (func, wait, immediate) {
        // 上一次执行回调时间戳  第一次执行处理函数的初始值
        var lastTime, timeout, context, args, result;
        var later = function () {
            // 时间间隔 定时器的回调later方法调用的时间戳
            // 和执行debounce最后一次匿名函数
            var last = _.now() - lastTime;
            console.log(last); //1003
            if (last < wait) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                if (!immediate) {
                    result = func.apply(context, args);

                }
            }
        }
        return function () {
            context = this;
            args = arguments;
            lastTime = _.now();

            // 立即执行触发必须满足两个条件
            var callNow = immediate && !timeout;

            if (!timeout) {
                console.log("---第一次执行-或没有设置immediate--");
                timeout = setTimeout(later, wait);
            }
            // else {
            //     clearTimeout(timeout);
            // }

            if (callNow) {
                result = func.apply(context, args);
                // 解除引用 
                context = args = null;
            }

            return result;
        }
    }

    _.memoize = function (func, hasher) {
        var memoize = function (key) {
            // 存储变量，方便使用
            // 求key
            // 如果传入了hasher，则用hasher函数来记录key
            // 否则用参数key(即memoize 方法传入的第一个参数)当key
            var cache = memoize.cache,
                address = "" + (hasher ? hasher.apply(this, arguments) : key);
            if (!_.has(cache, address)) {
                cache[address] = func.apply(this, arguments);
            }
            return cache[address];
        }
        // cache 对象被当做key-value键值对缓存中间运算结果
        memoize.cache = {};
        return memoize;
    }

    // 属性检测
    _.has = function (obj, key) {
        return obj !== null && hasOwnProperty.call(obj, key);
    }


    _.isArray = function (array) {
        return toString.call(array) === "[object Array]";
    }
    // 重写_.isObject方法
    _.isObject = function (obj) {
        var type = typeof obj;
        return type === "function" || type === "object";

    }


    _.each(["Function", "String", "Object", "Number", "Boolean", "Arguments"], function (name) {
        _["is" + name] = function (obj) {
            return toString.call(obj) === "[object " + name + "]";
        }
    });
    //函数功能，希尔排序算法对数字递增排序
    _.shellSort = function (arr){
        var len = arr.length,
            temp,
            gap = 1;
        while(gap < len/3){
            gap = gap*3+1
        }
        for(gap; gap>0;gap = Math.floor(gap/3)){
            for(var i=gap;i<len;i++){
                temp = arr[i]
                for(var j= j-gap; j>= 0 && arr[j]>temp; j-= gap) {
                    arr[j+gap] = arr[j]
                }
                arr[j+gap] = temp
            }
        }
        return arr
    }

    // mixin专门为underscore的原型上来扩展一下方法的
    _.mixin = function (obj) {
        // obj是underscore
        // _.functions(obj) 是一个数组或对象，包含underscore所有的属性和方法
        _.each(_.functions(obj), function (name) {

            var func = _[name] = obj[name];
            //console.log(func);
            // 找到underscroe，给它的原型上加上循环所得的扩展
            _.prototype[name] = function () {
                //需要传递参数和  this._wrapped（即创建underscore时调用的数据）
                var args = [this._wrapped];
                // 把arguments上的成员扩展到args上
                // console.log(args);//调用的数组对象
                // console.log(arguments);
                push.apply(args, arguments);
                // 第一步调用chain（）此时func指向的就是chain了
                // 第二步调用unique(), 此时的this指向的instance  func.是去重之后的结果
                return result(this, func.apply(this, args));
            }
            return _;
        })
    }

    _.mixin(_);
    root._ = _;
})(this)