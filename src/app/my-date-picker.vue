<template>
  <div class="pick-wrap">
    <el-date-picker
      v-model="value[0]"
      :type="type"
      :size="size"
      :align="align"
      :format="format"
      :disabled="disabled"
      :clearable="clearable"
      :picker-options="pickerOptions[0]"
      :value-format="valueFormat"
      :placeholder="startPlaceholder"
      @input="onInput"
      @change="date1Change"
    ></el-date-picker>&nbsp; 至&nbsp;
    <el-date-picker
      v-model="value[1]"
      :type="type"
      :size="size"
      :align="align"
      :format="format"
      :disabled="disabled"
      :clearable="clearable"
      :picker-options="pickerOptions[1]"
      :value-format="valueFormat"
      :placeholder="endPlaceholder"
      @change="date2Change"
    ></el-date-picker>
    <picker v-if="hasShortcuts" @pick="onPick"></picker>
  </div>
</template>
<script>
import picker from "./picker.vue";
import { parseDate, formatDate } from "element-ui/src/utils/date-util";

export default {
  name: "my-date-picker",

  model: {
    prop: "value",
    event: "change"
  },
  components: { picker },
  props: {
    value: {
      type: Array,
      required: true,
      validator: function(value) {
        return value.lenth !== 2 || value.lenth !== 0;
      }
    },
    clearable: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "date",
      validator: function(value) {
        return (
          ["year", "month", "week", "date", "datetime"].indexOf(value) !== -1
        );
      }
    },
    size: {
      type: String,
      default: "small",
      validator: function(value) {
        return ["large", "small", "mini"].indexOf(value) !== -1;
      }
    },
    startPlaceholder: {
      type: String,
      default: "开始日期"
    },
    endPlaceholder: {
      type: String,
      default: "结束日期"
    },
    align: {
      type: String,
      default: "left",
      validator: function(value) {
        return ["left", "center", "right"].indexOf(value) !== -1;
      }
    },
    valueFormat: {
      type: String
    },
    format: {
      type: String
    },
    disabledDate: {
      //"none" 则不禁用。这个属性为自定属性
      type: String,
      default: "future",
      validator: function(value) {
        return ["future", "none"].indexOf(value) !== -1;
      }
    },
    hasShortcuts: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const that = this;
    console.log(that.disabledDate);
    const disabledFuture = [
      //禁用未来时间且结束不得小于开始
      {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() || time.getTime() < that.parsedValue[0]
          );
        }
      }
    ];
    const disabledMust = [
      //仅结束不得小于开始
      {
        disabledDate(time) {
          return null;
        }
      },
      {
        disabledDate(time) {
          return time.getTime() < that.parsedValue[0];
        }
      }
    ];
    return {
      parsedValue: [{}, {}],
      pickerOptions:
        that.disabledDate == "future" ? disabledFuture : disabledMust
    };
  },
  computed: {},
  created() {},
  methods: {
    date1Change(v) {
      this.$emit("change", this.value);
      this.parsedValue[0] = this.valueFormat
        ? parseDate(v, this.valueFormat)
        : v;
    },
    date2Change(v) {
      this.parsedValue[1] = this.valueFormat
        ? parseDate(v, this.valueFormat)
        : v;
      if (!v && this.disabledDate !== "none") {
        this.pickerOptions[0].disabledDate = time => {
          return time.getTime() > Date.now();
        };
      } else {
        this.pickerOptions[0].disabledDate = time => {
          return time.getTime() > this.parsedValue[1];
        };
      }
      this.$emit("change", this.value);
    },
    onPick(v) {
      const newValue = v.map(date => {
        return this.valueFormat ? formatDate(date, this.valueFormat) : date;
      });
      this.$emit("change", newValue);
      // 这里为了节约性能不使用ref 后期如有需要可以换成ref提交
      // this.$refs["start"].emitInput(v[0]);
      // this.$refs["end"].emitInput(v[1]);
    },
    onInput(e) {
      console.log("触发了开始input", e);
    }
  }
};
</script>
<style lang="scss" scoped>
.pick-wrap {
  display: flex;
}
.el-date-editor {
  width: 190px !important;
}
</style>

