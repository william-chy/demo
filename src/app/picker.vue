<template>
  <div>
    <a v-for="picker in shortcuts" @click="picker.onClick">{{picker.text}}</a>
  </div>
</template>

<script>
export default {
  data() {
    const that = this;
    return {
      shortcuts: [
        {
          text: "一周",
          onClick() {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            that.$emit("pick", [start, end]);
          }
        },
        {
          text: "一个月",
          onClick() {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            that.$emit("pick", [start, end]);
          }
        },
        {
          text: "三个月",
          onClick() {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            that.$emit("pick", [start, end]);
          }
        }
      ]
    };
  },
  created() {}
};
</script>
<style lang="scss" scoped>
a{
    color: #457ed8;
    cursor: pointer;
    padding:3px;
    margin: 0 5px;
    // border: 1px solid #457ed8;
    // border-radius: 5px;
}
</style>