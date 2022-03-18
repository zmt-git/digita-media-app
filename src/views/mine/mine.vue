<template>
  <div class="mine">

    <!-- 用户信息 -->
    <div class="mine-header">
      <div class="mine-header--icon">
        <img class="avatar" src="../../assets/img/avatar.png" alt="">
      </div>
      <p class="mine-header--name van-ellipsis">{{user.username}}</p>
      <p class="mine-header--tel van-ellipsis">{{user.mobile | hiddenMobile}}</p>
    </div>
    <!-- 用户信息 -->

    <!-- 功能 -->
    <div class="contenList van-hairline--top">
      <mine-items :mineItems='itemList'></mine-items>
    </div>
    <!-- 功能 -->

    <!-- 退出登录 -->
    <van-cell class="logout" title-class='mine_logout' :clickable='true' title="退出登录" @click="logout" />
  </div>
</template>

<script>

// components
import MineItems from './components/MineItem'
import { Dialog } from 'vant'
import { mapGetters } from 'vuex'
import { removeToken } from '@/utils/auth'
import { isUpdateApp } from '@/utils/app'
// api

export default {
  components: {
    MineItems
  },
  computed: {
    ...mapGetters(['user', 'currentVersion', 'latestVersion'])
  },
  data () {
    return {
      itemList: [
        // { name: '使用手册', link: true, to: '/manual', icon: 'orders-o', tag: false },
        { name: '意见建议', link: true, to: '/suggestions', icon: 'smile-o', tag: false },
        { name: '关于软件', link: true, to: '/software', icon: 'info-o', tag: false, type: 'danger', tagTitle: '新版本' },
        { name: '修改密码', link: true, to: '/resetPassword', icon: 'edit', tag: false }
      ]
    }
  },
  mounted () {
    this.version()
  },
  filters: {
    hiddenMobile (val) {
      if (val) {
        let str = ''
        str = val.slice(0, 3) + '****' + val.slice(-4)
        return str
      } else {
        return ''
      }
    }
  },
  methods: {
    // 登出
    logout () {
      Dialog.confirm({
        title: '提示',
        message: '确认退出当前账号吗？'
      }).then(async () => {
        // store还未完成 完成后改为dispatch
        removeToken()
        this.$store.dispatch('Logout')
        this.$router.push('/login')
      }).catch(() => {
        // on cancel
      })
    },
    version () {
      const that = this
      try {
        // eslint-disable-next-line
        cordova.getAppVersion.getVersionNumber()
          .then(async function (version) {
            that.$store.commit('SET_CURRENT_VERSION', version)
          })

        const index = this.itemList.findIndex((item) => {
          return item.to === '/software'
        })
        const res = isUpdateApp(this.currentVersion, this.latestVersion)
        this.itemList[index].tag = res
      } catch (e) {}
    }
  }
}
</script>

<style lang="scss" scoped>
$bg1: linear-gradient(to bottom, #398bfa , #4eb8f4);
$bg2: #f6f6f6;
$color: #ff0000;
.mine{
  height: 100%;
  background: $bg2;
}
.mine-header {
  height: 1.76rem;
  width: 100%;
  text-align: center;
  overflow: hidden;
  position: relative;
  color: #fff;
  z-index: 0;
  &::after{
    width: 140%;
    height: 1.76rem;
    position: absolute;
    left: -20%;
    top: 0;
    z-index: -1;
    content: '';
    border-radius: 0 0 50% 50%;
    background: $bg1;
  }
  &--icon{
    height: .53rem;
    width: 100%;
    text-align: center;
    margin-top: .41rem;
    & i{
      font-size: .53rem;
      color: #fff;
    }
  }
  &--name{
    line-height: .46rem;
    font-size: .19rem;
    text-align: center;
    box-sizing: border-box;
    padding: 0 .15rem;
  }
  &--tel{
    font-size: .14rem;
    text-align: center;
    box-sizing: border-box;
    padding: 0 .15rem;
  }
}
.contenList{
  margin-top: .17rem;
}
.logout{
  margin-top: .17rem;
  text-align: center;
  color: $color;
}
.avatar{
  width: .52rem;
  height: .52rem;
}
</style>
