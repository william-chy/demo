### 裁剪图片上传组件（此组件只支持ie10+,chrome,ff）

### 本组件依赖第三方插件：cropper，请在html页面中自行引入该插件:
```html

<script type="text/javascript" src="//static.12301.cc/assets/build/lib/img_crop/cropper.min.js"></script>
<link href="//static.12301.cc/assets/build/lib/img_crop/cropper.min.css"/>

```


### 方法1 show(); (打开上传图片组件，用户得在此组件中选择并裁剪一张图片)

```
var Crop = require("COMMON/Components/Crop");
Crop.show({
    cropBoxWidth: 600, //裁剪区域的高度      非必须，默认600
    cropBoxHeight: 500, // 裁剪区域的宽度    非必须，默认400 
    outImgWidth: 200, //生成图片的宽度（px）  非必须，默认0  此时裁剪比例可随意调节
    outImgHeight: 100, //生成图片的高度（px） 非必须，默认0
    pathAndFileName: "", //上传到七牛的key(路径和文件名); 非必须，默认传到"pftcropimages/" 文件名随机
    success: function (imgAddressArr) { //裁剪上传成功返回的图片地址数组  
        console.log(imgAddressArr)
    },
    fail: function (data) {  //裁剪上传失败返回的信息
        console.log({
            code: 201,
            msg: "用户取消了操作"
        })
    }
});
```

### 方法2 cropAndUploadImg(); (裁剪并上传一张图片，调用此方法必选传入一个file对象作为参数; ie9-都不支持)

```
var Crop = require("COMMON/Components/Crop");
Crop.cropAndUploadImg({
    file: file, // file对象 *必须
    pathAndFileName: "", //上传到七牛的key(路径和文件名); 非必须，默认传到"pftcropimages/" 文件名随机
    cropBoxWidth: 600, //裁剪区域的高度
    cropBoxHeight: 500, // 裁剪区域的宽度
    outImgWidth: 200, //生成图片的宽度（px）
    outImgHeight: 100, //生成图片的高度（px）
    success: function (imgAddressArr) {
        console.log(imgAddressArr)
    },
    fail: function (msg) {
        console.log(msg)
    }
});
```