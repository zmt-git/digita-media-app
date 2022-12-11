<template>
  <ul>
    <li
      class="paltitem"
      :class="[isCheckMedia(item) ? 'isCheck' : '']"
      :key="item.id"
      v-for="item in playInfoArr"
      @click="check(item)"
    >
      <van-icon v-if="isCheck" class="isCheck_icon" name="success" />
      <div class="paltitem_top van-hairline--bottom" @click="viewMedia(item)">
        <div class="paltitem_top_img">
          <!-- 判断是否为video -->
          <div class="isDeviceInfo van-hairline--surround" v-if="isDeviceInfo">
            <template v-if="item.mediaType === 0">
              <img
                class="paltitem_top_img--media"
                :src="item.address + videoFrame"
                alt=""
              />
              <img
                class="paltitem_top_img--player"
                src="../../../assets/img/player.png"
                alt=""
              />
            </template>
            <template v-else>
              <van-image
                fit="contain"
                height=".75rem"
                width=".75rem"
                :src="item.address"
              />
              <!-- <img class="paltitem_top_img--media van-hairline--surround" :src="item.address" alt=""> -->
            </template>
          </div>
          <div class="circle" v-else>
            <van-circle
              v-model="item.progress"
              :speed="100"
              :rate="100"
              :text="item.progress | progress"
            />
          </div>
        </div>
        <div class="paltitem_top_info">
          <div class="paltitem_top_info_des">
            <template v-if="item.state !== 1">
              <van-tag
                class="mediaTag"
                :type="item.state === -2 ? 'danger' : 'warning'"
              >
                {{ item.state === -2 ? "审核失败" : "审核中" }}
              </van-tag>
            </template>
            <template v-if="isDeviceInfo">
              <p class="paltitem_top_info_des--type van-ellipsis">
                {{ item.name | filterName }}
                <span class="ml">{{ item.name | filterType }}</span>
              </p>
              <p class="paltitem_top_info_des--info van-ellipsis">
                媒体大小<span class="ml">{{ formatterSize(item) }}</span>
              </p>
              <p class="paltitem_top_info_des--info van-ellipsis">
                播放时长<span class="ml">{{ item.length | filterLength }}</span>
              </p>
            </template>
            <template v-else>
              <p class="paltitem_top_info_des--type van-ellipsis">
                {{ item.name | filterName }}
                <span class="ml">{{ item.name | filterType }}</span>
              </p>
              <p class="paltitem_top_info_des--info van-ellipsis">
                媒体大小<span class="ml">{{ formatterSize(item.file) }}</span>
              </p>
              <p class="paltitem_top_info_des--info van-ellipsis">
                播放时长<span class="ml">{{ item.length | filterLength }}</span>
              </p>
            </template>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import { downloadFile, videoFrame } from "@/oss/ossconfig";
import { secondFormat } from "@/utils/format";
// import VideoPlayer from '@/components/VideoPlayer/VideoPalyer'
export default {
  name: "palyItem",
  props: {
    playInfoArr: {
      type: Array,
      default: () => [],
    },
    isDeviceInfo: {
      type: Boolean,
      default: true,
    },
    isCheck: {
      type: Boolean,
      default: false,
    },
    checkList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      currentRate: 30,
      videoInfo: "",
      videoFrame: videoFrame,
      checkArr: [],
    };
  },
  filters: {
    filterType(val) {
      // 0：mp4，1：jpg；2：png；
      return val.split(".").pop().toUpperCase();
    },
    filterName(val) {
      // 0：mp4，1：jpg；2：png；
      if (val === 0) {
        return "视频媒体";
      } else {
        return "图片媒体";
      }
    },
    filterSize(val) {
      if (typeof val === "number") {
        return (val / 1024).toFixed(2) + "MB";
      } else {
        return "0MB";
      }
    },
    filterLength(val) {
      if (typeof val === "number") {
        return secondFormat(val);
      } else {
        return "00:00";
      }
    },
    progress(val) {
      if (typeof val !== "number") {
        return 0 + "%";
      } else {
        return val + "%";
      }
    },
  },
  methods: {
    // 获取oss地址
    getSrc(name) {
      if (name) {
        return downloadFile(name);
      } else {
        return "";
      }
    },
    isCheckMedia(info) {
      const index = this.checkArr.findIndex((item) => item.id === info.id);
      return index >= 0;
    },
    check(info) {
      if (!this.isCheck) return;
      const index = this.checkArr.findIndex((item) => item.id === info.id);
      if (index >= 0) {
        this.checkArr.splice(index, 1);
      } else {
        this.checkArr.push(info);
      }
      this.$emit("update:checkList", this.checkArr);
    },
    // 播放媒体视频
    viewMedia(palyItem) {
      if (this.isCheck) return;
      this.$emit("viewMedia", palyItem);
    },

    formatterSize(item) {
      if (item.mediaType === 0) {
        if (typeof item.size === "number") {
          return (item.size / 1024).toFixed(2) + "MB";
        } else {
          return "0MB";
        }
      } else {
        if (typeof item.size === "number") {
          return item.size + "KB";
        } else {
          return "0KB";
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$bg1: #fff;
$bg2: #1989f9;

.paltitem {
  width: 100%;
  height: 0.88rem;
  margin-bottom: 0.08rem;
  background: $bg1;
  box-sizing: border-box;
  border: 1px solid transparent;
  transition: all 0.2s;
  &_top {
    height: 0.88rem;
    width: 100%;
    &_img {
      width: 1.05rem;
      height: 0.88rem;
      padding: 0.08rem 0.15rem;
      box-sizing: border-box;
      position: relative;
      float: left;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      // background: $bgc;
      &--media {
        max-width: 100%;
        max-height: 100%;
        // height: 100%;
        overflow: hidden;
      }
      &--player {
        width: 0.28rem;
        height: 0.28rem;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
      }
    }
    &_info {
      width: calc(100% - 1.05rem);
      height: 0.88rem;
      float: left;
      &_des {
        height: 100%;
        width: 2.7rem;
        float: left;
        color: #000;
        position: relative;
        &--type {
          font-size: 0.15rem;
          line-height: 0.375rem;
        }
        &--info {
          font-size: 0.13rem;
          line-height: 0.235rem;
        }
      }
      &_btn {
        height: 100%;
        width: calc(100% - 2.32rem);
        float: left;
        padding: 0.125rem 0;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
      }
    }
  }
  &_bottom {
    height: 0.325rem;
    width: 100%;
    text-align: right;
    box-sizing: border-box;
    padding: 0.07rem 0.14rem;
    & button {
      height: 0.26rem;
      line-height: 0.26rem;
    }
  }
}
.isCheck {
  border: 1px solid $bg2;
  position: relative;
  animation: all ease 0.3s;
  &::after {
    display: block;
    content: "";
    width: 0px;
    height: 0px;
    border: 0.1rem solid transparent;
    border-right-color: $bg2;
    border-top-color: $bg2;
    position: absolute;
    top: 0;
    right: 0;
  }
  &_icon {
    color: #fff;
    font-size: 12px;
    position: absolute;
    top: 0;
    right: 0px;
    z-index: 1;
  }
}
.ml {
  margin-left: 0.1rem;
}
.circle {
  width: 100%;
  background: #f6f6f6;
  height: 100%;
  box-sizing: border-box;
  padding: 0.05rem;
  overflow: hidden;
  & .van-circle {
    width: 100% !important;
    height: 100% !important;
  }
}
.mediaTag {
  position: absolute;
  top: 0.09rem;
  right: 0.09rem;
}
.isDeviceInfo {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
</style>
