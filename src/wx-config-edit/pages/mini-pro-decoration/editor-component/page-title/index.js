import {commitCreator} from "../../../../util";
export default{
    template : require("./index.xtpl"),
    name : "editor-page-title",
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
            bgColor : "defaults"
        }
    },
    mounted(){
        this.commit = commitCreator(this,"page-title",this.$attrs.compId);
    },
    computed : {
        _shopNameShow : {
            get : function(){ return this.shopNameShow},
            set : function(val){
                this.commit("shopNameShow",{visible:val});
            }
        },
        _shopNameAlign : {
            get : function(){ return this.shopNameAlign},
            set : function(align){
                this.commit("shopNameAlign",{align});
            }
        },
        _searchBarShow : {
            get : function(){ return this.searchBarShow},
            set : function(val){
                this.commit("searchBarShow",{visible:val});
            }
        },
        _searchBarAlign : {
            get : function(){ return this.searchBarAlign},
            set : function(align){
                this.commit("searchBarAlign",{align});
            }
        }
    }
}