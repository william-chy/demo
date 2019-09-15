<template>
  <el-card>
    <my-tree></my-tree>
  </el-card>
</template>
<script>
import myTree from "./components/tree/index.vue";
export default {
  components: {
    myTree
  },
  data() {
    return {};
  },
  watch: {},
  methods: {}
};
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>

