<template>
  <div class="infoDetail">
    <el-form label-width="100px">
      <el-form-item label="信息分类：">
        <el-select v-model="categoryId" placeholder="请选择分类">
          <el-option
            v-for="item in category"
            :key="item.id"
            :label="item.category_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题：">
        <el-input v-model="title" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="缩略图：">
        <el-upload
          class="avatar-uploader"
          :action="uploadAction"
          :data="uploadKey"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="发布日期：">
        <el-date-picker
          v-model="createDate"
          type="date"
          disabled
          placeholder="请选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="详细内容：">
        <div ref="editor"></div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit" :loading="submitLoaging"
          >保存</el-button
        >
        <el-button @click="toInfoIndex">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { reactive, toRefs, ref, onMounted, watch, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { GetList, getQiniuToken } from "@/api/news";
import { timestampToTime } from "@/utils/common";
import wangeditor from "wangeditor";
import { EditInfo } from "@/api/news.js";
import { ElMessage } from "element-plus";

export default {
  name: "InfoDetail",
  components: {},
  setup() {
    // vuex
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    // console.log(route.params);
    // console.log(store.state);
    const editor = ref(null);
    const submitLoaging = ref(false);

    const cate_data = reactive({
      category: [],
      imageUrl: "",
      uploadKey: {
        token: "",
        key: "",
      },
      id: route.params.id || store.getters["infoDetail/infoId"],
      title: route.params.title || store.getters["infoDetail/infoTitle"],
    });
    const form = reactive({
      categoryId: "",
      title: "",
      createDate: "",
      content: "",
      imgUrl: "",
    });
    const uploadConfig = reactive({
      ak: "yf0RFOmlEOMq9CluPmOCRd6AkEIrBtUnUw3krMx1",
      sk: "CgPz3b0cnu6r_lP0D3YvzD2AgpGcD2xGyiJZn94p",
      buckety: "hpc-space",
    });
    const uploadAction = ref("http://up-z2.qiniup.com");

    let cate_datas = toRefs(cate_data);
    let form_data = toRefs(form);

    let instance;

    /**
     * onMounted
     */
    onMounted(() => {
      getInfo();
      getInfoCate();
      QiniuToken();
      /**
       * 富文本编辑器wangeditor
       */
      instance = new wangeditor(editor.value);
      instance.config.height = 100;

      Object.assign(instance.config, {
        onchange() {
          // console.log(instance.txt.text());
          form.content = instance.txt.text();
          // console.log(form.content);
        },
      });
      instance.create();
    });

    onBeforeUnmount(() => {
      instance.destroy();
      instance = null;
    });

    const getInfo = () => {
      //   console.log(cate_data.id);
      let data = {
        pageNumber: 1,
        pageSize: 1,
        id: cate_data.id,
      };

      GetList(data)
        .then((res) => {
          let data = res.data.data.data[0];
          // console.log(data);

          form.categoryId = data.categoryId;
          form.title = data.title;
          form.createDate = timestampToTime(data.createDate);
          form.content = data.content;
          form.imgUrl = data.imgUrl;
          // 富文本编辑器内容
          instance.txt.text(data.content);
          // console.log(form);
        })
        .catch((err) => {});
    };

    const getInfoCate = () => {
      store
        .dispatch("common/getInfoCategory")
        .then((res) => {
          cate_data.category = res.data.data.data;
          //   console.log(cate_data.category);
        })
        .catch((err) => {});
    };

    const submit = () => {
      let requestData = {
        id: cate_data.id, //当前编辑数据的id
        categoryId: form.categoryId,
        title: form.title,
        content: form.content,
        imgUrl: form.imgUrl,
      };
      // console.log(requestData);
      submitLoaging.value = true;

      EditInfo(requestData)
        .then((res) => {
          console.log(res);
          ElMessage({
            message: res.data.message,
            type: "success",
          });
          submitLoaging.value = false;
        })
        .catch((err) => {
          submitLoaging.value = false;
        });
    };

    const toInfoIndex = () => {
      console.log("back");
      router.push({
        path: "/infoIndex",
      });
    };

    const QiniuToken = () => {
      // 需要在七牛云绑定自己的域名，ak: "Avh-EZZAa4TxqPQZsEW42fXBUbTMFi-RKSZTRKJj", sk: "l9AXtnhCVKZexXNRcmHXzmecXiCUiLynwGboMeUw",buckety: "webjshtml",为例子
      let reqData = {
        ak: uploadConfig.ak,
        sk: uploadConfig.sk,
        buckety: uploadConfig.buckety,
      };

      getQiniuToken(reqData)
        .then((res) => {
          // console.log(res);
          cate_data.uploadKey.token = res.data.data.token;
          // console.log(cate_data.uploadKey);
        })
        .catch((err) => {});
    };

    const beforeAvatarUpload = (file) => {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        ElMessage({
          message: "上传头像图片只能是 JPG 格式!",
          type: "error",
        });
      }
      if (!isLt2M) {
        ElMessage({
          message: "上传头像图片大小不能超过 2MB!",
          type: "error",
        });
      }
      // console.log(file.name);

      form.imgUrl = file.name;
      // 文件名转码
      let suffix = file.name;
      let key = encodeURI(`${suffix}`);
      cate_data.uploadKey.key = key;
      // console.log(key);

      return isJPG && isLt2M;
    };

    // form.imgUrl = `http://www-web-jshtml-cn-idva7mx.web-jshtml.cn/vue.jpg`;
    // 上传图片成功
    // 需要在七牛云绑定自己的域名，www-web-jshtml-cn-idva7mx.web-jshtml.cn为例子
    const handleAvatarSuccess = (res, file) => {
      // console.log(res);
      // console.log(file);
      form.imgUrl = `${store.getters["common/QiniuUrl"]}${res.key}`;
    };

    return {
      editor,
      ...cate_datas,
      ...form_data,
      submit,
      submitLoaging,
      toInfoIndex,
      handleAvatarSuccess,
      beforeAvatarUpload,
      uploadAction,
    };
  },
};
</script>
<style lang="scss" scoped>
.infoDetail {
  padding: 30px;
}
</style>