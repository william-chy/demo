require('./index.scss');

const indexTpl = require('./index.xtpl');

export default {
	name: 'center',
	template: indexTpl,
	props: {
		baseData: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {};
	},
	computed: {
		storeName() {
			return this.baseData.store_name || '';
		},
		imgUrl() {
			return this.baseData.images.logo || '';
		},
		isOpen() {
			return this.baseData.enable_status == '1';
		},
	},
	created() {},
	mounted() {},
	methods: {
		goToConfig() {
			this.$emit('toconfig');
		},
		stateChange(v) {
			if (!v) {
				this.$confirm('关闭小程序店铺，您分享出去的小程序将无法访问。重新开启可继续访问。原有的装修不受影响。', '提示', {
					confirmButtonText: '确认关闭',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(() => {
					this.$emit('close');
				});
			} else {
				this.$emit('open');
			}
		},
	},
};
