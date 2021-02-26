<template>
  <div>
    <el-dialog
      title="新增"
      v-model="dialog_info_flag"
      @close="close"
      :width="580"
      @opened="openDialog"
    >
      <el-form :model="form" ref="dialog_form">
        <el-form-item
          label="类型:"
          :label-width="formLabelWidth"
          prop="category"
        >
          <el-select v-model="form.category" placeholder="请选择类型">
            <el-option
              v-for="item in categoryOption.item"
              :key="item.id"
              :label="item.category_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题:" :label-width="formLabelWidth" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item
          label="概况："
          :label-width="formLabelWidth"
          prop="content"
        >
          <el-input
            type="textarea"
            v-model="form.content"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close">取 消</el-button>
          <el-button type="danger" :loading="submit_loading" @click="submit">
            确 定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { ref, reactive, watch } from "vue";
import { AddInfo } from "@/api/news.js";
import { ElMessage } from "element-plus";
export default {
  name: "Dialog",
  props: {
    flag: {
      type: Boolean,
      default: false,
    },
    category: {
      type: Array,
      default: () => [],
    },
  },
  // emits: ["update:flag"],
  setup(props, { emit }) {
    const form_data = reactive({
      form: {
        category: "",
        title: "",
        content: "",
      },
      formLabelWidth: "80px",
    });
    const categoryOption = reactive({
      item: [],
    });
    const dialog_info_flag = ref(false);
    const submit_loading = ref(false);

    // dom
    const dialog_form = ref(null);

    // 监听
    watch(
      () => props.flag,
      () => {
        dialog_info_flag.value = props.flag;
      }
    );

    const close = () => {
      dialog_info_flag.value = false;
      // 向父级传递
      emit("update:flag", false);
      resetField();
    };

    const openDialog = () => {
      categoryOption.item = props.category;
    };

    const submit = () => {
      let data = {
        categoryId: form_data.form.category,
        title: form_data.form.title,
        content: form_data.form.content,
      };

      submit_loading.value = true;

      AddInfo(data)
        .then((res) => {
          // console.log(res);
          ElMessage({
            message: res.data.message,
            type: "success",
          });
          submit_loading.value = false;
          dialog_form.value.resetFields();
          resetField();
          dialog_info_flag.value = false;
          // 刷新列表
          emit("refreshList");
        })
        .catch((err) => {
          submit_loading.value = false;
        });
    };

    const resetField = () => {
      form_data.form.category = "";
      form_data.form.title = "";
      form_data.form.content = "";
    };

    return {
      // dom
      dialog_form,
      // ref
      dialog_info_flag,
      submit_loading,
      // reactive
      categoryOption,
      ...form_data,
      // methods
      openDialog,
      close,
      submit,
    };
  },
};
</script>
<style lang="scss" scoped>
</style>