<template>
  <div class="ConsoleIndex">home</div>
</template>
<script>
import { reactive, toRefs, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
export default {
  name: "ConsoleIndex",
  setup() {
    let router = useRouter();
    console.log(router);
    return {};
  },
};
</script>
<style lang="scss" scoped>
</style>
