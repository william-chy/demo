import "./index.scss";
import {commitCreator, cloneDeep} from "../../../../util";
import {Container,Draggable} from "vue-smooth-dnd";
import CropUploador from "@/common/Components/upload-crop";
import SetLinkPop from "../../../../component/set-link-pop";

//定义banner item的数据结构
const BANNER_ITEM_DEFAULT = {
    src : "",
    title : "",
    link : {
        type : "prod", //prod==产品   text==自定义链接  (目前小程序只支持产品详情的链接，不支持自定义链接)
        id : "",  //产品id  仅当type==prod时
        title : "", //产品标题 仅当type==prod时
        customLink : ""
    }
}

export default{
    template : require("./index.xtpl"),
    components : {
        Container,
        Draggable,
        SetLinkPop,
    },
    name : "editor-banner",
    props : {
        banner : {
            type : Array,
            default : [
                // {
                //     src : "",    //图片src
                //     title : "",  //标题
                //     link : {
                //         type : "prod",    //prod==产品   text==自定义链接  (目前小程序只支持产品详情的链接，不支持自定义链接)
                //         id : "",          //产品id  仅当type==prod时
                //         title : "",      //产品标题 仅当type==prod时
                //         customLink : ""
                //     }
                // }
            ]
        }
    },
    data(){
        return{
            bannerMaxCount : 5,   //最多支持5个banner
            dropPlaceholderOptions: {
                className: 'drop-preview',
                animationDuration: '150',
                showOnTop: true
            }
        }
    },
    mounted(){
        this.commit = commitCreator(this,"banner",this.$attrs.compId);
    },
    filters : {
        $linkText(text){
            if(typeof text!=="string") return "";
            if(text.length==0) return ""
            return `产品详情【${text}】`
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
            const confirm = await this.$confirm("确定要删除此轮播图吗？").catch(e=>e);
            if(confirm==="cancel") return false;
            this.commit("deleteBanner",{index});
        },
        onTitleChnage(value,index){
            this.commit("updateTitle",{index,title:$.trim(value)});
        },
        onImgPick(e,index){
            const file = e.target.files[0];
            e.target.value = "";
            this.cropAndUploadImg(file).then((res) => {
                const src = res[0];
                if(!src) throw new Error("图片上传组件未返回图片src");
                this.commit("changeImage",{index,src})
            }).catch(e=>{})
        },
        addBanner(){
            if(this.banner && this.banner.length>=this.bannerMaxCount){
                return this.$alert(`最多上传${this.bannerMaxCount}张图片`);
            }
            this.commit("add",{banner:cloneDeep(BANNER_ITEM_DEFAULT)});
        },
        async setLink(index){
            const result = await this.$refs.setLinkPop.open().catch(e=>e);
            if(result==="cancel") return false;
            const {prodId,prodName} = result;
            const link = {
                type : "prod",
                customLink : "",
                id : prodId,
                title : prodName
            }
            this.commit("updateLink",{link,index})

        },
        //删除链接(即把链接对象重置为初始状态)
        removeLink(index){
            this.commit("updateLink",{index,link:cloneDeep(BANNER_ITEM_DEFAULT)})
        },
        cropAndUploadImg(file){
            return new Promise((resolve,reject) => {
                if(!file) return reject();
                CropUploador.cropAndUploadImg({
                    file,
                    cropBoxWidth : 900,
                    cropBoxHeight : 450,
                    outImgWidth : 750,
                    outImgHeight : 375,
                    success(data){
                        resolve(data);
                    },
                    fail(){
                        reject();
                    }
                })
            })
        }
    }
}