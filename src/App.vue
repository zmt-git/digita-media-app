<template>
  <div id="app">
    <router-view/>
    <update-app ref="updateApp" :appInfo='appInfo'></update-app>
  </div>
</template>
<script>
import { Toast } from 'vant'
import { freelogin } from '@/api/system/system'
import { mapGetters } from 'vuex'
import { setToken, removeToken, getToken } from '@/utils/auth'
import UpdateApp from './components/UpdateApp/UpdateApp.vue'
import { websocketDestroy, initWebSocket } from './utils/websocket'
import eventBus from './utils/eventBus'
export default {
  name: 'app',

  components: {
    UpdateApp
  },

  computed: {
    ...mapGetters(['AppVersion', 'websocket', 'isImgview'])
  },

  data () {
    return {
      Splash: false,
      second: 5,
      myTime: null,
      exitAppTicker: 0,
      homePage: ['/', '/media', '/task', '/mine', '/login'],
      latestVersion: '',
      currentVersion: '',
      appInfo: {}
    }
  },

  async created () {
    if (!this.websocket && getToken()) {
      websocketDestroy()
      initWebSocket()
    }
    this.resume()
  },

  mounted () {
    // eslint-disable-next-line no-undef
    StatusBar.overlaysWebView(false)

    const route = this.$route
    // eslint-disable-next-line no-undef
    if (route.path === '/mine' || route.path === '/login') {
      // StatusBar.styleBlackTranslucent()
      // eslint-disable-next-line no-undef
      StatusBar.backgroundColorByHexString('#398AFA')
      // eslint-disable-next-line no-undef
      StatusBar.styleBlackOpaque()
    } else {
      // eslint-disable-next-line no-undef
      StatusBar.backgroundColorByHexString('#EDEDED')
      // eslint-disable-next-line no-undef
      StatusBar.styleDefault()
    }

    this.ready()

    // eslint-disable-next-line no-undef
    setTimeout(() => {
      navigator.splashscreen.hide()
    }, 2000)
  },

  beforeDestroy () {
    eventBus.$off('close')
    websocketDestroy()
    document.removeEventListener('backbutton')
    document.removeEventListener('resume')
  },

  methods: {
    // 设备准备就绪回调
    ready () {
      const that = this
      // 点击返回按钮
      document.addEventListener('backbutton', that.backButtom, false)
      // 获取软件版本
      this.onDeviceReady()
    },

    // 获取本地版本号， 获取服务器版本号
    async onDeviceReady () {
      const that = this
      // 获取本地软件版本号
      // 获取手机信息
      // eslint-disable-next-line no-undef
      await that.loginUUID(device.uuid)
      // eslint-disable-next-line no-undef
      cordova.getAppVersion.getVersionNumber()
        .then(function (version) {
          that.currentVersion = version
          // 设置vuex软件本地版本
          that.$store.commit('SET_CURRENT_VERSION', version)
          // 获取版本 是否更新软件版本
          that.$store.dispatch('getLatesVersion')
            .then(res => {
              that.appInfo = res
              // if (that.currentVersion !== res.version) {
              //   Toast.clear()
              //   that.showUpdate(res)
              // }
            })
            .catch(e => {
              console.log(e)
            })
        })
    },

    // 双击返回按钮
    backButtom () {
      // alert('返回键')
      if (this.isHomePage()) {
        if (this.exitAppTicker === 0) {
          this.exitAppTicker++
          Toast({ message: '再点一次退出', position: 'bottom' })
          setTimeout(() => {
            this.exitAppTicker = 0
          }, 2000)
        } else if (this.exitAppTicker === 1) {
          navigator.app.exitApp() // 退出app
        }
      } else {
        // 大于一级页面历史返回
        if (this.isImgview) {
          eventBus.$emit('close')
        } else if (this.isFullscreen) {
          eventBus.$emit('setFullscreen')
        } else {
          history.back()
        }
      }
    },

    // 判断是否为导航页
    isHomePage () {
      const result = this.homePage.includes(this.$route.path)
      return result
    },

    showUpdate (info) {
      this.$refs.updateApp.showDialog(info)
    },

    loginUUID (uuid) {
      return freelogin({ uuid: uuid })
        .then(res => {
          if (Object.keys(res.data).length > 0) {
            setToken(res.data.token)
            this.$router.push('/')
            this.$store.commit('SET_USER', res.data)
          } else {
            removeToken()
            if (this.$route.path !== '/login') {
              this.$router.push('/login')
            }
          }
        })
        .catch(e => {
          console.log(e)
        })
    },

    resume () {
      const route = this.$route
      document.addEventListener('resume', () => {
        if (route.path === '/mine' || route.path === '/login') {
          // eslint-disable-next-line no-undef
          StatusBar.styleBlackOpaque()
          // eslint-disable-next-line no-undef
          StatusBar.backgroundColorByHexString('#398AFA')
        } else if (route.path === '/signUp' || route.path === '/forgetWord' || route.path === '/code') {
          // eslint-disable-next-line no-undef
          StatusBar.styleDefault()
          // eslint-disable-next-line no-undef
          StatusBar.backgroundColorByHexString('#FFFFFF')
        } else {
          // eslint-disable-next-line no-undef
          StatusBar.styleDefault()
          // eslint-disable-next-line no-undef
          StatusBar.backgroundColorByHexString('#EDEDED')
        }
      }, false)
    }
  }
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  position: relative;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.advertising{
  width: 100%;
  height: 100%;
  background: #fff;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
  & img{
    width: 100%;
  }
}
.countDown{
  width: .5rem;
  height: .2rem;
  font-size: .1rem;
  color: #fff;
  background: rgba(0,0,0, 0.4);
  border-radius: .1rem;
  position: absolute;
  top: .2rem;
  right: .2rem;
  text-align: center;
  line-height: .2rem;
}
</style>
