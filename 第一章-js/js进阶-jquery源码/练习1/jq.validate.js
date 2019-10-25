/*
 * validate - jQuery plugin for validate
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
    $.fn.validate = function (options) {
        var rules = options.rules,
            ispass = false,
            iserror = true,
            self = this,
            messages = options.messages;
        $('.error').remove();
        // 循环rules规则和循环标签不可重复设置
        for (ritem in rules) {
            // console.log(ritem);
            var thisinput = "input[name=" + ritem + "]",
                thisval = $(thisinput).val();
            if (ritem.required) {
                ispass = $.required(thisval);
                if (!ispass) showError(thisinput, messages[ritem].required ? messages[
                    isname].required : "此项为必填项哦~");

            }

            for (ruleobj in rules[ritem]) {
                if (ruleobj == "minlength") {
                    ispass = $.minlength(thisval, rules[ritem][ruleobj]);
                    if (ispass) showError(thisinput, "少于最小长度哦~");
                }
                if (ruleobj == "maxlength") {
                    ispass = $.maxlength(thisval, rules[ritem][ruleobj]);
                    if (ispass) showError(thisinput, "超过了最大长度限制呢~");
                }
                if (ruleobj !== "required") {
                    switchCase(thisinput, ruleobj, thisval);
                }
            }

        };
        self.each(function () {
            var inputList = $(self).find("input,textarea");

            $.each(inputList, function (i, item) {
                var isrequired = $(item).attr("required"),
                    thistype = $(item).attr("type"),
                    thisminlength = $(item).attr("minlength"),
                    thismaxlength = $(item).attr("maxlength"),
                    thisval = $(item).val(),
                    isname = $(item).attr("name");
                if (!isname) {
                    return false;
                }
                if (thisminlength) {
                    ispass = $.minlength(thisval, thisminlength);
                    if (ispass) showError(item, "少于最小长度哦~");
                }
                if (thismaxlength) {
                    ispass = $.maxlength(thisval, thismaxlength);
                    if (ispass) showError(item, "超过了最大长度限制呢~");
                }
                if (isrequired || rules[isname].required) {
                    //必填
                    ispass = $.required(thisval);
                    if (!ispass) showError(item, messages[isname].required ? messages[
                        isname].required : "此项为必填项哦~");
                }
                if ((thistype && (thistype !== "submit" && thistype !==
                        "text"))) {
                    switchCase(item, thistype, thisval);
                }

            });

        });

        function switchCase(elem, thistype, thisval) {
            switch (thistype) {
                case 'email':
                    ispass = $.email(thisval);
                    if (!ispass) showError(elem, messages['email']
                        .email ? messages['email']
                        .email : "邮箱格式错误");
                    break;
                case 'url':
                    ispass = $.email(thisval);
                    if (!ispass) showError(elem, messages['url'].url ? messages['url'].url : "链接格式错误");
                    break;
                case 'telphone':
                    ispass = $.email(thisval);
                    if (!ispass) showError(elem, messages['telphone']
                        .telephone_no ? messages['telphone']
                        .telephone_no : "手机格式错误");
                    break;
                case 'idCard':
                    ispass = $.idCard(thisval);
                    if (!ispass) showError(elem, messages['idCard']
                        .idcard_no ? messages['idCard']
                        .idcard_no : "身份证格式错误");
                    break;
            }
        }

        function showError(elem, message) {
            $(elem).after("<p class='error'>" + message + "</p>");
        }



        var errors = this.find(".error").length;
        if (errors === 0) iserror = false;
        console.log(errors);
        return iserror;
    }

    $.required = function (inputText) {
        return $.trim(inputText).length > 0 ? true : false;
    };
    $.email = function (inputText) {
        return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
            .test(inputText);
    };
    $.telphone = function (inputText) {
        return /^1[345678]\d{9}$/
            .test(inputText);
    };
    $.idCard = function (inputText) {
        return /(^\d{15}$)|(^\d{17}([0-9]|X)$)/
            .test(inputText);
    };
    $.number = function (inputText) {
        return /^\d$/
            .test(inputText);
    };
    $.url = function (inputText) {
        return /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/.test(
            inputText);
    };
    $.minlength = function (inputText, min) {
        return inputText && inputText.length < min;
    };
    $.maxlength = function (inputText, max) {
        return inputText && inputText.length > max;
    };
})(jQuery);