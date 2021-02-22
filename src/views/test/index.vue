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
        <el-form-item label="邮箱" prop="username">
          <el-input
            type="text"
            v-model="ruleForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input
            type="text"
            v-model="ruleForm.pass"
            maxlength="20"
            minlength="6"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="comfirmPass"
          v-if="model == 'register'"
        >
          <el-input
            type="text"
            v-model="ruleForm.comfirmPass"
            maxlength="20"
            minlength="6"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code" class="getcode">
          <el-row :gutter="10">
            <el-col :span="14">
              <el-input
                v-model="ruleForm.code"
                maxlength="6"
                minlength="6"
              ></el-input>
            </el-col>
            <el-col :span="10"
              ><el-button type="success" class="block">获取验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="block" @click="submitForm()"
            >注册</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {
  defineComponent,
  toRefs,
  reactive,
  ref,
  onMounted,
  nextTick
} from "vue";
import {
  stripscript,
  validate_email,
  validate_password,
  validate_code
} from "@/utils/validate.js";

export default defineComponent({
  name: "Register",
  setup() {
    /**
     * 自定义表单验证
     */
    /**
     * 用户邮箱验证
     */
    var validateUsername = (rule, value, callback) => {
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
    var validatePass = (rule, value, callback) => {
      // console.log(stripscript(value));

      // 过滤密码特殊字符
      // formData.ruleForm.pass = stripscript(value);
      // value = formData.ruleForm.pass;

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
    var validateComfirmPass = (rule, value, callback) => {
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
    var checkCode = (rule, value, callback) => {
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
        { txt: "登录", current: false, type: "login" },
        { txt: "注册", current: true, type: "register" }
      ],
      model: "register"
    });
    /**
     * 表单数据
     */
    const formData = reactive({
      ruleForm: {
        username: "123@q.com",
        pass: "123456z",
        comfirmPass: "",
        code: "qwerts"
      },
      rules: {
        username: [{ validator: validateUsername, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        comfirmPass: [{ validator: validateComfirmPass, trigger: "blur" }],
        code: [{ validator: checkCode, trigger: "blur" }]
      }
    });

    const data = toRefs(datas);
    const form = toRefs(formData);

    /**
     *获取表单dom
     */
    let refruleForms = ref(null);
    /**
     * 表单提交
     */
    const submitForm = () => {
      // console.log(refruleForms.value);
      refruleForms.value.validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };

    /**
     * 登录注册按钮 切换
     */
    const switchTab = item => {
      datas.menuTab.forEach(e => {
        e.current = false;
      });
      item.current = true;

      datas.model = item.type;
    };

    return {
      ...data,
      ...form,
      switchTab,
      submitForm,
      refruleForms
    };
  }
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
