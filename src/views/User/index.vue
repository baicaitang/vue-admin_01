<template>
  <div class="userIndex">
    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :span="5">
        <div class="sel-wrap wordKey">
          <label>关键字：</label>
          <div class="wrap-content">
            <el-select v-model="wordKey" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="sel-wrap search">
          <el-input
            v-model="search_keyword"
            placeholder="请输入内容"
          ></el-input>
        </div>
      </el-col>
      <el-col :span="2">
        <el-button type="danger" @click="search">搜索</el-button>
      </el-col>
      <el-col :span="13">
        <el-button type="danger" class="pull-right" @click="addUser"
          >添加用户</el-button
        >
      </el-col>
    </el-row>
    <!-- 表单组件 -->
    <Table :config="ConfigTable" v-model="tableRow" ref="userTable">
      <template v-slot:status="slotData">
        <!-- 禁用/启用插槽 -->
        <!-- {{ slotData.data.status }} -->
        <el-switch
          v-model="slotData.data.status"
          active-value="2"
          inactive-value="1"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="handleSwitch(slotData.data)"
        >
        </el-switch>
      </template>
      <template v-slot:operation="slotData">
        <!-- 删除编辑插槽 -->
        <el-button type="success" size="mini" @click="handleEdit(slotData.data)"
          >编辑</el-button
        >
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(slotData.data)"
          >删除</el-button
        >
      </template>
      <template v-slot:tableFooterData>
        <!-- 批量删除插槽 -->
        <el-button size="medium" @click="deleteAll" ref="deleteAllDom"
          >批量删除</el-button
        >
      </template>
    </Table>
    <Add
      v-model:flag.sync="dialog_add"
      v-model:type.sync="type"
      v-model:switchStatus.sync="switchStatus"
      v-model:editId.sync="editId"
      :editUserDatas="editUserData"
      @refreshList="refresh()"
    ></Add>
  </div>
</template>
<script>
import { reactive, toRefs, ref, onMounted, watch } from "vue";
import { deleteUser, userActive } from "@/api/user.js";
import Add from "./dialog/add";
import { ElMessage } from "element-plus";
// 全局方法
import { global } from "@/utils/global.js";
import Table from "@c/table/index.vue";
export default {
  name: "UserIndex",
  components: { Table, Add },
  setup() {
    // 全局方法
    const { messageBox } = global();

    const user_data = reactive({
      wordKey: "邮箱/用户名",
      search_keyword: "", //搜素关键字
      options: [
        { value: 1, label: "真实姓名" },
        { value: 2, label: "邮箱/用户名" },
        { value: 3, label: "手机号" },
        { value: 4, label: "地区" },
        { value: 5, label: "角色" },
        { value: 6, label: "禁用/启用" },
      ], //选项数据
      tableData: [], //列表数据
      dialog_add: false, //弹框状态
    });
    // 配置表单
    const ConfigTable = {
      tHead: [
        {
          label: "邮箱/用户名",
          filed: "username",
          width: "220",
        },
        {
          label: "真实姓名",
          filed: "truename",
          width: "150",
        },
        {
          label: "手机号",
          filed: "phone",
          width: "183",
        },
        {
          label: "地区",
          filed: "region",
          width: "150",
        },
        {
          label: "角色",
          filed: "role",
          width: "130",
        },
        {
          label: "禁用/启用",
          filed: "status",
          width: "100",
          columnType: "slot",
          slotname: "status",
        },
        {
          label: "操作",
          width: "186",
          columnType: "slot",
          slotname: "operation",
        },
      ],
      selection: true,
      recordPage: false,
      pagination: true,
      requestData: {
        url: "getUserList", //请求接口
        method: "post",
        data: { pageNumber: 1, pageSize: 10 },
      },
    };
    const tableRow = ref({}); //批量删除、删除数据id
    const delId = ref([]); //删除选项id
    const updateUserActiveStatus = ref(false); //阻止多次修改状态
    const editUserData = ref({}); //编辑用户数据
    const type = ref(""); //弹框类型
    const switchStatus = ref(""); //禁用启用按钮数据
    const editId = ref(""); //编辑数据id

    // 用户列表dom
    const userTable = ref(null);

    const user_datas = toRefs(user_data);

    onMounted(() => {
      // console.log(editId.value);
    });

    // 监听
    watch(
      () => tableRow.value,
      (newVal) => {
        // 监听删除数据Id
        // console.log(newVal);
        delId.value = newVal;
      }
    );
    watch(
      () => switchStatus.value,
      (newVal) => {
        // 监听禁用启用按钮数据
        // console.log(newVal);
        // console.log(editId.value);
        handleSwitch();
      }
    );

    // 搜索
    const search = () => {};

    // 添加用户
    const addUser = () => {
      type.value = "add";
      user_data.dialog_add = true;
    };

    // 编辑
    const handleEdit = (slotData) => {
      // 拷贝子组件赋值
      editUserData.value = Object.assign(slotData);
      // console.log(editUserData.value);
      type.value = "edit";
      user_data.dialog_add = true;
    };

    // 删除
    const handleDelete = (slotData) => {
      // console.log(slotData.id);
      delId.value = [slotData.id];
      messageBox({
        content: "确认删除选择的数据，确认后将无法恢复！",
        tip: "警告",
        fn: deleteUserFun,
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
        fn: deleteUserFun,
      });
    };

    const deleteUserFun = () => {
      deleteUser({
        id: delId.value,
      })
        .then((res) => {
          // console.log(res);
          ElMessage({
            message: res.data.message,
            type: "success",
          });
          refresh();
          delId.value = [];
        })
        .catch((err) => {});
    };

    // 禁用启用
    const handleSwitch = (val) => {
      // console.log(val.id);
      // console.log(editId.value);
      // console.log(switchStatus.value);
      // console.log("---");
      // 禁止页面初次加载调用该方法

      if (val && !val.id) return false;

      if ((!val && editId.value === "") || (!val && switchStatus.value === ""))
        return false;

      // 防止切换多次
      if (updateUserActiveStatus.value) return false;
      updateUserActiveStatus.value = true;

      let req;

      // 点击禁用启用按钮
      if (val.status) {
        console.log(val);
        req = {
          id: val.id,
          status: val.status,
        };
      }
      // console.log(switchStatus.value);
      // 弹框修改后
      if (editId.value && switchStatus.value) {
        req = {
          id: editId.value,
          status: switchStatus.value,
        };
      }

      console.log(req);

      userActive(req)
        .then((res) => {
          // console.log(res);
          // ElMessage({
          //   message: res.data.message,
          //   type: "success",
          // });
          updateUserActiveStatus.value = false;
          refresh();
        })
        .catch((err) => {
          updateUserActiveStatus.value = false;
        });
    };

    // 刷新
    const refresh = () => {
      // console.log(userTable.value);
      userTable.value.refresh();
    };

    return {
      userTable,
      ...user_datas,
      tableRow,
      ConfigTable,
      editUserData,
      type,
      switchStatus,
      editId,
      // methods
      search,
      addUser,
      handleEdit,
      handleDelete,
      deleteAll,
      refresh,
      handleSwitch,
    };
  },
};
</script>
<style lang="scss" scoped>
.userIndex {
  padding: 20px;
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

  &.wordKey {
    @include selDom(left, 70, 40);
  }

  &.search {
    @include selDom(left, 60, 40);
  }
}
</style>