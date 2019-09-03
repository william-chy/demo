/**
 * @author [fangxu]
 * @email [864109504@qq.com]
 * @create date 2017-10-24 12:04:18
 * @modify date 2017-10-24 12:04:18
 * @desc [description]
*/


var readAsDataUrl = function (opt) {

    var defaults = {
        file: {},
        success: new Function,
        error: function () {
            alert("文件读取失败");
        },
        loading: new Function,
        close: new Function,
        open: new Function,
        complete: new Function
    }

    //混合默认参数和新参数
    var newOpt = {};
    for (var i in defaults) {
        if (typeof opt[i] == "undefined") {
            newOpt[i] = defaults[i];
        } else {
            newOpt[i] = opt[i];
        }
    }

    //能力检测
    if (!window.FileReader) {
        alert("您的浏览器不支持FileReader，请使用<a target='_blank' href='https://www.baidu.com/s?ie=UTF-8&wd=chrome%E6%B5%8F%E8%A7%88%E5%99%A8'>chrome浏览器</a>或其它支持FileReader的浏览器。");
        return false;
    }

    var reader = new FileReader();

    reader.readAsDataURL(newOpt.file);

    //执行loading
    newOpt.loading();

    //当读取操作被中止时调用
    reader.onabort = function (e) {
        // console.log("onabort", e);
    };

    //当读取操作发生错误时调用
    reader.onerror = function (e) {
        // console.log("onerror", e);
    };

    //当读取操作将要开始之前调用
    reader.onloadstart = function (e) {
        // console.log("onloadstart", e);
    };

    //在读取数据过程中周期性调用
    reader.onprogress = function (e) {
        // console.log("progress", e);
    };

    //当读取操作成功完成时调用
    reader.onload = function (e) {
        newOpt["success"](e.currentTarget.result);
        reader = null;
    };

    //当读取操作完成时调用,不管是成功还是失败.该处理程序在onload或者onerror之后调用
    reader.onloadend = function (e) {
        newOpt["complete"](e);
        // console.log("onloadend", e);
    };

}

module.exports = readAsDataUrl;


