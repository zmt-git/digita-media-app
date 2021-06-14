<template>
  <div class="media">
    <div class="my-media">
      <div class="my-media-img">
        <img src="../../assets/img/store.png" alt="">
      </div>
      <div class="my-media-store">
        <p class="my-media-store--name">云空间</p>
        <div class="my-media-store--bar van-hairline--surround" ></div>
        <p class="my-media-store--num">
          <span class="fl">{{storageTotal-storageUsed | filterstorage}}/{{storageTotal | filterstorage}}</span>
          <span class="fr">剩余{{storageUnusedPrecent}}</span>
        </p>
      </div>
    </div>
    <!-- 素材列表 -->
    <div class="my-media-lists" ref="container">
      <div class="refresh-box">
        <Refresh-load
          ref="refresh"
          :options='refreshOption'
          @onLoad='loading'
          @onRefresh='onRefresh'
          >
          <transition name="van-fade">
            <div class="positionBox">
              <van-grid :border="true" :column-num="3" gutter='3px' v-if="show">
                <!-- 上传媒体列表 横 -->
                <template v-for='(item) in updataLists'>
                  <van-grid-item
                    class="material-img circle"
                    :key='item.osskey'
                  >
                    <van-circle
                      v-model="item.file.progress"
                      :rate='100'
                      :speed='100'
                      :text="item.file.progress | progress"
                    />
                    <template v-if="item.file.state !== 1 && item.file.showState">
                      <van-tag class="mediaTag" :type="item.state === -2 ? 'danger' : 'warning'">
                        {{item.state === 0 ? '审核失败' : '审核中'}}
                      </van-tag>
                    </template>
                  </van-grid-item>
                </template>
                <!-- 媒体列表 横 -->
                <van-grid-item
                  class="material-img"
                  :key="item.id"
                  v-for="(item) in mediaLists"
                  v-tap="(e)=>viewMedia(item)"
                  >
                  <template v-if="item.mediaType === 0">
                    <img class="player" src="../../assets/img/player.png" alt="">
                    <img class="mediaImg" :src="item.addressOld + videoFrame" alt="">
                  </template>
                  <template v-else>
                    <img class="mediaImg" :src="item.addressOld" alt="">
                  </template>
                  <template v-if="item.state !== 1">
                    <van-tag class="mediaTag" :type="item.state === -2 ? 'danger' : 'warning'">
                      {{item.state === 0 ? '审核失败' : '审核中'}}
                    </van-tag>
                  </template>
                </van-grid-item>
              </van-grid>
            </div>
          </transition>
          <transition name='van-fade'>
            <div class="positionBox" v-if="!show">
              <!-- 上传媒体列表 竖 -->
              <!-- <template v-for="(item) in updataLists"> -->
                <media-list
                  :playInfoArr='updataLists'
                  :isDeviceInfo='false'
                  @viewMedia='viewMedia'
                ></media-list>
              <!-- </template> -->
              <!-- 媒体列表  竖-->
              <!-- <template v-for="(item) in mediaLists"> -->
                <media-list
                  :playInfoArr='mediaLists'
                  @viewMedia='viewMedia'
                ></media-list>
              <!-- </template> -->
            </div>
          </transition>
        </Refresh-load>
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus'
import common from '@/mixins/common'
import { mapGetters } from 'vuex'
import { downloadFile, videoFrame } from '@/oss/ossconfig'
// 组件
import mediaList from './components/mediaList'
import RefreshLoad from '@/components/RefreshLoad/RefreshLoad'

import { getMediaList } from '@/api/media/media'
import { mediaSave } from '@/api/media/uploader'
import { getUserInfo } from '@/api/system/system'
export default {
  mixins: [common],
  components: {
    mediaList, RefreshLoad
  },
  name: 'media',
  computed: {
    ...mapGetters(['show', 'user']),
    storageUnusedPrecent () {
      if (isNaN((this.storageTotal - this.storageUsed) / this.storageTotal)) {
        return '0%'
      } else {
        return (((this.storageTotal - this.storageUsed) / this.storageTotal) * 100).toFixed(2) + '%'
      }
    },
    storageUsedPrecent () {
      return ((this.storageUsed / this.storageTotal) * 100).toFixed(2) + '%'
    }
  },
  data () {
    return {
      videoFrame: videoFrame,
      updataLists: [], // 上传列表
      mediaLists: [], // 媒体列表
      test: {},
      storageTotal: 0,
      storageUsed: 0,
      totalCount: 0,
      count: 0,
      countTotal: 0
    }
  },
  filters: {
    filterstorage (val) {
      if (typeof (val) !== 'number') {
        return 0 + 'G'
      } else {
        return (val / 1024).toFixed(2) + 'G'
      }
    },
    progress (val) {
      if (typeof (val) !== 'number') {
        return 0 + '%'
      } else {
        return val.toFixed(2) + '%'
      }
    }
  },
  created () {
    // this.$store.dispatch('getUser')
    this.getUser()
  },
  mounted () {
    if (this.show) {
      this.$route.meta.rightIcon = ['orders-o', 'add-o']
    } else {
      this.$route.meta.rightIcon = ['apps-o', 'add-o']
    }
    this.container = this.$refs.container
    eventBus.$on('onClickRight', (icon) => {
      this.onClickRight(icon)
    })
    eventBus.$on('progress', (checkpoint, fileList) => {
      this.progress(checkpoint, fileList)
    })
    eventBus.$on('uploadSuccess', (res, fileList) => {
      this.uploadSuccess(res, fileList)
    })
    eventBus.$on('uploadError', (res, fileList) => {
      this.uploadError(res, fileList)
    })
    eventBus.$on('startUpload', (fileList) => {
      this.startUpload(fileList)
    })
  },
  beforeDestroy () {
    eventBus.$off('progress')
    eventBus.$off('uploadSuccess')
    eventBus.$off('uploadError')
    eventBus.$off('startUpload')
  },
  methods: {
    getUser () {
      getUserInfo()
        .then(res => {
          this.storageUsed = res.user.storageUsed
          this.storageTotal = res.user.storageTotal
        })
        .catch(e => console.log(e))
    },
    // 获取oss地址
    getSrc (name) {
      if (name) {
        return downloadFile(name)
      } else {
        return ''
      }
    },
    reset () {
      this.storageUsedPrecent = 0
      this.storageUnusedPrecent = 0
    },
    // 获取媒体列表
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
    // 点击头部icon
    onClickRight (icon) {
      if (icon === 'question-o') {
        this.$router.push({ path: '/question', query: { type: this.$route.path } })
      } else if (icon === 'add-o') {
        // 照片视频素材上传
        // uploadMedia(this)
      } else {
        if (icon === 'orders-o') {
          this.$route.meta.rightIcon = ['apps-o', 'add-o']
          this.$store.commit('SET_MEDIA_LIST', false)
        } else {
          this.$route.meta.rightIcon = ['orders-o', 'add-o']
          this.$store.commit('SET_MEDIA_LIST', true)
        }
      }
    },
    // 查看媒体详情
    viewMedia (item) {
      this.$router.push({ path: '/mediaDetails', query: { id: item.id } })
    },
    // 加载数据
    async loading () {
      // 判断是否为刷新状态，为刷新状态时 清空列表 刷新状态改为false
      if (this.refreshOption.refreshing) {
        this.mediaLists = []
        this.updataLists = []
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
    },
    // 判断是否加载完所有设备
    judge () {
      if (this.mediaLists.length >= this.totalCount) {
        return true
      } else {
        return false
      }
    },
    // 开始上传
    startUpload (fileList) {
      this.toast('上传中', 'loading', 0, false)
      this.updataLists = []
      this.updataLists.push(...fileList)
      this.count = 0
      this.countTotal = this.updataLists.length
    },
    // 设置上传进度
    progress (checkpoint, fileList) {
      this.toast('上传中', 'loading', 0, false)
      this.updataLists = []
      this.updataLists.push(...fileList)
      // 解决无法更新视图bug
      this.updataLists.forEach(item => {
        this.$set(item.file, 'progress', item.file.progress)
        this.$set(item.file, 'oldSize', item.file.oldSize)
        this.$set(item.file, 'length', item.file.length)
        this.$set(item.file, 'mediaType', item.file.mediaType)
      })
    },
    // 上传成功
    async uploadSuccess (res, fileList) {
      this.updataLists = fileList

      // 删除上传列表对应的dome

      const index = this.updataLists.findIndex(item => {
        return item.ossKey === res.name
      })

      // 添加媒体
      const endIndex = res.res.requestUrls[0].indexOf('?uploadId')

      let addressOld = ''
      if (endIndex !== -1) {
        addressOld = res.res.requestUrls[0].slice(0, endIndex)
      } else {
        addressOld = res.res.requestUrls[0]
      }

      await mediaSave({
        addressOld: addressOld,
        oldSize: Math.ceil(this.updataLists[index].file.oldSize),
        length: Math.ceil(this.updataLists[index].file.length),
        mediaType: this.updataLists[index].file.mediaType,
        name: res.name
      })
        .then(res => {
          this.toast('上传成功', 'success')
        })
        .catch(err => {
          this.toast('上传失败', 'fail')
          console.log(err)
        })

      this.count++

      this.updataLists.splice(index, 1)

      if (this.count === this.countTotal) {
        // 上传成功 获取媒体list默认前10条
        this.updataLists = []

        this.mediaLists = []

        this.refreshOption.refreshing = true

        this.onRefresh()
      }

      this.getUser()
    },
    // 上传失败
    uploadError (res, fileList) {
      this.toast('上传失败', 'fail')
      this.updataLists = fileList
      const index = this.updataLists.findIndex(item => {
        return item.osskey === res.name
      })
      this.updataLists.splice(index, 1)

      this.count++

      if (this.count === this.countTotal) {
        // 上传成功 获取媒体list默认前10条
        this.updataLists = []

        this.mediaLists = []

        this.refreshOption.refreshing = true

        this.onRefresh()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$bgc: #f6f6f6;
.media{
  height: 100%;
  background: $bgc;
  display: flex;
  flex-direction: column;
}
.my-media{
  height: .89rem;
  margin-bottom: .05rem;
  background: #ffffff;
  &-img{
    width: 1.08rem;
    height: 100%;
    padding: .14rem;
    box-sizing: border-box;
    float: left;
    & img{
      width: 100%;
      height: 100%;
    }
  }
  &-store{
    height: 100%;
    width: calc(100% - 1.08rem);
    float: left;
    box-sizing: border-box;
    padding-top: .14rem;
    padding-right: .15rem;
    &--name{
      font-size: .15rem;
      line-height: .15rem;
    }
    &--bar{
      margin: .1rem 0;
      border-color: #929292;
      height: .06rem;
    }
    &--num{
      font-size: .13rem;
      line-height: .13rem;
    }
  }
}
.my-media-lists{
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  & > div{
    position: absolute;
    top: 0;
    left: 0;
  }
  & .van-grid-item__content{
    padding: 0;
  }
}
.grid-box{
  position: absolute;
  top: 0;
  left: 0;
}
.material-img{
  position: relative;
  &_status{
    position: absolute;
    bottom: 0;
    left: 0;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding: .1rem;
    & > div{
      height: 100%;
      width: 100%;
      align-items: flex-start
    }
  }
}
.mediaImg{
  max-height: 100%;
  max-width: 100%;
}
.player{
  width: .28rem!important;
  height: .28rem!important;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
.mediaTag{
  height: .2rem;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
}
.percentage{
  height: 100%;
  width: 0;
  transition: all .5s;
  background: #1989f9;
}
.refresh-box{
  width: 100%;
  position: relative;
}
</style>
<style lang="scss">
$bgc: #f6f6f6;
.my-media-lists{
  & .van-grid-item__content{
    padding: 0;
    height: 1.2rem;
    overflow: hidden;
  }
}
.circle .van-grid-item__content{
  background: $bgc;
}
</style>
