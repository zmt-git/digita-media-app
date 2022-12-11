<template>
  <figure
    ref="videoContainer"
    class="video-box"
    :data-fullscreen="dataFullscreen"
  >
    <video
      class="video-el"
      ref="videoSource"
      :poster="poster"
      preload="metadata"
      webkit-playsinline
    >
      <source :src="source" type="video/mp4" />
    </video>
    <ul
      ref="videoControls"
      :class="showBar || bar ? 'bgBLACK' : ''"
      class="controls"
      @click="showBarFn"
    >
      <!-- 视频播放 暂停 -->
      <transition name="van-fade">
        <li
          class="controls_pausePlay"
          @click.stop="pausePlay"
          v-show="showBar || bar"
        >
          <van-icon
            class="controls_pausePlay_icon"
            v-show="!pause"
            name="play-circle"
          />
          <van-icon
            class="controls_pausePlay_icon"
            v-show="pause"
            name="pause-circle"
          />
        </li>
      </transition>
      <!-- 视频播放进度 -->
      <transition name="van-slide-up">
        <li
          class="controls_progress"
          v-show="showBar || bar"
          :style="{ color: controlColor }"
        >
          <!-- 当前播放时间 -->
          <span class="controls_progress--time">{{
            videoTime.currentTime | secondFormatter
          }}</span>
          <!-- 进度条 -->
          <van-slider
            v-model="progerssValue"
            class="controls_progress-slider"
            active-color="#ee0a24"
            @change="changeProgerss"
          >
            <template #button>
              <div class="custom-button"></div>
            </template>
          </van-slider>
          <!-- 总时长 -->
          <span class="controls_progress--time">{{
            videoTime.duration | secondFormatter
          }}</span>
          <!-- <div class="controls_fullscreen" @click.stop="fullscreenFn">
            <van-icon v-show="!fullscreen" name="expand-o" />
            <van-icon v-show='fullscreen' name="shrink" />
          </div> -->
        </li>
      </transition>
      <li
        class="controls_progress"
        :class="fullscreen ? 'control_progress_fullscreen' : ''"
        v-show="!showBar"
        style="height: 0.1rem"
        :style="{ color: controlColor }"
      >
        <!-- 进度条 -->
        <van-slider
          bar-height=".02rem"
          v-model="progerssValue"
          :disabled="true"
          class="controls_progress-slider"
          style="width: 100%"
          active-color="#ee0a24"
          @change="changeProgerss"
        >
          <template #button>
            <div style="display: none"></div>
          </template>
        </van-slider>
      </li>
    </ul>
  </figure>
</template>

<script>
import { downloadFile, videoFrame } from "@/oss/ossconfig";
import { secondFormat } from "@/utils/format";
import { setOrientation } from "@/utils/cordovaMethod";
import eventBus from "@/utils/eventBus";

export default {
  name: "videoPlayer",
  props: {
    videoInfo: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    bar() {
      return !this.pause;
    },
  },
  filters: {
    secondFormatter(val) {
      return secondFormat(val);
    },
  },
  data() {
    return {
      timeer: null,
      source: "",
      poster: "",
      showBar: true,
      pause: false,
      fullscreen: false,
      videoTime: {
        duration: null,
        currentTime: null,
      },
      progerssValue: 0,
      dataFullscreen: false,
      controlColor: "#fff",
    };
  },
  mounted() {
    this.addEventListener();

    eventBus.$on("setFullscreen", () => {
      this.setFullscreenData(false);
    });
  },
  beforeDestroy() {
    this.removeEventListener();
    eventBus.$off("setFullscreen");
  },
  methods: {
    addEventListener() {
      this.$refs.videoSource.controls = false;
      this.$refs.videoSource.addEventListener("loadedmetadata", () => {
        this.videoTime.duration = this.$refs.videoSource.duration;
      });

      this.$refs.videoSource.addEventListener("ended", () => {
        this.pausePlay();
      });

      // 监听视频播放进度
      this.$refs.videoSource.addEventListener("timeupdate", () => {
        this.videoTime.currentTime = this.$refs.videoSource.currentTime;
        this.progerssValue = Math.floor(
          (this.$refs.videoSource.currentTime /
            this.$refs.videoSource.duration) *
            100
        );
      });
      // 获取是否全屏状态兼容
      document.addEventListener("fullscreenchange", () => {
        this.setFullscreenData(
          !!(document.fullScreen || document.fullscreenElement)
        );
      });
      document.addEventListener("webkitfullscreenchange", () => {
        this.setFullscreenData(!!document.webkitIsFullScreen);
      });
      document.addEventListener("mozfullscreenchange", () => {
        this.setFullscreenData(!!document.mozFullScreen);
      });
      document.addEventListener("msfullscreenchange", () => {
        this.setFullscreenData(!!document.msFullscreenElement);
      });
      // })
      // 获取视频资源 视频帧
      this.poster = this.videoInfo.addressOld + videoFrame;
      this.source = this.videoInfo.addressOld;
    },
    removeEventListener() {
      const arr = [
        "loadedmetadata",
        "timeupdate",
        "fullscreenchange",
        "webkitfullscreenchange",
        "mozfullscreenchange",
        "msfullscreenchange",
        "ended",
      ];
      arr.forEach((item) => {
        document.removeEventListener(item, () => {});
      });
    },
    // 获取oss地址
    getSrc(name) {
      if (name) {
        return downloadFile(name);
      } else {
        return "";
      }
    },
    // 显示控制条
    showBarFn() {
      if (this.pause) {
        this.showBar = !this.showBar;
        this.displayNone();
      }
    },
    displayNone() {
      clearTimeout(this.timeer);
      if (!this.showBar) return;
      this.timeer = setTimeout(() => {
        this.showBar = false;
      }, 1500);
    },
    // 暂停 播放
    pausePlay() {
      this.pause = !this.pause;
      if (this.pause) {
        this.$refs.videoSource.play();
      } else {
        this.$refs.videoSource.pause();
      }
      if (this.pause) {
        this.displayNone();
      }
    },
    // 判断是否是全屏
    isFullScreen() {
      return !!(
        document.fullScreen ||
        document.webkitIsFullScreen ||
        document.mozFullScreen ||
        document.msFullscreenElement ||
        document.fullscreenElement
      );
    },
    // 设置全屏参数
    setFullscreenData(state) {
      this.dataFullscreen = !!state;
      if (this.dataFullscreen === true) {
        // this.controlColor = '#000'
        // 设置为竖屏状态
        // eslint-disable-next-line
        StatusBar.hide();
        setOrientation(false);
      } else {
        // 设置为横屏状态
        // this.controlColor = '#fff'
        // eslint-disable-next-line
        StatusBar.show();
        setOrientation(true);
      }
      this.$store.commit("SET_FULLSCREEN", !this.dataFullscreen);
    },
    fullscreenFn() {
      if (this.isFullScreen()) {
        this.setFullscreenData(false);

        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.webkitCancelFullScreen)
          document.webkitCancelFullScreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
      } else {
        this.setFullscreenData(true);

        if (this.$refs.videoContainer.requestFullscreen)
          this.$refs.videoContainer.requestFullscreen();
        else if (this.$refs.videoContainer.mozRequestFullScreen)
          this.$refs.videoContainer.mozRequestFullScreen();
        else if (this.$refs.videoContainer.webkitRequestFullScreen)
          this.$refs.videoContainer.webkitRequestFullScreen();
        else if (this.$refs.videoContainer.msRequestFullscreen)
          this.$refs.videoContainer.msRequestFullscreen();
      }
    },
    // 播放进度改变
    changeProgerss() {
      this.$refs.videoSource.currentTime =
        (this.progerssValue / 100) * this.$refs.videoSource.duration;
    },
  },
};
</script>

<style lang="scss" scoped>
.video-box {
  max-height: 2.5rem;
}
.bgBLACK {
  background: RGBA(0, 0, 0, 0.1);
}
.video-box,
.controls,
.video-el {
  width: 100%;
  max-height: 2.5rem;
  position: relative;
}
.controls {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  color: #fff;
  &_pausePlay {
    width: 0.65rem;
    height: 0.65rem;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    overflow: hidden;
    &_icon {
      width: 0.5rem;
      height: 0.5rem;
      font-size: 0.4rem;
      line-height: 0.5rem;
    }
  }
  &_progress {
    position: absolute;
    bottom: 0rem;
    left: 0;
    width: 100%;
    height: 0.3rem;
    &-slider {
      display: inline-block;
      width: 2.3rem;
      margin-bottom: 0.03rem;
    }
    &--time {
      display: inline-block;
      padding: 0 0.1rem;
      line-height: 0.3rem;
      box-sizing: border-box;
      width: 0.6rem;
      text-align: center;
    }
  }
  &_fullscreen {
    display: inline-block;
    height: 0.3rem;
    font-size: 0.2rem;
    & i {
      position: relative;
      top: 0.05rem;
    }
  }
}
.control_progress_fullscreen {
  bottom: 0.1rem;
}
.custom-button {
  width: 0.15rem;
  height: 0.15rem;
  border-radius: 50%;
  background: #fff;
}
</style>
