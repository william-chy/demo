export const tree: any = {
  // 必须定义name，组件内部才能递归调用
  template: `
    <div>
        子组件
        <br />
        <!-- 递归调用自身, 后台判断是否不存在改值 -->
        <tree :item="item.data" v-if="item.flag"></tree>
    </div>`,
  name: 'tree',
  data() {
    // tslint:disable-next-line:no-this-assignment no-invalid-this
    let vm = this;
    return {
      treeArray: vm.item,
    };
  },
  // 接收外部传入的值
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
};
