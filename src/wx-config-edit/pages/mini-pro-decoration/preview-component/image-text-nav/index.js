import "./index.scss";
//组件被添加进去时，默认只显示4个导航item，最多8个，分两行
import {DEFAULT_NAV_LIST} from "../../editor-component/image-text-nav"
export default{
    template : require("./index.xtpl"),
    name : "preview-image-text-nav",
    nameCN : "图文导航",
    sort : 5,  //用于默认显示时的组件排序
    compType : "base",   //组件类型 - 基础组件
    // compIcon : "icon_tuwendaohang.png",
    compIcon : require("../../images/icon_tuwendaohang.png"),
    props : {
        navList : {
            type : Array,
            default : DEFAULT_NAV_LIST.map(item=>Object.assign(item))
        }
    },
    data(){
        return {
            boxWidth : 100,
            
        }
    },
    mounted(){
        this.$nextTick(() => {
            // this.boxWidth = (this.$el.offsetWidth-12) / 4;
            this.boxWidth = (document.querySelector(".outputStage").offsetWidth-15) / 4;
        })
    },
    methods : {
        onImgError(e){

        }
    },
    
}