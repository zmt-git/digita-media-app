<template>
  <div class="qrscanner">
    <!-- 关闭 -->
    <van-icon name="cross close" @click="close"/>
    <!-- 扫描区域 -->
    <div class="qrscanner-area">
      <!-- 扫描线 -->
      <div class="through-line"></div>
    </div>
    <div class="btnBox">
      <div class="btnBox-item" @touchstart='setStyle(1)' @touchend='setStyle(0)' :class="style1" @click="setLight">
        <i class="iconfont icon-shoudiantong"></i>
      </div>
      <div class="btnBox-item" @touchstart='setStyle(2)' @touchend='setStyle(0)' :class="style2" @click="setFontCamera">
        <i class="iconfont icon-xuanzhuanshexiangtou"></i>
      </div>
    </div>
  </div>
</template>

<script>
import common from '@/mixins/common'
export default {
  name: 'qrscanner',

  mixins: [common],

  data () {
    return {
      light: true,
      frontCamera: true,
      style2: {},
      style1: {},
      style: {
        background: 'rgba(204,204,204,.8)'
      }
    }
  },

  mounted () {
    this.prepare(this.onDone)
  },

  methods: {
    close () {
      const _this = this
      // eslint-disable-next-line
      QRScanner.destroy((status) =>{
        _this.$router.go(-1)
      })
      document.getElementsByTagName('html').style.backgroundColor = '#fff'
    },

    setStyle (n) {
      if (n === 0) {
        this.style1 = {}
        this.style2 = {}
      } else {
        this[`style${n}`] = this.style
      }
    },

    prepare (onDone) {
      // eslint-disable-next-line
      QRScanner.prepare(onDone)
    },

    onDone (err, status) {
      const _this = this
      if (err) {
        console.error(err)
      }
      if (status.authorized) {
      // eslint-disable-next-line
        QRScanner.destroy()
        // 绑定扫描监听
        // eslint-disable-next-line
        QRScanner.scan(_this.displayContents)

        // 开始扫描，需要将页面的背景设置成透明
        // eslint-disable-next-line
        QRScanner.show()
      } else if (status.denied) {
        this.toast('用户拒绝访问摄像头', 'fail')
      } else {
      }
    },

    displayContents (err, text) {
      const _this = this
      if (err) {
        _this.toast('启动扫描出错啦, 稍后重试', 'fail')
      } else {
        _this.scanResult = text
        const result = _this.judgeSerialNumber()

        if (!result) {
          _this.$router.go(-1)
          _this.toast('无效的序列号', 'fail')
          return
        }
        _this.$router.push({ path: '/deviceAddorEdit', query: { isAdd: true, devCode: _this.scanResult } })
      }
    },
    // 判断序列号是否是ELF或elf开头
    judgeSerialNumber () {
      const SerialNumberhead = this.scanResult.slice(0, 3).toLowerCase()
      if (SerialNumberhead === 'elf') {
        return true
      } else {
        return false
      }
    },

    setLight () {
      if (this.light) {
        // eslint-disable-next-line
        QRScanner.enableLight()
      } else {
        // eslint-disable-next-line
        QRScanner.disableLight()
      }
      this.light = !this.light
    },

    setFontCamera () {
      if (this.frontCamera) {
        // eslint-disable-next-line
        QRScanner.useFrontCamera()
      } else {
        // eslint-disable-next-line
        QRScanner.useBackCamera()
      }
      this.frontCamera = !this.frontCamera
    }
  }
}
</script>

<style lang="scss" scoped>

.qrscanner{
  width: 100%;
  height: 100%;
  position: relative;
  // background: rgba(0, 0, 0, .1);
}
.close{
  position: absolute;
  top: .2rem;
  font-size: .2rem;
  color: #fff;
  left: .2rem;
}
.qrscanner-area{
  width: 2.5rem;
  height: 2.5rem;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  border: 1px solid #00fc5f;
  overflow: hidden;
}
.through-line{
  height: 1px;
  background: #00fc5f;
  animation: myfirst 2s linear infinite;
}
// .through-line{}
.btnBox{
  width: 100%;
  position: absolute;
  bottom: .5rem;
  left: 0;
  display: flex;
  justify-content: space-around;
  &-item{
    width: .45rem;
    height: .45rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(204, 204, 204, .6);
    border-radius: 50%;
    transition: all .5s;
    & i{
      font-size: .2rem;
      color: #fff
    }
  }
}
@keyframes myfirst{
  0% {transform: translateY(-.01rem)}
  100% {transform: translateY(2.6rem)}
}
</style>
