<template>
  <div class="device">
    <!-- 设备在线离线数量统计 -->
    <div class="my-media">
      <div class="my-media-img">
        <img src="../../assets/img/store.png" alt="">
      </div>
      <div class="my-media-store">
        <p class="my-media-store--name">云空间</p>
        <div class="my-media-store--bar van-hairline--surround"></div>
        <p class="my-media-store--num">
          <span class="fl">3GB/10GB</span>
          <span class="fr">剩余70%</span>
        </p>
      </div>
    </div>
    <div class="device-count van-hairline--bottom">
      <!-- 在线统计 -->
      <div class="device-count_online">
        <!-- 在线 -->
        <div class="device-count_online--left">
          <p class="online">在线</p>
          <p class="online online-num">10</p>
        </div>
        <!-- 状态统计 -->
        <div class="device-count_online--right">
          <div class="device-num work">
            <p class="device-num_title">工作</p>
            <p class="device-num_count">10</p>
          </div>
          <div class="device-num dormant">
            <p class="device-num_title">休眠</p>
            <p class="device-num_count">10</p>
          </div>
          <div class="device-num alarm">
            <p class="device-num_title">报警</p>
            <p class="device-num_count">10</p>
          </div>
        </div>
      </div>
      <!-- 离线统计 -->
      <div class="device-count_off">
         <p class="online">离线</p>
        <p class="online online-num" style="text-align: right">10</p>
      </div>
    </div>
    <!-- 设备列表 -->
    <div class="device-list" @scroll="loadList" ref="listBox">
      <template v-for="(item, index) in deviceLists">
        <Device-item
          :key='index'
          :itemInfo='item'
          @viewDevice='viewDevice'
        ></Device-item>
      </template>
    </div>
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus'
import common from '@/mixins/common'
// 组件
import DeviceItem from './components/DeviceItem'
// api
import { deviceList, deviceCheck } from '@/api/device/device'
export default {
  name: 'device',
  mixins: [common],
  components: {
    DeviceItem
  },
  data () {
    return {
      deviceLists: [
        {
          id: 1111,
          userId: '1',
          code: '1',
          name: '智能终端-001',
          location: '德商高速273km+200',
          appVer: '1',
          card: '1',
          memoryUse: 0,
          memoryMax: 1,
          stateOnline: 1,
          stateWork: 1,
          timeControl: 1,
          timeOpen: '1',
          timeClose: '1',
          stateCrient: 1,
          lightControl: 1,
          lightBrightness: '1',
          temperature: 0,
          temperatureMax: 1,
          worktimeThis: 1,
          worktimeTotal: 1,
          internetDataThis: 1,
          internetDataTotal: 1,
          heartId: 1,
          timeProduction: '1',
          timeRegister: '1',
          timeMediaUpdate: '1',
          timeLastLogin: '1'
        },
        {
          id: 1111,
          userId: '1',
          code: '1',
          name: '智能终端-001',
          location: '德商高速273km+200',
          appVer: '1',
          card: '1',
          memoryUse: 1,
          memoryMax: 1,
          stateOnline: 1,
          stateWork: 0,
          timeControl: 1,
          timeOpen: '23:23',
          timeClose: '6:00',
          stateCrient: 1,
          lightControl: 1,
          lightBrightness: '1',
          temperature: 1,
          temperatureMax: 1,
          worktimeThis: 1,
          worktimeTotal: 1,
          internetDataThis: 1,
          internetDataTotal: 1,
          heartId: 1,
          timeProduction: '1',
          timeRegister: '1',
          timeMediaUpdate: '1',
          timeLastLogin: '1'
        }
      ]
    }
  },
  created () {
    // 获取设备列表
    this.getDeviceList()
  },
  mounted () {
    // 头部图标点击事件监听
    eventBus.$on('onClickRight', (icon) => {
      this.onClickRight(icon)
    })
  },
  methods: {
    // 获取设备列表
    getDeviceList () {
      return deviceList(this.page)
        .then(res => {
          this.deviceLists = res.data
        })
        .catch(e => {
          console.log(e)
        })
    },
    // 扫描按钮
    onClickRight (icon) {
      if (icon === 'scan') {
        // 调取cordova的scan插件进行二维码扫描
        // 判断序列号是否有效
        deviceCheck()
          .then(res => {
            // 根据序列号的有效性判断是否添加设备
            if (res.msg) {
              this.$router.push({ path: '/deviceAddorEdit', query: { isAdd: true } })
            } else {
              this.toast('序列无效', 'fail')
            }
          })
          .catch(e => {
            console.log(e)
          })
      // 帮助
      } else if (icon === 'question-o') {
        this.$router.push({ path: '/question', query: { type: this.$route.path } })
      }
    },
    // 查看设备详情
    viewDevice (item) {
      this.$router.push({ path: '/details', query: { id: item.id, info: JSON.stringify(item) } })
    },
    // 滚动加载
    loadList () {
      console.log(this.$refs.listBox.scrollbottom)
    }
  }
}
</script>

<style lang="scss" scoped>
$color1: #000;
$color2: #fff;
$bg: #ededed;
$bg1: linear-gradient(to right, #46a0fb , #dce7fa);
$bg2: linear-gradient(to bottom, #29bb6f , #19d276);
$bg3: linear-gradient(to bottom, #a3a3a3 , #b0adb4);
$bg4: linear-gradient(to bottom, #f02d44 , #ec7d81);
$bg5: #f3f3f3;
.device{
  height: 100%;
}
.device-header{
  height: .43rem;
  width: 100%;
  line-height: .43rem;
  font-size: .19rem;
  background: $bg;
  & .van-nav-bar__title{
    font-weight: 600;
  }
  & .van-icon{
    color: $color1;
    font-size: .2rem;
    font-weight: 600;
  }
}
.my-media{
  height: .89rem;
  margin-bottom: .05rem;
  background: #ffffff;
  &-img{
    width: 1.08rem;
    height: 100%;
    padding: .14rem;
    box-sizing: border-box;
    float: left;
    & img{
      width: 100%;
      height: 100%;
    }
  }
  &-store{
    height: 100%;
    width: calc(100% - 1.08rem);
    float: left;
    box-sizing: border-box;
    padding-top: .14rem;
    padding-right: .15rem;
    &--name{
      font-size: .15rem;
      line-height: .15rem;
    }
    &--bar{
      margin: .1rem 0;
      border-color: #929292;
      height: .06rem;
    }
    &--num{
      font-size: .13rem;
      line-height: .13rem;
    }
  }
}
.device-count{
  padding: 0.11rem .13rem 0;
  box-sizing: border-box;
  height: .88rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &_online{
    height: .66rem;
    width: 2.7rem;
    background-image: url('../../assets/img/bg1.png');
    background-size: 100% 100%;
    box-sizing: border-box;
    padding: .1rem;
    display: flex;
    &--left{
      height: 100%;
      width: .52rem;
    }
    &--right{
      flex: 1;
      height: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      & div{
        width: .48rem;
        height: .48rem;
        background-size: 100% 100%;
        padding: .1rem;
        box-sizing: border-box;
      }
    }
  }
  &_off{
    height: .66rem;
    width: .66rem;
    background-image: url('../../assets/img/bg2.png');
    background-size: 100% 100%;
    box-sizing: border-box;
    padding: .1rem;
  }
}
.device-list{
  width: 100%;
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0 .13rem;
  box-sizing: border-box;
}
.dormant{
   background-image: url('../../assets/img/dormant.png');
}
.work{
   background-image: url('../../assets/img/work.png');
}
.alarm{
   background-image: url('../../assets/img/alarm.png');
}
.device-num{
  &_title{
    font-size: .1rem;
    color: $color2;
    line-height: .15rem;
  }
  &_count{
    font-size: .1rem;
    color: $color2;
    line-height: .2rem;
    text-align: right;
  }
}
.online{
  line-height: .25rem;
  font-size: .14rem;
  color: $color2;
  padding-left: 4px;
}
.online-num{
  font-size: .15rem;
}
</style>
