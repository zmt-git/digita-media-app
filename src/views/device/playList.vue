<<<<<<< HEAD
<template>
  <div class="playList">
    <div class="list">
      <template v-for="(item, index) in mediaPlayLists">
        <transition :key='index' name="van-slide-left">
          <Play-item
            :index='index'
            :playInfo='item'
            @hiddenMedia='hiddenMedia'
            @restore='restore'
            @deteleMedia='deteleMedia'
            @changeOrder='changeOrder'
          />

        </transition>
      </template>
    </div>
    <div class="playList-btn">
      <van-button type="default" @click="$router.go(-1)">取消</van-button>
      <van-button type="info" :disabled='empty' @click='confirm'>确认</van-button>
    </div>
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus'
import common from '@/mixins/common'
// 组件
import PlayItem from './components/playItem'
// api`
import { listMediaAll, MediaAdjustment } from '@/api/device/playList'
import { Dialog } from 'vant'
export default {
  name: 'playList',
  mixins: [common],
  components: {
    PlayItem
  },
  computed: {
    empty () {
      return this.mediaPlayLists.length <= 0
    }
  },
  data () {
    return {
      id: null,
      mediaPlayLists: [],
      submitArr: [],
      taskIcon: require('../../assets/img/taskIcon.png')
    }
  },
  async created () {
    this.id = this.$route.query.id
    // 获取该终端的播放列表
    await this.getPlayList()
  },
  mounted () {
    eventBus.$on('onClickRight', (icon) => {
      this.onClickRight(icon)
    })
  },
  methods: {
    // 头部点击回调
    onClickRight (icon) {
      if (icon === 'question-o') {
        this.$router.push({ path: '/question', query: { type: this.$router.path } })
      }
    },
    // 获取终端设备播放列表all
    getPlayList () {
      return listMediaAll(this.id)
        .then(res => {
          // 通过sort排序
          res.list.sort((itemA, itemB) => {
            return itemA.sort - itemB.sort
          })
          this.mediaPlayLists = res.list
        })
        .catch(e => { console.log(e) })
    },
    // 隐藏按钮
    async hiddenMedia (id) {
      // await this.onStateMedia(id, 0)
      const index = this.findIndex(this.mediaPlayLists, 'id', id)
      this.$set(this.mediaPlayLists[index], 'state', 0)
    },
    // 恢复按钮
    async restore (id, state) {
      // await this.onStateMedia(id, 1)
      let s = null
      if (state === 1) {
        s = 0
      } else {
        s = 1
      }
      const index = this.findIndex(this.mediaPlayLists, 'id', id)
      this.$set(this.mediaPlayLists[index], 'state', s)
    },
    // 删除按钮
    deteleMedia (id) {
      // 删除提示dialog
      Dialog.confirm({
        title: '提示',
        message: '在播放列表中删除该媒体吗？'
      })
        .then(async () => {
          // onconfirm
          const index = this.findIndex(this.mediaPlayLists, 'id', id)
          // 删除元素sort设置为-1
          const sort = this.mediaPlayLists[index].sort
          this.mediaPlayLists[index].sort = -1
          // 判断是否为最后一个元素媒体
          if (sort === this.mediaPlayLists.length) return
          // sort+1目标媒体order-1
          const index1 = this.findIndex(this.mediaPlayLists, 'sort', sort + 1)
          for (let i = index1; i < this.mediaPlayLists.length; i++) {
            const sort = this.mediaPlayLists[i].sort
            this.$set(this.mediaPlayLists[i], 'sort', sort - 1)
          }
        })
        .catch(() => {

        })
    },
    // 改变顺序
    changeOrder (id, type) {
      // 获取自身元素
      const num = type === 'up' ? -1 : 1
      const index = this.mediaPlayLists.findIndex(item => {
        return item.id === id
      })
      // 获取元素order
      const sort = this.mediaPlayLists[index].sort
      // 头尾元素判断
      if ((sort === 1 && num === -1) || (sort === this.mediaPlayLists.length && num === 1)) {
        const str = type === 'up' ? '已经是最顶部了！' : '已经是最底部了！'
        this.toast(str, 'text')
        return
      }
      // 获取互换位置元素
      const tagertIndex = this.mediaPlayLists.findIndex(item => {
        return item.sort === sort + num
      })
      // 修改自身
      this.changePositionOrder(index, sort + num)
      // 上一元素
      if (tagertIndex < 0) return
      this.changePositionOrder(tagertIndex, sort)
    },
    // 通过order进行改变位置 删除存在bug
    changePositionOrder (index, val) {
      this.$set(this.mediaPlayLists[index], 'sort', val)
    },
    // 确认播放列表修改
    async confirm () {
      // 提交请求
      this.beforeSubmit()
      this.toast('调整列表中', 'loading', 0)
      let str = JSON.stringify(this.submitArr)
      str = str.replace('[', '')
      str = str.replace(']', '')
      await MediaAdjustment({ playlistArr: str })
        .then(res => {
          if (res.state === 1) {
            this.toast('正在上传新的播放列表<br/>请在【任务】标签卡中查看结果', 'html', 2000, false)
          } else {
            this.toast('媒体发布任务失败', 'fail')
          }
        })
        .catch(e => {
          console.log(e)
          this.toast('媒体发布任务失败', 'fail')
        })
    },
    findIndex (arr, key, val) {
      const index = arr.findIndex(item => {
        return item[key] === val
      })
      return index
    },
    beforeSubmit () {
      this.submitArr = []
      this.mediaPlayLists.forEach(item => {
        const obj = {}
        obj.id = item.playListId
        obj.sort = item.sort
        obj.state = item.state
        this.submitArr.push(obj)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$bg1: #f6f6f6;
.playList{
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden!important;
}
.list{
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  background: $bg1;
  position: relative;
}
.playList-btn{
  height: .4rem;
  width: 100%;
  & button{
    height: .4rem;
    line-height: .4rem;
    width: 50%;
    border-radius: 0;
    border-bottom: none;
    border-right: none;
    border-left: none;
  }
}
</style>
=======
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
            >
              <!-- @changeColor="changeColor" -->
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
      console.log("🚀 ~ file: playList.vue:80 ~ scenes ~ scenes:", scenes);
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
        const length =
          targetList.length === 0
            ? -1
            : targetList[targetList.length - 1].mediaOrder;
        list.forEach((item, i) => {
          item.mediaOrder = length + i + 1;
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
      // this.toast("调整灯光颜色中", "loading", 0);
      const id = list[index].id;
      try {
        await setColor(id, { playlistid: id, color: val });
        await this.getInfo();
        this.updateReleaseName(1000, () => {
          this.getPlayList();
        });
      } catch (e) {
        console.log(e);
        this.toast("媒体发布任务失败", "fail");
        this.getPlayList();
      }
    },

    changeTime(value, info, index) {
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
        this.updateReleaseName(1000);
      } catch (e) {
        console.log(e);
        this.toast("媒体发布任务失败", "fail");
      }
    },

    // 提示按钮
    async updateReleaseName(delay = 1000 * 10, success = () => {}) {
      this.timer = setTimeout(async () => {
        await this.getInfo();
        if (this.info.stateMedia === 0) {
          clearTimeout(this.timer);
          this.updateReleaseName(delay, success);
        } else {
          clearTimeout(this.timer);
          this.timer = null;
          success();
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
>>>>>>> 6d726aca7b36707575d3d47ca165a0a551942d2e
