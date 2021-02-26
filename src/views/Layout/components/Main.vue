<template>
  <div class="main">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: "Main",
  setup() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.main {
  margin: 30px;
  margin-bottom: 0;
  height: max-content;
  // max-height: 1100px;
  position: absolute;
  top: $header;
  bottom: 0;
  right: 0;
  background-color: #fff;
  box-sizing: border-box;
  @include webkit(transition, all 0.3s ease 0);
  overflow: hidden;
}

.open {
  .main {
    left: $navMenu;
  }
}
.close {
  .main {
    left: $navMenuMin;
  }
}
</style>
