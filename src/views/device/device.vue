<template>
  <div class="device">
    <!-- 设备在线离线数量统计 -->
    <div class="device-header">
      <div class="device-header-img">
        <img src="../../assets/img/deviceIcon.png" alt="">
      </div>
      <div class="device-header-store">
        <div class="status-item" :key='index' v-for="(item, index) in statusList">
          <van-tag class="status-item--title" :type="item.Tagtype">{{item.statusTitle}}</van-tag>
          <div class="status-item--number van-hairline--bottom van-hairline--left van-hairline--right">{{item.value}}</div>
        </div>
      </div>
    </div>
    <!-- 设备列表 -->
    <div class="device-list">
      <div>
        <Refresh-load
          ref="refresh"
          :options='refreshOption'
          @onLoad='loading'
          @onRefresh='onRefresh'
        >
          <template v-for="(item, index) in deviceLists">
            <!-- 设备列表元素-->
            <Device-item
              :key='index'
              :itemInfo='item'
              @viewDevice='viewDevice'
            ></Device-item>
            <!-- 设备列表元素-->
          </template>
        </Refresh-load>
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus'
import common from '@/mixins/common'
// import { erweima } from '@/utils/scanCode'
// 组件
import RefreshLoad from '@/components/RefreshLoad/RefreshLoad'
import DeviceItem from './components/DeviceItem'
// api
import { deviceList, getDevicesStatus } from '@/api/device/device'
export default {
  name: 'device',
  mixins: [common],
  components: {
    DeviceItem, RefreshLoad
  },
  data () {
    return {
      totalCount: 0,
      deviceLists: [],
      statusList: {
        online: { Tagtype: 'primary', statusType: 'online', statusTitle: '在线', value: '0' },
        onwork: { Tagtype: 'success', statusType: 'work', statusTitle: '工作', value: '0' },
        sleep: { Tagtype: 'default', statusType: 'dormant', statusTitle: '休眠', value: '0' },
        alarm: { Tagtype: 'danger', statusType: 'alarm', statusTitle: '报警', value: '0' },
        offline: { Tagtype: 'default', statusType: 'offline', statusTitle: '离线', value: '0' }
      },
      scanResult: '' // 条形码二维码扫描结果
    }
  },
  created () {
    // 获取设备的状态统计
    getDevicesStatus()
      .then(res => {
        const obj = JSON.parse(res.data)
        for (const key in obj) {
          if (obj[key] > 9999) {
            obj[key] = 9999 + '+'
          }
          this.statusList[key].value = obj[key]
        }
      })
      .catch(e => {
        console.log(e)
      })
  },
  mounted () {
    // 头部图标点击事件监听
    eventBus.$on('onClickRight', (icon) => {
      this.onClickRight(icon)
    })

    eventBus.$on('devStatus', this.updateStatus)

    eventBus.$on('devList', this.updateList)

    this.$once('hook:beforeDestroy', () => {
      eventBus.$off('devStatus', this.updateStatus)
      eventBus.$off('devList', this.updateList)
    })
  },

  methods: {
    // 更新设备状态统计
    updateStatus (data) {
      const obj = JSON.parse(data)
      for (const key in obj) {
        if (obj[key] > 9999) {
          obj[key] = 9999 + '+'
        }
        this.statusList[key].value = obj[key]
      }
    },
    // 更新设备数据
    updateList (data) {
      data.forEach(item => {
        const index = this.deviceLists.findIndex(el => {
          return el.id === item.id
        })
        if (index >= 0) {
          this.deviceLists.splice(index, 1, item)
        }
      })
    },
    // 获取设备列表
    getDeviceList () {
      return deviceList(this.page)
        .then(res => {
          this.deviceLists.push(...res.page.list)
          this.totalCount = res.page.totalCount
        })
        .catch(e => {
          console.log(e)
          this.refreshOption.finished = true
        })
    },
    // 扫描按钮
    onClickRight (icon) {
      if (icon === 'add-o') {
        this.$router.push({ path: '/deviceAddorEdit', query: { isAdd: true } })
      } else if (icon === 'question-o') {
        this.$router.push({ path: '/question', query: { type: this.$route.path } })
      }
    },
    // 查看设备详情
    viewDevice (item) {
      this.$router.push({ path: '/details', query: { id: item.id } })
    },
    // 加载数据
    async loading () {
      // 判断是否为刷新状态，为刷新状态时 清空列表 刷新状态改为false
      if (this.refreshOption.refreshing) {
        this.deviceLists = []
        this.page = { page: 0, limit: 10 }
        this.refreshOption.refreshing = false
      }
      this.page.page += 1
      // 发送请求获取数据
      await this.getDeviceList()
      // 加载状态改为false
      this.refreshOption.loading = false
      // 获取的数据末尾判断
      const result = this.judge()
      if (result) {
        this.refreshOption.finished = true
      }
    },
    // 判断是否加载完所有设备
    judge () {
      if (this.deviceLists.length >= this.totalCount) {
        return true
      } else {
        return false
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
  display: flex;
  flex-direction:column;
}
.device-header{
  height: .89rem;
  margin-bottom: .05rem;
  background: #f6f6f6;
  padding-bottom: .1rem;
  &-img{
    width: 1.08rem;
    background: #ffffff;
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
    background: #ffffff;
    float: left;
    box-sizing: border-box;
    padding-top: .14rem;
    padding-right: .15rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.status-item{
  width: .41rem;
  height: .46rem;
  &--title{
    height: .18rem;
    width: .41rem;
    box-sizing: border-box;
    text-align: center;
    line-height: .16rem;
    display: block;
  }
  &--number{
    height: .28rem;
    width: 100%;
    line-height: .28rem;
    text-align: center;
    color: $color1;
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
