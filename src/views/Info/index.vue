<template>
  <div class="ConsoleIndex">
    <el-form
      :inline="true"
      class="demo-form-inline"
      style="padding-bottom: 20px"
    >
      <el-row :gutter="15">
        <el-col :span="4">
          <div class="sel-wrap category">
            <label for="">分类：</label>
            <div class="wrap-content">
              <el-select
                v-model="cate_value"
                placeholder="请选择"
                style="width: 100%"
              >
                <template v-if="options.category.length !== 0">
                  <el-option
                    v-for="item in options.category"
                    :key="item.id"
                    :label="item.category_name"
                    :value="item.id"
                  >
                  </el-option>
                </template>
                <template else>
                  <el-option label="" value=""> </el-option>
                </template>
              </el-select>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="sel-wrap date">
            <label for="">日期：</label>
            <div class="wrap-content">
              <el-date-picker
                v-model="date_val"
                type="datetimerange"
                format="YYYY-MM-DD HH:mm:ss"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="defaultTime"
              >
              </el-date-picker>
            </div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="sel-wrap key-word">
            <label for="">关键字：</label>
            <div class="wrap-content">
              <el-select v-model="search_key" style="width: 90px">
                <el-option
                  v-for="item in searchOption"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </el-col>
        <el-col :span="3" style="margin-left: 20px">
          <el-input
            style="width: 100%"
            v-model="search_keyword"
            placeholder="请输入内容"
          ></el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="danger" style="width: 100%" @click="search"
            >搜索</el-button
          >
        </el-col>
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="2">
          <el-button
            type="danger"
            style="width: 100%"
            class="add_btn"
            @click="alert_dialog"
            :disabled="!$btnPerm('info.add')"
            >新增</el-button
          >
        </el-col>
      </el-row>
    </el-form>
    <el-skeleton :rows="6" animated v-if="skeletonAnimated"> </el-skeleton>
    <!-- v-loading="loadingData" -->
    <el-table
      v-if="!skeletonAnimated"
      :data="tableData.item"
      border
      fit
      style="width: 100%"
      class="space-bottom infoIndex-table-th"
      ref="deleteDom"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50"> </el-table-column>
      <el-table-column prop="title" label="标题" width="300"> </el-table-column>
      <el-table-column prop="categoryName" label="类别" width="130">
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="日期"
        width="238"
        :formatter="toDate"
      >
      </el-table-column>
      <el-table-column prop="user" label="管理员" width="115">
      </el-table-column>
      <el-table-column label="操作" width="352">
        <template #default="scope">
          <el-button
            type="danger"
            size="mini"
            @click="deleteItem(scope.row.id)"
            :disabled="!$btnPerm('info.delete')"
          >
            删除
          </el-button>
          <el-button
            type="success"
            size="mini"
            @click="editInfo_dialog(scope.row.id)"
            :disabled="!$btnPerm('info.edit')"
          >
            编辑
          </el-button>
          <el-button
            type="success"
            size="mini"
            @click="toInfoDetail(scope.row)"
            :disabled="!$btnPerm('info.detailed')"
          >
            编辑详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-row>
      <el-col :span="12">
        <el-button
          size="medium"
          @click="deleteAll"
          ref="deleteAllDom"
          :disabled="!$btnPerm('info.batchDel')"
          >批量删除</el-button
        >
        <el-button size="medium" type="success" @click="refresh()"
          >刷新</el-button
        >
        <!-- <el-button
          size="medium"
          type="success"
          v-btnPerm="'info.del'"
          @click="refresh()"
          >自定义
        </el-button> -->
      </el-col>
      <el-col :span="12">
        <el-pagination
          class="pull-right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 新增对话框 -->
    <!-- .sync修饰符  -->
    <InfoDialog
      v-model:flag.sync="dialog_info"
      :category="options.category"
      @refreshList="getList()"
    ></InfoDialog>
    <!-- 编辑对话框 -->
    <EditDialog
      v-model:flag.sync="dialog_info_edit"
      :category="options.category"
      :id="editId"
      @refreshList="getList()"
    ></EditDialog>
  </div>
</template>
<script>
import { reactive, toRefs, ref, onMounted, watch, onBeforeMount } from "vue";
import InfoDialog from "./dialog/info";
import EditDialog from "./dialog/edit";
import { useRouter } from "vue-router";
// 全局方法
import { global } from "@/utils/global.js";
// 全局api
import { common } from "@/api/common.js";
import { useStore } from "vuex";
import { GetList, DeleteInfo } from "@/api/news";
import { timestampToTime, dateToMs } from "@/utils/common";
import { ElMessage } from "element-plus";
export default {
  name: "InfoIndex",
  components: { InfoDialog, EditDialog },
  setup(props, context) {
    // 全局方法
    const { messageBox } = global();

    const {
      getInfoCategory,
      allCategory,
      infoCategory,
      getCategoryAll,
    } = common();

    // vuex
    const store = useStore();
    const router = useRouter();

    // 选项数据
    const data1 = reactive({
      cate_value: "",
    });
    const options = reactive({
      category: [],
    });
    const data2 = reactive({
      date_val: "",
      defaultTime: [
        new Date(2020, 1, 1, 12, 0, 0),
        new Date(2020, 2, 1, 8, 0, 0),
      ], // '12:00:00', '08:00:00'
    });
    const data3 = reactive({
      search_key: "id",
      searchOption: [
        { value: "id", label: "ID" },
        { value: "title", label: "标题" },
      ],
    });
    // 表格数据
    const tableData = reactive({
      item: [
        // 示例数据
        {
          categoryId: "9988",
          categoryName: "体育",
          content:
            "哈哈哈哈哈哈哈哈哈哈或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或",
          createDate: "1614450500",
          user: "admin",
          id: "3280",
          imgUrl: "",
          status: null,
          title: "示例数据",
        },
      ],
    });
    const page = reactive({
      pageNumber: 1,
      pageSize: 10,
    });

    const search_keyword = ref("");
    const currentPage = ref(1);
    const dialog_info = ref(false);
    const dialog_info_edit = ref(false);
    const total = ref(1); //默认数据1
    const loadingData = ref(false);
    const delId = ref("");
    const editId = ref("");
    const skeletonAnimated = ref(true); //骨架屏

    // Dom
    let deleteDom = ref("");
    let deleteAllDom = ref("");

    onBeforeMount(() => {
      getList();
    }),
      /**
       * 页面dom元素实例完成
       */
      onMounted(() => {
        // 数据渲染
        if (tableData.item.length) {
          total.value = tableData.item.length;
        }
        // 获取列表
        getList();

        // 获取分类：
        /**方法二：全局api */
        getInfoCategory();
        // getCategoryAll();
        /**方法三：vuex */
        // store
        //   .dispatch("common/getInfoCategory")
        //   .then((res) => {
        //     options.category = res.data.data.data;
        //   })
        //   .catch((err) => {});
        options.category = infoCategory.item;
      });
    /**
     * 监听
     */
    watch(
      // () => allCategory.item,
      () => infoCategory.item,
      (value) => {
        options.category = value;
        // console.log(options.category);
        toCategory(options.category);
      }
    );

    //获取列表
    const getList = (ref) => {
      let data = formatData();
      if (ref) {
        data = ref;
        data1.cate_value = "";
        data2.date_val = "";
        // data3.search_key = "";
        search_keyword.value = "";
      }

      // console.log(data);
      // loadingData.value = true;//loading
      skeletonAnimated.value = true; //骨架屏
      GetList(data)
        .then((res) => {
          let data = res.data.data;
          // console.log(data);
          tableData.item = data.data;
          // 管理员
          let user = store.getters["app/roles"];
          // console.log(user[0]);
          tableData.item.forEach((item) => {
            item.user = user[0];
          });
          // console.log(tableData.item);

          toCategory(options.category);
          // console.log(data.total);
          total.value = data.total || 0;
          // loadingData.value = false;
          skeletonAnimated.value = false;
        })
        .catch((err) => {
          // loadingData.value = false;
          skeletonAnimated.value = false;
        });
    };

    // element-plus: formatter格式化
    const toDate = (row, column, cellValue, index) => {
      // console.log(timestampToTime(row.createDate));
      let date = timestampToTime(row.createDate);
      return date;
    };

    const toCategory = (cate) => {
      // console.log(cate);
      // console.log(tableData.item);

      let id = cate.filter((j) => j);

      for (let i = 0; i < tableData.item.length; i++) {
        let item = tableData.item[i];

        id.forEach((j) => {
          if (j.id == item.categoryId) {
            item.categoryName = j.category_name;
            return true;
          }
        });
      }

      // console.log(tableData.item);
    };

    // 删除
    const deleteItem = (id) => {
      // console.log(id);
      delId.value = [id];

      messageBox({
        content: "确认删除数据，确认后将无法恢复！",
        tip: "警告",
        fn: confirmDelFn,
      });
    };

    // 批量删除
    const deleteAll = () => {
      if (!delId.value || delId.value.length == 0) {
        ElMessage({
          message: "请选择需要删除的数据",
          type: "error",
        });
        return false;
      }
      messageBox({
        content: "确认删除选择的数据，确认后将无法恢复！",
        tip: "警告",
        fn: confirmDelFn,
      });
    };

    //确认删除
    const confirmDelFn = () => {
      DeleteInfo({ id: delId.value })
        .then((res) => {
          console.log(res);
          ElMessage({
            message: res.data.message,
            type: "success",
          });
          getList();
          delId.value = "";
        })
        .catch((err) => {});
    };

    const handleSelectionChange = (val) => {
      // console.log(val);
      let id = val.map((item) => item.id);
      // console.log(id);
      delId.value = id;
    };

    // 请求数据
    // let requestData = {
    // categoryId: "",
    // startTiem: "",
    // endTime: "",
    // title: "",
    // id: "",
    // pageNumber: page.pageNumber,
    // pageSize: page.pageSize,
    // };
    const formatData = () => {
      let requestData = {
        pageNumber: page.pageNumber || 1,
        pageSize: page.pageSize,
      };
      // 分类Id
      if (data1.cate_value) {
        requestData.categoryId = data1.cate_value;
      }
      // 日期
      let date = dateConversion();
      if (date.length > 0) {
        requestData.startTime = date[0];
        requestData.endTime = date[1];
      }
      // 关键字
      // id:"3251"
      // title:"kjfdghkhgk"
      requestData[data3.search_key] = search_keyword.value;

      return requestData;
    };

    const search = () => {
      // let requestData = formatData();
      // console.log(requestData);

      getList();
    };

    // 日期转换
    const dateConversion = () => {
      let arr = [];
      let date = data2.date_val;
      // console.log(date);
      if (!date === "") {
        date.forEach((item) => {
          let date1 = dateToMs(item);
          let date2 = timestampToTime(date1);
          arr.push(date2);
        });
      }

      return arr;
    };

    // 分页操作
    const handleSizeChange = (val) => {
      // console.log(`每页 ${val} 条`);
      page.pageSize = val;
      getList();
    };
    const handleCurrentChange = (val) => {
      // console.log(`当前页: ${val}`);
      page.pageNumber = val;
      getList();
    };

    // 弹出对话框
    const alert_dialog = () => {
      dialog_info.value = true;
    };

    const editInfo_dialog = (id) => {
      // console.log(id);
      editId.value = id;
      dialog_info_edit.value = true;
    };

    const toInfoDetail = (row) => {
      let params = {
        id: row.id,
        title: row.title,
      };
      // console.log(row);
      // store.commit("infoDetail/SET_ID", row.id);
      // store.commit("infoDetail/SET_TITLE", row.title);
      store.commit("infoDetail/UPDATE_STATE_VALUE", {
        id: {
          value: row.id,
          sessionKey: "infoId",
          session: true,
        },
        title: {
          value: row.title,
          sessionkey: "infoTitle",
          session: true,
        },
      });

      router.push({
        name: "InfoDetail",
        params: params,
      });
    };

    const refresh = () => {
      let req = {
        user: "",
        categoryId: "",
        startTiem: "",
        endTime: "",
        title: "",
        id: "",
        pageNumber: page.pageNumber,
        pageSize: page.pageSize,
      };

      getList(req);
    };

    return {
      //reactive
      ...toRefs(data1),
      ...toRefs(data2),
      ...toRefs(data3),
      options,
      tableData,
      //ref
      search_keyword,
      currentPage,
      dialog_info,
      dialog_info_edit,
      total,
      // loadingData,
      editId,
      skeletonAnimated,
      //dom
      deleteDom,
      deleteAllDom,
      // methods
      handleSizeChange,
      deleteItem,
      handleCurrentChange,
      alert_dialog,
      deleteAll,
      toDate,
      toCategory,
      handleSelectionChange,
      search,
      editInfo_dialog,
      getList,
      refresh,
      toInfoDetail,
    };
  },
};
</script>
<style lang="scss" scoped>
.ConsoleIndex {
  padding: 20px;
}
.add_btn {
  float: right;
}
.space-bottom {
  margin-bottom: 30px;
}
.sel-wrap {
  label {
    float: left;
    line-height: 40px;
    width: 60px;
  }
  .wrap-content {
    margin-left: 80px;
  }

  &.category {
    @include selDom(left, 60, 40);
  }

  &.date {
    @include selDom(left, 60, 40);
  }

  &.key-word {
    @include selDom(left, 70, 40);
  }
}
</style>
