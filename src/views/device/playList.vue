<template>
  <div class="playList">
    <div class="list">
      <van-tabs
        title-active-color="#1989f9"
        color="#1989f9"
        v-model="activeName"
        sticky
        :offset-top="46"
      >
        <template v-for="scene in scenes.scenes">
          <van-tab
            :ellipsis="false"
            :title="item.title"
            :name="item.type"
            :key="item.type"
            v-for="item in scene"
          >
            <scenes-list
              :activeName="activeName"
              :disabled="disabled"
              :list="mediaPlayLists"
              :index="item.index"
              :info="info"
              :hasSwitch="scenes.hasSwitch"
              @changeOrder="changeOrder"
              @deleteMedia="deleteMedia"
              @changeTime="changeTime"
              @changeColor="changeColor"
            >
            </scenes-list>
          </van-tab>
        </template>
      </van-tabs>
    </div>
    <div class="playList-btn">
      <template v-if="info.stateMedia === 0">
        <span>{{ releaseName }}</span>
      </template>
      <template v-else>
        <van-button type="default" @click="goBack">取消</van-button>
        <van-button
          :type="uploadType"
          :disabled="empty || disabled"
          @click="confirm"
          >{{ releaseName }}</van-button
        >
      </template>
    </div>
  </div>
</template>

<script>
import eventBus from "@/utils/eventBus";
import common from "@/mixins/common";
// 组件
// api`
import { getPlaylist, updateContentV2, setColor } from "@/api/device/playList";
import { devIceDetails } from "@/api/device/details";

import ScenesList from "./components/ScenesList.vue";
import { deviceTypeArr } from "@/common/common";
import { mapGetters } from "vuex";
export default {
  name: "playList",

  components: { ScenesList },

  mixins: [common],

  computed: {
    ...mapGetters(["playList"]),

    empty() {
      return this.mediaPlayLists.length <= 0;
    },

    scenes() {
      const scenes = deviceTypeArr.find((item) => item.text === this.info.type);
      return scenes || deviceTypeArr[0];
    },

    disabled() {
      return this.info.stateOnline !== 1;
    },
    uploadType() {
      if (this.info.stateMedia === 1) {
        return "info";
      } else {
        return "danger";
      }
    },

    releaseName() {
      if (this.info.stateMedia === 0) {
        return "正在上传播放列表，请稍等！";
      } else if (this.info.stateMedia === 1) {
        return "发布";
      } else if (this.info.stateMedia === -1) {
        return "重新发布";
      } else {
        return "";
      }
    },
  },

  data() {
    return {
      timer: null,
      info: {},
      activeName: 0,
      mediaPlayLists: [],
      submitArr: [],
      taskIcon: require("../../assets/img/taskIcon.png"),
    };
  },
  async created() {
    this.info = JSON.parse(this.$route.query.info);
    await this.getInfo();
    this.updateReleaseName();
    if (this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName;
    } else {
      const arr = Object.keys(this.scenes);
      this.activeName = arr[0].type;
    }
    // 获取该终端的播放列表
    await this.getPlayList();

    if (this.$route.query.from) {
      this.$store.commit("setPlayList", this.mediaPlayLists);
    } else {
      this.mediaPlayLists = this.playList;
    }

    if (this.$route.query.isCheck === "true") {
      this.addMediaList();
      this.$store.commit("setPlayList", this.mediaPlayLists);
    }

    eventBus.$on("devList", this.updateList);

    eventBus.$on("onClickLeft", this.goBack);

    this.$once("hook:beforeDestroy", () => {
      eventBus.$off("devList", this.updateList);
      eventBus.$off("onClickLeft", this.goBack);
    });
  },
  mounted() {
    eventBus.$on("onClickRight", (icon) => {
      this.onClickRight(icon);
    });
  },
  beforeDestroy() {
    this.timer && clearInterval(this.timer);
  },
  methods: {
    goBack() {
      this.$router.push({ path: "/details", query: { id: this.info.id } });
    },
    getInfo() {
      return devIceDetails(this.info.id)
        .then((res) => {
          this.info = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    updateList(data) {
      const obj = data.find((item) => item.id === this.id);

      if (obj) {
        this.info = Object.assign(this.info, obj);
      }
    },
    addMediaList() {
      try {
        const list = JSON.parse(this.$route.query.list);
        const index = this.$route.query.index;
        const targetList = JSON.parse(this.mediaPlayLists[index].content);
        const length = targetList.length;
        list.forEach((item, i) => {
          item.mediaOrder = length + i;
        });
        targetList.push(...list);
        this.mediaPlayLists[index].content = JSON.stringify(targetList);
      } catch (e) {
        this.toast("添加媒体列表失败", "fail");
        console.log(e);
      }
    },
    // 头部点击回调
    onClickRight(icon) {
      if (icon === "question-o") {
        this.$router.push({
          path: "/question",
          query: { type: this.$router.path },
        });
      }
    },
    // 获取终端设备播放列表all
    getPlayList() {
      return getPlaylist(this.info.id)
        .then((res) => {
          res.list.forEach((item) => {
            const content = JSON.parse(item.content);
            content.sort((a, b) => a.mediaOrder - b.mediaOrder);
            item.content = JSON.stringify(content);
          });
          this.mediaPlayLists = res.list;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    async changeColor(list, index, val) {
      this.toast("调整灯光颜色中", "loading", 0);
      const id = list[index].id;
      try {
        await setColor(id, { playlistid: id, color: val });
      } catch (e) {
        console.log(e);
      }

      this.getPlayList();
      this.toastClear();
    },

    changeTime(value, info, index) {
      console.log(value, info, index);
      const targetList = JSON.parse(this.mediaPlayLists[index].content);
      const obj = targetList.find(
        (item) => item.mediaOrder === info.mediaOrder
      );
      obj.mediaTime = value;
      this.mediaPlayLists[index].content = JSON.stringify(targetList);
    },

    changeOrder(direction, target, index) {
      const targetList = JSON.parse(this.mediaPlayLists[index].content);
      const currentIndex = targetList.findIndex(
        (item) => item.mediaOrder === target.mediaOrder
      );
      const length = targetList.length;
      if (direction === "down" && currentIndex < length - 1) {
        const nextItem = targetList[currentIndex + 1];
        targetList.splice(currentIndex, 2, nextItem, target);
      } else if (direction === "up" && currentIndex !== 0) {
        const nextItem = targetList[currentIndex - 1];
        targetList.splice(currentIndex - 1, 2, target, nextItem);
      }
      this.mediaPlayLists[index].content = JSON.stringify(targetList);
    },

    deleteMedia(target, index) {
      const targetList = JSON.parse(this.mediaPlayLists[index].content);
      const i = targetList.findIndex(
        (item) => item.mediaOrder === target.mediaOrder
      );
      if (i >= 0) {
        targetList.splice(i, 1);
      }
      this.mediaPlayLists[index].content = JSON.stringify(targetList);
    },

    // 确认播放列表修改
    async confirm() {
      // this.toast('调整列表中', 'loading', 0)
      const ids = [];
      const colors = [];
      const contents = [];
      this.mediaPlayLists.forEach((item) => {
        const content = JSON.parse(item.content);
        content.forEach((i, index) => {
          i.mediaOrder = index + 1;
        });
        item.content = JSON.stringify(content);
        ids.push(item.id);
        colors.push(item.color);
        contents.push(item.content);
      });
      try {
        await updateContentV2({
          devid: this.info.id,
          ids: ids,
          colors: colors,
          contents: contents,
        });
        this.updateReleaseName(0);
      } catch (e) {
        console.log(e);
        this.toast("媒体发布任务失败", "fail");
      }
    },

    // 提示按钮
    async updateReleaseName(delay = 1000 * 10) {
      this.timer = setTimeout(async () => {
        await this.getInfo();
        if (this.info.stateMedia === 0) {
          clearTimeout(this.timer);
          this.updateReleaseName();
        } else {
          clearTimeout(this.timer);
          this.timer = null;
        }
      }, delay);
    },
  },
};
</script>

<style lang="scss" scoped>
$bg1: #f6f6f6;
.playList {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden !important;
}
.list {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  background: $bg1;
  position: relative;
}
.playList-btn {
  height: 0.4rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  & button {
    height: 0.4rem;
    line-height: 0.4rem;
    width: 50%;
    border-radius: 0;
    border-bottom: none;
    border-right: none;
    border-left: none;
  }
}
</style>
