<template>
  <div class="header">
    <div class="pull-lfet menu" @click="handleMenu">
      <SvgIcon iconName="menu" iconClass="header-icon" />
    </div>

    <div class="pull-right p-top-3">
      <div class="userInfo">
        <img src="../../../assets/face.png" alt="" />
        <div class="name">{{ username }}</div>
      </div>
      <div class="logout" @click="logout">
        <SvgIcon iconName="logout" iconClass="logout-icon" />
      </div>
    </div>
  </div>
</template>
<script>
import { computed, reactive, toRefs } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
export default {
  name: "Header",
  setup() {
    // vuex
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const data = reactive({});
    const datas = toRefs(data);

    const username = computed(() => {
      // console.log(store.state.app.username);
      return store.state.app.username;
    });

    const handleMenu = () => {
      // 命名空间
      store.commit("app/SET_COLLAPSE");
      // store.commit("login/SET_COLLAPSE");
      // store.dispatch("setMenuStatus", {});
    };

    const logout = () => {
      store
        //命名空间
        .dispatch("app/logout")
        .then((res) => {
          // console.log(res);
          if (res.resCode === 0) {
            ElMessage({
              message: "退出成功",
              type: "success",
            });
            router.push({
              name: "Login",
            });
          }
        });
    };

    return {
      ...datas,
      handleMenu,
      username,
      logout,
    };
  },
};
</script>
<style lang="scss" scoped>
.header {
  padding: 22px 32px;
  position: fixed;
  top: 0;
  z-index: 1;
  right: 0;
  height: $header;
  background-color: #fff;
  box-sizing: border-box;
  @include webkit(box-shadow, 0 3px 16px 0 rgba(0, 0, 0, 0.1));
  @include webkit(transition, all 0.3s ease 0);
}

.open {
  .header {
    left: $navMenu;
  }
}
.close {
  .header {
    left: $navMenuMin;
  }
}

.menu {
  display: inline-block;
}

.userInfo {
  margin-right: 20px;
  display: inline-block;
  vertical-align: -3px;
  cursor: pointer;

  img {
    display: inline-block;
    height: 25px;
    width: 25px;
    border-radius: 100px;
  }
  .name {
    padding-left: 10px;
    display: inline-block;
    vertical-align: 8px;
  }
}

.logout {
  display: inline-block;
}
</style>
