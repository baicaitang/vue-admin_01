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
  position: fixed;
  top: $header;
  bottom: 0;
  right: 0;
  background-color: #fff;
  box-sizing: border-box;
  @include webkit(transition, all 0.3s ease 0);
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
