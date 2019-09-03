require('./index.scss');

const indexTpl = require('./index.xtpl');
const Crop = require('../../../component/upload-crop');

const required = {required: true, message: '不得为空', trigger: 'blur'};
export default {
	name: 'base-info',
	template: indexTpl,
	props: {
		baseData: {
			type: Object,
			required: true,
		},
	},
	data() {
		let checkCoordinate = (rule, value, callback) => {
			if (value != '' && !/\d+(\.\d+)?,\d+(\.\d+)?/.test(value)) {
				callback(new Error('请输入“经度,维度”，中间用英文逗号隔开'));
			} else {
				callback();
			}
		};
		return {
			form: {
				name: '',
				coordinate: '',
				telephone: '',
				addr: '',
				url: '',
			},
			rules: {
				name: [required],
				coordinate: [required, {validator: checkCoordinate, trigger: 'blur'}],
				telephone: [required],
				addr: [required],
				url: [required],
			},
			btnLoading: false,
			loading: false,
		};
	},
	created() {
		const d = JSON.parse(JSON.stringify(this.baseData));
		this.tempData = d.images; //后端与旧版的公用，这边未来不覆盖 进行存取原样照传
		this.form = {
			name: d.store_name,
			coordinate: d.longitude ? d.longitude + ',' + d.latitude : '',
			telephone: d.service_mobile,
			addr: d.address,
			url: d.images ? d.images.logo : '',
		};
	},
	methods: {
		onOpenPosition() {
			window.open('https://api.map.baidu.com/lbsapi/getpoint/index.html');
		},
		onSubmit() {
			this.$refs['form'].validate((valid) => {
				if (valid) {
					const {name, coordinate, telephone, addr, url} = this.form;
					this.tempData.logo=url
					const params = {
						enable_status: 1,
						store_name: name,
						longlatitude: coordinate,
						address: addr,
						service_mobile: telephone,
						images: JSON.stringify(this.tempData),
					};
					console.log(url)
					this.$emit('save', params);
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		onUploadImg() {
			let that = this;
			Crop.show({
				cropBoxWidth: 400, //裁剪区域的高度      非必须，默认600
				cropBoxHeight: 400, // 裁剪区域的宽度    非必须，默认400
				outImgWidth: 400, //生成图片的宽度（px）  非必须，默认0  此时裁剪比例可随意调节
				outImgHeight: 400, //生成图片的高度（px） 非必须，默认0
				pathAndFileName: '', //上传到七牛的key(路径和文件名); 非必须，默认传到"pftcropimages/" 文件名随机
				success: function(imgAddressArr) {
					//裁剪上传成功返回的图片地址数组
					console.log(imgAddressArr);
					that.form.url = imgAddressArr[0];
				},
				fail: function(data) {
					//裁剪上传失败返回的信息
					console.log({
						msg: '用户取消了操作',
					});
				},
			});
		},
	},
};
