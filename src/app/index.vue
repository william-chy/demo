<template>
  <div>
    <el-card>
      <el-input class="input" v-model="input" placeholder="请输入内容" @change="onchange"></el-input>
      <el-button>按钮</el-button>
    </el-card>
  </div>
</template>
<script>
import { capitalize } from "lodash";
export default {
  data() {
    return {
      input: ""
    };
  },
  methods: {
    onchange(v) {
      console.log(capitalize(v));
    }
  }
};
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>

