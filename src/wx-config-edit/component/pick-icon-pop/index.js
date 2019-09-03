import "./index.scss";
import IconMap from "../../ptypeIconMap";
import CropUploador from "@/common/Components/upload-crop";
export default{
    template : require("./index.xtpl"),
    props : {
        title : {
            type : String,
            default : "选择图标"
        },
        width : {
            type : String,
            default : "50%"
        }
    },
    data(){
        return{
            IconMap,
            show : false,
            type : "1",  //1==从图标库里直接选取  2==自定义上传图标
            selectedSrc : "",             //标识从图标库中选中的第几个图标
            selectedText : "",
            customSrc : ""                //自定义上传图标，上传成功后返回的图标src
        }
    },
    mounted(){
        this.isClickToCancel = true;
    },
    methods : {
        open(){
            this.isClickToCancel = true;
            return new Promise((resolve,reject) => {
                const unwatch  = this.$watch("show",(show) => {
                    if(show===true) return false;
                    const {type,selectedSrc,customSrc,selectedText} = this;
                    if(this.isClickToCancel){
                        unwatch();
                        return reject("cancel");
                    }
                    unwatch();
                    resolve({
                        type,
                        src : type==1 ? selectedSrc : customSrc,
                        text : type==1 ? selectedText : "",
                    })
                })
                this.show = true;
            })
        },
        onConfirm(){
            const {type,selectedSrc,customSrc} = this;
            if(type==1 && !selectedSrc) return this.$alert("请选择图标");
            if(type==2 && !customSrc) return this.$alert("请上传自定义图标");
            this.isClickToCancel = false;
            this.show = false;
        },
        onCancel(){
            this.isClickToCancel = true;
            this.show = false;
        },
        onImgPick(e){
            const file = e.target.files[0];
            e.target.value = "";
            this.cropAndUploadImg(file).then((res) => {
                const src = res[0];
                if(!src) throw new Error("图片上传组件未返回图片src");
                this.customSrc = src;
            }).catch(e=>{})
        },
        onSelectIcon(item){
            this.selectedSrc = item.src;
            this.selectedText = item.text;
        },
        cropAndUploadImg(file){
            return new Promise((resolve,reject) => {
                if(!file) return reject();
                CropUploador.cropAndUploadImg({
                    file,
                    cropBoxWidth : 450,
                    cropBoxHeight : 450,
                    outImgWidth : 96,
                    outImgHeight : 96,
                    zIndex : 9999,
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