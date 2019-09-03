import "./index.scss";
import RootStore from "../../store";
import store from "./store";
import PreviewWrapper from "./component/preview-wrapper";
import EditorWrapper from "./component/editor-wrapper";
//导入所有预览组件
import {
    components as PreviewComponents,
    componentsDefaultData,
    baseCompIcon,
    otherCompIcon,
} from "./preview-component";




//导入所有编辑组件
import EditorComponents from "./editor-component";
import {Container,Draggable} from "vue-smooth-dnd";
const { 
    mapState, 
    mapActions, 
    mapGetters, 
    mapMutations 
} = Vuex.createNamespacedHelpers(store.name);
//基础组件数据
RootStore.registerModule(store.name,store);

export default{
    template : require("./index.xtpl"),
    components : { //把所有预览组件跟编辑组件都注册到本页面来
        ...PreviewComponents.reduce((cur,next) => {
            cur[next.name] = next;
            return cur;
        },{}),
        ...EditorComponents.reduce((cur,next) => {
            cur[next.name] = next;
            return cur;
        },{}),
        Container,
        Draggable,
        PreviewWrapper,
        EditorWrapper,
    },
    data(){
        return{
            componentsDefaultData,
            baseCompIcon,
            otherCompIcon,
            dropPlaceholderOptions: {
                className: 'drop-preview',
                animationDuration: '150',
                showOnTop: true
            }
        }
    },
    computed : {
        ...mapState(["compData","curEditCompId"]),
        ...mapGetters(["curEditCompData"]),
    },
    mounted(){

    },
    methods : {
        ...mapMutations(["changeSort","addNew"]),
        onDrop({removedIndex, addedIndex, payload={}, element}){
            if(typeof removedIndex==="number" && typeof addedIndex==="number" && removedIndex===addedIndex) return false;
            const changeSort = typeof removedIndex==="number";
            const {newCompIndex,type} = payload;
            if(changeSort){//不需要添加新组件，只是组件调整顺序
                this.changeSort({removedIndex,addedIndex});
            }else if(typeof newCompIndex==="number"){ //插入一个新组件
                this.addNew({addedIndex,newCompIndex,type})
            }
        },
        getBaseDragSourcePayload(index){
            return{
                type : "base",
                newCompIndex : index
            }
        },
        getOtherDragSourcePayload(index){
            return{
                type : "other",
                newCompIndex : index
            }
        },

    }
}