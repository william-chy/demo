require('./index.scss');

const indexTpl = require('./index.xtpl');
import VueEditor from '@vue-component/vue-wang-editor';
import QRCode from 'qrcodejs2';

import { getShopBaseConfig, editBaseShopConfig } from '../../service';
// import { type } from 'os';

import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

//新增充值方案页面
export default {
    name: 'addRecharge',

    template: indexTpl,

    components: {
        VueEditor,
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
            btnLoading: false,
            form: {
                name: '',
                site: '',
                qq: '',
                telephone: '',
                addr: '',
                qrcode_url: '',
                //需要处理的
                payMethod: {
                    pay_ali: false,
                    pay_card: false,
                    pay_uni: false,
                    pay_wx: false,
                },
                coordinate: '', //坐标
            },
            rules: {
                coordinate: [{ validator: checkCoordinate, trigger: 'blur' }],
            },
            isCanvasShow: false,
            isTutorialShow: false,
            isProduction: document.getElementById('envHidInp').value === 'PRODUCTION',
            account: document.getElementById('accountHidInp').value,
        };
    },
    computed: {},

    beforeCreate() {
        this.loading = true;
    },

    async created() {
        const r = await getShopBaseConfig().catch((e) => e);
        if ((r.code = 200)) {
            const { latitude, longitude, about_us, pay_mode, account, url, ...rest } = r.data;
            Object.assign(this.form, rest);
            if (pay_mode) {
                Object.keys(pay_mode).forEach((key) => {
                    this.form.payMethod[key] = Boolean(pay_mode[key]);
                });
            }
            this.form.coordinate = longitude + ',' + latitude;
            this.form.site = 'https://' + url;
            const editor = this.$refs['about'];
            if (editor) editor.setContent(about_us);
            // 生成二维码
            try {
                new QRCode(document.getElementById('qrcode'), {
                    width: 80,
                    height: 80,
                    text: this.form.site,
                });
            } catch (error) {
                console.log('二维码生成失败', error);
            }
        } else {
            this.$message({
                message: r.msg || r.message || '获取店铺信息失败',
                type: 'warning',
            });
        }
        this.loading = false;
    },
    mounted() {},

    methods: {
        async onSubmit() {
            const val = await this.$refs['form'].validate().catch((e) => e);
            if (!val) return;
            this.btnLoading = true;
            const { coordinate, payMethod, ...rest } = this.form;
            const editor = this.$refs['about'];
            const about_us = editor.getContent('html');
            const [longitude, latitude] = coordinate.split(',');
            let pay_mode = Object.assign({}, payMethod);
            Object.keys(pay_mode).forEach((key) => {
                pay_mode[key] = Number(pay_mode[key]);
            });
            pay_mode = JSON.stringify(pay_mode);
            const param = {
                longitude, //经度
                latitude,
                about_us,
                pay_mode,
                ...rest,
            };
            const r = await editBaseShopConfig(param).catch((e) => e);
            if (r.code == 200) {
                this.$message({
                    type: 'success',
                    message: r.msg || '保存成功',
                });
            } else {
                this.$message({
                    type: 'warning',
                    message: r.msg || r.message || '保存失败',
                });
            }
            this.btnLoading = false;
        },
        onmouseover() {
            this.isCanvasShow = true;
        },
        onmouseout() {
            this.isCanvasShow = false;
        },
        tutorialOver() {
            this.isTutorialShow = true;
        },
        tutorialOut() {
            this.isTutorialShow = false;
        },
        onOpenPosition() {
            window.open('https://api.map.baidu.com/lbsapi/getpoint/index.html');
        },
        onCopy(e) {
            this.$message({
                type: 'success',
                message: '复制成功',
            });
        },
        onError(e) {
            this.$message({
                type: 'warning',
                message: '复制失败',
            });
        },

    },
};