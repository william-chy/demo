import "./index.scss";
import {commitCreator, cloneDeep} from "../../../../util";
const FIELDS = [
    "lprice",  //零售价
    "mprice",  //门市价
    "ptype",   //产品类型
    "tnum",    //票种数量
]
export default{
    template : require("./index.xtpl"),
    name : "editor-prod-list",
    props : {
        layout : { //展示样式
            type : Number,
            default : 1    //1==大图模式  2==一行两个   3==详细列表
        },
        detail : { //具体显示哪些字段 见FIELDS
            type : Array,
            default : FIELDS.map((item)=>item)
        }
    },
    data(){
        return{
            isIndeterminate : false
        }
    },
    created(){
        this.commit = commitCreator(this,"prod-list",this.$attrs.compId);
    },
    computed : {
        _layout : {
            get : function(){
                return this.layout
            },
            set : function(layout){
                this.commit("updateLayout",{layout})
            }
        },
        _detail : {
            get : function(){
                return this.detail
            },
            set : function(detail){
                this.commit("updateDetail",{detail})
            }
        },
        isCheckAll : {
            get : function(){
                return this.detail.length === FIELDS.length;
            },
            set : function(checkAll){
                
                if(checkAll){
                    const detail = FIELDS.map((item)=>item);
                    this.commit("updateDetail",{detail})
                }else{
                    const detail = this.detail.length===FIELDS.length ? [] : FIELDS.map((item)=>item);
                    this.commit("updateDetail",{detail})
                }
            }
        }
    },
    methods : {
        onCheck(e){
            this.isIndeterminate = this.detail.length>0 && this.detail.length<FIELDS.length;
        },
    }
}