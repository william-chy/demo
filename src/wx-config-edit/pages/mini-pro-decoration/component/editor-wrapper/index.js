import "./index.scss"
export default{
    computed : {
        compNameCN(){
            const curEditCompData = this.$store.getters["miniDec/curEditCompData"] || {};
            return curEditCompData.compNameCN || "";
        }
    },
    template : `
        <div class="editorWrapper">
            <div class="editorWrapper-header">{{compNameCN}}</div>
            <div class="editorWrapper-content">
                <slot/>
            </div>
        </div>
    `,
}