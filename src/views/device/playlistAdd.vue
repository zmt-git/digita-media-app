<template>
  <div class="playlist-add">
    <Refresh-load
      ref="refresh"
      :options='refreshOption'
      @onLoad='loading'
      @onRefresh='onRefresh'
      >
      <play-item disabled :play-info="item" v-for="item in mediaLists" :key="item.id"></play-item>
    </Refresh-load>
  </div>
</template>

<script>
import common from '@/mixins/common'
import PlayItem from './components/playItem'
import { getMediaList } from '@/api/media/media'

export default {
  name: 'playlist-add',

  components: { PlayItem },

  mixins: [common],

  data () {
    return {
      mediaLists: []
    }
  },

  methods: {
    getMediaLists () {
      return getMediaList(this.page)
        .then(res => {
          this.mediaLists.concat(res.page.list)
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
.playList{
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden!important;
}
</style>
