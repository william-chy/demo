<template>
  <div>
    <div
      role="treeitem"
      tabindex="-1"
      aria-expanded="true"
      draggable="false"
      class="el-tree-node is-expanded"
      v-for="(item,index) in data"
      :key="item.id"
    >
      <div class="el-tree-node__content" style="padding-left: 0px;">
        <span
          :class="{'el-tree-node__expand-icon el-icon-caret-right':true,'expanded':item.expanded}"
          @click="onClickExpand(item,index)"
        ></span>
        <label role="checkbox" class="el-checkbox">
          <span
            aria-checked="mixed"
            :class="{'el-checkbox__input':true,'is-checked':item.isChecked,'is-indeterminate':item.isIndeterminate}"
          >
            <span class="el-checkbox__inner" @click.stop="onParentCheck(item)"></span>
            <input
              type="checkbox"
              aria-hidden="true"
              class="el-checkbox__original"
              value
              tabindex="-1"
            />
          </span>
        </label>

        <span class="custom-tree-node">
          <span>{{item.label}}</span>
          <span>
            <button type="button" class="el-button el-button--text el-button--mini">
              <span>Append</span>
            </button>
            <button type="button" class="el-button el-button--text el-button--mini">
              <span>Delete</span>
            </button>
          </span>
        </span>
      </div>
      <!-- 子集 -->
      <div
        role="group"
        aria-expanded="true"
        class="el-tree-node__children"
        :style="item.expanded?'':'display:none'"
        v-if="item.children"
      >
        <div
          role="treeitem"
          tabindex="-1"
          aria-expanded="true"
          draggable="false"
          class="el-tree-node is-expanded is-focusable"
          v-for="(sub, index2) in item.children"
          :key="sub.id"
        >
          <div class="el-tree-node__content" style="padding-left: 18px;">
            <span class="is-leaf el-tree-node__expand-icon el-icon-caret-right"></span>
            <label role="checkbox" class="el-checkbox">
              <span
                aria-checked="mixed"
                :class="{'el-checkbox__input':true,'is-checked':sub.isChecked}"
              >
                <span class="el-checkbox__inner" @click.stop="onChildrenCheck(item,sub)"></span>
                <input
                  type="checkbox"
                  aria-hidden="true"
                  class="el-checkbox__original"
                  value
                  tabindex="-1"
                />
              </span>
            </label>

            <span class="custom-tree-node">
              <span>{{sub.label}}</span>
              <span>
                <button type="button" class="el-button el-button--text el-button--mini">
                  <span>Append</span>
                </button>
                <button type="button" class="el-button el-button--text el-button--mini">
                  <span>Delete</span>
                </button>
              </span>
            </span>
          </div>
          <div role="group" aria-expanded="true" class="el-tree-node__children"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let id = 1000;

export default {
  data() {
    const data = [
      {
        id: 1,
        label: "一级 1",
        children: [
          {
            id: 4,
            label: "二级 1-1"
          }
        ]
      },
      {
        id: 2,
        label: "一级 2",
        children: [
          {
            id: 5,
            label: "二级 2-1"
          },
          {
            id: 6,
            label: "二级 2-2"
          }
        ]
      },
      {
        id: 3,
        label: "一级 3",
        children: [
          {
            id: 7,
            label: "二级 3-1"
          },
          {
            id: 8,
            label: "二级 3-2"
          }
        ]
      }
    ];
    data.map(i => {
      i.expanded = false;
      i.isChecked = false;
      i.isIndeterminate = false;
      if (i.children) {
        i.children.map(j => {
          j.isChecked = false;
          return j;
        });
      }
      return i;
    });
    return {
      data: JSON.parse(JSON.stringify(data))
    };
  },

  methods: {
    onClickExpand(item, index) {
      console.log(item);
      item.expanded = !item.expanded;
      // this.data.splice(index, 1, item);
    },
    onParentCheck(item) {
      item.isIndeterminate = false;
      item.isChecked = !item.isChecked;
      item.children.forEach(sub => {
        sub.isChecked = item.isChecked;
      });
    },
    onChildrenCheck(item, sub) {
      sub.isChecked = !sub.isChecked;
      console.log("item", item);
      const count = item.children.reduce((cur, next) => {
        return cur + next.isChecked;
      }, 0);
      console.log("count", count);

      switch (count) {
        case 0:
          item.isChecked = item.isIndeterminate = false;
          break;
        case item.children.length:
          item.isChecked = true;
          item.isIndeterminate = false;
          break;
        default:
          item.isChecked = false;
          item.isIndeterminate = true;
          break;
      }
    },
    append(data) {
      const newChild = { id: id++, label: "testtest", children: [] };
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild);
    },

    remove(node, data) {
      console.log(node);
      console.log(data);
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },

    renderContent(h, { node, data, store }) {
      if (!data.children && node.expanded) {
        return (
          <div class="custom-tree-my">
            <span>{node.label}</span>
            <span>
              <el-button
                size="mini"
                type="text"
                on-click={() => this.append(data)}
              >
                Append
              </el-button>
              <el-button
                size="mini"
                type="text"
                on-click={() => this.remove(node, data)}
              >
                Delete
              </el-button>
            </span>
            <div class="loadMore">123</div>
          </div>
        );
      } else {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
          </span>
        );
      }
    }
  }
};
</script>

<style>
.el-tree-node__content {
  height: auto;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>