<template>
  <div class="infoCate">
    <el-button type="danger" @click="addFirst({ type: 'cate_first_add' })"
      >添加一级分类</el-button
    >
    <div class="line"></div>
    <div>
      <el-row :gutter="30">
        <el-col :span="8">
          <div class="cate-wrap">
            <div
              class="category"
              v-for="firstItem in category.item"
              :key="firstItem.id"
            >
              <h4>
                <SvgIcon
                  iconName="jiahao"
                  iconClass="cate-icon"
                  class="plus"
                  @click="closeCate"
                />
                <span class="cate_name">{{ firstItem.category_name }}</span>
                <div class="btn-group">
                  <el-button
                    size="mini"
                    type="danger"
                    round
                    @click="
                      editCategory({ data: firstItem, type: 'cate_first_edit' })
                    "
                  >
                    编辑</el-button
                  >
                  <el-button
                    size="mini"
                    type="success"
                    round
                    @click="
                      handleAddChildren({
                        data: firstItem,
                        type: 'cate_children_add',
                      })
                    "
                    >添加子级
                  </el-button>
                  <el-button
                    size="mini"
                    round
                    @click="deleteConfirm(firstItem)"
                  >
                    删除</el-button
                  >
                </div>
              </h4>
              <ul v-if="firstItem.children">
                <li
                  v-for="childrenItem in firstItem.children"
                  :key="childrenItem.id"
                >
                  <span>{{ childrenItem.category_name }}</span>
                  <div class="btn-group">
                    <el-button
                      size="mini"
                      type="danger"
                      round
                      @click="
                        editChildrenCategory({
                          parent: firstItem,
                          data: childrenItem,
                          type: 'cate_children_edit',
                        })
                      "
                    >
                      编辑</el-button
                    >
                    <el-button
                      size="mini"
                      round
                      @click="deleteConfirm(childrenItem)"
                    >
                      删除</el-button
                    >
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="edit-menu">
            <h4 class="menu-title">一级分类编辑</h4>
            <el-form
              :label-position="labelPosition"
              label-width="140px"
              class="form-warp"
              ref="categoryForm"
            >
              <el-form-item
                label="一级菜单名称:"
                prop="categoryName"
                v-if="cate_first"
              >
                <el-input
                  v-model="categoryName"
                  :disabled="cate_first_disabled"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="二级菜单名称:"
                prop="secCategoryName"
                v-if="cate_children"
              >
                <el-input
                  v-model="secCategoryName"
                  :disabled="cate_children_disabled"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="danger"
                  @click="submit"
                  :loading="submit_loading"
                  :disabled="submit_disabled"
                  >确定</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { ref, toRefs, reactive, onMounted, watch } from "vue";
import {
  AddFirstCategory,
  // GetCategory,
  DeleteCategory,
  EditCategory,
  AddChildrenCategory,
} from "@/api/news.js";
import { ElMessage } from "element-plus";
// 全局方法
import { global } from "@/utils/global.js";
// 全局api
import { common } from "@/api/common.js";
import { useStore } from "vuex";
export default {
  name: "InfoCategory",
  setup() {
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

    const data = reactive({
      labelPosition: "right",
      cate_first: true,
      cate_children: true,
    });

    const category = reactive({
      item: [],
      current: [],
    });
    const categoryName = ref("");
    const secCategoryName = ref("");
    const submit_loading = ref(false);
    const cate_first_disabled = ref(true);
    const cate_children_disabled = ref(true);
    const submit_disabled = ref(true);
    const deleteId = ref("");
    const button_type = ref("");

    // dom
    const categoryForm = ref("");

    const submit = () => {
      submit_loading.value = true;
      if (button_type.value === "cate_first_add") {
        // 添加一级菜单
        addFirstCategory();
      } else if (button_type.value === "cate_first_edit") {
        // 编辑一级分类
        editFirstCategory();
      } else if (button_type.value === "cate_children_add") {
        // 添加二级分类
        addChildrenCate();
      } else if (button_type.value === "cate_children_edit") {
        // 编辑二级分类
        editChildrenCate();
      }
    };

    const addFirstCategory = () => {
      if (!categoryName.value) {
        ElMessage({
          message: "未选择分类！",
          type: "error",
        });
        submit_loading.value = false;
        return false;
      }
      AddFirstCategory({ categoryName: categoryName.value })
        .then((res) => {
          // console.log(res.data.data);

          let data = res.data;
          if (data.resCode === 0) {
            ElMessage({
              message: data.message,
              type: "success",
            });

            // 页面渲染
            category.item.push(res.data.data);
          }
          submit_loading.value = false;
          // console.log(categoryForm);
          // categoryForm.value.resetFields();
          categoryName.value = "";
        })
        .catch((err) => {
          submit_loading.value = false;
          // categoryForm.value.resetFields();
          categoryName.value = "";
        });
    };

    const addFirst = (params) => {
      button_type.value = params.type;
      data.cate_first = true;
      data.cate_children = false;
      cate_first_disabled.value = false;
      submit_disabled.value = false;
    };
    /**方法一：那个页面需要就都写一次 */
    // const getCategory = () => {
    //   GetCategory({})
    //     .then((res) => {
    //       // console.log(res);

    //       category.item = res.data.data.data;
    //     })
    //     .catch((err) => {});
    // };

    const deleteConfirm = (data) => {
      console.log(data);
      deleteId.value = data.id;

      messageBox({
        content: "确认删除，确认后将无法恢复！",
        tip: "警告",
        fn: deleteCategory,
        catchFn: () => {
          deleteId.value = "";
        },
      });
    };

    const deleteCategory = () => {
      DeleteCategory({ categoryId: deleteId.value })
        .then((res) => {
          // console.log(res);

          let data = res.data;

          ElMessage({
            message: data.message,
            type: "success",
          });

          getCategoryAll();
          /**
           * 方法1
           */
          // let index = category.item.findIndex(
          //   (item) => item.id == deleteId.value
          // );
          // console.log(index);
          // category.item.splice(index, 1);
          /**
           * 方法2
           */
          // console.log(deleteId.value);
          // const arr = category.item.filter((item) => {
          //   return item.id !== deleteId.value;
          // });
          // console.log(arr);
          // category.item = arr;
        })
        .catch((err) => {});
    };

    const editCategory = (params) => {
      button_type.value = params.type;
      cate_first_disabled.value = false;
      data.cate_children = false;
      submit_disabled.value = false;

      categoryName.value = params.data.category_name;

      // 存储当前数据对象
      category.current = params.data;
    };

    const editFirstCategory = () => {
      if (category.current.length == 0) {
        ElMessage({
          message: "未选择分类！",
          type: "error",
        });
        submit_loading.value = false;
        return false;
      }
      let req = {
        id: category.current.id,
        categoryName: categoryName.value,
      };

      editCate(req);
    };

    const editCate = (req) => {
      EditCategory(req)
        .then((res) => {
          let resData = res.data;
          if (resData.resCode === 0) {
            ElMessage({
              message: resData.message,
              type: "success",
            });
          }
          // console.log(resData);
          submit_loading.value = false;
          categoryName.value = "";

          let arr = category.item.filter((item) => {
            // 一级分类
            // console.log(item);

            return item.id == category.current.id;
          });
          // console.log(arr);

          arr[0].category_name = resData.data.data.categoryName;

          category.current = [];
        })
        .catch((err) => {
          submit_loading.value = false;
        });
    };

    const handleAddChildren = (params) => {
      // console.log(params);
      data.cate_first = true;
      data.cate_children = true;
      cate_first_disabled.value = true;
      cate_children_disabled.value = false;
      submit_disabled.value = false;
      button_type.value = params.type;
      category.current = params.data;
      categoryName.value = params.data.category_name;
    };

    const addChildrenCate = () => {
      let data = {
        parentId: category.current.id,
        categoryName: secCategoryName.value,
      };
      // console.log(data);
      if (!secCategoryName.value) {
        ElMessage({
          message: "未选择分类！",
          type: "error",
        });
        submit_loading.value = false;
        return false;
      }

      AddChildrenCategory(data)
        .then((res) => {
          // console.log(res);
          let data = res.data;
          ElMessage({
            message: res.data.message,
            type: "success",
          });
          submit_loading.value = false;
          secCategoryName.value = "";
          categoryName.value = "";
          getCategoryAll();
        })
        .catch((err) => {
          submit_loading.value = false;
        });
    };

    const editChildrenCategory = (params) => {
      // console.log(params);
      data.cate_first = true;
      data.cate_children = true;
      cate_first_disabled.value = true;
      cate_children_disabled.value = false;
      submit_disabled.value = false;
      button_type.value = params.type;
      category.current = params.data;
      categoryName.value = params.parent.category_name;
      secCategoryName.value = params.data.category_name;
    };

    const editChildrenCate = () => {
      if (category.current.length == 0) {
        ElMessage({
          message: "未选择分类！",
          type: "error",
        });
        submit_loading.value = false;
        return false;
      }

      let req = {
        id: category.current.id,
        categoryName: secCategoryName.value,
      };

      editChildren(req);
    };

    const editChildren = (req) => {
      EditCategory(req)
        .then((res) => {
          let resData = res.data;
          if (resData.resCode === 0) {
            ElMessage({
              message: resData.message,
              type: "success",
            });
          }
          console.log(resData);
          submit_loading.value = false;

          getCategoryAll();
          categoryName.value = "";
          secCategoryName.value = "";
          category.current = [];
        })
        .catch((err) => {
          submit_loading.value = false;
        });
    };

    const closeCate = () => {};

    /**
     * 页面dom元素实例完成
     */
    onMounted(() => {
      // getCategory();
      getCategoryAll();
      /**方法二：全局api */
      // getInfoCategory();
      /**方法三：vuex */
      // store
      //   .dispatch("common/getInfoCategory")
      //   .then((res) => {
      //     category.item = res.data.data.data;
      //   })
      //   .catch((err) => {});
    });

    /**
     * 监听
     */
    watch(
      () => allCategory.item,
      (value) => {
        // console.log(value);
        category.item = value;
      }
    );

    return {
      // dom
      categoryForm,
      // reactive
      ...toRefs(data),
      category,
      // ref
      submit_loading,
      cate_first_disabled,
      cate_children_disabled,
      submit_disabled,
      categoryName,
      secCategoryName,
      // methods
      submit,
      addFirst,
      deleteConfirm,
      editCategory,
      handleAddChildren,
      editChildrenCategory,
      deleteCategory,
      closeCate,
    };
  },
};
</script>
<style lang="scss" scoped>
.infoCate {
  padding: 30px;
}
.cate-wrap {
  margin-top: 20px;

  div:first-child {
    &:before {
      top: 22px;
    }
  }
  div:last-child {
    &:before {
      bottom: 22px;
    }
  }
}
.category {
  position: relative;
  line-height: 44px;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 22px;
    bottom: 0;
    width: 32px;
    border-left: 1px dotted rgb(68, 66, 66);
  }

  h4 {
    height: 44px;
    position: relative;
    padding-left: 40px;
    cursor: pointer;
    .plus {
      position: absolute;
      top: 15px;
      left: 16px;
    }

    &:hover {
      @include webkit(transition, all 0.5s ease);
      background-color: #f3f3f3;

      .btn-group {
        display: block;
      }
    }
  }

  li {
    position: relative;
    padding-left: 60px;
    margin-left: 2px;
    &:before {
      content: "";
      position: absolute;
      top: 21px;
      left: 20px;
      width: 32px;
      border-bottom: 1px dotted rgb(66, 64, 64);
    }

    &:hover {
      background-color: #f3f3f3;
      .btn-group {
        display: block;
      }
    }
  }
}
.cate_name {
  width: 100px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.btn-group {
  display: none;
  position: absolute;
  top: 0;
  z-index: 2;
  right: 11px;
  font-size: 12px;
}
.edit-menu {
  .form-warp {
    margin-top: 30px;
    width: 410px;
  }

  .menu-title {
    padding-left: 20px;
    line-height: 44px;
    background-color: #f3f3f3;
  }
}
.line {
  margin: 30px 0;
  width: calc(100% + 60px);
  margin-left: -30px;
  border: none;
  border-bottom: 1px solid #e9e9e9;
}
</style>