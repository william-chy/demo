import "./index.scss";
import {commitCreator, cloneDeep} from "../../../../util";

export default{
    template : require("./index.xtpl"),
    name : "editor-search",
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
    created(){
        this.commit = commitCreator(this,"search",this.$attrs.compId);
    },
    computed : {
        _align : {
            get : function(){
                return this.align;
            },
            set : function(align){
                this.commit("updateAlign",{align})
            }
        }
    },
    methods : {
        onPlaceholderChange(placeholder){
            this.commit("updatePlaceholder",{placeholder})
        }
    }
}