/*
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2019 
 *
 * Netease homework exercises
 *  https://course.study.163.com/
 * 
 * Version:  1.0.0-dev
 *
 */

(function ($) {
    $.fn.lazyload = function (options) {
        // 默认设置
        var defaultSet = {
            event: "scroll", // 事件触发时才加载，click(点击),mouseover(鼠标划过),sporty(运动的),默认为scroll（滑动）
            show_type: "fadeIn", //展现方式，show(直接显示),fadeIn(淡入),slideDown(下拉)
            visible: true,
            defaultsrc: ""
        };

        // 如果有自定义则替换原有的默认设置,deep深拷贝
        if (options) {
            $.extend(true, defaultSet, options);
        }
        var thisShowType = defaultSet.show_type,
            thisIsVisible = defaultSet.visible,
            thisEvent = defaultSet.event;

        var self = this;

        if (thisEvent == "scroll") {
            $(window).scroll(function () {
                $(self).each(function () {
                    var thisImg = this;

                    if (thisIsVisible && !$(thisImg).is(":visible")) return;
                    var thistop = $(thisImg).offset().top - $(document).scrollTop(),
                        clientHeight = window.innerHeight;
                    if (thistop <= clientHeight + 100) {
                        // console.log(thisImg);
                        $(thisImg).trigger("appear");
                    }
                });
                // 从数组中去掉已加载的图片,不让它进入下次循环
                var temp = $.grep(self, function (element) {
                    // console.log(!element.loaded);
                    return !element.loaded;
                });
                // console.log(temp);
                self = $(temp);
            });
        }

        this.each(function () {
            var thisSelf = this;
            thisSelf.loaded = false;
            $(thisSelf).attr("src", defaultSet.defaultsrc);
            // 进入可视区
            $(thisSelf).one("appear", function () {
                if (!this.loaded) {
                    $("<img />").on("load", function () {
                        $(thisSelf).hide().attr("src", $(thisSelf).data("src"))[thisShowType](thisShowType);
                        thisSelf.loaded = true;
                    }).attr("src", $(thisSelf).data("src"));
                };
            });

            if (thisEvent != "scroll") {
                // 非滚动事件
                $(thisSelf).on(thisEvent, function (event) {
                    if (!thisSelf.loaded) {
                        $(thisSelf).trigger("appear");
                    }
                });
            }
        });

        // 模拟触发
        $(window).trigger(thisEvent);
        return this;
    }

})(jQuery);