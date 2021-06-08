<template>
  <div class="header">
    <van-nav-bar
      class="header-bar"
      :title="meta.title"
      @click-left="onClickLeft"
    >
      <van-icon v-show="meta.leftArrow" :name="meta.leftIcon" slot="left" />
      <template v-for='(item, index) in meta.rightIcon'>
        <template v-if="item === 'add-o' && isMedia">
          <uploader
            :key='index'
            slot="right"
           ></uploader>
        </template>
        <van-icon v-else :key='index' :name="item" slot="right" @click="onClickRight(item)" />
      </template>
    </van-nav-bar>
  </div>
</template>

<script>
import uploader from '../../views/media/uploader'
import eventBus from '@/utils/eventBus'
export default {
  name: 'devHeader',
  components: {
    uploader
  },
  props: {
    meta: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    isMedia () {
      return this.$route.path === '/media'
    }
  },
  methods: {
    onClickLeft (back = true) {
      if (back) {
        if (!this.meta.hiddenBack) {
          this.$router.go(-1)
        }
      }
      this.$emit('onClickLeft')
    },
    onClickRight (icon) {
      eventBus.$emit('onClickRight', icon)
    }
  }
}
</script>

<style lang="scss" scoped>
$bg: #ededed ;
$color1: #000;
.header{
  & .van-nav-bar{
    background: $bg;
    & .van-nav-bar__title{
      font-weight: 600;
    }
    & .van-nav-bar__right i{
      margin-left: .1rem;
    }
  }
}
.header-bar{
  font-size: .19rem;
  background: $bg;
  & .van-nav-bar__title{
    font-weight: 600;
  }
  & .van-icon{
    color: $color1;
    font-size: .2rem;
    font-weight: 600;
  }
}
</style>
