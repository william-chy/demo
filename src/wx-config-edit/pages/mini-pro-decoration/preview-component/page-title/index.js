import "./index.scss";
import bg from "./image/image_top_bg.js";
const { 
    mapState, 
    mapActions, 
    mapGetters, 
    mapMutations 
} = Vuex.createNamespacedHelpers("miniDec");
export default{
    template : require("./index.xtpl"),
    name : "preview-page-title",
    nameCN : "页面标题",
    sort : 1,            //用于默认显示时的组件排序
    compType : "base",   //组件类型 - 基础组件
    // compIcon : "icon_title.png",
    compIcon : require("../../images/icon_title.png"),
    props : {
        shopNameShow : { //是否显示店铺名称
            type : Boolean,
            default : true,
        },
        shopNameAlign : {   //店铺名对齐方式
            type : String,
            default : "left"
        },
        searchBarShow : { //是否显示搜索框
            type : Boolean,
            default : true,
        },
        searchBarAlign : { //搜索框对齐方式
            type : String,
            default : "center"
        }
    },
    data(){
        return{
            bg,
        }
    },
    computed : {
        ...mapState(["shopName"]),
        shopName(){//店铺名称超出9个字符后，多余字符省略
            const shopName = this.$store.state.miniDec.shopName || "";
            if(shopName.length>9){
                return shopName.substring(0,9) + "..";
            }
            return shopName;
        },
        shopNameWidth(){
            if(!this.searchBarShow){//如果搜索框不显示，则shopName独自占满整列
                return "100%";
            }
            return "";
        }
    }
}