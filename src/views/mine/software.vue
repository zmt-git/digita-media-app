<template>
  <div class="software">
    <div class="software_info">
      <img class="software_info--about" src="../../assets/img/about.png" alt="">
      <!-- <img class="software_info--name" src="../../assets/img/appName.png" alt=""> -->
    </div>
    <mine-items :mineItems='itemList'></mine-items>
    <img class="slogan" src="../../assets/img/slogan.png" alt="">
    <update-app ref="updateApp" :appInfo='appInfo'></update-app>
  </div>
</template>

<script>
// components
import MineItems from './components/MineItem'
import common from '@/mixins/common'
import { mapGetters } from 'vuex'
import UpdateApp from '@/components/UpdateApp/UpdateApp.vue'
import { Toast } from 'vant'
import { isUpdateApp } from '@/utils/app'
export default {
  name: 'software',
  components: {
    MineItems, UpdateApp
  },
  mixins: [common],
  computed: {
    ...mapGetters(['currentVersion', 'latestVersion'])
  },
  data () {
    const that = this
    return {
      itemList: [
        { name: '基本信息', link: false, icon: '', tag: false, value: '智能标志' },
        { name: '版本号', link: false, icon: '', tag: false, value: '' },
        { name: '检测新版本', link: true, icon: '', tag: false, type: 'danger', tagTitle: '新版本', method: that.getVersionF }
      ],
      appInfo: {}
    }
  },
  async mounted () {
    await this.$store.dispatch('getLatesVersion')
    this.checkVersion()
    this.version()
  },
  methods: {
    checkVersion (tar = 'name', key = 'tag', val = '检测新版本') {
      const index = this.itemList.findIndex((item) => {
        return item[tar] === val
      })
      const result = isUpdateApp(this.currentVersion, this.latestVersion)
      this.itemList[index][key] = result
    },
    version () {
      const index = this.itemList.findIndex((item) => {
        return item.name === '版本号'
      })
      this.itemList[index].value = this.currentVersion
    },

    async getVersionF () {
      this.toast('版本检测中', 'loading', 0)
      this.$store.dispatch('getLatesVersion')
        .then(res => {
          const result = isUpdateApp(this.currentVersion, res.version)
          if (result) {
            Toast.clear()
            this.appInfo = res
            this.showUpdate(res)
          } else {
            this.toast('当前为最新版本', 'success')
          }
        })
    },
    showUpdate (info) {
      this.$refs.updateApp.showDialog(info)
    }
  }
}
</script>

<style lang="scss" scoped>
.software{
  height: 100%;
  background: #f6f6f6;
  &_info{
    width: 100%;
    height: 2.66rem;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    &--about{
      height: .98rem;
      // width: .98rem;
    }
    &--name{
      // width: 1.5rem;
      height: .29rem;
      position: absolute;
      bottom: .47rem;
      left: 0;
      right: 0;
      margin: auto;
    }
  }
}
.slogan{
  height: .245rem;
  position: absolute;
  bottom: .375rem;
  left: 0;
  right: 0;
  margin: auto;
}
</style>
