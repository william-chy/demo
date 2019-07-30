<template>
  <div>
    <el-input v-model="input" placeholder="请输入内容" @change="onchange"></el-input>
  </div>
</template>
<script>
export default {
  data() {
    return {
      input: ""
    };
  },
  methods: {
    onchange(v) {
      console.log(v);
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'index.scss';
div {
  background-color: #ccc;
}
</style>

