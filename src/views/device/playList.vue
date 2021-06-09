<template>
  <div class="playList">
    <div class="list">
      <scenes-list scenes='weatherScenes'></scenes-list>
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
