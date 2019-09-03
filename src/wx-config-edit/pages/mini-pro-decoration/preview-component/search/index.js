import "./index.scss";
export default{
    template : require("./index.xtpl"),
    name : "preview-search",
    nameCN : "搜索",
    sort : 6,  //用于默认显示时的组件排序
    compType : "other",   //组件类型 - 基础组件
    // compIcon : "icon_search.png",
    compIcon : require("../../images/icon_search.png"),
    props : {
        placeholder : {
            type : String,
            default : "搜索"
        },
        align : {
            type : String,
            default : "center"  //center==居中   left==居左
        }
    },
    computed : {
        flex(){
            if(this.align=="center"){
                return "main:center cross:center"
            }
            return "cross:center main:left"
        }
    }
}