<template>
  <div>
    <el-select
      v-model="selectVal"
      placeholder="请选择"
      @change="handleChangOption"
    >
      <el-option
        v-for="item in options.items"
        :key="item.value"
        :value="item.label"
        :label="item.label"
      ></el-option>
    </el-select>
  </div>
</template>
<script>
import { reactive, toRefs, ref, onMounted, watch } from "vue";
export default {
  name: "SelectOption",
  props: {
    selectData: {
      type: Object,
      default: () => {},
    },
    flag: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const selectVal = ref("");
    const options = reactive({
      items: [
        // { value: "truename", label: "真实姓名" },
        { value: "username", label: "邮箱/用户名" },
        { value: "phone", label: "手机号" },
      ], //选项数据
    });

    const option_data = toRefs(options);

    watch(
      () => props.flag,
      (newVal) => {
        // console.log(newVal);
        if (newVal) selectVal.value = "";
      }
    );

    const handleChangOption = (val) => {
      //   console.log(val);
      // 过滤
      let arr = options.items.filter((item) => item.label == val);
      //   console.log(arr[0]);
      emit("update:selectData", arr[0]);
    };

    return {
      selectVal,
      options,
      // methods
      handleChangOption,
    };
  },
};
</script>
<style lang="scss" scoped></style>