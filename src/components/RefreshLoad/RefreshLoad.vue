<template>
  <van-pull-refresh
    ref="content"
    class="refresh"
    v-model="options.refreshing"
    @refresh="onRefresh"
  >
    <van-list
      v-model="options.loading"
      :finished="options.finished"
      finished-text="-- END --"
      @load="onLoad"
    >
      <slot></slot>
    </van-list>
  </van-pull-refresh>
</template>

<script>
export default {
  name: "RefreshLoad",

  props: {
    options: {
      type: Object,
      default: () => {
        return {
          loading: false,
          finished: false,
          refreshing: false,
        };
      },
      required: true,
    },
  },
  methods: {
    onLoad() {
      this.$emit("onLoad");
    },
    onRefresh() {
      this.$emit("onRefresh");
    },
  },
};
</script>

<style lang="scss" scoped>
.refresh {
  width: 100%;
  height: 100%;
}
</style>
