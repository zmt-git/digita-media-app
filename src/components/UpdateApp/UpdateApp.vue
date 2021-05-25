<template>
  <van-popup v-model="show" class="updatePopup" :close-on-click-overlay='closeBtn'>
    <div class="update">
      <header class="header van-hairline--bottom">
        <h3 class="header_title">新版本体验邀请</h3>
      </header>
      <section class="section">
        <!-- <div class="section_title">
          <img class="logo" src="../../assets/img/logo.png" alt="">
          <img class="name" src="../../assets/img/updateAppName.png" alt="">
        </div> -->
        <ul class="section_lists">
          <li :key="index" v-for="(item, index) in description">
            <i class="iconfont icon icon-update-point"></i>
            <p>{{item}}</p>
          </li>
        </ul>
        <div class="section_progress a1progress" v-show="showProgress">
          <div class="progress_box">
            <div class="progress_box--fill" :style="{width: progress + '%'}">{{progress > 0 ? progress + '%' : ''}}</div>
          </div>
          <p class="updating">{{loadStatus}}<van-loading class="loading" type="spinner" size="10px" color="#1989fa"/></p>
        </div>
      </section>
      <footer class="footer van-hairline--top">
        <div>
          <van-button class="footer_btn footer_btn--left" style='color: #6f6f6f;' type="default" @click="cancel">忽略新版本</van-button>
          <van-button class="footer_btn footer_btn--right" style="color: #1989fa;" :loading='loading' loading-text='下载中' type="default" @click="downLoad">{{downTit}}</van-button>
        </div>
      </footer>
    </div>
  </van-popup>
</template>

<script>
import { onDownload } from './update'
import { mapGetters } from 'vuex'
import { Toast } from 'vant'
export default {
  name: 'updateApp',
  props: {
    closeBtn: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['newestVersion'])
  },
  data () {
    return {
      downTit: '立即更新',
      loading: false,
      window: window,
      show: false,
      progress: 0,
      showProgress: false,
      loadStatus: '下载中',
      fileName: 'digitalMedia',
      savePath: '',
      description: []
    }
  },
  methods: {
    // 显示更新界面
    showDialog (info) {
      // 获取下载地址3
      this.appInfo = info
      this.show = true
      this.downTit = '立即更新'
      this.loading = false
      this.progress = 0
      this.$nextTick(() => {
        this.description = this.appInfo.content.split('##')
      })
    },
    // 下载app
    downLoad () {
      this.$nextTick(() => {
        const str = new Date().getTime()
        this.showProgress = true
        this.fileName = this.appInfo.name + str
        this.savePath = this.appInfo.url
        // const startindex = this.appInfo.url.lastIndexOf('/') + 1
        // const endindex = this.appInfo.url.lastIndexOf('.')
        // this.fileName = this.appInfo.url.slice(startindex, endindex)
        const that = this
        // 1.设置请求参数(请求地址)
        this.loading = true
        try {
          onDownload(that)
        } catch (e) {
          console.log(e)
        }
      })
    },
    Downloaderror () {
      this.loading = false
      this.progress = 0
      this.showProgress = false
      this.downTit = '重新下载'
    },
    // 关闭更新弹框
    cancel () {
      if (this.appInfo.isRequire === 'true') {
        // eslint-disable-next-line
         navigator.app.exitApp() // 退出app
      } else {
        this.show = false
        this.loading = false
        this.progress = 0
        this.showProgress = false
        this.downTit = '立即更新'
      }
    },
    toast (msg, type = 'success', duration = 1500) {
      Toast({
        message: msg,
        type: type,
        duration: duration,
        forbidClick: true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.updatePopup{
  border-radius: .16rem;
  overflow: hidden;}
.update{
  width: 2.3rem;
  background: #eeeeee;
  display: flex;
  flex-direction: column;
  position: relative;}
.loading{
  display: inline-block;}
.header{
  background: linear-gradient(to right, #3290e8 , #3290e8);
  height: .5rem;
  &_title{
    font-size: .15rem;
    font-weight: 100;
    line-height: .5rem;
    text-align: center;
    color: #fff;}
}
.section{
  flex: 1;
  box-sizing: border-box;
  padding: 0 .16rem;
  display: flex;
  flex-direction: column;
  &_title{
    height: 1.23rem;
    text-align: center;
  }
  &_lists{
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    margin: .1rem 0;
    li{
      line-height: .29rem;
      font-size: .14rem;
      display: flex;
    }
  }
  &_progres{
    height: .38rem;
  }
}
.name{
  height: .16rem;
  margin-top: .11rem;
}
.footer{
  height: .45rem;
  &_btn{
    width: 50%;
    height: .45rem;
    line-height: .45rem;
    background: #eee;
    border-color: #b5b5b5;}
  &_btn--right{
    border-right: 0;}
  &_btn--left{
    border-right: 0;
    border-left: 0;}
}
.progress{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 .05rem;
  &_box{
    height: .14rem;
    width: 100%;
    border-radius: .1rem;
    background: #f4f4f4;
    overflow: hidden;
    &--fill{
      width: 30%;
      height: 100%;
      background: #1989fa;
      transition: all .1s;
      font-size: .05rem;
      text-align: right;
      line-height: 0.14rem;
      color: #fff;}
  }
}
.footer_btn{
  font-size: .14rem;
}
.updating{
  text-align: center;
  line-height: .25rem;}
.icon{
  margin-right: .07rem;
  color: #1989fa;}
.logo{
  width: .5rem;
  height: .5rem;
  display: block;
  margin: 0 auto;
  padding-top: .21rem;}
.confirm{
  width: 100%;}
</style>
