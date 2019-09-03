require('./index.scss');

const indexTpl = require('./index.xtpl');

import configCenter from './center';
import create from './create';
import baseInfo from './base-info';
import {saveWxConfig, getWxConfig, getPageAppCodeConfig} from '../../service';

export default {
	name: 'mini',
	template: indexTpl,
	components: {create, baseInfo, configCenter},
	data() {
		return {
			alreadyCreated: false,
			baseInfoShow: false,
			loading: true,
			baseData: {}, //单向绑定到各个组件
			codeSrc: '', //小程序码
			dialogVisible: false, //小程序码弹窗
		};
	},
	async created() {
		await this.getConfig();
		this.alreadyCreated = true;
		this.loading = false;
	},
	methods: {
		async getConfig() {
			const r = await getWxConfig().catch((e) => e);
			if ((r.code = 200)) {
				if (Array.isArray(r.data) || !r.data.id) return; //未配置 可以用id也可以用空数组判断
				this.baseData = r.data;
			} else {
				this.$message({
					message: r.msg || r.message || '获取小程序信息失败',
					type: 'warning',
				});
			}
		},
		async saveConfig(params) {
			const r = await saveWxConfig(params).catch((e) => e);
			if ((r.code = 200)) {
				this.$message({
					message: '保存小程序信息成功',
					type: 'success',
				});
				//刷新数据
				this.getConfig();
			} else {
				this.$message({
					message: r.msg || r.message || '保存小程序信息失败',
					type: 'warning',
				});
			}
		},
		async saveConfigAndClose(params) {
			console.log(params);
			await this.saveConfig(params);
			this.baseInfoShow = false;
		},
		async changeState(isOpen) {
			const {enable_status, latitude, longitude, images, ...rest} = this.baseData;
			const params = {
				longlatitude: longitude + ',' + latitude,
				images: JSON.stringify(images),
				enable_status: isOpen,
				...rest,
			};
			await this.saveConfig(params);
		},
		async showMiniCode() {
			this.dialogVisible = true;
			const r = await getPageAppCodeConfig({account: this.baseData.account}).catch((e) => e);
			if ((r.code = 200)) {
				this.codeSrc = r.data.url;
			} else {
				this.$message({
					message: r.msg || r.message || '获取小程序码失败',
					type: 'warning',
				});
			}
		},
	},
};
