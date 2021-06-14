<template>
  <div class="playList">
      <div class="list">
        <van-tabs title-active-color='#1989f9' color='#1989f9' v-model="activeName" sticky :offset-top="46">
          <template  v-for="(scene) in scenes">
            <van-tab :title="item.title" :name="item.type" :key="item.type" v-for="item in scene">
              <scenes-list @changeOrder='changeOrder' @deleteMedia='deleteMedia' :list='mediaPlayLists' :index='item.index' :info='info'></scenes-list>
            </van-tab>
          </template>
        </van-tabs>
      </div>
      <div class="playList-btn">
        <van-button type="default" @click="$router.go(-1)">取消</van-button>
        <van-button type="info" :disabled='empty || disabled' @click='confirm'>确认</van-button>
      </div>
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus'
import common from '@/mixins/common'
// 组件
// api`
import { getPlaylist, updateContent } from '@/api/device/playList'
import { Dialog } from 'vant'
import ScenesList from './components/ScenesList.vue'
import { deviceTypeArr } from '@/common/common'
export default {
  name: 'playList',

  components: { ScenesList },

  mixins: [common],

  computed: {
    empty () {
      return this.mediaPlayLists.length <= 0
    },

    scenes () {
      const scenes = deviceTypeArr.find(item => item.text === this.info.type)
      return scenes ? scenes.scenes : deviceTypeArr[0].scenes
    },

    disabled () {
      return this.info.stateOnline !== 1
    }
  },

  data () {
    return {
      info: {},
      activeName: '',
      mediaPlayLists: [],
      submitArr: [],
      taskIcon: require('../../assets/img/taskIcon.png')
    }
  },
  async created () {
    this.info = JSON.parse(this.$route.query.info)
    // 获取该终端的播放列表
    await this.getPlayList()

    if (this.$route.query.isCheck) {
      this.addMediaList()
    }
  },
  mounted () {
    eventBus.$on('onClickRight', (icon) => {
      this.onClickRight(icon)
    })
  },
  methods: {
    addMediaList () {
      try {
        const list = JSON.parse(this.$route.query.list)
        const index = this.$route.query.index
        const targetList = JSON.parse(this.mediaPlayLists[index].content)
        const length = targetList.length
        list.forEach((item, i) => {
          item.mediaOrder = length + i
        })
        targetList.push(...list)
        this.mediaPlayLists[index].content = JSON.stringify(targetList)
      } catch (e) {
        this.toast('添加媒体列表失败', 'fail')
        console.log(e)
      }
    },
    // 头部点击回调
    onClickRight (icon) {
      if (icon === 'question-o') {
        this.$router.push({ path: '/question', query: { type: this.$router.path } })
      }
    },
    // 获取终端设备播放列表all
    getPlayList () {
      return getPlaylist(this.info.id)
        .then(res => {
          res.list.forEach(item => {
            const content = JSON.parse(item.content)
            content.sort((a, b) => a.mediaOrder - b.mediaOrder)
            item.content = JSON.stringify(content)
          })
          this.mediaPlayLists = res.list
        })
        .catch(e => { console.log(e) })
    },
    // 删除按钮
    deteleMedia (id) {
      // 删除提示dialog
      Dialog.confirm({
        title: '提示',
        message: '在播放列表中删除该媒体吗？'
      })
        .then(async () => {
        })
        .catch(() => {

        })
    },

    changeOrder (direction, target, index) {
      const targetList = JSON.parse(this.mediaPlayLists[index].content)
      const currentIndex = targetList.findIndex(item => item.mediaId === target.mediaId)
      const length = targetList.length
      if (direction === 'down' && currentIndex < length - 1) {
        const nextItem = targetList[currentIndex + 1]
        targetList.splice(currentIndex, 2, nextItem, target)
      } else if (direction === 'up' && currentIndex !== 0) {
        const nextItem = targetList[currentIndex - 1]
        targetList.splice(currentIndex - 1, 2, target, nextItem)
      }
      this.mediaPlayLists[index].content = JSON.stringify(targetList)
    },

    deleteMedia (target, index) {
      const targetList = JSON.parse(this.mediaPlayLists[index].content)
      const i = targetList.findIndex(item => item.mediaId === target.mediaId)
      if (i >= 0) {
      }
      console.log(targetList)
      this.mediaPlayLists[index].content = JSON.stringify(targetList)
    },

    // 确认播放列表修改
    async confirm () {
      this.toast('调整列表中', 'loading', 0)
      const ids = []
      const contents = []
      this.mediaPlayLists.forEach(item => {
        const content = JSON.parse(item.content)
        content.forEach((i, index) => {
          i.mediaOrder = index + 1
        })
        item.content = JSON.stringify(content)
        ids.push(item.id)
        contents.push(item.content)
      })
      await updateContent({ devid: this.info.id, ids: ids, contents: contents })
        .then(res => {
          this.toast(res.msg, 'success')
          // if (res.state === 1) {
          //   this.toast('正在上传新的播放列表<br/>请在【任务】标签卡中查看结果', 'html', 2000, false)
          // } else {
          //   this.toast('媒体发布任务失败', 'fail')
          // }
        })
        .catch(e => {
          console.log(e)
          this.toast('媒体发布任务失败', 'fail')
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
