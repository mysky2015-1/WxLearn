(function (global,util) {
    var seaCopy = global.seaCopy = {
        version: "1.0.1",
    }
    var data = {};
    var cache = {};
    var anonymousMeta = {};
    //模块的生命周期
    var status = {
        FETCHED: 1, //正在当前模块获取uri
        SAVED: 2, //缓存中存储模块数据信息
        LOADING: 3, //正在加载当前模块依赖项
        LOADED: 4, //准备执行当前模块
        EXECUTING: 5, //正在执行当前模块
        EXECUTED: 6, //执行完毕接口对象以获取
    }
     // 循环依赖栈 
    var circularCheckStack = []
    var isArray = function (obj) {
        return toString.call(obj) === "[object Array]";
    }
    var isFunction = function (obj) {
        return toString.call(obj) === "[object Function]";
    }
    var isString = function (obj) {
        return toString.call(obj) === "[object String]";
    }
    // 是否使用了别名
    function parseAlias(id) {
        var alias = data.alias;
        return alias && isString(alias[id]) ? alias[id] : id;
    }
    // 不能以""/" ":"开头，结尾必须是一个“/”,后面跟随任意字符至少一个
    var PATHS_RE = /^([^\/:]+)(\/.+)$/; //路径的短名称配置
    // 检测是否书写路径短名称
    function parsePaths(id) {
        var paths = data.paths; //配置
        if (paths && (m = id.match(PATHS_RE)) && isString(paths[m[1]])) {
            id = paths[m[1]] + m[2];
        }
        return id;
    }
    // 检测是否添加后缀
    function normalize(path) {
        var last = path.length - 1;
        var lastC = path.charAt(last);
        return (lastC === "/" || path.substring(last - 2) === ".js") ? path : path + ".js";
    }
    // 添加根目录
    function addBase(id, uri) {
        var result;
        if (id.charAt(0) === ".") {
            result = relapath((uri ? uri.match(/[^?]*\//)[0] : data.cwd) + id);
        } else {
            result = data.cwd + id;
        }
        return result;
    }
    var DOT_RE = /\/.\//g; //规范路径  /./ =>"/"
    function relapath(path) {
        path = path.replace(DOT_RE, "/");
        return path;
    }
    // 生成绝对路径 parent child
    // a=>a.js   b=>b.js
    seaCopy.resolve = function (child, parent) {

        // console.log("检测资源是否使用了别名：", child);

        // 资源定位
        if (!child) {
            return "";
        }
        child = parseAlias(child); //检测是否有别名
        child = parsePaths(child); //检测是否有路径别名 依赖模块中引包的模块路径地址  require（"app/c"）
        child = normalize(child); //检测是否添加后缀
        return addBase(child, parent); //添加跟目录
    }
    // 
    seaCopy.request = function (url, callback) {
        var node = document.createElement("script");
        node.src = url;
        document.body.appendChild(node);
        // console.log(callback);
        node.onload = function () {
            // node.onload = null;
            // document.body.removeChild(node);
            callback();
        }
    }

    //获取纯粹的依赖关系，得到不存在循环依赖关系的依赖数组 
    function getPureDependencies(module) {
        var uri = module.uri
        console.log('getPureDependencies',uri);
        // 对每个依赖项进行过滤，对于有可能形成循环依赖的进行剔除，并打印出警告日志 
        return util.filter(module.dependencies, function (dep) {
            // 首先将被检查模块的uri放到循环依赖检查栈中，之后的检查会用到 
            circularCheckStack = [uri]
            //接下来检查模块uri是否和其依赖的模块存在循环依赖 
            var isCircular = isCircularWaiting(cachedModules[dep])
            if (isCircular) {
                // 如果循环，则将uri放到循环依赖检查栈中 
                circularCheckStack.push(uri)
                // 打印出循环警告日志 
                printCircularLog(circularCheckStack)
            }

            return !isCircular
        })
    }


    // Module模块定义==========
    function Module(uri, deps) {
        // 模块初始化
        this.uri = uri; //模块的绝对路径
        this.deps = deps || []; //模块的依赖项的列表
        this.exports = null; //向外传递的对象
        this.status = 0; //状态码
        this._waitings = {}; //谁依赖了我
        this._remain = 0; //还有几个依赖没有加载完
    }
    // 分析主干（左右子树）上的依赖项
    Module.prototype.load = function () {
        var module = this;
        module.status = status.LOADING; //正在加载当前模块依赖项
        // 获取主干上的依赖项
        var uris = module.resolve(),
            leng = module._remain = uris.length;
        // console.log(uris);
        // 获取主干上的依赖项模块
        var m;
        for (var i = 0; i < leng; i++) {
            m = Module.get(uris[i]);
            if (m.status < status.LOADED) {
                if (m.status >= status.SAVED) {
                    // 从模块信息中获取依赖模块列表，并作循环依赖的处理 
                    var deps = getPureDependencies(m)
                    // 如果存在依赖项，继续下载 
                    if (deps.length) {
                        Module.prototype._load(deps, function () {
                        cb(m)
                        })
                    }
                    // 否则直接执行cb 
                    else {
                        cb(m)
                    }
                }
                m._waitings[module.uri] = m._waitings[module.uri] || 1;
            } else {

                module._remain--;
            }
        }
        function cb(module) {
            // 更改模块状态为READY，当remain为0时表示模块依赖都已经下完，那么执行callback 
            (module || {}).status < status.READY && (module.status = status.READY)
                --remain === 0 && callback()
        }
        // console.log("prototype.load里的依赖列表值：" + module._remain);
        //如果依赖列表模块全部加载完毕
        if (module._remain == 0) {
            // onload方法在哪里
            module.onload();
        }
        // 准备执行根目录下的依赖列表中的模块
        var requestCache = {};
        for (var i = 0; i < leng; i++) {
            m = Module.get(uris[i]);
            if (m.status < status.FETCHED) {
                m.fetch(requestCache);
            }
        }
        for (uri in requestCache) {
            requestCache[uri]();
        }
    }
    // 加载依赖列表中的模块
    Module.prototype.fetch = function (requestCache) {
        var module = this;
        // console.log(module);
        module.status = status.FETCHED;
        var uri = module.uri;
        requestCache[uri] = sendRequest; // Document.createElement("script")

        function sendRequest() {
            seaCopy.request(uri, onRequest);
        }

        function onRequest() {
            // console.log(anonymousMeta);
            if (anonymousMeta) {
                module.save(uri, anonymousMeta);
            }
            module.load();
        }
    }
    Module.prototype.onload = function () {
        // console.log("onload：");
        var mod = this;
        mod.status = status.LOADED;
        if (mod.callback) {
            mod.callback();
        }
        // 伪递归
        _waitings = mod._waitings;
        var uri, m;
        for (uri in _waitings) {
            m = cache[uri];
            m._remain -= _waitings[uri];
            // console.log("m._remain：" + m._remain);
            if (m._remain == 0) {
                m.onload();
            }
        }
    }
    // 更改初始化数据
    Module.prototype.save = function (uri, meta) {
        var module = Module.get(uri);
        module.id = uri;
        module.deps = meta.deps || [];
        module.factory = meta.factory;
        module.status = status.SAVED;
    }
    // 获取模块对外的接口对象
    Module.prototype.exec = function () {
        var module = this;
        // console.log("exec---module", module);
        // 防止重复执行
        if (module.status >= status.EXECUTING) {
            return module.exports;
        }
        module.status = status.EXECUTING; //5
        var uri = module.uri;

        function require(id) {
            // 更新过后的数据
            return Module.get(require.resolve(id)).exec();
        }
        require.resolve = function (id) {
            return seaCopy.resolve(id, uri);
        }
        var factory = module.factory;
        var exports = isFunction(factory) ? factory(require, module.exports = {}, module) : factory;
        if (exports === undefined) {
            exports = module.exports;
        }

        module.exports = exports;
        module.status = status.EXECUTED;
        return exports;
    }
    // 资源定位 解析依赖项生成绝对路径
    Module.prototype.resolve = function () {
        // console.log("====resolve方法中获取的this====");
        // console.log(this);
        var mod = this,
            ids = mod.deps,
            uris = [];
        for (var i = 0; i < ids.length; i++) {
            uris[i] = seaCopy.resolve(ids[i], mod.uri); //依赖项
        }
        return uris;
    }
    // 定义一个模块
    Module.define = function (factory) {
        var deps;
        // console.log("factory=====", factory);
        if (isFunction(factory)) {
            // 正则解析依赖项
            deps = parseDependencies(factory.toString());
        }
        // 存储当前模块的信息
        var meta = {
            id: "",
            uri: "",
            deps: deps,
            factory: factory
        }
        anonymousMeta = meta;
    };

    // 检测缓存对象上是否有当前模块信息
    Module.get = function (uri, deps) {
        // 第一次肯定是没有在缓存对象里的，所以会new Module第二次有了之后，就直接引用就可以了
        return cache[uri] || (cache[uri] = new Module(uri, deps));
    }
    Module.use = function (deps, callback, uri) {
        // 先去缓存对象中检查是否有module对象
        var module = Module.get(uri, isArray(deps) ? deps : [deps]);
        // console.log("use-module,是否有callback方法：", module);
        module.callback = function () {
            var exports = [];
            var uris = module.resolve();
            // console.log("uris--module.callback:", uris);
            for (var i = 0; i < uris.length; i++) {
                // console.log(cache[uris[i]]);
                exports[i] = cache[uris[i]].exec();
            }
            if (callback) {
                callback.apply(global, exports);
            }
            // console.log('exports:', exports);
        }
        module.load();
    }

    // =======Module define end=========
    var _cid = 0;

    function cid() {
        return _cid++;
    }
    //data.preload = [];
    //获取当前项目文档的URL
    data.cwd = document.URL.match(/[^?]*\//)[0];
    Module.preload = function (callback) {
        var preloadMods = data.preload || [];
        var length = preloadMods.length;
        if (length) {
            // 如果有需要预先加载的项，那就去重新调用Module.use,启动模块加载器，
            // 再次生成一个虚拟的根目录
            // 为什么加载完之后要再移除加载了的模块呢？为了性能更好一点吗？
            Module.use(preloadMods, function () {
                preloadMods.splice(0, length);
                Module.preload(callback);
            }, data.cwd + "_preload_" + cid()); //虚拟的根目录
        } else {
            callback();
            // 这里的callbacks就是下面提到的
        }
        //length !== 0 先加载预先设定模块Module.preload 方法
    };

    // 第一步先执行use
    seaCopy.use = function (list, callback) {
        // 检测有没有需要预先加载的模块
        // Module模块需要提前创建好
        // console.log('list:', list);

        Module.preload(function () {
            // 为什么要设置虚拟根目录？
            // 此处data.cwd+"_zm_"+cid()为虚拟的根目录，那么，我可以随便加任何标识
            // console.log('callback:', callback);
            Module.use(list, callback, data.cwd + "_zm_" + cid());
        });
    }
    seaCopy.config = function (options) {
        // 解析配置的短名称
        var key;
        for (key in options) {
            // data是模块加载器内置的一个对象，加载内置信息
            data[key] = options[key]
        }
        // console.log(data);
    }
    var REQUIRE_RE = /\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g,
        delqe01 = /\/\*((\n|\r|.)*?)\*\//mg,
        delqe02 = /(\s|\;|^|\{|\})\/\/.*$/mg;

    function parseDependencies(code) {
        var ret = [];
        code = code.replace(delqe01, "");
        code = code.replace(delqe02, "");
        code.replace(REQUIRE_RE, function (m, m1, m2) {
            if (m2) ret.push(m2);
        })
        console.log("依赖项名称:",ret)
        // 这里获取的是js内部的依赖项名称
        return ret;
    }

    global.define = Module.define;
})(this);