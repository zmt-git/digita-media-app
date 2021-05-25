<template>
  <div class="manual">
   <van-tabs @click="onClick" :color='color' v-model='tag'>
    <van-tab title="使用手册">
      <Mine-items :mineItems='itemList'></Mine-items>
    </van-tab>
    <van-tab title="常见问题">
      <Mine-items :mineItems='questionList'></Mine-items>
    </van-tab>
  </van-tabs>
  </div>
</template>

<script>
import MineItems from './components/MineItem'
import { mapGetters } from 'vuex'
export default {
  name: 'manual',
  components: {
    MineItems
  },
  computed: {
    ...mapGetters(['defaultTag'])
  },
  mounted () {
    this.tag = this.defaultTag
  },
  beforeDestroy () {
    this.$store.commit('SET_TAG', this.tag)
  },
  data () {
    return {
      tag: 0,
      color: '#1989fa',
      itemList: [
        { name: '智能终端认证', link: true, to: '/manualDetails?type=0', icon: '', tag: false },
        { name: '智能终端运行状态', link: true, to: '/manualDetails?type=1', icon: '', tag: false },
        { name: '智能终端参数设置', link: true, to: '/manualDetails?type=2', icon: '', tag: false },
        { name: '智能终端媒体播放列表', link: true, to: '/manualDetails?type=3', icon: '', tag: false }
      ],
      questionList: [
        { name: '智能终端列表', link: true, to: '/question?type=0', icon: '', tag: false },
        { name: '任务列表', link: true, to: '/question?type=1', icon: '', tag: false },
        { name: '媒体列表', link: true, to: '/question?type=2', icon: '', tag: false },
        { name: '我的', link: true, to: '/question?type=3', icon: '', tag: false }
      ]
    }
  },
  methods: {
    onClick (index, title) {}
  }
}
</script>

<style lang="scss">
.manual{
  height: 100%;
  & .van-tab__text{
    font-size: .16rem;
  }
}
</style>
