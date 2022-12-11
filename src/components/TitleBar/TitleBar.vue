<template>
  <van-cell class="title-box">
    <template slot="title">
      <p class="titlep">{{ title }}</p>
    </template>
    <slot class="fl"></slot>
  </van-cell>
</template>

<script>
export default {
  name: "InfoBar",
  props: {
    title: {
      type: String,
      default: "标题",
    },
  },
};
</script>

<style lang="scss" scoped>
$color1: #000;
$bg1: #1989fa;
.title-box {
  height: 0.44rem;
  font-size: 0.16rem;
  color: $color1;
  padding: 0.1rem 0.16rem;
}
.titlep {
  line-height: 0.24rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  display: flex;
  align-items: center;
}
.titlep::before {
  width: 0.06rem;
  height: 0.18rem;
  display: inline-block;
  content: "";
  background: $bg1;
  margin-right: 0.09rem;
}
.fl {
  float: right;
}
</style>
