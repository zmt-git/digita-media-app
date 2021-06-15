/*
 * @Author: ZMT
 * @Date: 2020-07-23 10:32:09
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-27 09:49:14
 */
<template>
  <div class="inlinevideo" ref="inlinevideo">
    <video
      ref="myPlayer"
      class="videoBox video-js vjs-default-skin vjs-big-play-centered"
      preload="auto"
      :poster="videoInfo.address"
      crossorigin="anonymous"
      data-setup='{"html5" : { "nativeTextTracks" : false }}'
    >
      <source :src="videoInfo.addressOld" type="video/mp4"/>
    </video>
  </div>
</template>
<script>
import { videoFrame } from '@/oss/ossconfig'
import { setOrientation } from '@/utils/cordovaMethod'

import videojs from 'video.js'
import 'video.js/dist/video-js.css'
export default {
  name: 'videojs',
  props: {
    videoInfo: {
      type: Object,
      default: () => {}
    },
    videoOption: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      defaultOptions: {
        autoplay: false, // 是否自动播放
        aspectRatio: '16:9',
        controls: true,
        fluid: true, // 宽高自适应
        techOrder: ['html5'],
        bigPlayButton: true,
        textTrackDisplay: false,
        posterImage: true,
        errorDisplay: false
      },
      player: null,
      isFullscreen: false,
      videoFrame: videoFrame
    }
  },

  methods: {
    // 销毁video
    dispose () {
      if (this.player) {
        this.player.dispose()
      }
    },

    // 播放
    play () {
      if (this.player) {
        this.player.play()
      }
    },

    // 暂停
    pause () {
      if (this.player) {
        this.player.pause()
      }
    },

    // 初始化
    init () {
      const that = this
      this.player = videojs(this.$refs.myPlayer, this.defaultOptions, () => {
        // that.play()
      })

      this.player.on('fullscreenchange', (res) => {
        that.isFullscreen = !that.isFullscreen
        if (that.isFullscreen) {
          console.log('全屏')
          // eslint-disable-next-line no-undef
          StatusBar.hide()
          setOrientation(false)
        } else {
          console.log('非全屏')
          // eslint-disable-next-line no-undef
          StatusBar.show()
          setOrientation(true)
        }
      })
    },

    // 重置
    reset () {
      if (this.player) {
        this.player.reset()
      }
    }
  },

  mounted () {
    this.init()
  },

  beforeDestroy () {
    this.player.dispose()
  }
}
</script>
<style lang='scss' scoped>
.inlinevideo {
  width:100%;
  position:relative;
  & video{
    width: 100%;
  }
}

.videoBox {
  width: 100%;
}
</style>
