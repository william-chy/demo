import "./index.scss";
import IconMap from "../../../../ptypeIconMap";
import ptypeMap from "../../ptypeMap";
import {Container,Draggable} from "vue-smooth-dnd";
import pickIconPop from "../../../../component/pick-icon-pop";
import SetLinkPop from "../../../../component/set-link-pop";
import {commitCreator, cloneDeep} from "../../../../util";
//组件被添加进去时，默认只显示4个导航item，最多8个，分两行
export const DEFAULT_NAV_LIST = [{
    style : 1,         //导航样式  1==图文导航  2==文字导航
    icon : IconMap[0].src,         //图标src地址
    text : "名称",   //导航描述文字
    ptype : "all",      //all代表不限 点击该导航时跳转到产品列表时，默认显示所有产品类型还是某个特定的产品类型  "all"==不限产品类型(所有)  "A"==景区类产品
    cityId : "all",     //点击该导航时跳转到产品列表时，默认显示所有所有城市的产品还是某个特定城市的  "all"==不限城市(所有)  "3365"==某个特定城市的城市id
    cityName : "all",   //点击该导航时跳转到产品列表时，默认显示所有所有城市的产品还是某个特定城市的  "all"==不限城市(所有)  "福州"==某个特定城市的城市名
},{
    style : 1,        //导航样式  1==图文导航  2==文字导航
    icon : IconMap[1].src,         //图标src地址
    text : "名称",   //导航描述文字
    ptype : "all",       //点击该导航时跳转到产品列表时，默认显示所有产品类型还是某个特定的产品类型  "all"==不限产品类型(所有)  "A"==景区类产品
    cityId : "all",     //点击该导航时跳转到产品列表时，默认显示所有所有城市的产品还是某个特定城市的  "all"==不限城市(所有)  "3365"==某个特定城市的城市id
    cityName : "all",   //点击该导航时跳转到产品列表时，默认显示所有所有城市的产品还是某个特定城市的  "all"==不限城市(所有)  "福州"==某个特定城市的城市名
},{
    style : 1,        //导航样式  1==图文导航  2==文字导航
    icon : IconMap[15].src,         //图标src地址
    text : "名称",   //导航描述文字
    ptype : "all",       //点击该导航时跳转到产品列表时，默认显示所有产品类型还是某个特定的产品类型  "all"==不限产品类型(所有)  "A"==景区类产品
    cityId : "all",     //点击该导航时跳转到产品列表时，默认显示所有所有城市的产品还是某个特定城市的  "all"==不限城市(所有)  "3365"==某个特定城市的城市id
    cityName : "all",   //点击该导航时跳转到产品列表时，默认显示所有所有城市的产品还是某个特定城市的  "all"==不限城市(所有)  "福州"==某个特定城市的城市名
},{
    style : 1,        //导航样式  1==图文导航  2==文字导航
    icon : IconMap[3].src,         //图标src地址
    text : "名称",   //导航描述文字
    ptype : "all",       //点击该导航时跳转到产品列表时，默认显示所有产品类型还是某个特定的产品类型  "all"==不限产品类型(所有)  "A"==景区类产品
    cityId : "all",     //点击该导航时跳转到产品列表时，默认显示所有所有城市的产品还是某个特定城市的  "all"==不限城市(所有)  "3365"==某个特定城市的城市id
    cityName : "all",   //点击该导航时跳转到产品列表时，默认显示所有所有城市的产品还是某个特定城市的  "all"==不限城市(所有)  "福州"==某个特定城市的城市名
}]
export default{
    template : require("./index.xtpl"),
    name : "editor-image-text-nav",
    components : {
        Container,
        Draggable,
        pickIconPop,
        SetLinkPop,
    },
    props : {
        navList : {
            type : Array,
            default : DEFAULT_NAV_LIST.map(item=>Object.assign(item))
        }
    },
    data(){
        return{
            maxCount : 8, //最多8个图文导航   
            dropPlaceholderOptions: {
                className: 'drop-preview',
                animationDuration: '150',
                showOnTop: true
            },
        }
    },
    created(){
        this.commit = commitCreator(this,"image-text-nav",this.$attrs.compId);
    },
    computed : {
        style : {
            get : function(){
                return this.navList[0].style;
            },
            set : function(style){
                this.commit("updateStyle",{style});
            }
        }
    },
    filters : {
        $linkText(item){
            const {ptype,cityName} = item || {};
            const ptypeName = ptype && ptype!="all" ? ptypeMap[ptype.toUpperCase()] : "不限";
            const _cityName = cityName && cityName!="all" ? cityName : "不限";
            return `产品类型：${ptypeName}，${_cityName}`;
        }
    },
    methods : {
        onPreviewImgError(e){
            e.target.src = "//images.pft12301.cc/images/defaultThum.jpg";
        },
        onDrop({removedIndex, addedIndex, payload={}, element}){
            if(typeof removedIndex==="number" && typeof addedIndex==="number" && removedIndex===addedIndex) return false;
            this.commit("sort",{removedIndex,addedIndex})
        },
        async onDelete(index){
            if(this.navList.length==1) return this.$alert("请至少保留一个图文导航");
            const confirm = await this.$confirm("确定要删除此图标吗？").catch(e=>e);
            if(confirm==="cancel") return false;
            this.commit("delete",{index});
        },
        onTitleChnage(text,index){
            this.commit("updateText",{index,text});
        },
        async onImgPick(index){
            const result = await this.$refs.pickIconPop.open().catch(e=>e);
            if(result==="cancel") return;
            const {type,src,text} = result;
            this.commit("updateIcon",{index,icon:src});
            if(type==1){//直接从图标库里选，此时文字也要跟随图标库里的文字
                this.commit("updateText",{index,text});
            }
        },
        addNav(){
            if(this.navList && this.navList.length>=this.maxCount){
                return this.$alert(`目前只支持最多8个导航`);
            }
            this.commit("add",{navItem:cloneDeep(DEFAULT_NAV_LIST[0])});
        },
        async setLink(index){
            const result = await this.$refs.setLinkPopNavList.open().catch(e=>e);
            if(result==="cancel") return false;
            const {ptype,text,cityId,cityName} = result;
            this.commit("updateLink",{ptype,text,cityId,cityName,index})
        },
        //删除链接(即把链接对象重置为初始状态)
        removeLink(index){
            this.commit("deleteLink",{index})
        },
    }
}