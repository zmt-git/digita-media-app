<template>
  <div class="playList">
    <div class="list">
      <van-tabs v-model="activeName" sticky :offset-top="46">
        <van-tab title="默认场景" name="weatherScenes">
          <scenes-list scenes='weatherScenes'></scenes-list>
        </van-tab>
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
import { listMediaAll, MediaAdjustment } from '@/api/device/playList'
import { Dialog } from 'vant'
import ScenesList from './components/ScenesList.vue'
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
