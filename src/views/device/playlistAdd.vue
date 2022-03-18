<template>
  <div class="playlist-add">
    <div class="playlist-add-list">
      <refresh-load
        ref="refresh"
        :options='refreshOption'
        @onLoad='loading'
        @onRefresh='onRefresh'
        >
        <media-list
          :playInfoArr='mediaLists'
          isCheck
          :checkList.sync='checkList'
        ></media-list>
      </refresh-load>
    </div>
    <div class="btn">
      <van-button type="danger" @click="cancel">取消</van-button>
      <van-button type="info" @click="add">添加</van-button>
    </div>
  </div>
</template>

<script>
import common from '@/mixins/common'
import RefreshLoad from '@/components/RefreshLoad/RefreshLoad'
import MediaList from '../media/components/mediaList.vue'
import { getMediaList } from '@/api/media/media'
import eventBus from '@/utils/eventBus'
export default {
  name: 'playlist-add',

  components: { RefreshLoad, MediaList },

  mixins: [common],

  data () {
    return {
      mediaLists: [],
      checkList: [],
      index: 0,
      info: '',
      activeName: ''
    }
  },

  created () {
    this.checkList = []
    this.index = this.$route.query.index
    this.info = this.$route.query.info
    this.activeName = this.$route.query.activeName
  },

  mounted () {
    eventBus.$on('onClickLeft', this.cancel)

    this.$once('hook:beforeDestroy', () => {
      eventBus.$off('onClickLeft', this.cancel)
    })
  },

  methods: {
    cancel () {
      this.$router.push({ path: '/playList', query: { isCheck: false, info: this.info } })
    },
    add (arr) {
      const list = []
      this.checkList.forEach(item => {
        list.push({ mediaId: item.id, mediaTime: item.length ? item.length : 1, mediaOrder: undefined })
      })
      this.$router.push({ path: '/playList', query: { isCheck: true, index: this.index, info: this.info, list: JSON.stringify(list), activeName: this.activeName } })
    },
    getMediaLists () {
      return getMediaList(this.page)
        .then(res => {
          this.mediaLists.push(...res.page.list)
          this.totalCount = res.page.totalCount
        })
        .catch(e => {
          console.log(e)
          this.refreshOption.finished = true
        })
    },

    // 判断是否加载完所有设备
    judge () {
      return this.mediaLists.length >= this.totalCount
    },

    // 加载数据
    async loading () {
      // 判断是否为刷新状态，为刷新状态时 清空列表 刷新状态改为false
      if (this.refreshOption.refreshing) {
        this.mediaLists = []
        this.page = { page: 0, limit: 10 }
        this.refreshOption.refreshing = false
      }
      this.page.page += 1
      // 发送请求获取数据
      await this.getMediaLists()
      // 加载状态改为false
      this.refreshOption.loading = false
      // 获取的数据末尾判断
      const result = this.judge()
      if (result) {
        this.refreshOption.finished = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.playlist-add{
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden!important;
  box-sizing: border-box;
  &-list{
    flex: 1;
    padding: .05rem .1rem;
    overflow: auto;
    overflow-x: hidden;
  }
}
.btn{
  height: .39rem;
  width: 100%;
  & button{
    height: .39rem;
    line-height: .39rem;
    font-size: .17rem;
    width: 50%;
    border-radius: 0;
    border-bottom: none;
    border-right: none;
    border-left: none;
  }
}
</style>
