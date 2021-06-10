<template>
  <div class="playList">
    <div class="list">
      <van-tabs v-model="activeName" sticky :offset-top="46">
        <template  v-for="(scene) in scenes">
          <van-tab :title="item.title" :name="item.type" :key="item.type" v-for="item in scene">
            <scenes-list :list='mediaPlayLists' :index='item.index'></scenes-list>
          </van-tab>
        </template>
      </van-tabs>
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

    id () {
      return this.info.id
    },

    scenes () {
      const scenes = deviceTypeArr.find(item => item.text === this.info.type)
      return scenes ? scenes.scenes : deviceTypeArr[0].scenes
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
    this.info = this.$route.query.info
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
      return getPlaylist(this.id)
        .then(res => {
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

    // 确认播放列表修改
    async confirm () {
      this.toast('调整列表中', 'loading', 0)
      const ids = []
      const contents = []
      this.mediaPlayLists.forEach(item => {
        ids.push(item.id)
        contents.push(item.content)
      })
      await updateContent({ devid: this.id, ids: ids, contents: contents })
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
