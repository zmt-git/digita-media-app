<template>
  <div class="mineItem">
    <template v-for="(item, index) in mineItems">
      <van-cell
        class="item"
        :value='item.value'
        :key="index"
        :is-link='item.link'
        :to='item.to'
        :icon="item.icon"
        @click="item.method ? item.method() : onClick(item)"
      >
        <template slot="title">
          <span class="custom-title">{{item.name}}</span>
          <template v-if="item.tag">
            <van-tag class="tag" :type="item.type">{{item.tagTitle}}</van-tag>
          </template>
        </template>
      </van-cell>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    mineItems: {
      type: Array,
      default: () => {}
    }
  },
  methods: {
    onClick (item) {
      this.$emit('callback', item)
    }
  }
}
</script>
<style lang="scss">
.item .van-cell__left-icon{
  font-size: .2rem;
}
.item .custom-title{
  font-size: .15rem;
}
.item .van-tag{
    margin-left: .09rem;
}
.mineItem .van-cell__value{
  color: #000;
}
</style>
