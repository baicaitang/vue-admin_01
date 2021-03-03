<template>
  <div class="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          v-for="item in menuTab"
          :key="item.id"
          :class="{ current: item.current }"
          @click="switchTab(item)"
        >
          {{ item.txt }}
        </li>
      </ul>

      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="refruleForms"
        class="login-form"
      >
        <el-form-item label="邮箱" prop="username" class="login-label">
          <el-input
            type="text"
            v-model="ruleForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass" class="login-label">
          <el-input
            type="password"
            v-model="ruleForm.pass"
            maxlength="20"
            minlength="6"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="comfirmPass"
          v-show="model == 'register'"
          class="login-label"
        >
          <el-input
            type="password"
            v-model="ruleForm.comfirmPass"
            maxlength="20"
            minlength="6"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code" class="getcode login-label">
          <el-row :gutter="10">
            <el-col :span="14">
              <el-input
                v-model="ruleForm.code"
                maxlength="6"
                minlength="6"
              ></el-input>
            </el-col>
            <el-col :span="10"
              ><el-button
                type="success"
                :disabled="getCodeBtn"
                class="block"
                @click="getCode()"
                >{{ getCodeText }}</el-button
              >
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button
            :disabled="submitBtn"
            type="primary"
            class="block"
            @click="submitForm()"
            >{{ model === "login" ? "登录" : "注册" }}</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
// 加密
import sha1 from "js-sha1";
import {
  defineComponent,
  toRefs,
  reactive,
  ref,
  // getCurrentInstance,
} from "vue";
import { useRouter } from "vue-router";
import {
  stripscript,
  validate_email,
  validate_password,
  validate_code,
} from "@/utils/validate.js";
import { GetSms, Register } from "@/api/login.js";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";

export default defineComponent({
  name: "Login",

  setup() {
    // 引入的useRoute,useRouter 相当于vue2的 this.$route()，this.$router()
    // const route = useRoute();
    const router = useRouter();
    // vuex
    const store = useStore();

    /**
     * 自定义表单验证
     */
    /**
     * 用户邮箱验证
     */
    let validateUsername = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("邮箱不能为空"));
      } else if (validate_email(value)) {
        callback(new Error("邮箱格式不正确"));
      } else {
        callback();
      }
    };
    /**
     * 密码验证
     */
    let validatePass = (rule, value, callback) => {
      // console.log(stripscript(value));

      // 过滤密码特殊字符
      // ruleForm.pass = stripscript(value);
      // value = ruleForm.pass;

      if (value === "") {
        callback(new Error("密码不能为空"));
      } else if (stripscript(value) !== value) {
        callback(new Error("密码不能含有特殊字符"));
      } else if (validate_password(value)) {
        callback(new Error("密码必须为6-20位的数字与字母"));
      } else {
        callback();
      }
    };
    /**
     * 确认密码
     */
    let validateComfirmPass = (rule, value, callback) => {
      if (datas.model === "login") {
        callback();
      }
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (stripscript(value) !== value) {
        callback(new Error("密码不能含有特殊字符"));
      } else if (value != formData.ruleForm.pass) {
        callback(new Error("两次密码不相同"));
      } else {
        callback();
      }
    };
    /**
     * 验证码
     */
    let checkCode = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入验证码"));
      } else if (stripscript(value) !== value) {
        callback(new Error("验证码错误"));
      } else if (validate_code(value)) {
        return callback(new Error("验证码格式错误"));
      } else {
        callback();
      }
    };
    /**
     * 响应数据
     */
    const datas = reactive({
      menuTab: [
        { txt: "登录", current: true, type: "login" },
        { txt: "注册", current: false, type: "register" },
      ],
      model: "login",
      submitBtn: true,
      getCodeBtn: false,
      getCodeText: "获取验证码",
      timer: null,
    });
    /**
     * 表单数据
     */
    const formData = reactive({
      ruleForm: {
        username: "",
        pass: "",
        comfirmPass: "",
        code: "",
      },
      rules: {
        username: [{ validator: validateUsername, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        comfirmPass: [{ validator: validateComfirmPass, trigger: "blur" }],
        code: [{ validator: checkCode, trigger: "blur" }],
      },
    });

    const data = toRefs(datas);
    const form = toRefs(formData);

    /**
     *表单dom
     */
    let refruleForms = ref(null);

    /**
     * 表单提交
     */
    const submitForm = () => {
      clearInterval(datas.timer);
      datas.getCodeText = "获取验证码";
      // console.log(datas.model);

      refruleForms.value.validate((valid) => {
        if (valid) {
          if (datas.model === "register") {
            register();
          } else if (valid && datas.model === "login") {
            login();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };

    /**
     * 登录
     */
    const login = () => {
      let data = {
        username: formData.ruleForm.username,
        pass: sha1(formData.ruleForm.pass),
        code: formData.ruleForm.code,
      };

      store
        //命名空间
        .dispatch("login/login", data)
        .then((res) => {
          ElMessage({
            showClose: true,
            message: res.data.message,
            type: "success",
          });
          // 登录成功
          // 跳转到控制台
          router.push({ name: "Console", params: {} });
        })
        .catch((err) => {});
      // Login(data)
      //   .then((res) => {
      // ElMessage({
      //   showClose: true,
      //   message: res.data.message,
      //   type: "success",
      // });

      //     // 登录成功
      //     // 跳转到控制台
      //     router.push({ name: "Console", params: {} });
      //   })
      //   .catch((error) => {
      //     // console.log(error);
      //   });
    };

    /**
     * 注册
     */
    const register = () => {
      let data = {
        username: formData.ruleForm.username,
        pass: sha1(formData.ruleForm.pass),
        comfirmPass: formData.ruleForm.comfirmPass,
        code: formData.ruleForm.code,
        module: "register",
      };
      Register(data)
        .then((res) => {
          ElMessage({
            showClose: true,
            message: res.data.message,
            type: "success",
          });
          // 切换登录tab
          switchTab(datas.menuTab[0]);
        })
        .catch((error) => {});
    };

    /**
     * 获取验证码
     */
    const getCode = () => {
      if (formData.ruleForm.username === "") {
        ElMessage({
          showClose: true,
          message: "邮箱不能为空",
          type: "error",
        });
        return false;
      }

      if (validate_email(formData.ruleForm.username)) {
        ElMessage({
          showClose: true,
          message: "邮箱格式错误",
          type: "error",
        });
        return false;
      }

      // 修改获取按钮状态
      datas.getCodeBtn = true;
      datas.getCodeText = "发送中...";

      // 参数
      let data = {
        username: formData.ruleForm.username,
        model: datas.model,
      };

      setTimeout(() => {
        GetSms(data)
          .then((res) => {
            // console.log(route);
            // console.log(router);
            // console.log(res);
            ElMessage({
              showClose: true,
              message: res.data.message,
              type: "success",
            });

            // 倒计时
            // 启用登录注册按钮
            countDown(60);
          })
          .catch((error) => {
            console.log(error);
          });
      }, 1500);
    };

    /**
     * 登录注册按钮 切换
     */
    const switchTab = (item) => {
      datas.menuTab.forEach((e) => {
        e.current = false;
      });
      item.current = true;
      datas.model = item.type;

      resetForms();

      if (datas.timer) {
        clearInterval(datas.timer);
      }
      datas.submitBtn = true;
      datas.getCodeBtn = false;
      datas.getCodeText = "获取验证码";
    };

    // 重置表单
    const resetForms = () => {
      refruleForms.value.resetFields();
    };

    //跟新按钮状态
    // const updateBtn = ({ params }) => {
    //   datas.getCodeBtn = params.status;
    //   datas.getCodeText = params.text;
    // };

    // 倒计时
    const countDown = (num) => {
      if (datas.timer) {
        clearInterval(datas.timer);
      }
      datas.submitBtn = false;
      datas.getCodeBtn = false;

      datas.timer = setInterval(() => {
        num--;
        // console.log(num);
        if (num === 0) {
          clearInterval(datas.timer);
          datas.submitBtn = true;
          datas.getCodeText = "重新发送";
        } else {
          datas.getCodeText = `倒计时${num}秒`;
        }
      }, 1000);
    };

    return {
      ...data,
      ...form,
      switchTab,
      submitForm,
      refruleForms,
      getCode,
    };
  },
});
</script>
<style lang="scss" scoped>
.login {
  height: 100vh;
  background-color: #344a5f;
}
.login-wrap {
  width: 330px;
  margin: auto;
  padding-top: 100px;
}
.menu-tab {
  text-align: center;
  margin-bottom: 50px;

  li {
    display: inline-block;
    width: 88px;
    font-size: 14px;
    color: #fff;
    line-height: 36px;
    border-radius: 10px;
    cursor: pointer;

    &.current {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
}
.login-form {
  .block {
    display: block;
    width: 100%;
  }

  .getcode {
    display: flex;
    flex-direction: column;
  }
}
</style>
