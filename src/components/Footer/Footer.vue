<template>
  <div class="footer">
    <van-tabbar v-model="active" :route='true'>
    <van-tabbar-item icon="wap-home-o" to="/">
      <span>智能终端</span>
    </van-tabbar-item>
    <van-tabbar-item icon="video-o" to="/media">
      <span>媒体</span>
    </van-tabbar-item>
    <van-tabbar-item icon="todo-list-o" to="/task">
      <span>任务</span>
    </van-tabbar-item>
    <van-tabbar-item icon="user-o" to="/mine" :dot='currentVersion !== latestVersion ? true : false'>
      <span>我的</span>
    </van-tabbar-item>
  </van-tabbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'devFooter',
  computed: {
    ...mapGetters(['currentVersion', 'latestVersion'])
  },
  data () {
    return {
      active: 0,
      icon: {
        active: 'https://img.yzcdn.cn/vant/user-active.png',
        inactive: 'https://img.yzcdn.cn/vant/user-inactive.png'
      }
    }
  }
}
</script>

<style lang="scss">
.footer .van-tabbar-item__icon{
  font-size: .25rem;
}
</style>
