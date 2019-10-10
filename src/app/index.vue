<template>
    <div>
        <el-card>
            <el-input class="input" v-model="input" placeholder="请输入内容" @input="onInput"></el-input>
            <el-button>按钮</el-button>
            {{something}}
        </el-card>
    </div>
</template>
<script lang='ts'>
import { capitalize } from 'lodash';
import { Component, Emit, Inject, Model, Prop, Provide, Vue, Watch } from 'vue-property-decorator';

@Component
export default class App extends Vue {
    private input = '';
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
}
</script>
<style lang="scss" scoped>
@import 'index.scss';
</style>

