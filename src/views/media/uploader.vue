<<<<<<< HEAD
<template>
  <div class="box" @click="beforeRead">
    <div class="boxbtn"></div>
    <van-uploader ref="uploader" multiple :after-read='afterRead' v-model="fileList" accept='image/png,image/jpg,/image/jpeg' capture='camera'>
      <van-button icon="add-o" class="add-o" type="primary"></van-button>
    </van-uploader>
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus'
import common from '@/mixins/common'
import { OSSclient } from '@/oss/ossconfig'
// import { getTimes } from '@/utils/format'
import { mapGetters } from 'vuex'
export default {
  name: 'upploader',
  mixins: [common],
  computed: {
    ...mapGetters(['user'])
  },
  data () {
    return {
      fileList: [],
      // 当前分片上传进度点
      currentCheckpoint: '',
      // 上传人的手机号，上传人
      model: '',
      // 上传文件oss对象
      uploadFileClient: OSSclient,
      retryCount: 0,
      retryCountMax: 3,
      progressNum: 0,
      progressText: '0%',
      Attributes: [
        { key: 'progressNum', value: 0 },
        { key: 'success', value: false },
        { key: 'error', value: false },
        { key: 'oldSize', value: false },
        // { key: 'progressText', value: '0%' },
        // { key: 'length', value: false },
        { key: 'mediaType', value: -1 },
        // { key: 'currentRate', value: 0 },
        { key: 'showState', value: false }
      ],
      mediaType: {
        mp4: 0,
        jpg: 1,
        jpeg: 1,
        png: 2
      }
    }
  },
  methods: {
    beforeRead (file) {
      if (this.user.storageUsed === this.user.storageTotal) {
        this.toast('云空间已满，请删除不需要的媒体', 'text')
        return
      }
      this.$refs.uploader.chooseFile()
    },
    afterRead (files) {
      let size = 0

      if (files instanceof Array) {
        files.forEach(file => {
          size += file.file.size
        })
      } else {
        size = files.file.size
      }

      size = size / 1024 / 1024
      if (this.user.storageTotal < this.user.storageUsed + size) {
        this.toast('云空间不足，请删除不需要的媒体', 'text')
        return
      }

      if (files instanceof Array) {
        for (let i = 0; i < files.length; i++) {
          setTimeout(() => {
            const date = new Date().getTime() + i
            this.uploadFile(OSSclient, files[i], date)
          }, 2000)
        }
      } else {
        this.uploadFile(OSSclient, files)
      }
    },
    // 进度
    progress (p, checkpoint) {
      const that = this
      if (!checkpoint) return
      that.currentCheckpoint = checkpoint
      const progress = Math.floor(p * 100)
      // const progressText = `${Math.floor(p * 100)}%`
      const index = this.fileList.findIndex(item => {
        return item.ossKey === checkpoint.file.ossKey
      })
      this.setAttributes(index, progress, checkpoint)
      eventBus.$emit('progress', checkpoint, this.fileList)
    },
    // 上传文件
    uploadFile (client, file, date = new Date().getTime()) {

      const that = this

      if (!that.uploadFileClient || Object.keys(that.uploadFileClient).length === 0) {
        that.uploadFileClient = client
      }

      // 创建属性
      // this.createAttributes(file.file)

      // 上传文件名称
      // const date = date

      const type = file.file.type.slice(file.file.type.lastIndexOf('/') + 1).toLowerCase()

      file.file.mediaType = that.mediaType[type]

      file.file.oldSize = Math.ceil(file.file.size / 1024)

      // 用户名 (文件夹名称)/ 年 + 月 + 时 + 分 + 秒（文件名）+ 文件类型格式
      const key = (that.user.mobile || 'unknown') + '/' + date + '.' + type

      // oss object name
      file.ossKey = key

      file.file.ossKey = key

      // 获取文件播放时长
      if (file.file.mediaType === 0) {
        this.getLength(file.file)
      } else {
        file.file.length = 10
      }

      // 上传文件的配置信息
      const options = {
        // 进度监听
        progress: that.progress,
        // 上传大小？？
        // partSize: 500 * 1024,
        // 上传文件信息描述
        meta: {
          year: date,
          people: that.user.mobile || 'unknown',
          author: key
        },
        // 超时
        timeout: 60000
      }
      if (that.currentCheckpoint) {
        options.checkpoint = that.currentCheckpoint
      }
      // 上传方法
      eventBus.$emit('startUpload', that.fileList)
      that.uploadFileClient.multipartUpload(key, file.file, options)
        .then((res) => {
          that.currentCheckpoint = null
          that.uploadFileClient = null
          // console.log(res)
          eventBus.$set(file, 'success', true)
          eventBus.$emit('uploadSuccess', res, that.fileList)
          // console.log(res)
        })
        .catch((err) => {
          if (that.uploadFileClient && that.uploadFileClient.isCancel()) {
            eventBus.$emit('uploadPause')
          } else {
            console.error(err)
            if (err.name.toLowerCase().indexOf('connectiontimeout') !== -1) {
              if (that.retryCount < that.retryCountMax) {
                that.retryCount++
                console.error(`retryCount : ${that.retryCount}`)
                // 重试 重新上传
                this.uploadFile(client, file)
              } else {
                // 提示上传失败
                this.$set(file, 'error', true)
                eventBus.$emit('uploadError', err, that.fileList)
              }
            } else {
              eventBus.$emit('uploadError', err, that.fileList)
            }
          }
        })
    },
    // 创建属性
    createAttributes (file) {
      this.Attributes.forEach(item => {
        this.$set(file, item.key, item.value)
      })
    },
    // 设置属性
    setAttributes (index, progress, checkpoint) {
      this.$set(this.fileList[index].file, 'progressNum', progress)
      this.$set(this.fileList[index].file, 'oldSize', checkpoint.fileSize / 1024)
      if (progress === 100) {
        this.$set(this.fileList[index].file, 'success', true)
        this.$set(this.fileList[index].file, 'showState', true)
      } else {
        this.$set(this.fileList[index].file, 'success', false)
        this.$set(this.fileList[index].file, 'showState', false)
      }
    },
    // 获取播放时长
    getLength (file) {
      var video = document.createElement('video')
      video.src = URL.createObjectURL(file)
      video.addEventListener('loadedmetadata', () => {
        file.length = video.duration
        video.remove()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.box{
  position: relative;
  display: inline-block;
}
.boxbtn{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}
.add-o{
  background: transparent;
  border-color: none;
  border: none;
  padding: 0;
  padding-left: .1rem;
  & i{
    color: #000;
    font-weight: 600;
    font-size: .21rem;
  }
}
</style>
=======
<template>
  <div class="box" @click="beforeRead">
    <div class="boxbtn"></div>
    <van-uploader
      ref="uploader"
      multiple
      :after-read="afterRead"
      v-model="fileList"
      :accept="accept"
      capture="camera"
    >
      <van-button icon="add-o" class="add-o" type="primary"></van-button>
    </van-uploader>
  </div>
</template>

<script>
import eventBus from "@/utils/eventBus";
import common from "@/mixins/common";
import { mapGetters } from "vuex";
export default {
  name: "up-loader",
  mixins: [common],
  computed: {
    ...mapGetters(["user"]),
  },
  data() {
    return {
      fileList: [],
      accept: "image/bmp,image/jpeg,image/png",
    };
  },
  methods: {
    beforeRead() {
      if (this.user.storageUsed === this.user.storageTotal) {
        this.toast("云空间已满，请删除不需要的媒体", "text");
        return;
      }
      this.$refs.uploader.chooseFile();
    },

    afterRead(files) {
      let size = 0;

      if (files instanceof Array) {
        files.forEach((file) => {
          size += file.file.size;
        });
      } else {
        size = files.file.size;
      }

      size = size / 1024 / 1024;
      if (this.user.storageTotal < this.user.storageUsed + size) {
        this.toast("云空间不足，请删除不需要的媒体", "text");
        return;
      }

      eventBus.$emit("startUpload", files);
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  position: relative;
  display: inline-block;
}
.boxbtn {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}
.add-o {
  background: transparent;
  border-color: none;
  border: none;
  padding: 0;
  padding-left: 0.1rem;
  & i {
    color: #000;
    font-weight: 600;
    font-size: 0.2rem;
  }
}
</style>
>>>>>>> 6d726aca7b36707575d3d47ca165a0a551942d2e
