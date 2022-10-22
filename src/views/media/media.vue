<template>
  <div class="media">
    <div class="my-media">
      <div class="my-media-img">
        <img src="../../assets/img/store.png" alt="" />
      </div>
      <div class="my-media-store">
        <p class="my-media-store--name">云空间</p>
        <div class="my-media-store--bar van-hairline--surround"></div>
        <p class="my-media-store--num">
          <span class="fl"
            >{{ (storageTotal - storageUsed) | filterstorage }}/{{
              storageTotal | filterstorage
            }}</span
          >
          <span class="fr">剩余{{ storageUnusedPrecent }}</span>
        </p>
      </div>
    </div>
    <!-- 素材列表 -->
    <div class="my-media-lists" ref="container">
      <div class="refresh-box">
        <Refresh-load
          ref="refresh"
          :options="refreshOption"
          @onLoad="loading"
          @onRefresh="onRefresh"
        >
          <transition name="van-fade">
            <div class="positionBox">
              <van-grid :border="true" :column-num="3" gutter="3px" v-if="show">
                <!-- 上传媒体列表 横 -->
                <template v-for="item in updataLists">
                  <van-grid-item class="material-img circle" :key="item.id">
                    <van-circle
                      v-model="item.progress"
                      :rate="100"
                      :speed="100"
                      :text="item.progress | progress"
                    />
                    <template v-if="item.state !== 1 && item.progress === 100">
                      <van-tag class="mediaTag" :type="item.state === -2 ? 'danger' : 'warning'">
                        {{ item.state === -2 ? '审核失败' : '审核中' }}
                      </van-tag>
                    </template>
                  </van-grid-item>
                </template>
                <!-- 媒体列表 横 -->
                <van-grid-item
                  class="material-img"
                  :key="item.id"
                  v-for="item in mediaLists"
                  v-tap="(e) => viewMedia(item)"
                >
                  <template v-if="item.mediaType === 0">
                    <img class="player" src="../../assets/img/player.png" alt="" />
                    <img class="mediaImg" :src="item.address" alt="" />
                  </template>
                  <template v-else>
                    <van-image fit="contain" class="mediaImg" :src="item.address" />
                    <!-- <img class="mediaImg" :src="item.address" alt=""> -->
                  </template>
                  <template v-if="item.state !== 1">
                    <van-tag class="mediaTag" :type="item.state === -2 ? 'danger' : 'warning'">
                      {{ item.state === 0 ? '审核失败' : '审核中' }}
                    </van-tag>
                  </template>
                </van-grid-item>
              </van-grid>
            </div>
          </transition>
          <transition name="van-fade">
            <div class="positionBox" v-if="!show">
              <!-- 上传媒体列表 竖 -->
              <!-- <template v-for="(item) in updataLists"> -->
              <media-list
                :playInfoArr="updataLists"
                :isDeviceInfo="false"
                @viewMedia="viewMedia"
              ></media-list>
              <!-- </template> -->
              <!-- 媒体列表  竖-->
              <!-- <template v-for="(item) in mediaLists"> -->
              <media-list :playInfoArr="mediaLists" @viewMedia="viewMedia"></media-list>
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
import { videoFrame } from '@/oss/ossconfig'
// 组件
import mediaList from './components/mediaList'
import RefreshLoad from '@/components/RefreshLoad/RefreshLoad'

import { getMediaList } from '@/api/media/media'
import { getUserInfo } from '@/api/system/system'
import { uploadMedia, mediaSave } from '@/api/media/uploader'
export default {
  mixins: [common],
  components: {
    mediaList,
    RefreshLoad,
  },
  name: 'media',
  computed: {
    ...mapGetters(['show', 'user']),
    storageUnusedPrecent() {
      if (isNaN((this.storageTotal - this.storageUsed) / this.storageTotal)) {
        return '0%'
      } else {
        return (((this.storageTotal - this.storageUsed) / this.storageTotal) * 100).toFixed(2) + '%'
      }
    },
    storageUsedPrecent() {
      return ((this.storageUsed / this.storageTotal) * 100).toFixed(2) + '%'
    },
  },
  data() {
    return {
      id: 0,
      videoFrame: videoFrame,
      updataLists: [], // 上传列表
      mediaLists: [], // 媒体列表
      test: {},
      storageTotal: 0,
      storageUsed: 0,
      totalCount: 0,
      count: 0,
      countTotal: 0,
      mediaType: {
        jpg: 1,
        jpeg: 1,
        bmp: 2,
      },
    }
  },
  filters: {
    filterstorage(val) {
      if (typeof val !== 'number') {
        return 0 + 'G'
      } else {
        return (val / 1024).toFixed(2) + 'G'
      }
    },
    progress(val) {
      if (typeof val !== 'number') {
        return 0 + '%'
      } else {
        return val.toFixed(2) + '%'
      }
    },
  },
  created() {
    // this.$store.dispatch('getUser')
    this.getUser()
  },
  mounted() {
    if (this.show) {
      this.$route.meta.rightIcon = ['add-o']
    } else {
      this.$route.meta.rightIcon = ['add-o']
    }
    this.container = this.$refs.container

    eventBus.$on('onClickRight', (icon) => {
      this.onClickRight(icon)
    })

    eventBus.$on('startUpload', (filelist) => {
      if (!Array.isArray(filelist)) {
        filelist = [filelist]
      }
      filelist.forEach((file) => {
        const info = this.createFileInfo(file.file)
        this.updataLists.push(info)
      })
      this.upload()
    })
  },
  beforeDestroy() {
    eventBus.$off('startUpload')
  },
  methods: {
    getUser() {
      getUserInfo()
        .then((res) => {
          this.storageUsed = res.user.storageUsed
          this.storageTotal = res.user.storageTotal
        })
        .catch((e) => console.log(e))
    },
    reset() {
      this.storageUsedPrecent = 0
      this.storageUnusedPrecent = 0
    },
    // 获取媒体列表
    getMediaLists() {
      return getMediaList(this.page)
        .then((res) => {
          this.mediaLists.push(...res.page.list)
          this.totalCount = res.page.totalCount
        })
        .catch((e) => {
          console.log(e)
          this.refreshOption.finished = true
        })
    },
    // 点击头部icon
    onClickRight(icon) {
      if (icon === 'question-o') {
        this.$router.push({
          path: '/question',
          query: { type: this.$route.path },
        })
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
    viewMedia(item) {
      this.$router.push({ path: '/mediaDetails', query: { id: item.id } })
    },
    // 加载数据
    async loading() {
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
    },
    // 判断是否加载完所有设备
    judge() {
      if (this.mediaLists.length >= this.totalCount) {
        return true
      } else {
        return false
      }
    },

    async upload() {
      const promiseUpload = []

      const promiseInfo = []
      try {
        this.updataLists.forEach((item) => {
          promiseUpload.push(this.createUploadPromise(item.file, item))
        })
        // 上传媒体至视频服务器
        const res = await Promise.allSettled(promiseUpload)
        res.forEach((item) => {
          const p = this.createInfoPromise(item.value, item.value.file)
          promiseInfo.push(p)
        })

        // 上传媒体信息
        await Promise.allSettled(promiseInfo).catch((e) => console.log(e))

        // 刷新列表
        this.updataLists = []

        this.onRefresh()
      } catch (e) {
        console.log(e)
      }
    },

    getId() {
      if (this.id > 99) {
        this.id = 1
      } else {
        this.id++
      }
      return this.id
    },

    // 创建上传信息
    createFileInfo(file) {
      const fileInfo = {}
      const type = file.type.split('/').pop()
      const name = (this.user.mobile || 'unknown') + '/' + new Date().getTime() + '.' + type
      fileInfo.id = this.getId()
      fileInfo.progress = 0
      fileInfo.name = name
      fileInfo.size = file.size / 1024
      fileInfo.mediaType = this.mediaType[type]
      fileInfo.length = 10
      fileInfo.state = -1
      fileInfo.file = file
      return fileInfo
    },

    // 上传文件媒体服务器
    async createUploadPromise(file, fileInfo) {
      const formData = new FormData()

      formData.append('file', file)

      return this.uploadMediaRequest(formData, (progressEvent) => {
        if (progressEvent.lengthComputable) {
          const currentProgress = ((progressEvent.loaded / progressEvent.total) * 100).toFixed(0)
          fileInfo.progress = parseInt(currentProgress)
        }
      })
        .then((res) => {
          return { ...res, file: fileInfo.file }
        })
        .catch((e) => console.log(e))
    },

    // 上传媒体信息
    createInfoPromise(res, file) {
      const dataForm = this.getSaveParams(res, file)

      return this.saveMediaRequest(dataForm)
    },

    // 获取上传媒体信息参数
    getSaveParams(res, file) {
      const dataForm = {}
      const type = file.type.split('/').pop()
      const name = (this.user.mobile || 'unknown') + '/' + new Date().getTime() + '.' + type
      dataForm.name = name
      dataForm.size = file.size / 1024
      dataForm.mediaType = this.mediaType[type]
      dataForm.address = res.url
      dataForm.length = 10

      return dataForm
    },

    // 媒体上传请求
    uploadMediaRequest(formData, file) {
      return uploadMedia(formData, file)
        .then((res) => {
          return { ...res, file }
        })
        .catch((e) => console.log(e))
    },

    // 媒体信息上传请求
    saveMediaRequest(data) {
      return mediaSave(data).catch((e) => {
        console.log(e)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
$bgc: #f6f6f6;
.media {
  height: 100%;
  background: $bgc;
  display: flex;
  flex-direction: column;
}
.my-media {
  height: 0.89rem;
  margin-bottom: 0.05rem;
  background: #ffffff;
  &-img {
    width: 1.08rem;
    height: 100%;
    padding: 0.14rem;
    box-sizing: border-box;
    float: left;
    & img {
      width: 100%;
      height: 100%;
    }
  }
  &-store {
    height: 100%;
    width: calc(100% - 1.08rem);
    float: left;
    box-sizing: border-box;
    padding-top: 0.14rem;
    padding-right: 0.15rem;
    &--name {
      font-size: 0.15rem;
      line-height: 0.15rem;
    }
    &--bar {
      margin: 0.1rem 0;
      border-color: #929292;
      height: 0.06rem;
    }
    &--num {
      font-size: 0.13rem;
      line-height: 0.13rem;
    }
  }
}
.my-media-lists {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  & > div {
    position: absolute;
    top: 0;
    left: 0;
  }
  & .van-grid-item__content {
    padding: 0;
  }
}
.grid-box {
  position: absolute;
  top: 0;
  left: 0;
}
.material-img {
  position: relative;
  &_status {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding: 0.1rem;
    & > div {
      height: 100%;
      width: 100%;
      align-items: flex-start;
    }
  }
}
.mediaImg {
  height: 100%;
  width: 100%;
}
.player {
  width: 0.28rem !important;
  height: 0.28rem !important;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
.mediaTag {
  height: 0.2rem;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
}
.percentage {
  height: 100%;
  width: 0;
  transition: all 0.5s;
  background: #1989f9;
}
.refresh-box {
  width: 100%;
  position: relative;
}
</style>
<style lang="scss">
$bgc: #f6f6f6;
.my-media-lists {
  & .van-grid-item__content {
    padding: 0;
    height: 1.2rem;
    overflow: hidden;
  }
}
.circle .van-grid-item__content {
  background: $bgc;
}
</style>
