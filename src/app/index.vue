<template>
  <el-card>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" size="mini">
      <el-form-item label="elmUI" prop="value1">
        <el-date-picker
          v-model="ruleForm.value1"
          type="daterange"
          unlink-panels
          align="right"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :clearable="false"
          :picker-options="pickerOptions"
          @change="onchange"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="自定义" prop="value2">
        <my-date-picker
          v-model="ruleForm.value2"
          type="datetime"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :clearable="false"
          disabled-date="future"
          @change="onchange"
          value-format="yyyy-MM-dd"
          :has-shortcuts="true"
        ></my-date-picker>
      </el-form-item>
    </el-form>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-card>
          <ul>
            <li>
              <s>model双向绑定</s>
            </li>
            <li>
              <s>chaneg事件触发</s>
            </li>
            <li>
              <s>size</s>
            </li>
            <li>
              <s>clearable</s>
            </li>
            <li>
              <s>vaildate验证</s>
            </li>
            <li>
              <s>disable-date</s>
            </li>
            <li>
              <s>日期、时间选择</s>
            </li>
            <li>
              <s>shortcut快捷选择</s>
            </li>
            <li>
              <s>value-format</s>
            </li>
            <li>
              <s>disabled</s>
            </li>
            <li>
              <s>format</s>
            </li>
            剩下文档里有的用的到的api应该都能实现，需要再加
          </ul>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          目前无法实现
          <ul>
            <li>vaildate验证无法直接require，因为只要选一个就是非空。解决方案:1自定义验证。2预设值然后不可清空避开验证</li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import myDatePicker from "./my-date-picker.vue";
export default {
  components: {
    myDatePicker
  },
  data() {
    return {
      ruleForm: {
        value1: [],
        value2: []
      },
      rules: {
        value1: [{ required: true, message: "请选择时间", trigger: "blur" }],
        value2: [{ required: true, message: "请选择时间", trigger: "blur" }]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  watch: {},
  methods: {
    onchange(v) {
      console.log(v);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>

