import "./index.scss";
import leftIcon from "./image/icon_gonggao.png";
export default{
    template : require("./index.xtpl"),
    name : "preview-text-word",
    nameCN : "文本",
    sort : 4,  //用于默认显示时的组件排序
    compType : "base",   //组件类型 - 基础组件
    // compIcon : "icon_words.png",
    compIcon : require("../../images/icon_words.png"),
    props : {
        title : { //标题
            type : String,
            default : "票付通全新小程序店铺装修全新交互体验一键装修精美店铺"
        },
        content : { //内容
            type : String,
            default : "票付通全新小程序店铺装修全新交互体验一键装修精美店铺"
        },
        display : { //显示方式  1==滚动  2==禁用滚动   3==多行显示
            type : [Number,String],
            default : 1
        },
        icon : { //有无图标，是否显示公告前的图片 1==有  0==无
            type : [Number,String],
            default : 1
        }
    },
    data(){
        return{
            leftIcon,
            speed : 20,
            paddingLeft : 0
        }
    },
    computed : {
        flex(){
            if(this.icon){
                return "cross:center box:justify";
            }
            return "cross:center box:last";
        },
    },
    watch : {
        title : {
            handler(){
                this.$nextTick(() => {
                    if(this.display!=1) return;
                    const offsetWidth = this.$refs.content.getBoundingClientRect().width;
                    const duration = offsetWidth / this.speed + "s";
                    $(this.$refs.content).css({
                        webkitAnimationDuration : duration,
                        mozAnimationDuration : duration,
                        oAnimationDuration : duration,
                        msAnimationDuration : duration,
                        animationDuration:duration
                    });
                })
            },  
            immediate : true
        },
        display : {
            immediate : true,
            handler(display){
                this.$nextTick(() => {
                    if(display!=1) return this.paddingLeft = 0;
                    const width = this.$refs.wrap.offsetWidth;
                    this.paddingLeft = width;
                })
            }
        }
    },
    methods : {

    },
}