<template>
  <div class="layout" :class="[menuStatus ? 'close' : 'open']">
    <Header></Header>
    <Aside></Aside>
    <Main></Main>
  </div>
</template>
<script>
// 在父组件中通过provider来提供变量，然后在子组件中通过inject来注入变量
import { toRefs, reactive, computed, provide } from "vue";
import { useStore } from "vuex";
import Header from "./components/Header";
import Main from "./components/Main";
import Aside from "./components/Aside";
// echarts5.0
import * as echarts from "echarts";

export default {
  name: "Layout",
  components: {
    Header,
    Main,
    Aside,
  },
  setup() {
    // 在父组件中通过provider来提供变量
    provide("ec", echarts);
    // vuex
    const store = useStore();

    const menuStatus = computed(() => {
      return store.state.app.isCollapse;
    });

    return { menuStatus };
  },
};
</script>
<style lang="scss" scoped>
.layout {
  width: 100vw;
  // height: 1260px;
  background-color: #f7f7f7;
}
</style>
