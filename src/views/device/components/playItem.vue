<template>
  <van-swipe-cell :disabled="disabled">
      <van-image
        class="img"
        src="https://img01.yzcdn.cn/vant/cat.jpeg"
      />
      <van-stepper input-width="40px" button-size="20px" v-model="playInfo.mediaTime" integer />
    <template #right>
    <van-button square text="删除" type="danger" class="delete-button" @click="deleteMedia"/>
  </template>
  </van-swipe-cell>
</template>

<script>
import { videoFrame } from '@/oss/ossconfig'
import { secondFormat } from '@/utils/format'
import { Toast } from 'vant'
export default {
  name: 'play-item',
  props: {
    playInfo: {
      type: Object,
      default: () => {}
    },

    disabled: {
      type: Boolean,
      default: false
    },

    value: {
      type: [String, Number],
      default: ''
    },

    checked: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      id: null,
      clientHeight: 0,
      videoFrame: videoFrame
    }
  },
  filters: {
    mediaTypeFilter (val) { // 0：mp4，1：jpg；2：png；
      switch (val) {
        case 0: return 'MP4'
        case 1: return 'jpg'
        case 2: return 'png'
      }
    },
    filterLength (val) {
      if (typeof (val) === 'number') {
        return secondFormat(val)
      } else {
        return '00:00'
      }
    }
  },
  methods: {
    // 播放媒体视频
    player () {
      this.$router.push({ path: '/mediaDetails', query: { id: this.playInfo.id } })
    },
    // 删除按钮
    deleteMedia (id) {
      if (this.disabled) {
        Toast.fail('设备离线')
        return
      }
      this.$emit('deleteMedia', this.playInfo)
    },
    // 改变顺序
    changeOrder (type) {
      if (this.disabled) {
        Toast.fail('设备离线')
        return
      }
      this.$emit('changeOrder', type, this.playInfo)
    },

    onChange (value, detail) {
      this.$emit('change', value, detail, this.playInfo)
    }
  }
}
</script>

<style lang="scss" scoped>
$bg1: #fff;
$bg2: #1989f9;
$bg3: #f6f6f6;
.play-item{
  width: 100%;
  height: .4rem;
  box-sizing: border-box;
  background: $bg1;
  display: flex;
  flex-direction: column;
  padding: 0 .1rem;
  align-items: center;
  border-top: 1px solid $bg3;
  justify-content: space-between;
}
.delete-button{
  height: 100%;
}
.img{
  width: 100%!important;
}
</style>
