import "./index.scss";
import emptyIcon from "../../images/image_fixure_default.png"
export default{
    template : require("./index.xtpl"),
    name : "preview-banner",
    nameCN : "轮播图",
    sort : 2,
    compType : "base",   //组件类型 - 基础组件
    compIcon : require("../../images/icon_lunbo.png"),
    props : {
        banner : {
            type : Array,
            default : []  //banner里的数据结构请到editor-component/banner里的BANNER_ITEM_DEFAULT常量查看
        }
    },
    data(){
        return{
            emptyIcon
        }
    },
    methods : {
        onImgError(e){
            e.target.src = "//images.pft12301.cc/images/defaultThum.jpg";
        }
    }
    
}