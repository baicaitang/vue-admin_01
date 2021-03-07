<template>
  <div class="ConsoleIndex">
    <h3>数据展示</h3>
    <div id="main"></div>
  </div>
</template>
<script>
import {
  reactive,
  toRefs,
  ref,
  inject,
  onMounted,
  getCurrentInstance,
  watch,
  onBeforeMount,
} from "vue";
// import { useRoute, useRouter } from "vue-router";
import { TableLoadingData } from "@c/table/tableLoadingData";
import { common } from "@/api/common.js";
import { GetList } from "@/api/news";

export default {
  name: "ConsoleIndex",
  setup() {
    //获取上下文实例，ctx=vue2的this
    // const { ctx } = getCurrentInstance();
    const { tableDatas, tableLoadData } = TableLoadingData();
    const {
      getInfoCategory,
      allCategory,
      infoCategory,
      getCategoryAll,
    } = common();

    let option1 = ref({
      legend: {
        top: "bottom",
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      series: [
        {
          name: "分类",
          type: "pie",
          radius: [40, 170],
          center: ["50%", "50%"],
          roseType: "area",
          itemStyle: {
            borderRadius: 8,
          },
          data: [
            //默认数据
            { value: 40, name: "1" },
            { value: 38, name: "2" },
            { value: 32, name: "3" },
            { value: 30, name: "4" },
            { value: 28, name: "5" },
            { value: 26, name: "6" },
            { value: 22, name: "7" },
            { value: 18, name: "8" },
          ],
        },
      ],
    });

    const cateData = ref([]);
    const infoData = ref([]);
    const userData = ref([]);
    const optionValue = ref([]);

    // const echartDom = ref(null);
    // console.log(echartDom);
    // console.log(ctx);

    let echarts = inject("ec"); //引入

    let myChart;

    onBeforeMount(() => {
      getData();
    });

    onMounted(() => {
      // 基于准备好的dom，初始化echarts实例
      // myChart = ctx.$echarts.init(document.getElementById("main"));
      myChart = echarts.init(document.getElementById("main"));
      // console.log(myChart);

      option1.value && myChart.setOption(option1.value);
    });

    watch(
      () => infoCategory.item,
      (newVal) => {
        // console.log(newVal);
        // console.log(option1.value.series[0].data);
        let cateArr = [];
        newVal.forEach((item) => {
          cateArr.push({
            value: 0,
            name: item.category_name,
          });
        });
        // console.log(cateArr);
        cateData.value = cateArr;
        option1.value.series[0].data = cateData.value;
        // console.log(option1.value.series[0].data);
        option1.value && myChart.setOption(option1.value);
      }
    );
    watch(
      () => infoData.value,
      (newVal) => {
        // console.log(newVal);
        // 处理信息列表数据数值
        infoDtataVal();
      }
    );
    watch(
      () => tableDatas.item,
      (newVal) => {
        // console.log(newVal);
        // console.log(tableDatas);
        userData.value = tableDatas.item;
      }
    );

    // 处理信息列表数据数值
    const infoDtataVal = () => {
      // console.log(cateData.value);
      // console.log(infoCategory.item);
      // console.log(infoData.value);
      if (cateData.value) {
        let arr = [];
        infoCategory.item.forEach((cateItem) => {
          // console.log(cateItem.id);
          let obj = {
            count: 0,
            name: cateItem.category_name,
          };
          infoData.value.forEach((item) => {
            item.categoryId == cateItem.id ? obj.count++ : "";
          });
          arr.push(obj);
        });
        optionValue.value = arr;
        // console.log(arr);
        // 替换数值
        replaceValue(arr);
      }
    };

    // 替换数值
    const replaceValue = (arr) => {
      arr.forEach((val) => {
        // console.log(val);
        cateData.value.forEach((cate) => {
          // if (cate.value)
          if (val.name === cate.name) {
            cate.value = val.count * 20 + 20;
            // console.log(cate);
          }
        });
      });

      myChart.setOption(option1.value);
    };

    // 获取数据
    const getData = () => {
      let req = {
        url: "getUserList", //用户列表请求接口
        method: "post",
        data: { pageNumber: 1, pageSize: 10 },
      };
      // 分类数据
      getInfoCategory();

      // 用户数据
      tableLoadData(req);

      // 信息数据
      GetList(req.data)
        .then((res) => {
          let data = res.data.data.data;
          // console.log(data);
          infoData.value = data;
        })
        .catch((err) => {});
    };

    return {
      // echartDom,
    };
  },
};
</script>
<style lang="scss" scoped>
.ConsoleIndex {
  padding: 30px;
  height: 530px;
  background-color: #fbfafa;
  h3 {
    padding: 10px;
    font-size: 24px;
    color: #000;
  }
}
#main {
  margin: auto;
  width: 600px;
  height: 480px;
  // @include webkit(transform, scale(0.8));
  // background-color: aquamarine;
}
</style>
