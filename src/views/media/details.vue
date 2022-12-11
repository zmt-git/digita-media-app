<template>
  <div class="details">
    <div class="content">
      <!-- 媒体 视频 图片资源 -->
      <div class="mediaSrc">
        <template v-if="mediaInfo.mediaType === 0">
          <Video-players :videoInfo="mediaInfo"></Video-players>
          <!-- <VideojsPlayer :videoInfo='mediaInfo'></VideojsPlayer> -->
        </template>
        <template v-else>
          <van-image
            fit="contain"
            class="mediaSrc_img"
            :src="mediaInfo.address"
            @click="showBigImg(mediaInfo.address)"
          />
          <!-- <img class="mediaSrc_img" :src="mediaInfo.address" alt="" @click="showBigImg(mediaInfo.address)"> -->
        </template>
      </div>
      <!-- 媒体信息 -->
      <div class="media">
        <div class="mediaInfo margin-bottom">
          <TitleBar :title="mediaInfo.mediaType | filterName"></TitleBar>
          <!-- <van-cell title="媒体编号" :value="mediaInfo.id" /> -->
          <van-cell title="媒体格式" :value="mediaInfo.name | filterType" />
          <van-cell title="媒体大小" :value="formatterSize(mediaInfo)" />
          <!-- <van-cell title="播放时长" :value="mediaInfo.length | filterLength" /> -->
          <!-- <van-cell title="播放时长" :value="mediaInfo.length | filterLength" :is-link='setLength' @click="changeTime(mediaInfo.length)" /> -->
        </div>
        <!-- 终端设备发布媒体列表 -->
        <!-- <div class="mediaInfo margin-bottom">
          <TitleBar title="已发布的智能终端"></TitleBar>
          <van-cell :title="item.name" :key="index" v-for="(item, index) in releaseList">
            <template slot="default">
              <van-button class="retract" type="default" size="mini" :disabled='item.stateOnline === 0 ? true : false' @click="retract(item)">撤回</van-button>
            </template>
          </van-cell>
        </div> -->
      </div>
    </div>
    <div class="btn">
      <van-button type="danger" @click="deleteM">删除</van-button>
      <!-- <van-button v-if="mediaInfo.state === 1" type="info" @click="release">发布</van-button> -->
      <!-- <van-button v-else-if="mediaInfo.state === 0" :disabled="true" type="danger" @click="release">审核失败</van-button> -->
      <!-- <van-button v-else :disabled="true" type="warning" @click="release">审核中</van-button> -->
    </div>
    <!-- 播放时长弹出层 -->
    <van-popup
      v-model="showPicker"
      position="bottom"
      :style="{ _height: '30%' }"
    >
      <van-picker
        v-model="currentTime"
        show-toolbar
        title="播放时长"
        :columns="columns"
        @cancel="cancel"
        @confirm="onConfirmTime"
      />
    </van-popup>
    <!-- 播放时长弹出层 -->
    <!-- 删除媒体终端复选框 -->
    <van-dialog
      v-model="showPicker1"
      title="重要提示"
      show-cancel-button
      @confirm="deleteMediaById"
      @open="checked = false"
    >
      <div class="deleteMedia">
        <!-- <van-checkbox v-model="checked" shape="square">同时从所有智能终端中删除媒体</van-checkbox> -->

        该媒体将从所有智能终端中清除！
      </div>
    </van-dialog>
    <!-- <van-image-preview v-model="previewShow" :images="images" :showIndex='false' :closeable='true' @close='closePreview'></van-image-preview> -->
  </div>
</template>

<script>
import { Dialog, Toast, ImagePreview } from "vant";
import { downloadFile } from "@/oss/ossconfig";
import { secondFormat, formatTosecond } from "@/utils/format";
import TitleBar from "@/components/TitleBar/TitleBar";
import {
  mediaDetails,
  recall,
  deleteMedia,
  setLength,
  publishList,
} from "@/api/media/details";
import common from "@/mixins/common";
import eventBus from "@/utils/eventBus";
// 组件
import VideoPlayers from "@/components/VideoPlayer/VideoPalyer";

export default {
  name: "media-details",
  mixins: [common],
  components: {
    TitleBar,
    VideoPlayers,
    [ImagePreview.Component.name]: ImagePreview.Component,
  },
  computed: {
    type() {
      if (this.mediaInfo.mediaType === 0) {
        return "bg-1";
      } else {
        return "bg-0";
      }
    },
    setLength() {
      if (this.mediaInfo.mediaType === 0) {
        return false;
      } else {
        return true;
      }
    },
  },
  filters: {
    filterName(val) {
      // 0：mp4，1：jpg；2：png；
      if (val === 0) {
        return "视频媒体";
      } else {
        return "图片媒体";
      }
    },
    filterType(val) {
      try {
        return val.split(".").pop().toUpperCase();
      } catch (e) {
        return "--";
      }
    },
    filterSize(val) {
      if (typeof val === "number") {
        return Math.ceil(val / 1024) + "MB";
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
  },
  data() {
    return {
      previewShow: false,
      images: [],
      id: "",
      checked: 0, // 删除终端媒体check
      showPicker1: false, // 删除dialog
      currentTime: [], // 当前时间
      showPicker: false, // 播放时间show
      releaseList: [],
      mediaInfo: {},
      columns: [
        // 时间选择器element
        // 第一列
        {
          values: this.timeArray(10, " 时"),
          defaultIndex: 1,
        },
        // 第二列
        {
          values: this.timeArray(60, " 分"),
          defaultIndex: 1,
        },
        // 第三列
        {
          values: this.timeArray(60, " 秒"),
          defaultIndex: 1,
        },
      ],
    };
  },
  created() {
    // 获取路由参数id
    this.id = this.$route.query.id;
    // 1.获取媒体详情
    this.getMediaDetails(this.id);
    // 2.获取媒体发布终端列表
    // this.getPublishList(this.id)
  },
  mounted() {
    eventBus.$on("close", () => {
      this.closePreview();
    });
  },
  beforeDestroy() {
    eventBus.$off("close");
  },
  methods: {
    // 获取发布终端列表
    getPublishList(id) {
      return publishList({ mediaid: id })
        .then((res) => {
          this.releaseList = res.list;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    // 获取媒体详细
    getMediaDetails(id) {
      return mediaDetails(id)
        .then((res) => {
          this.mediaInfo = res.data;
        })
        .catch((e) => {
          console.log(e);
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
    // 删除媒体
    deleteM() {
      // 弹出终端列表
      this.showPicker1 = true;
    },
    // 删除媒体确认
    deleteMediaById() {
      this.toast("删除中", "loading", 0);
      let isDeletMedia;
      this.checked ? (isDeletMedia = 1) : (isDeletMedia = 0);
      deleteMedia({ id: this.mediaInfo.id, isDeletMedia: isDeletMedia })
        .then((res) => {
          if (res.state === 1) {
            this.$router.go(-1);
            Toast.clear();
          } else {
            this.toast("删除失败", "fail");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    // 撤回媒体
    retract(device) {
      Dialog.confirm({
        title: "重要提示",
        message: `在【${device.name}】中撤回该媒体吗？`,
      })
        .then(async () => {
          // on confirm
          this.toast("撤回中", "loading", 0);
          await recall({
            deviceId: device.id,
            isDeletMedia: 1,
            mediaId: this.id,
          })
            .then((res) => {
              if (res.state !== 1) {
                this.toast("撤回失败", "fail");
              } else {
                Toast.clear();
              }
            })
            .catch((e) => {
              console.log(e);
            });
          this.getPublishList(this.id);
          // 获取已发布设备列表
        })
        .catch(() => {
          // on cancel
        });
    },
    // 发布媒体
    release() {
      this.$router.push({ path: "/release", query: { id: this.id } });
    },
    // 根据媒体类型弹出播放时长选择器
    changeTime(time) {
      if (this.type === "bg-0") {
        this.showPicker = true;
        // ["03 时", "02 分", "01 秒"]
        let times = secondFormat(time, 3);
        times = times.split(":");
        this.currentTime[0] = times[0] + " 时";
        this.currentTime[1] = times[1] + " 分";
        this.currentTime[2] = times[2] + " 秒";
        for (let i = 0; i < this.columns.length; i++) {
          const index = this.columns[i].values.findIndex(
            (el) => el === this.currentTime[i]
          );
          if (index >= 0) {
            this.columns[i].defaultIndex = index;
          } else {
            this.columns[i].defaultIndex = 0;
          }
        }
      }
    },
    // 确认媒体播放时间
    async onConfirmTime(value) {
      console.log(this.currentTime);
      this.showPicker = false;
      const length = this.beforesubmitLength(value);
      this.toast("设置中", "loading", 0);
      await setLength({ id: this.id, length: length })
        .then(() => {
          this.toast("设置成功", "success");
        })
        .catch((e) => {
          console.log(e);
          Toast.clear();
        });
      this.getMediaDetails(this.id);
    },
    beforesubmitLength(value) {
      const val = value.join(" ").split(" ");
      const time = val[0] + ":" + val[2] + ":" + val[4];
      const length = formatTosecond(time);
      this.mediaInfo.length = length;
      return length;
    },
    cancel() {
      this.showPicker = false;
      for (let i = 0; i < this.columns.length; i++) {
        const index = this.columns[i].values.findIndex(
          (el) => el === this.currentTime[i]
        );
        if (index >= 0) {
          this.columns[i].defaultIndex = index;
        } else {
          this.columns[i].defaultIndex = 0;
        }
      }
    },
    // 选择器的对应element时间转换
    timeArray(maxTime, type) {
      const arr = [];
      for (let i = 0; i < maxTime; i++) {
        if (i < 10) {
          arr.push("0" + i + type);
        } else {
          arr.push(i + type);
        }
      }
      return arr;
    },
    // 删除终端对应的媒体资源
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
    },
    // 图片预览
    showBigImg(addressOld) {
      ImagePreview({
        images: [addressOld],
        showIndex: false,
        closeable: true,
        closeOnPopstate: true,
      });
    },
    closePreview() {
      // this.$store.commit('SET_IS_IMG_VIEW', false)

      this.previewShow = false;
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
.details {
  height: 100%;
  background: #f6f6f6;
  display: flex;
  flex-direction: column;
  overflow: hidden !important;
}
.content {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
}
.btn {
  height: 0.39rem;
  width: 100%;
  & button {
    height: 0.39rem;
    line-height: 0.39rem;
    font-size: 0.17rem;
    width: 100%;
    border-radius: 0;
    border-bottom: none;
    border-right: none;
    border-left: none;
  }
}
.media {
  margin-top: 0.07rem;
}
.mediaSrc {
  max-height: 3.75rem;
  width: 100%;
  position: relative;
  overflow: hidden;
  background: rgba($color: #fff, $alpha: 0.8);
  text-align: center;
  &_img {
    // width: 100%;
    height: 3.75rem;
    width: 3.75rem;
    // float: left;
  }
  &_player {
    width: 0.65rem;
    height: 0.65rem;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
}
.mediaInfo .van-cell__value {
  color: #000;
}
.mediaInfo .van-cell {
  padding-left: 0.2rem;
}
.margin-bottom {
  margin-bottom: 0.07rem;
}
.deleteMedia {
  text-align: center;
  padding: 0.2rem;
}
.retract {
  height: 0.24rem;
  padding: 0 0.15rem;
}
</style>
<style lang="scss">
$bg0: #fff;
$bg1: #f6f6f6;
.bg-0 {
  background: $bg0;
}
.bg-1 {
  background: $bg1;
}
</style>
