<template>
  <svg class="svg-class" :class="iconClass">
    <use :href="`#icon-${iconName}`"></use>
  </svg>
</template>
<script>
export default {
  name: "Svgicon",
  props: {
    iconName: {
      type: String,
    },
    iconClass: {
      type: String,
    },
  },

  setup() {},
};
</script>
<style lang="scss" scoped>
.svg-class {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>