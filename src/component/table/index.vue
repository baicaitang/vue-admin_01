<template>
  <div class="tableIndex">
    <el-table
      :data="tableData"
      ref="tableRoot"
      border
      style="width: 100%"
      class="userIndex-table-th space-bottom"
      @selection-change="handleSelectionChange"
    >
      <!-- 多选框 -->
      <el-table-column v-if="tableConfig.selection" type="selection" width="50">
      </el-table-column>
      <!-- 文本数据 -->
      <template v-for="item in tableConfig.tHead" :key="item.filed">
        <!-- <template v-if="item.columnType === 'slot'"> -->
        <el-table-column
          :label="item.label"
          :width="item.width"
          :prop="item.filed"
          v-if="item.columnType === 'slot'"
        >
          <template #default="scope">
            <slot :name="item.slotname" :data="scope.row"></slot>
          </template>
        </el-table-column>
        <!-- </template> -->
        <el-table-column
          v-else
          :label="item.label"
          :width="item.width"
          :prop="item.filed"
        >
        </el-table-column>
      </template>
    </el-table>
    <el-row>
      <el-col :span="12">
        <!-- 批量删除 -->
        <slot name="tableFooterData"></slot>
        <el-button size="medium" type="success" @click="refresh()"
          >刷新</el-button
        >
      </el-col>
      <!-- 分页操作 -->
      <el-col :span="12">
        <el-pagination
          class="pull-right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { reactive, toRefs, ref, onMounted, watch, onBeforeMount } from "vue";
// import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
// 全局方法
import { global } from "@/utils/global.js";
import { TableLoadingData } from "./tableLoadingData";
import { RecordPage } from "./recordPage";
import { PaginationHook } from "./paginationHook";
// import tableLoadDataMixin from "@/mixins/tableLoadData";
export default {
  name: "TableIndex",
  props: {
    config: {
      type: Object,
      default: () => {},
    },

    modelValue: Object,
  },
  //   data() {
  //     return {
  //       table_Config: {
  //         tHead: [], //表头
  //         selection: true, //多选框是否显示
  //         recordPage: false, //记录翻页
  //         pagination: false, //分页
  //         requestData: {}, //请求数据
  //       },
  //       Data: [],
  //     };
  //   },
  //混入
  //   mixins: [tableLoadDataMixin],
  setup(props, { emit }) {
    // 全局方法
    const { messageBox } = global();
    // vuex
    const store = useStore();
    const router = useRouter();
    // 数据加载
    const tableRoot = ref(null);
    const {
      //   tableData,
      //   totals,
      tableDatas,
      tableLoadData,
    } = TableLoadingData(tableRoot);

    const datas = toRefs(tableDatas);

    // 分页记录
    const {} = RecordPage();
    // 页码
    const {
      pageData,
      handleSizeChange,
      handleCurrentChange,
    } = PaginationHook();

    // 组件变量
    const table_data = reactive({
      tableConfig: {
        tHead: [], //表头
        selection: true, //多选框是否显示
        recordPage: false, //记录翻页
        pagination: false, //分页
        requestData: {}, //请求数据
      },
      tableData: [
        {
          //示例数据
          id: "343",
          btnPerm: "",
          username: "小白",
          truename: "李白",
          phone: "121425352",
          region: "广东",
          role: "示例数据",
          status: "1",
        },
      ],
    });
    const page = reactive({
      pageNumber: 1,
      pageSize: 10,
    });
    const currentPage = ref(1);
    const total = ref(0);
    const pageSize = ref(10);
    const pageSizes = ref([10, 20, 30, 40]);

    const table_datas = toRefs(table_data);

    onBeforeMount(() => {
      initTable();
      //   加载数据
      tableLoadData(table_data.tableConfig.requestData);
    });

    onMounted(() => {
      //   console.log(table_data.tableData);
      handleTotal();
    });

    // 表单数据监听
    watch(
      [() => tableDatas.item, () => tableDatas.total_data],
      ([tableItem, tableTotal]) => {
        table_data.tableData = tableItem;
        total.value = tableTotal;
        // console.log(table_data.tableData);
      }
    );
    // 页码监听
    watch(
      [() => pageData.currentPage, () => pageData.pageSize],
      ([current_page, page_size]) => {
        // console.log(table_data.tableConfig.requestData);
        let reqData = table_data.tableConfig.requestData.data;
        if (reqData) {
          reqData.pageNumber = current_page;
          pageSize.pageSize = page_size;
        }
        //   加载数据
        tableLoadData(table_data.tableConfig.requestData);
        // console.log(reqData);
      }
    );

    // 初始化table
    const initTable = () => {
      let config = props.config;
      let keys = Object.keys(table_data.tableConfig); // [' tHead','selection'...]

      for (let key in config) {
        // ["a", "b", "c"].includes("a"); ----> true
        if (keys.includes(key)) {
          table_data.tableConfig[key] = config[key];
        }
      }
      //   console.log(table_data.tableConfig);
    };

    // 总页数
    const handleTotal = () => {
      currentPage.value = pageData.currentPage;
      total.value = pageData.total;
      pageSize.value = pageData.pageSize;
      pageSizes.value = pageData.pageSizes;
    };

    // 多选框
    const handleSelectionChange = (val) => {
      //   console.log(val);
      let id = val.map((item) => item.id);
      //   console.log(id);
      //   console.log(props.tableRow);
      // 返回父组件数据
      emit("update:modelValue", id);
    };

    // 刷新
    const refresh = () => {
      //   重新加载数据
      tableLoadData(table_data.tableConfig.requestData);
    };

    return {
      tableRoot,
      ...table_datas,
      currentPage,
      total,
      pageSize,
      pageSizes,
      //   methods
      handleSelectionChange,
      handleSizeChange,
      handleCurrentChange,
      refresh,
    };
  },
};
</script>
<style lang="scss" scoped>
.space-bottom {
  margin-bottom: 30px;
}
</style>