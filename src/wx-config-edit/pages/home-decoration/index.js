require('./index.scss');
const indexTpl = require('./index.xtpl');

const Crop = require('@/common/Components/upload-crop');

import * as service from '../../service';

import prodTypeList from '../../product-type.js';

import moment from 'moment';

/**
 * TODO:组件化页面
 */

//新增充值方案页面
export default {
    name: 'addRecharge',

    template: indexTpl,

    beforeRouteLeave(to, from, next) {
        if (this.saved) return next();
        this.$confirm('您当前修改可能还未保存, 确定离开?', '提示', {
                confirmButtonText: '离开',
                cancelButtonText: '取消',
                type: 'warning',
            })
            .then(() => {
                next();
            })
            .catch(() => {});
    },

    data() {
        return {
            saveBtnLoading: false,
            currentTab: '0',
            activeName: 'linkDIY',
            dialogLinkVisible: false,
            dialogIconLinkVisible: false,
            dialogIconChooseVisible: false,
            isTutorialShow: false,
            dialogTempData: {}, //缓存dialog数据
            //---轮播图---
            imgList: [
                // {
                //   title: '',
                //   src: '',
                //   link: {
                //     isLinkToProduct: undefined,
                //     product: {
                //       landId: '',
                //       landName: '',
                //     },
                //     linkDIY: '',
                //   },
                // },
            ],
            draggable: false,
            currentIndex: 0,
            //轮播图-linkdialog
            remoteSelectloading: false,
            productOptions: [],
            //---公告---
            formAnnounce: {
                isShow: false,
                title: '',
                content: '',
            },
            //---icon---
            cityOptions: [],
            iconList: [
                // {
                //   name: '', //图标标题
                //   src: '',
                //   link: {
                //     isLinkToProduct: undefined,
                //     productType: '',
                //     city: '',
                //     activityTypeArr: [],
                //     linkDIY: '',
                //   },
                // },
            ],
            iconLibList: Object.keys(ICON_MAP).map((key) => {
                return {
                    name: ICON_MAP[key].name,
                    src: ICON_MAP[key].src,
                };
            }),
            productList: prodTypeList,
        };
    },
    computed: {},

    watch: {
        //debug监听
        // dialogTempData: {
        //   handler: function(val, oldVal) {
        //     console.log(val);
        //   },
        //   deep: true,
        // },
    },
    beforeCreate() {
        this.loading = true;
        window.onbeforeunload = function(e) {
            var e = window.event || e;
            e.returnValue = '确定离开当前页面吗？';
        };
    },
    async created() {
        await this.getBannerConfig();
        this.loading = false;
        await this.getIconConfig();
        await this.getNotice();
        await this.getCity();
    },
    mounted() {},
    methods: {
        tutorialOver() {
            this.isTutorialShow = true;
        },
        tutorialOut() {
            this.isTutorialShow = false;
        },
        //-----请求-----
        async getBannerConfig() {
            const r = await service.getBannerConfig().catch((e) => e);
            if (r.code == 200) {
                if (!Array.isArray(r.data) || r.data.length == 0) return;
                const value = r.data.map((item, index, arr) => {
                    return {
                        title: item.title,
                        src: item.photoUrl,
                        link: {
                            isLinkToProduct: !Boolean(item.type),
                            product: { landId: item.landID, landName: item.landName },
                            linkDIY: item.link,
                        },
                    };
                });
                this.imgList = value;
            } else {
                this.$message({
                    type: 'warning',
                    message: r.msg || r.message || '获取轮播数据失败',
                });
            }
        },
        async getNotice() {
            const r = await service.getNotice().catch((e) => e);
            if (r.code == 200) {
                if (!Array.isArray(r.data) || r.data.length == 0) return;
                const data = r.data[0];
                this.formAnnounce = {
                    isShow: Boolean(data.status),
                    title: data.title,
                    content: data.content.split('TIME_CREATE')[0],
                };
            } else {
                this.$message({
                    type: 'warning',
                    message: r.msg || r.message || '获取公告失败',
                });
            }
        },
        async getIconConfig() {
            const r = await service.getIconConfig().catch((e) => e);
            if (r.code == 200) {
                if (!Array.isArray(r.data) || r.data.length == 0) return;
                const value = r.data.map((item, index, arr) => {
                    return {
                        name: item.title,
                        src: item.photoUrl,
                        link: {
                            isLinkToProduct: !Boolean(item.type),
                            productType: item.ptype || '',
                            city: item.city,
                            activityTypeArr: [], //活动先不做,回传activityType: ""即可
                            linkDIY: item.link,
                        },
                    };
                });
                this.iconList = value;
            } else {
                this.$message({
                    type: 'warning',
                    message: r.msg || r.message || '获取图标数据失败',
                });
            }
        },
        async getCity() {
            const r = await service.getCityLST().catch((e) => e);
            if (r.code == 200) {
                if (!Array.isArray(r.data) || r.data.length == 0) return;
                this.cityOptions = r.data.map((i) => {
                    return {
                        value: i.area_id,
                        label: i.area_name,
                        children: i._child.map((e) => {
                            return {
                                value: e.area_id,
                                label: e.area_name,
                            };
                        }),
                    };
                });
            } else {
                this.$message({
                    type: 'warning',
                    message: r.msg || r.message || '获取城市列表失败',
                });
            }
        },

        //----公用----
        handleTabChange(e) {
            if (e.target.dataset.tab) {
                this.currentTab = e.target.dataset.tab;
            }
        },
        //拖动 取消默认行为
        allowDrop(e) {
            e.preventDefault();
        },
        //开始拖动
        dragStart(e, index) {
            let tar = e.target;
            // console.log(tar);
            e.dataTransfer.setData('Text', index);
            if (tar.tagName.toLowerCase() == 'div') {
                // console.log('drag start')
                // console.log('drag Index: ' + index)
            }
        },
        //放置
        drop(e, index) {
            this.allowDrop(e);
            //使用一个新数组重新排序后赋给原变量
            if (this.currentTab == '0') {
                let arr = this.imgList.concat([]),
                    dragIndex = e.dataTransfer.getData('Text'),
                    temp = arr.splice(dragIndex, 1);
                arr.splice(index, 0, temp[0]);
                this.imgList = arr;
            } else {
                let arr = this.iconList.concat([]),
                    dragIndex = e.dataTransfer.getData('Text'),
                    temp = arr.splice(dragIndex, 1);
                arr.splice(index, 0, temp[0]);
                this.iconList = arr;
            }

            this.draggable = false;
        },
        //删除链接
        onDeleteLink(index) {
            if (this.currentTab == '0') {
                this.imgList[index].link = {
                    isLinkToProduct: undefined,
                    product: {
                        landId: '',
                        landName: '',
                    },
                    linkDIY: '',
                };
            } else {
                this.iconList[index].link = {
                    isLinkToProduct: undefined,
                    productType: '',
                    city: '',
                    activityTypeArr: [],
                    linkDIY: '',
                };
            }
        },

        //-------轮播-----
        //新增图片
        onaddImg() {
            if (this.imgList.length >= 10) return this.$message('最多只支持10张图片');

            this.onUploadImg(undefined, true);
        },

        onDeleteImg(index) {
            if (this.imgList.length <= 1) return this.$message('最少需保留一张图片');
            this.imgList.splice(index, 1);
        },
        /**
         * 
         * @param {*} index 当前操作的index
         * @param  isAdd 是否是新增，如果是，index无效
         */
        onUploadImg(index, isAdd) {
            let that = this;
            Crop.show({
                cropBoxWidth: 750, //裁剪区域的高度      非必须，默认600
                cropBoxHeight: 420, // 裁剪区域的宽度    非必须，默认400
                outImgWidth: 750, //生成图片的宽度（px）  非必须，默认0  此时裁剪比例可随意调节
                outImgHeight: 420, //生成图片的高度（px） 非必须，默认0
                pathAndFileName: '', //上传到七牛的key(路径和文件名); 非必须，默认传到"pftcropimages/" 文件名随机
                success: function(imgAddressArr) {
                    //裁剪上传成功返回的图片地址数组
                    console.log(imgAddressArr);
                    if (!Array.isArray(imgAddressArr) && imgAddressArr.length !== 1)
                        return that.$message('上传错误' + JSON.stringify(imgAddressArr));
                    if (isAdd === true) {
                        that.imgList.splice(that.imgList.length, 0, {
                            src: imgAddressArr[0],
                            title: '',
                            link: {
                                isLinkToProduct: false,
                                product: {
                                    landId: '',
                                    landName: '',
                                },
                                linkDIY: '',
                            },
                        });
                    } else {
                        that.imgList[index].src = imgAddressArr[0];
                    }
                },
                fail: function(data) {
                    //裁剪上传失败返回的信息
                    console.log({
                        msg: '用户取消了操作',
                    });
                },
            });
        },

        //轮播-link
        onSetLink(index) {
            this.currentIndex = index;
            if (this.imgList[index].link.isLinkToProduct) {
                this.activeName = 'product';
                this.dialogTempData = { product: this.imgList[index].link.product };
            } else {
                this.activeName = 'linkDIY';
                this.dialogTempData = { linkDIY: this.imgList[index].link.linkDIY };
            }
            this.dialogLinkVisible = true;
        },

        // 搜索focus事件
        async onRemoteSelectFocus() {
            this.remoteMethod('');
        },
        // 轮播-link 搜索产品select
        async remoteMethod(query) {
            this.remoteSelectloading = true;
            const params = {
                pageNum: 0,
                pageSize: 20,
                keyWord: query,
            };
            const r = await service.getLandNameAndLandId(params).catch((e) => e);
            if (r.code == 200) {
                this.productOptions = r.data.map((i) => {
                    return {
                        landId: i.landId,
                        landName: i.title,
                    };
                });
                this.remoteSelectloading = false;
            } else {
                this.productOptions = [];
                this.$message({
                    type: 'warning',
                    message: r.msg || r.message || '获取景区ID和名称失败',
                });
            }
        },
        //轮播link确认
        onLinkConfirm() {
            this.dialogLinkVisible = false;
            const i = this.currentIndex;
            this.imgList[i].link = {
                isLinkToProduct: this.activeName == 'product',
                product: this.dialogTempData.product,
                linkDIY: this.dialogTempData.linkDIY,
            };
        },

        //-----图标-----
        //新增图标
        onaddIcon() {
            if (this.iconList.length >= 8) return this.$message('最多只支持8个图标');
            this.iconList.splice(this.iconList.length, 1, {
                name: `图标${this.iconList.length + 1}`,
                src: this.iconLibList[0].src,
                link: {
                    isLinkToProduct: false,
                    productType: '',
                    city: '',
                    activityTypeArr: [],
                    linkDIY: '',
                },
            });
        },

        //打开图标选择dialog
        onChooseIcon(index) {
            this.currentIndex = index;
            this.dialogIconChooseVisible = true;
            this.activeName = 'iconLib';
            this.dialogTempData = {
                iconSrc: '',
                iconLibIndex: '',
            };
        },
        //点击图标库图标
        onIconLibClick(iconIndex, iconName) {
            this.dialogTempData.iconLibIndex = iconIndex; //保存选择的序号
            this.dialogTempData.iconLibName = iconName; //保存选择的名称
        },
        //点击自定义上传
        onChooseIconUplord() {
            let that = this;
            Crop.show({
                cropBoxWidth: 600, //裁剪区域的高度      非必须，默认600
                cropBoxHeight: 400, // 裁剪区域的宽度    非必须，默认400
                outImgWidth: 96, //生成图片的宽度（px）  非必须，默认0  此时裁剪比例可随意调节
                outImgHeight: 96, //生成图片的高度（px） 非必须，默认0
                pathAndFileName: '', //上传到七牛的key(路径和文件名); 非必须，默认传到"pftcropimages/" 文件名随机
                success: function(imgAddressArr) {
                    //裁剪上传成功返回的图片地址数组
                    console.log(imgAddressArr);
                    if (Array.isArray(imgAddressArr) && imgAddressArr.length === 1) {
                        that.dialogTempData.iconSrc = imgAddressArr[0];
                    }
                },
                fail: function(data) {
                    //裁剪上传失败返回的信息
                    console.log({
                        msg: '用户取消了操作',
                    });
                },
            });
        },
        //关闭图标dialog
        onChooseIconConfirm() {
            this.dialogIconChooseVisible = false;
            if (this.activeName == 'iconDIY') {
                this.iconList[this.currentIndex].src = this.dialogTempData.iconSrc;
            } else {
                const i = this.dialogTempData.iconLibIndex;
                const name = this.dialogTempData.iconLibName;
                this.iconList[this.currentIndex].src = this.iconLibList[i].src;
                this.iconList[this.currentIndex].name = name;
                //如果选择的图标是蓝色（ptype）类型，则默认勾选对应产品类型
                const ptypeObj = this.productList.find((i) => i.label == name);
                if (ptypeObj) {
                    this.iconList[this.currentIndex].link.isLinkToProduct = 1;
                    this.iconList[this.currentIndex].link.productType = ptypeObj.value;
                }
            }
        },
        //----图标链接----
        //打开图标链接dialog
        onSetIconLink(index) {
            this.dialogTempData = {};
            this.currentIndex = index;
            if (this.iconList[index].link.isLinkToProduct) {
                this.activeName = 'product';
                this.dialogTempData = {
                    productType: this.iconList[index].link.productType,
                    city: this.iconList[index].link.city,
                    activityTypeArr: this.iconList[index].link.activityTypeArr,
                };
            } else {
                this.activeName = 'linkDIY';
                this.dialogTempData = { linkDIY: this.iconList[index].link.linkDIY };
            }
            this.dialogIconLinkVisible = true;
        },
        //选择城市
        handleCityChange(v) {
            //city数据格式["1","15"],"朝阳区"]
            const parent = this.cityOptions.find((i) => {
                return i.value == v[0];
            });
            const child = parent.children.find((j) => {
                return j.value == v[1];
            });
            this.dialogTempData.city = [v, child.label];
        },
        //映射产品id=>产品名称
        mapProduct(value) {
            const product = this.productList.find((i) => i.value == value);
            return product && product.label ? product.label : '';
        },
        //确认图标链接，关闭dialog
        onLinkIconConfirm() {
            this.dialogIconLinkVisible = false;
            const i = this.currentIndex;
            const { productType, city, activityTypeArr, linkDIY } = this.dialogTempData;
            if (this.activeName == 'product') {
                this.iconList[i].link = {
                    isLinkToProduct: true,
                    productType,
                    city,
                    activityTypeArr,
                    linkDIY,
                };
            } else {
                this.iconList[i].link = {
                    isLinkToProduct: false,
                    productType,
                    city,
                    activityTypeArr,
                    linkDIY,
                };
            }
        },

        //----保存----
        async onSubmit() {
            this.saveBtnLoading = true;
            let count = 0;
            const paramBanner = this.imgList.map((item) => {
                const { title, src, link: { isLinkToProduct, product, linkDIY } } = item;
                return {
                    type: Number(!isLinkToProduct),
                    title,
                    photoUrl: src,
                    link: linkDIY,
                    landID: (product && product.landId) || '',
                    landName: (product && product.landName) || '',
                };
            });
            const r1 = await service
                .editBannerConfig({ data: JSON.stringify(paramBanner) })
                .catch((e) => e);
            if (r1.code == 200) {
                count++;
            } else {
                this.$message({
                    type: 'warning',
                    message: r1.msg || r1.message || '保存轮播数据失败',
                });
            }

            const paramNotice = {
                status: Number(this.formAnnounce.isShow),
                title: this.formAnnounce.title,
                content: this.formAnnounce.content + 'TIME_CREATE' + moment().format('YYYY-MM-DD HH:mm:ss'),
            };
            const r2 = await service
                .editNotice({ data: JSON.stringify([paramNotice]) })
                .catch((e) => e);
            if (r2.code == 200) {
                count++;
            } else {
                this.$message({
                    type: 'warning',
                    message: r2.msg || r2.message || '保存公告数据失败',
                });
            }

            const paramIcon = this.iconList.map((item) => {
                return {
                    title: item.name,
                    photoUrl: item.src,

                    type: Number(!item.link.isLinkToProduct),
                    city: item.link.city,
                    link: item.link.linkDIY,
                    ptype: item.link.productType,
                    activityType: '', //活动先不做
                };
            });
            const r3 = await service.editIconConfig({ data: JSON.stringify(paramIcon) }).catch((e) => e);
            if (r3.code == 200) {
                count++;
            } else {
                this.$message({
                    type: 'warning',
                    message: r3.msg || r3.message || '保存图标数据失败',
                });
            }

            if (count == 3) {
                this.$message({
                    type: 'success',
                    message: '全部保存成功！',
                });
            }
            this.saveBtnLoading = false;
            this.saved = true;
        },

        //---工具函数---需求变动暂不用
        //对已有照片裁剪 url=>new url
        // async onCropImg(index) {
        //   let that = this;
        //   if (this.imgList[index].src) {
        //     const file = await this.urlToBlob(this.imgList[index].src)
        //     console.log(file)
        //     Crop.cropAndUploadImg({
        //       file: file, // file对象 *必须
        //       pathAndFileName: "", //上传到七牛的key(路径和文件名); 非必须，默认传到"pftcropimages/" 文件名随机
        //       cropBoxWidth: 750, //裁剪区域的高度
        //       cropBoxHeight: 420, // 裁剪区域的宽度
        //       outImgWidth: 750, //生成图片的宽度（px）
        //       outImgHeight: 420, //生成图片的高度（px）
        //       success: function (imgAddressArr) {
        //         console.log(imgAddressArr)
        //         if (Array.isArray(imgAddressArr) && imgAddressArr.length === 1) {
        //           that.imgList[index].src = imgAddressArr[0]
        //         }
        //       },
        //       fail: function (msg) {
        //         console.log(msg)
        //       }
        //     });
        //   }
        // },
        // urlToBlob(url) {
        //   return new Promise(function (resolve, reject) {
        //     try {
        //       var xhr = new XMLHttpRequest();
        //       xhr.open("GET", url);
        //       xhr.responseType = "blob";
        //       xhr.onerror = function () { reject("Network error.") };
        //       xhr.onload = function () {
        //         if (xhr.status === 200) { resolve(xhr.response) }
        //         else { reject("Loading error:" + xhr.statusText) }
        //       };
        //       xhr.send();
        //     }
        //     catch (err) { reject(err.message) }
        //   });
        // }
    },
};