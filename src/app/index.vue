<template>
    <div>
        <el-card>
            <el-input class="input" v-model="input" placeholder="请输入内容" @input="onInput"></el-input>
            <el-button>按钮</el-button>
            {{something}}
        </el-card>
        <tree :item="data"></tree>
        <my-button @reset="reset"></my-button>
    </div>
</template>
<script lang='ts'>
import { capitalize } from 'lodash';
import { Component, Emit, Inject, Model, Prop, Provide, Vue, Watch } from 'vue-property-decorator';
import MyButton from './components/my-button.vue';
import { tree } from './components/recursive';

@Component({ components: { tree, MyButton } })
export default class App extends Vue {
    private input = '';
    private data = {
        data: { data: { data: {}, flag: true }, flag: true },
        flag: true
    };
    private get something(): string {
        return this.input + 'compute属性';
    }
    private set something(val: string) {
        this.input = val;
    }
    private created() {
        console.log('created');
    }
    private onInput(v: string) {
        console.log(capitalize(v));
    }
    private reset(e: any) {
        console.log(e);
    }
}
</script>
<style lang="scss" scoped>
@import 'index.scss';
</style>

