<template>
    <div>
        <el-button @click="resetCount">按钮组件</el-button>
    </div>
</template>
<script lang='ts'>
import { Component, Emit, Inject, Model, Prop, Provide, Vue, Watch } from 'vue-property-decorator';
@Component
export default class MyButton extends Vue {
    private input = '';
    private data = {
        data: { data: { data: {}, flag: true }, flag: true },
        flag: true
    };
    private get something(): string {
        return this.input + 'compute属性';
    }
    private set something(val: string) {
        console.log('setval', val);
        this.input = val;
    }
    private created() {
        console.log('生命周期created');
    }

    @Emit('reset')
    private resetCount(e: MouseEvent) {
        console.log(e);
        return ((e.target as HTMLSpanElement).innerText = '点击了我');
    }
}
</script>
<style lang="scss" scoped>
</style>

