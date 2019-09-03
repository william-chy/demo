import "./index.scss"
export default{
    name : "preview-wrapper",
    props : {
        compId : {
            type : String,
            default : ""
        },
        compName : {
            type : String,
        },
        compNameCn : {
            type : String,
        },
        index : {
            type : Number
        }
    },
    data(){
        return{
            isHover : false
        }
    },
    template : `
        <div 
            @click="onClick" 
            @mouseenter="mouseenter" 
            @mouseleave="mouseleave" 
            class="previewWrapper" 
            :class="{
                selected : curEditCompId===compId,
                noMarginBottom : index==0&&compName=='preview-page-title',
                hover : !!isHover
            }">
            <slot/>
            <transition name="el-fade-in-linear">
                <div v-show="!!isHover" class="hoverHeadBar">
                    <div style="height:100%" flex="cross:center box:last">
                        <span>{{compNameCn}}</span>
                        <a @click.stop="onDelete" class="deleteBtn">删除</a>
                    </div>
                </div>    
            </transition>
        </div>
    `,
    computed : {
        curEditCompId(){
            return this.$store.state.miniDec.curEditCompId;
        }
    },
    methods : {
        onClick(e){
            this.$store.commit("miniDec/switchEditComp",this.compId);
        },
        mouseenter(e){
            this.isHover = true;
        },
        mouseleave(e){
            this.isHover = false;
        },
        async onDelete(){
            const confirm = await this.$confirm('确定要删除此组件吗？').catch(e=>e);
            if(confirm==="cancel") return false;
            this.$store.commit("miniDec/deletePreviewComp",this.compId);
        }
    }

}