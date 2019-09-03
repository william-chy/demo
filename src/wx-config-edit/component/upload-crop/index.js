/**
 * @author [author]
 * @email [example@mail.com]
 * @create date 2017-12-05 04:40:26
 * @modify date 2017-12-05 04:40:26
 * @desc [description]
*/

require("./index.scss");
require("./lib/cropper.scss");
var cropTpl = require("./tpl/crop.xtpl");
var chooseImgTpl = require("./tpl/chooseimg.xtpl");

//请在html页面中自行引入该插件
// var Cropper = require("cropperjs");
var Dialog = require("@pft-ui-component/Dialog");
var Drag = require("@pft-ui-component/Drag");
var upBase64ImgTo7Niu = require("./upBase64-qiniu.js");
var readImgAsDataUrl = require("./readImgAsDataUrl.js");
var Toast = require('COMMON/modules/Toast');
var toast = new Toast;
var Message = require("@pft-ui-component/Message");

/**
 * 图片裁剪上传组件
 */
var cropImgUpload = {

    //基础配置
    _config: {
        cropBoxHeight: 200, //裁剪区域的高度
        cropBoxWidth: 200, // 裁剪区域的宽度
        quality: 1, //生成图片质量
        outImgWidth: 0, //生成图片的宽度（px）
        outImgHeight: 0,//生成图片的高度（px）
        pathAndFileName: "",
        viewMode: 0,
        aspectRatio: function () { //裁剪比例
            if (this.outImgWidth === 0 || this.outImgHeight === 0) {
                return NaN;
            } else {
                return this.outImgWidth / this.outImgHeight;
            }
        },
        success: new Function,
        fail: new Function
    },

    /**
     * dataURLtoBlob
     * @param   dataurl
     * @return  blob
     */
    _dataURLtoBlob: function (dataurl) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    },

    /**
     * @description 初始化裁剪框架
     */
    _initCropWrap: function () {
        this.cropWrap = $('<div class="pft-imgcrop-wrap"></div>');
        this._bind();
    },


    _bind: function () {

        var _this = this, CON = this.cropWrap;

        //点击图片选择按钮
        CON.on("click", ".crop-choose__btn", function () {
            var curBtn = $(this);
            if (curBtn.hasClass("disabled")) return false;
            CON.find(".crop-choose__fileInp").click();
        });

        //fileInp的change事件
        CON.on("change", ".crop-choose__fileInp", function (e) {

            var chooseBtn = CON.find(".crop-choose__btn");
            readImgAsDataUrl({
                file: e.currentTarget.files[0],
                loading: function () {
                    chooseBtn.find(".text").text("读取中..")
                },
                success: function (dataUrl) {
                    _this._renderCrop(dataUrl);
                },
                complete: function () {
                    chooseBtn.find(".text").text("选择图片");
                    chooseBtn.removeClass("disabled");
                }
            });

        });

        //点击裁剪并上传按钮
        CON.on("click", ".crop__savebtn", function (e) {

            var tarBtn = $(this);

            if (tarBtn.hasClass("disabled")) return false;

            var canvas = _this.cropper.getCroppedCanvas({
                width: _this._config.outImgWidth,
                height: _this._config.outImgHeight,
            });
            var dataURL = canvas.toDataURL('image/png', _this._config.quality);

            var imgBase64 = dataURL.match(/(?:base64\,)(.+)/)[1];

            upBase64ImgTo7Niu({
                data: imgBase64,
                pathAndFileName: _this._config.pathAndFileName,
                loading: function () {
                    tarBtn.text("上传中..").addClass("disabled");
                },
                success: function (imgAddress) {
                    var arr = [];
                    arr.push(imgAddress);
                    _this._config.success(arr);
                    _this.dialog.close();
                },
                complete: function () {
                    tarBtn.text("裁剪并上传").removeClass("disabled");
                }
            })

            console.log(Number(_this._dataURLtoBlob(dataURL).size / 1024).toFixed(2) + "Kb");
        });

        //用户点击取消操作
        CON.on("click", ".crop__cancelBtn", function (e) {
            _this.dialog.close();
            _this._config.fail({
                code: 201,
                msg:"用户取消了操作"
            });
        })

    },

    /**
     * @description 初始化裁剪
     * @param {any} dataUrl 图片的Base64
     */
    _renderCrop: function (dataUrl) {
        var _this = this, CON = this.cropWrap;
        CON.html(cropTpl); //放入基本结构

        var $cropimgBox = CON.find(".crop__imgbox");
        var height = this._calCropBoxWidthHeight().height;
        $cropimgBox.css({
            "height": height + "px"
        })
        var $cropImg = CON.find(".crop__img");;
        $cropImg.prop("src", dataUrl);
        _this.cropper = new Cropper($cropImg.get(0), {
            aspectRatio: _this._config.aspectRatio(),
            dragMode: "move",
            crop: function (e) {}
        });

        //重新定位
        var win = $(window);
        var width = this.dialog.poper.width();
        var height = this.dialog.poper.height();

        this.dialog.poper.css({
            top : (win.height()-height) / 2,
            left : (win.width()-width) / 2
        })

        

    },

    /**
     * @author huangzhiyang
     * 补充：计算裁剪区域的宽高
     * 这个宽高是用户调用方法时传进来的，但有传进来的宽高超过了屏幕自身宽高，所以这里做一下限制
     */
    _calCropBoxWidthHeight : function(){
        var win = $(window);
        var winW = win.width();
        var winH = win.height();
        var config = this._config;
        var cropBoxWidth = config.cropBoxWidth + 40;
        var cropBoxHeight = config.cropBoxHeight;
        //计算裁剪区域的最大高度
        var titleHeight = 43;
        var paddingTop = 10;
        var paddingBottom = 10;
        var footer = 60;
        var maxHeight = winH - (titleHeight+paddingTop+paddingBottom+footer);
        
        //如果cropBoxWidth大于屏幕宽度
        if(cropBoxWidth>winW) cropBoxWidth = winW;
        //如果cropBoxHeight大于最大高度
        if(cropBoxHeight>maxHeight) cropBoxHeight = maxHeight;

        return{
            width : cropBoxWidth,
            height : cropBoxHeight
        }

    },

    /**
     * 打开弹框
     * 
     * @return 弹框实例的容器jqdom
     */
    _openDialog: function () {
        var title = this._config.title || "图片上传";
        // var width = Number(this._config.cropBoxWidth) + 40 || 600;
        var wh = this._calCropBoxWidthHeight();
        var width = wh.width;
        var height = wh.height;
        //初始化一个弹框
        this.dialog = new Dialog({
            title: title,
            cache: false,
            drag: Drag,
            closeBtn: false,
            content: "",
            width: width,
            top : 100
        });
        this.dialog.open();
        return this.dialog.poper.find(".pui-dialogBox-con");
    },

    
    /**
     * @description 初始化配置参数
     * @param {any} opt 
     */
    _getAndInitOpt: function (opt) {
        var cropBoxWidth = opt && opt.cropBoxWidth || 600; //裁剪区域的高度
        var cropBoxHeight = opt && opt.cropBoxHeight || 400; // 裁剪区域的宽度
        var outImgWidth = opt && opt.outImgWidth || 0; //生成图片的宽度（px）
        var outImgHeight = opt && opt.outImgHeight || 0; //生成图片的高度（px）
        var pathAndFileName = opt && opt.pathAndFileName || 0; //生成图片的高度（px）



        var success = opt.success || new Function;
        var fail = opt.fail || new Function;

        this._config.success = success;
        this._config.fail = fail;


        this._config.cropBoxWidth = cropBoxWidth;
        this._config.cropBoxHeight = cropBoxHeight;
        this._config.outImgWidth = outImgWidth;
        this._config.outImgHeight = outImgHeight;
        this._config.pathAndFileName = pathAndFileName;
    },

    /**
     * @description 能力检测
     */
    _safeCheck: function () {
        var isSupport = true;
        //能力检测
        if (!window.FileReader) {
            Message.alert("您的浏览器不支持图片裁剪，请使用<a target='_blank' href='https://www.baidu.com/s?ie=UTF-8&wd=chrome%E6%B5%8F%E8%A7%88%E5%99%A8'>谷歌浏览器</a>或火狐浏览器。");
            isSupport =  false;
        }
        return isSupport;
    },

    //--------------------------------------
    //----------封装一些对外的操作-------------
    //--------------------------------------


    /**
     * @description 打开上传图片组件，用户得在此组件中选择并裁剪一张图片
     * @param {any} opt 一些配置信息
     */
    show: function (opt) {
        var _this = this;
        if (!this._safeCheck()) return false;
        this._getAndInitOpt(opt);
        this._initCropWrap();
        this._openDialog().append(this.cropWrap);
        this.cropWrap.html(chooseImgTpl);
    },

    /**
     * @description 裁剪并上传一张图片
     * @param {any} file file对象 
     */
    cropAndUploadImg: function (opt) {
        var _this = this;
        if (!this._safeCheck()) return false;

        if (!opt.file) {
            throw new Error("file参数必须");
            return false;
        }
        var file = opt.file;

        this._getAndInitOpt(opt);

        this._initCropWrap();
        this._openDialog().append(this.cropWrap);

        var loadingStr = PFT.Util.LoadingPc("图片读取中..", {
            tag: "div",
            height: 200
        });

        //读取图片的dataUrl
        readImgAsDataUrl({
            file: file,
            loading: function () {
                _this.cropWrap.html(loadingStr);
            },
            success: function (dataUrl) {
                setTimeout(function () {
                    _this._renderCrop(dataUrl);
                }, 500)
            },
            complete: function () { }
        });

    }

};

module.exports = cropImgUpload;