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
import { mapGetters } from 'vuex'
import { uploadMedia, mediaSave } from '@/api/media/uploader'
import { Toast } from 'vant'
export default {
  name: 'upploader',
  mixins: [common],
  computed: {
    ...mapGetters(['user'])
  },
  data () {
    return {
      id: 1,
      fileList: [],
      mediaType: {
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
            this.uploadFile(files[i].file)
          }, 2000)
        }
      } else {
        this.uploadFile(files.file)
      }
    },
    // 上传文件
    async uploadFile (file, date = new Date().getTime()) {
      const fileInfo = this.getUploadInfo(file)

      eventBus.$emit('startUpload', fileInfo)

      const formData = new FormData()

      formData.append('file', file)

      const res = await this.uploadMediaRequest(formData, (progressEvent) => {
        if (progressEvent.lengthComputable) {
          const currentProgress = (progressEvent.loaded / progressEvent.total * 100).toFixed(0)
          fileInfo.progress = currentProgress
          eventBus.$emit('progress', fileInfo)
        }
      })

      if (res) {
        const dataForm = this.getSaveParams(res, file)

        const result = await this.saveMediaRequest(dataForm)

        if (result) {
          eventBus.$emit('uploadSuccess', fileInfo)
        } else {
          eventBus.$emit('uploadError', fileInfo)
          Toast.fail('上传失败')
        }
      } else {
        eventBus.$emit('uploadError', fileInfo)
        Toast.fail('上传失败')
      }
    },

    uploadMediaRequest (formData, onprogress) {
      return uploadMedia(formData, onprogress)
        .then(res => {
          return res
        })
        .catch(e => console.log(e))
    },

    saveMediaRequest (data) {
      return mediaSave(data)
        .then(res => {
          return true
        })
        .catch(e => {
          console.log(e)
          return false
        })
    },
    getId () {
      if (this.id > 99) {
        this.id = 1
      } else {
        this.id++
      }
      return this.id
    },

    getUploadInfo (file) {
      const fileInfo = {}
      const type = file.type.split('/').pop()
      const name = (this.user.mobile || 'unknown') + '/' + new Date().getTime() + '.' + type
      fileInfo.id = this.getId()
      fileInfo.progress = 0
      fileInfo.name = name
      fileInfo.size = file.size / 1024
      fileInfo.mediaType = this.mediaType[type]
      fileInfo.length = 10
      return fileInfo
    },

    getSaveParams (res, file) {
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
