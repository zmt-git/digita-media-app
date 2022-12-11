<template>
  <div class="material"></div>
</template>

<script>
export default {
  name: "material-page",
  data() {
    return {
      fileList: [],
    };
  },
  methods: {
    afterRead() {},
  },
};
</script>

<style lang="scss" scoped>
.material {
  height: 100%;
  padding: 0.2rem;
  box-sizing: border-box;
}
</style>
