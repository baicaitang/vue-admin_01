<template>
  <div class="aside">
    <div class="logo">
      <img alt="" src="@/assets/logo.png" />
      <div class="tit">我的后台</div>
    </div>

    <div style="width: 251px">
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        background-color="transparent"
        text-color="#fff"
        :collapse="isCollapse"
        router
      >
        <template v-for="(item, i) in routes">
          <!-- 是否隐藏 -->
          <el-submenu v-if="!item.hidden" :key="item.id" :index="i.toString()">
            <!-- 一级菜单 -->
            <template #title>
              <SvgIcon
                :iconName="item.meta && item.meta.icon"
                iconClass="aside-icon"
              />
              <span>{{ item.meta.name }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item-group>
              <template v-for="subItem in item.children">
                <el-menu-item
                  v-if="!subItem.hidden"
                  :key="subItem.id"
                  :index="subItem.path"
                >
                  {{ subItem.meta.name }}
                </el-menu-item>
              </template>
            </el-menu-item-group>
          </el-submenu>
        </template>
      </el-menu>
    </div>
  </div>
</template>
<script>
import { ref, toRefs, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
export default {
  name: "Aside",
  setup() {
    // 路由实例
    let router = useRouter();
    // let route = useRoute();
    // console.log(router.options.routes);
    // vuex
    const store = useStore();
    // console.log(store);

    //数据
    let menuData = reactive({
      routes: router.options.routes,
    });

    let menuDatas = toRefs(menuData);

    //是否水平折叠收起菜单
    const isCollapse = computed(() => {
      return store.state.app.isCollapse;
    });

    return {
      ...menuDatas,
      isCollapse,
    };
  },
};
</script>
<style lang="scss" scoped>
.aside {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  background-color: #1e4162;
  // transition: all 0.3s ease 0;
  @include webkit(transition, all 0.3s ease 0);
}
.logo {
  display: flex;
  height: 70px;
  img {
    margin: 10px 30px;
    display: inline-block;
    height: 50px;
  }
  div {
    color: #fff;
    line-height: 70px;
    font-size: 18px;
  }
}
.open {
  .aside {
    width: $navMenu;
  }
}

.close {
  .aside {
    width: $navMenuMin;

    img {
      margin: 10px 7px;
    }
    .tit {
      display: none;
    }
  }
}
</style>
