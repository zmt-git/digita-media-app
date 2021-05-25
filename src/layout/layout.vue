<template>
  <div class="layout">
    <!-- <transition name="van-slide-down"> -->
      <div class="header" v-if="meta.hasHeader">
        <!-- <div class="StatusBar"></div> -->
        <dev-header
          :meta='meta'
          @onClickRight='onClickRight'
          @onClickLeft='onClickLeft'
        ></dev-header>
      </div>
    <!-- </transition> -->
    <section class="contain" ref="content">
      <transition :name="transitionName">
        <router-view></router-view>
      </transition>
    </section>
    <transition name="van-slide-up">
      <div class="footer" v-if="meta.hasFooter">
      <dev-footer></dev-footer>
      </div>
    </transition>
  </div>
</template>

<script>
// 组件
import devHeader from '@/components/Header/Header'
import devFooter from '@/components/Footer/Footer'
import eventBus from '../utils/eventBus'
export default {
  name: 'layout',
  components: {
    devHeader, devFooter
  },
  data () {
    return {
      meta: {},
      transitionName: 'van-fade',
      ele: {}
    }
  },
  created () {
    if (this.$route.path !== '/login') {
      this.$store.dispatch('getUser')
    }
  },
  mounted () {
    const that = this
    // eslint-disable-next-line
    cordova.getAppVersion.getVersionNumber().then(async function (version) {
      that.$store.commit('SET_CURRENT_VERSION', version)
    })
  },
  watch: {
    '$route': {
      handler: function (to, from) {
      this.meta = to.meta
      if (to.meta.animate === from.meta.animate) {
        this.transitionName = 'van-fade'
      } else {
        this.transitionName = 'van-slide-left'
      }
      if (to.path === '/mine' || to.path === '/login') {
        // eslint-disable-next-line no-undef
        // StatusBar.styleBlackTranslucent()
        StatusBar.backgroundColorByHexString("#398AFA");
        StatusBar.styleBlackOpaque()
      } else {
        // eslint-disable-next-line no-undef
        StatusBar.backgroundColorByHexString("#EDEDED");
        StatusBar.styleDefault()
      }
    },
      immediate: true
    }
  },
  methods: {
    onClickRight (icon) {
      eventBus.$emit('onClickRight', icon)
    },
    onClickLeft () {
      eventBus.$emit('onClickLeft')
    }
  },
  beforeMount () {
    this.meta = this.$route.meta
  },
  beforeDestroy () {
    eventBus.$off('onClickLeft')
    eventBus.$off('onClickRight')
  }
}
</script>

<style lang="scss" scoped>
.layout{
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
}
.contain{
  width: 100%;
  flex: 1;
  overflow: hidden;
  position: relative;
  &>div{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
.header{
  height: .46rem;
  width: 100%;
  background: #ededed;
}
.StatusBar{
  height: .2rem;
  background: transparent;
}
.footer{
  height: .50rem;
  width: 100%;
}
</style>
