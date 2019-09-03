import "./index.scss";
import emptyIcon from "../../images/image_fixure_default.png"
const PANME = "原始森林超大超级凶野生动物园野动物门口俩面的得的动物门口俩面的得的超大超级凶动物园野动物门口超级凶"
export default{
    template : require("./index.xtpl"),
    name : "preview-prod-list",
    nameCN : "商品",
    sort : 3,  //用于默认显示时的组件排序
    compType : "base",   //组件类型 - 基础组件
    compIcon : require("../../images/icon_product.png"),
    props : {
        layout : { //展示样式
            type : Number,
            default : 2    //1==大图模式  2==一行两个   3==详细列表
        },
        detail : { //具体显示哪些字段 见FIELDS
            type : Array,
            default : [
                "lprice",  //零售价
                "mprice",  //门市价
                "ptype",   //产品类型
                "tnum",    //票种数量
            ]
        }
    },
    computed : {
        show_lprice(){
            return this.detail.includes("lprice")
        },
        show_mprice(){
            return this.detail.includes("mprice")
        },
        show_ptype(){
            return this.detail.includes("ptype")
        },
        show_tnum(){
            return this.detail.includes("tnum")
        },
        prodCount(){
            const layout = this.layout;
            if(layout==1) return 2;
            if(layout==2) return 4;
            if(layout==3) return 2;
            return 4;
        }
    },
    data(){
        return{
            pname : PANME,
            emptyIcon
        }
    },
    directives : {
		computImgboxHeight : {
			inserted(el,binding,vnode){
                setTimeout(() => {
                    const width = $(el).width()
                    el.querySelector(".photoBox").style.height = width + "px";
                },0)
            },
            unbind(el){
                el.querySelector(".photoBox").style.height = "";
            }
		}
	},
}