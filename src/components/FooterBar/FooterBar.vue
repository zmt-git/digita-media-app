<template>
  <van-divider
    :style="{ color: bg, borderColor: bg, padding: '0 .08rem', margin: '1px' }"
  >
    没有更多了
  </van-divider>
</template>

<script>
export default {
  name: "bar-layout",
  data() {
    return {
      bg: "#ededed",
    };
  },
};
</script>

<style lang="scss" scoped></style>
