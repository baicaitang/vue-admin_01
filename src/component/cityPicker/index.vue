<template>
  <div class="cityPicker">
    <el-row :gutter="10">
      <el-col :span="6" v-if="init.province">
        <el-select
          placeholder="省份"
          v-model="provinceVal"
          @change="handleProvince"
          prop="province"
        >
          <el-option
            v-for="item in provinceData"
            :key="item.PROVINCE_ID"
            :label="item.PROVINCE_NAME"
            :value="item.PROVINCE_CODE"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6" v-if="init.city">
        <el-select
          placeholder="城市"
          v-model="cityVal"
          @change="handleCity"
          prop="city"
        >
          <el-option
            v-for="item in cityData"
            :key="item.CITY_ID"
            :label="item.CITY_NAME"
            :value="item.CITY_CODE"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6" v-if="init.area">
        <el-select
          placeholder="区县"
          v-model="areaVal"
          @change="handleArea"
          prop="area"
        >
          <el-option
            v-for="item in areaData"
            :key="item"
            :label="item.AREA_NAME"
            :value="item.AREA_CODE"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6" v-if="init.street">
        <el-select
          placeholder="街道"
          v-model="streetVal"
          prop="street"
          @change="handleStreet"
        >
          <el-option
            v-for="item in streetData"
            :key="item"
            :label="item.STREET_NAME"
            :value="item.STREET_CODE"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { reactive, toRefs, ref, onMounted, watch } from "vue";
// import { getCityPicker } from "@/api/user";
import { cityPicker } from "@/mixins/cityPicker";

export default {
  name: "CityPicker",
  props: {
    modelValue: Object,
    cityPickerData: {
      type: Object,
      deafault: () => {},
    },
    cityLevel: {
      type: Array,
      default: () => {},
    },
    type: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const {
      // 事件
      getProvance,
      handleProvince,
      handleCity,
      handleArea,
      handleStreet,
      picker_datas,
      resultData,
      // provinceVal,
      // cityVal,
      // areaVal,
      // streetVal,
      // provinceData,
      // cityData,
      // areaData,
      // streetData,
    } = cityPicker();

    const init = reactive({
      province: false,
      city: false,
      area: false,
      street: false,
    });

    // const provinceVal = ref("");
    // const cityVal = ref("");
    // const areaVal = ref("");
    // const streetVal = ref("");

    // const picker_datas = toRefs(picker_data);

    onMounted(() => {
      // sessionStorage.setItem("city_data", "");
      // 初始化
      initCityPicker();
      getProvance();
    });

    // 监听选项变化
    watch(
      [
        () => resultData.provinceVal,
        () => resultData.cityVal,
        () => resultData.areaVal,
        () => resultData.streetVal,
      ],
      ([province, city, area, street]) => {
        // console.log(resultData);
        handleEmit();
        // emit("update:cityPickerData", resultData);
        // sessionStorage.setItem("city_data", JSON.stringify(resultData));
        // console.log(sessionStorage.getItem("city_data"));
      }
    );
    watch(
      () => props.cityPickerData,
      (newVal) => {
        // 监听编辑弹框数据
        // console.log(newVal);
        // console.log(picker_datas);
        if (newVal) {
          // 获取城市数据
          if (newVal.provinceVal) handleProvince(newVal.provinceVal);
          if (newVal.cityVal) handleCity(newVal.cityVal);
          if (newVal.areaVal) handleArea(newVal.areaVal);
          if (newVal.streetVal) handleStreet(newVal.streetVal);
        }
      }
    );
    watch(
      () => props.type,
      () => {
        // console.log(props.type);
        // 关闭弹框后重置
        if (props.type === "add") {
          handleProvince("");
        }
      }
    );

    const handleEmit = () => {
      // console.log(resultData);
      // console.log(props.cityPickerData);
      // console.log(props.modelValue);
      emit("update:modelValue", resultData);
      // emit("update:cityPickerData", resultData);
    };

    const initCityPicker = () => {
      //   console.log(props.cityLevel);

      let initData = props.cityLevel;
      if (initData.length == 0) {
        initData.forEach((item) => {
          init[item] = true;
        });
      } else {
        initData.forEach((item) => {
          init[item] = true;
        });
      }
    };

    return {
      init,
      ...picker_datas,
      // provinceVal,
      // cityVal,
      // areaVal,
      // streetVal,
      handleProvince,
      handleCity,
      handleArea,
      handleStreet,
    };
  },
};
</script>
<style lang="scss" scoped>
.cityPicker {
  overflow: hidden;
}
</style>