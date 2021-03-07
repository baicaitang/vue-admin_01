<template>
  <div>
    <el-dialog
      title=""
      v-model="dialog_info_flag"
      @close="close"
      :width="580"
      @opened="openDialog"
    >
      <el-form :model="form" ref="dialog_form" :rules="rules_datas.rules">
        <el-form-item
          label="用户邮箱:"
          :label-width="formLabelWidth"
          prop="username"
        >
          <el-input
            v-model="form.username"
            placeholder="请输入用户邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="密码:"
          :label-width="formLabelWidth"
          prop="password"
        >
          <el-row :gutter="20">
            <el-col :span="16">
              <el-input
                v-model="form.password"
                :placeholder="passText"
                :disabled="editPass"
              ></el-input>
            </el-col>
            <el-col :span="8">
              <el-button
                type="success"
                @click="editPassActive"
                :disabled="isPass"
                >修改密码</el-button
              >
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item
          label="真实姓名:"
          :label-width="formLabelWidth"
          prop="truename"
        >
          <el-input
            :disabled="truenameDisabled"
            v-model="form.truename"
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="手机号:"
          :label-width="formLabelWidth"
          prop="phone"
        >
          <el-input
            v-model.number="form.phone"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <!-- 选择地区 -->
        <el-form-item label="地区:" :label-width="formLabelWidth" prop="region">
          <!--vue2.X @update:cityPickerData="city_picker_data = $event" -->
          <CityPicker
            v-model="city_picker_data"
            :cityPickerData="cityPickerData"
            :type="type"
            :cityLevel="['province', 'city', 'area', 'street']"
          >
          </CityPicker>
        </el-form-item>

        <el-form-item
          label="是否启用:"
          :label-width="formLabelWidth"
          prop="status"
        >
          <el-radio v-model="roleStatus" label="1">禁用</el-radio>
          <el-radio v-model="roleStatus" label="2">启用</el-radio>
        </el-form-item>

        <el-form-item label="角色:" :label-width="formLabelWidth" prop="role">
          <el-checkbox-group v-model="roleCheckList">
            <el-checkbox
              v-for="item in roleItem"
              :key="item"
              :label="item.role"
              >{{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <!-- 按钮权限  -->
        <el-form-item label="权限:" :label-width="formLabelWidth" prop="perm">
          <template v-if="btnPerm.length > 0">
            <div v-for="item in btnPerm" :key="item">
              <h4>{{ item.name }}:</h4>
              <template v-if="item.perm && item.perm.length > 0">
                <el-checkbox-group v-model="permCheckList">
                  <el-checkbox
                    v-for="btn in item.perm"
                    :key="btn"
                    :label="btn.value"
                  >
                    {{ btn.name }}
                  </el-checkbox>
                </el-checkbox-group>
              </template>
            </div>
          </template>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close">取 消</el-button>
          <el-tooltip :content="cont" placement="top">
            <el-button type="danger" :loading="submit_loading" @click="submit">
              确 定
            </el-button>
          </el-tooltip>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { ref, reactive, watch, onMounted, toRefs } from "vue";
import CityPicker from "@/component/cityPicker/index";
import { ElMessage } from "element-plus";
import { getRole } from "@/api/user";
import { userEdit, AddUser } from "@/api/user.js";
import { getSystem, permButton } from "@/api/login.js";
import {
  stripscript,
  validate_email,
  validate_password,
} from "@/utils/validate.js";
// 加密
import sha1 from "js-sha1";
export default {
  name: "Dialog",
  props: {
    flag: {
      //是否显示弹框
      type: Boolean,
      default: false,
    },
    editUserDatas: {
      //编辑用户数据
      type: Object,
      fefault: () => {},
    },
    type: {
      //判断添加用户按钮&编辑按钮
      type: String,
      deault: "",
    },
    switchStatus: {
      // 禁用启用按钮数据
      type: String,
      default: "",
    },
    editId: {
      type: String,
      default: "",
    },
    refreshList: {
      type: Boolean,
      default: false,
    },
  },
  // 城市联动组件
  components: { CityPicker },
  setup(props, { emit }) {
    // 表单dom
    const dialog_form = ref();
    /**
     * 用户邮箱验证
     */
    let validateUsername = (rule, value, callback) => {
      if (!value) {
        submit_loading.value = false;

        return callback(new Error("用户邮箱不能为空"));
      } else if (validate_email(value)) {
        submit_loading.value = false;

        callback(new Error("用户邮箱格式不正确"));
      } else {
        callback();
      }
    };
    /**
     * 密码验证
     */
    let validatePass = (rule, value, callback) => {
      if (props.type === "edit" && editPass.value) {
        callback();
      }
      if (value === "") {
        submit_loading.value = false;
        callback(new Error("密码不能为空"));
      } else if (stripscript(value) !== value) {
        submit_loading.value = false;

        callback(new Error("密码不能含有特殊字符"));
      } else if (validate_password(value)) {
        submit_loading.value = false;

        callback(new Error("密码必须为6-20位的数字与字母"));
      } else {
        callback();
      }
    };

    // 响应数据
    const form_data = reactive({
      form: {
        username: "",
        password: "",
        truename: "",
        phone: "",
        region: {},
        status: "",
        role: [],
        btnPerm: [],
      },
      formLabelWidth: "80px",
      btnPerm: [],
    });
    // 表单校验规则：用户名、密码、角色
    const rules_datas = reactive({
      rules: {
        username: [{ validator: validateUsername, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
        // role: [{ required: true, message: "请选择角色", trigger: "change" }],
      },
    });

    const city_picker_data = ref({}); //城市联动数据
    const cityPickerData = ref({});
    const roleStatus = ref(""); //禁用启用
    const roleCheckList = ref(["sale"]); //当前选中的角色
    const roleItem = ref([]); //用户可选角色
    const dialog_info_flag = ref(false); //弹框出现关闭状态,false关闭
    const submit_loading = ref(false); //确认按钮加载状态
    const passText = ref("请输入密码"); //编辑弹框input输入提示文本
    const editPass = ref(true); //编辑弹框显示可修改密码按钮
    const isPass = ref(false); //默认禁止修改密码
    const truenameDisabled = ref(false);
    const permCheckList = ref(["info.edit"]);
    const cont = ref("确认后真实姓名不可修改");

    const form_datas = toRefs(form_data);

    onMounted(() => {
      // console.log(form_data.form);
    });

    // 监听
    watch(
      () => props.flag,
      () => {
        /**
         * 当弹框消失：组件重置
         * 弹框消失：dialog_info_flag.value = false
         * 弹框出现：dialog_info_flag.value = true
         */
        dialog_info_flag.value = props.flag;
        // console.log(props.flag);
        // if (!props.flag) emit("update:refreshList", true);

        resetField();
      }
    );
    watch(
      () => city_picker_data.value,
      (newVal) => {
        /**
         * 城市联动数据变化：赋值给 form_data.form.region，页面响应
         */
        // console.log(city_picker_data.value);
        form_data.form.region = newVal;
      }
    );
    // watch(
    //   () => roleStatus.value,
    //   (newVal) => {
    //     // 启用禁用
    //     // console.log(newVal);
    //     // 返回数据
    //     // emit("update:switchStatus", roleStatus.value);
    //   }
    // );
    watch(
      () => permCheckList.value,
      (newVal) => {
        // console.log(newVal);
        // console.log(roleCheckList.value);
        if (roleCheckList.value.length === "" || permCheckList.value === "") {
          roleCheckList.value = ["sale"];
          permCheckList.value = ["info.edit"];
        }
      }
    );

    /**
     * 点击关闭弹框:重置数据
     * 弹框消失：dialog_info_flag.value = false
     * 向父组件返回弹框类型和弹框状态：type : "" , flag : false
     */
    const close = () => {
      dialog_info_flag.value = false;
      roleCheckList.value = ["sale"];
      permCheckList.value = ["info.edit"];
      // 向父级传递数据
      emit("update:type", "");
      emit("update:flag", false);
      resetField();
    };

    // 弹框打开后
    const openDialog = () => {
      // 获取所有可选角色
      getUserRole();
      // 移除表单校验结果
      dialog_form.value.clearValidate();
      /**
       * 弹框初始数据处理
       * 1、编辑用户：
       * props.type === "edit" 点击的是编辑用户
       * 编辑弹框显示选中用户数据 editData
       *
       * 2、添加用户：
       * props.type === "add" 点击的是同级用户
       */
      // 从父组件获取用户数据
      let editData = props.editUserDatas;

      if (props.type === "edit") {
        //编辑
        // 移除表单校验结果
        dialog_form.value.clearValidate();
        editPass.value = true;
        isPass.value = false; //修改密码按钮启用
        roleStatus.value = editData.status;
        truenameDisabled.value = true;
        // cont.value = "";
        passText.value = "请输入修改密码";
        //将角色数据进行转换：字符串转为数组
        let role = editData.role.split(",");
        // console.log(role);
        let perm = editData.btnPerm.split(","); //按钮权限
        // editData.btnPerm = perm ? perm : [];

        // 遍历响应数据
        for (let key in editData) {
          form_data.form[key] = editData[key];
        }
        // 渲染城市数据
        let regionJSon = JSON.parse(form_data.form.region);
        cityPickerData.value = regionJSon;
        // console.log(regionJSon);
        // 处理编辑用户方法
        handleEditUser(role, perm);
      } else if (props.type === "add") {
        //添加
        // 移除表单校验结果
        dialog_form.value.clearValidate();
        editPass.value = false;
        isPass.value = true; //修改密码按钮禁用
        passText.value = "请输入密码";
        truenameDisabled.value = false;
        // console.log(permCheckList.value);
        permCheckList.value = ["info:edit"];
        roleCheckList.value = ["sale"];
        roleStatus.value = "2"; //默认启用
        // 遍历响应数据为空
        for (let key in editData) {
          form_data.form[key] = "";
        }
        // 渲染城市数据

        cityPickerData.value = {};
        // console.log(form_data.form);
      }
    };

    // 编辑
    const handleEditUser = (role, perm) => {
      // console.log(role);
      roleCheckList.value = role; //当前选中的角色
      // console.log(roleCheckList.value);
      permCheckList.value = perm;
      // console.log(form_data.form);
    };

    // 获取可选角色
    const getUserRole = () => {
      if (roleItem.value.length > 0 && form_data.btnPerm) return false;

      getRole()
        // getSystem()
        .then((res) => {
          // console.log(res);
          let data = res.data.data;
          // console.log(data);
          // let arr = [];
          // data.forEach((item) => {
          //   // arr.push(item.name);
          //   arr.push(item.role);
          // });
          // console.log(arr);
          roleItem.value = data;
        })
        .catch((err) => {});
      // 获取按钮权限
      permButton()
        .then((res) => {
          // console.log(res);
          form_data.btnPerm = res.data.data;
        })
        .catch((err) => {});
    };

    // 确认
    const submit = () => {
      submit_loading.value = true; //按钮加载开启
      // 请求数据修改
      form_data.form.role = roleCheckList;
      form_data.form.btnPerm = permCheckList;
      form_data.form.status = roleStatus.value;
      // console.log(roleCheckList.value.length);
      if (roleCheckList.value.length === 0) {
        ElMessage({
          message: "最少选择一个角色",
          type: "error",
        });
        submit_loading.value = false; //按钮加载关闭
        return false;
      }
      // console.log(form_data.form);
      // return false;
      // 验证表单
      dialog_form.value.validate((vaild) => {
        // console.log(vaild);
        if (vaild) {
          // console.log("验证通过");

          /**
           * 深拷贝： JSON.parse(JSON.stringify(form_data.form))) --> 先转字符串，再转json
           *          如果obj里有函数，undefined，则序列化的结果会把函数或 undefined丢失,
           *          如果obj里有NaN、Infinity和-Infinity，则序列化的结果会变成null
           * 浅拷贝：Object.assign({},form_data.form) --> 拷贝出来就是object
           */

          // 数据处理
          let reqData = Object.assign({}, form_data.form);
          // console.log(reqData);
          // console.log(reqData.role);
          // reqData.role = reqData.role.trim();
          reqData.role = reqData.role.join(",");
          reqData.btnPerm = reqData.btnPerm.join(",");
          // console.log(reqData.role);
          reqData.region = JSON.stringify(city_picker_data.value);
          // 用户手机号为数值
          reqData.phone = reqData.phone ? parseInt(reqData.phone) : "";

          if (props.type === "add") {
            // 添加用户弹框确认
            // 密码加密
            reqData.password = sha1(reqData.password);
            // console.log(reqData);
            // 添加用户
            addUserFun(reqData);
          } else if (props.type === "edit") {
            // 编辑用户弹框确认
            // 请求数据删除密码password的请求（password为可不传项）
            reqData.password
              ? (reqData.password = sha1(reqData.password))
              : delete reqData.password;

            // console.log(reqData);
            // 编辑用户
            editUserFun(reqData);
          }
        } else {
          // console.log("未验证通过");
          if (props.type === "add") {
            ElMessage({
              message: "请正确填写表单",
              type: "error",
            });

            // 重置表单
            resetField();
          } else if (props.type === "edit") {
            // console.log(form_data.form.password);
            ElMessage({
              message: "请正确填写表单",
              type: "error",
            });
          }
          // dialog_info_flag.value = true;

          return false;
        }
      });
    };

    // 添加用户方法
    const addUserFun = (reqData) => {
      AddUser(reqData)
        .then((res) => {
          // console.log(res);
          ElMessage({
            message: res.data.message,
            type: "success",
          });
          submit_loading.value = false; //按钮加载关闭
          // resetField(); //重置表单
          close(); //关闭弹框

          // 刷新用户列表
          emit("update:refreshList", true);
        })
        .catch((err) => {
          submit_loading.value = false; //按钮加载关闭
        });
    };

    // 编辑用户方法
    const editUserFun = (reqData) => {
      userEdit(reqData)
        .then((res) => {
          // console.log(res);
          ElMessage({
            message: res.data.message,
            type: "success",
          });
          submit_loading.value = false;
          // 返回禁用启用按钮数据
          emit("update:editId", form_data.form.id);
          emit("update:switchStatus", roleStatus.value);
          // resetField();
          // roleCheckList.value = ["sale"];
          // permCheckList.value = ["info.edit"];
          close();
          // 刷新用户列表
          emit("update:refreshList", true);
        })
        .catch((err) => {
          submit_loading.value = false;
        });
    };

    // 修改密码按钮状态
    const editPassActive = () => {
      editPass.value = !editPass.value;
    };

    // 重置
    const resetField = () => {
      // 弹框初次出现dialog_form.value = undefined
      // console.log(dialog_form.value);
      // dialog_form.value.resetFields();
      form_data.form.username = "";
      form_data.form.password = "";
      form_data.form.truename = "";
      form_data.form.phone = "";
      form_data.form.region = {};
      form_data.form.status = "2";
      form_data.form.role = [];
      form_data.form.btnPerm = [];
      city_picker_data.value = {};
      // roleCheckList.value = ["sale"];
      // permCheckList.value = ["info.edit"];
    };

    return {
      // dom
      dialog_form,
      // ref
      city_picker_data,
      roleStatus,
      roleCheckList,
      roleItem,
      dialog_info_flag,
      submit_loading,
      passText,
      editPass,
      isPass,
      cityPickerData,
      truenameDisabled,
      permCheckList,
      cont,
      // reactive
      ...form_datas,
      rules_datas,
      // methods
      openDialog,
      close,
      editPassActive,
      submit,
    };
  },
};
</script>
<style lang="scss" scoped>
</style>