<template>
  <div class="layout" :class="[menuStatus ? 'close' : 'open']">
    <Header></Header>
    <Aside></Aside>
    <Main></Main>
  </div>
</template>
<script>
import { toRefs, reactive, computed } from "vue";
import { useStore } from "vuex";
import Header from "./components/Header";
import Main from "./components/Main";
import Aside from "./components/Aside";
export default {
  name: "Layout",
  components: {
    Header,
    Main,
    Aside,
  },
  setup() {
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
