import "./index.scss";
import {commitCreator, cloneDeep} from "../../../../util";

export default{
    template : require("./index.xtpl"),
    name : "editor-text-word",
    props : {
        title : { //标题
            type : String,
            default : ""
        },
        content : { //内容
            type : String,
            default : ""
        },
        display : { //显示方式  1==滚动  2==禁用滚动   3==多行显示
            type : [Number,String],
            default : 1
        },
        icon : { //有无图标，是否显示公告前的图片  1==有  0==无
            type : [Number,String],
            default : 1
        }
    },
    computed : {
        _title : {
            get(){
                return this.title;
            },
            set(title){
                this.commit("updateTitle",{title});
            }
        },
        _content : {
            get(){
                return this.content;
            },
            set(content){
                this.commit("updateContent",{content});
            }
        },
        _display : {
            get(){
                return this.display;
            },
            set(display){
                this.commit("updateDisplay",{display});
            }
        },
        _icon : {
            get(){
                return this.icon;
            },
            set(icon){
                this.commit("updateIcon",{icon});
            }
        }
    },
    mounted(){
        this.commit = commitCreator(this,"text-world",this.$attrs.compId);
    }
}