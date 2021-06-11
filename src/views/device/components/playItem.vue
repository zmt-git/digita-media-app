<template>
  <van-swipe-cell :disabled="disabled">
    <div class="play-item">
      <div class="play-item_top van-hairline--bottom">
        <div class="play-item_top_img" @click="player()">
          <template v-if="playInfo.mediaType === 0">
            <img class="play-item_top_img--media" :src="playInfo.address + videoFrame" alt="">
            <img class="play-item_top_img--player" src="../../../assets/img/player.png" alt="">
          </template>
          <template v-else>
            <img class="play-item_top_img--media" :src="playInfo.address" alt="">
          </template>
        </div>
        <div class="play-item_top_info">
          <div class="play-item_top_info_des">
            <p class="play-item_top_info_des--type van-ellipsis">
              {{playInfo.mediaType === 0 ? '视频媒体' : '图片媒体'}}
              <van-tag plain v-if="playInfo.state === 0">隐藏</van-tag>
            </p>
            <p class="play-item_top_info_des--info van-ellipsis">
              媒体格式
              <span class="padding-left">{{playInfo.mediaType | mediaTypeFilter }}</span>
            </p>
            <p class="play-item_top_info_des--info van-ellipsis">
              播放时长
              <van-stepper :disabled="disabled" :value="playInfo.length" :default-value="1" integer @change="onChange" />
            </p>
          </div>
          <div class="play-item_top_info_btn">
            <span class="Triangle Triangle-bottom" @click="changeOrder('up')"></span>
            <span class="Triangle Triangle-up" @click="changeOrder('down')"></span>
          </div>
        </div>
      </div>
    </div>
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
  height: 1.28rem;
  padding-bottom: .08rem;
  background: $bg3;
  &_top{
    height: .88rem;
    background: $bg1;
    width: 100%;
    &_img{
      width: 1.05rem;
      height: .88rem;
      padding: .08rem .15rem;
      box-sizing: border-box;
      position: relative;
      float: left;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      &--media{
        max-width: 100%;
        max-height: 100%;
      }
      &--player{
        width: .28rem;
        height: .28rem;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
      }
    }
    &_info{
      width: calc(100% - 1.05rem);
      height: .88rem;
      float: left;
      &_des{
        height: 100%;
        width: 2.32rem;
        float: left;
        color: #000;
        &--type{
          font-size: .15rem;
          line-height: .375rem;
        }
        &--info{
          font-size: .13rem;
          line-height: .215rem;
        }
      }
      &_btn{
        height: 100%;
        width: calc(100% - 2.32rem);
        float: left;
        padding: .125rem 0;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
      }
    }
  }
  &_bottom{
    // height: .325rem;
    width: 100%;
    background: $bg1;
    text-align: right;
    box-sizing: border-box;
    padding: .07rem .14rem;
    & button{
      height: .235rem;
      line-height: .235rem;
      padding: 0 .15rem;
      margin: 0 .05rem;
    }
  }
}
.padding-left{
  margin-left: .13rem;
}

.Triangle{
  width: 0;
  height: 0;
  display: block;
  border-color: transparent;
  border-style: solid;
}
.Triangle-up{
  border-top-width: .17rem;
  border-bottom-width: 0;
  border-left-width: .095rem;
  border-right-width: .095rem;
  border-top-color: $bg2;
}
.Triangle-bottom{
  border-bottom-width: .17rem;
  border-top-width: 0;
  border-left-width: .095rem;
  border-right-width: .095rem;
  border-bottom-color: $bg2;
}
</style>
