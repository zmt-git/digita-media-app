<template>
  <div class="deviceInfo">
    <div class="info-status-box">
      <device-item :itemInfo='detailInfo' @tapImg='tapImg'></device-item>
    </div>
    <div class="infoitem">
      <!-- 媒体 -->
      <div class="infoItem-box">
        <van-cell>
          <template slot="title">
            <p class="title"><span class="title_bar"></span><span class="title_word">媒体</span></p>
          </template>
        </van-cell>
        <van-cell title="播放列表" is-link @click="toPlayList"/>
      </div>
      <!-- 运行状态 -->
      <div class="infoItem-box">
        <van-cell>
          <template slot="title">
            <p class="title"><span class="title_bar"></span><span class="title_word">运行状态</span></p>
          </template>
        </van-cell>
        <van-cell title="在线状态" :value="detailInfo.stateOnline | statusOnline" />
        <van-cell title="工作状态" :value="detailInfo.stateWork | statusWork" />
        <van-cell :value="temperature">
          <template slot="title">
            <span class="custom-title">核心温度</span>
            <template v-if="temp">
              <van-tag type="danger" style="margin-left: .1rem">高温</van-tag>
            </template>
          </template>
        </van-cell>
<!--        <van-cell :value="filtersStorage(detailInfo.storageTotal - detailInfo.storageUsable) + 'G/' + filtersStorage(detailInfo.storageTotal)+ 'G'">-->
<!--          &lt;!&ndash; 使用 title 插槽来自定义标题 &ndash;&gt;-->
<!--          <template slot="title">-->
<!--            <span class="custom-title">内存使用</span>-->
<!--            <template v-if="storageStatus">-->
<!--              <van-tag type="danger" style="margin-left: .1rem">存储将满</van-tag>-->
<!--            </template>-->
<!--          </template>-->
<!--        </van-cell>-->
      </div>
      <!-- 参数设置 -->
      <div class="infoItem-box">
        <van-cell>
          <template slot="title">
            <p class="title"><span class="title_bar"></span><span class="title_word">参数设置</span></p>
          </template>
        </van-cell>
<!--        <van-cell center title="启用休眠">-->
<!--          <van-switch :active-value='1' :inactive-value='0' v-model="dataForm.timeControl" @change='setTimeControl' slot="right-icon" size="24" />-->
<!--        </van-cell>-->
        <van-cell center title="光源控制">
          <van-switch :active-value='1' :inactive-value='0' v-model="dataForm.lightControl" @change='setLight' slot="right-icon" size="24" />
        </van-cell>
        <van-cell center title="光源开关">
          <van-switch :active-value='100' :inactive-value='-1' v-model="dataForm.lightBrightness" @change='setLight' slot="right-icon" size="24" />
        </van-cell>
        <van-cell title="休眠时间" :class="timeDisabled ? 'bg-1' : 'bg-0'" is-link @click="showPopup('timeClose')" :value="dataForm.timeClose" />
        <van-cell title="唤醒时间" :class="timeDisabled ? 'bg-1' : 'bg-0'" is-link @click="showPopup('timeOpen')" :value="dataForm.timeOpen" />
        <!-- <van-cell title="光源控制" is-link @click="showPopup('lightControl')" :value="dataForm.lightControl | statusControl" /> -->
        <!-- <van-cell title="光源亮度" is-link @click="showPopup('lightBrightness')" :value="dataForm.lightBrightness + '%'" /> -->
<!--        <van-cell title="媒体音量" class="volume" :border='false'>-->
<!--          <div class="volume-box">-->
<!--            <van-slider v-model="dataForm.stateVolume" :min="0" :max="15" bar-height="0.04rem" @change='setVolume'/>-->
<!--          </div>-->
<!--        </van-cell>-->
      </div>

      <div  class="infoItem-box">
        <van-cell title="画面方向" is-link @click="showPopup('stateOrient')" :value="stateOrient | stateOrientFilter" />
        <van-cell title="切换场景" is-link @click="showPopup('scenes')" :value="orderNumber | scenesFilter" />
      </div>

      <!-- 系统设置 systemShow-->
      <div class="infoItem-box" v-if="false">
        <van-cell>
          <template slot="title">
            <p class="title"><span class="title_bar"></span><span class="title_word">系统</span></p>
          </template>
        </van-cell>
        <van-cell center title="开机动画">
          <van-switch :active-value='1' :inactive-value='0' v-model="dataForm.stateLogo" @change='setBootAnimation' slot="right-icon" size="24" />
        </van-cell>
        <van-cell center title="信息提示">
          <van-switch :active-value='1' :inactive-value='0' v-model="dataForm.stateInfo" @change='setInfoAnimation' slot="right-icon" size="24" />
        </van-cell>
      </div>

      <!-- 系统设置按钮  systemShow-->
      <div class="system-btns" v-if="false">
        <van-button type="info" class="system-btns-item" @click="setSystem('rebootAll')">重启智能终端</van-button>
        <van-button type="info" class="system-btns-item" @click="setSystem('rebootApp')">重启核心程序</van-button>
        <van-button type="info" class="system-btns-item" @click="setSystem('uploadLog')">上传工作日志</van-button>
        <van-button type="danger" class="system-btns-item" @click="setSystem('reset')">恢复出厂设置</van-button>
      </div>
    </div>
    <van-popup
      v-model="showPicker"
      position="bottom"
      :style="{ _height: '30%' }"
      >
      <van-datetime-picker
        v-model="currentTime"
        type="time"
        :title="popupTitle"
        v-show="timeShow"
        :formatter="formatter"
        @cancel="showPicker = false"
        @confirm="onConfirmTime"
      />
      <van-picker
        show-toolbar
        v-show="!timeShow"
        :default-index='defaultIndex'
        :title="popupTitle"
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
      </van-popup>
  </div>
</template>

<script>
// 组件
import eventBus from '@/utils/eventBus'
import DeviceItem from './components/DeviceItem'
import common from '@/mixins/common'
// api
import { devIceDetails, setTime, light, direction, orderNumber, volume, bootAnimation, infoAnimation, rebootAll, rebootApp, uploadLog, reset } from '@/api/device/details'
import { Toast, Dialog } from 'vant'

import { lightControl, stateOrient, scenesOptions } from '@/common/common'
export default {
  name: 'deviceDetails',
  mixins: [common],
  components: {
    DeviceItem
  },
  computed: {
    timeDisabled () {
      return this.dataForm.lightControl === 1
    },
    temp () {
      if (this.detailInfo.alarm) {
        return this.detailInfo.alarm.includes('2001')
      } else {
        return false
      }
    },
    temperature () {
      if (this.detailInfo.stateWork !== 1 || this.detailInfo.stateWork !== 0) return ''
      if (typeof (this.detailInfo.temperature) === 'number') {
        return this.detailInfo.temperature + '℃'
      } else {
        return '0℃'
      }
    },
    storageStatus () {
      if (this.detailInfo.alarm) {
        return this.detailInfo.alarm.includes('2002')
      } else {
        return false
      }
    },
    scenes () {
      if (this.detailInfo.type && this.detailInfo.type.indexOf('-') >= 0) {
        const type = this.detailInfo.type.split('-').pop()
        return scenesOptions[type]
      }
      return scenesOptions.A
    }
  },
  data () {
    const that = this
    return {
      count: 0,
      systemShow: false,
      rebootAll: rebootAll,
      rebootApp: rebootApp,
      uploadLog: uploadLog,
      reset: reset,
      id: null,
      defaultIndex: [0],
      detailInfo: {},
      stateOrientObj: {},
      timeDefault: [0, 0],
      showPicker: false,
      currentTime: '12:00:00',
      timeShow: true,
      type: '',
      columns: [],
      lightControl: lightControl,
      stateOrient: stateOrient,
      popupTitle: '',
      titleObj: {
        timeClose: '休眠时间',
        timeOpen: '唤醒时间',
        lightControl: '光源控制',
        lightBrightness: '光源亮度',
        stateOrient: '画面方向',
        scenes: '切换场景'
      },
      dataForm: {
        timeClose: '00:00',
        timeOpen: '00:00',
        lightControl: 0,
        lightBrightness: 1
      },
      stateOrientValue: 0,
      orderNumber: 0,
      dataForm1: {
        bootAnimation: '',
        infoAnimation: ''
      },
      controlFunction: {
        timeClose: that.setTimeClose,
        timeOpen: that.setTimeOpen,
        lightControl: that.setLight,
        lightBrightness: that.setLight,
        stateOrient: that.setstateOrient,
        scenes: that.setScenes
      }
    }
  },
  filters: {
    // 在线状态
    statusOnline (val) {
      return val === 1 ? '在线' : '离线'
    },
    // 工作状态
    statusWork (val) {
      return this.detailInfo.stateWork === 1
        ? '工作'
        : this.detailInfo.stateWork === 0
          ? '休眠'
          : ''
    },
    // 画面方向
    stateOrientFilter (val) {
      const obj = stateOrient.find(item => item.val === val)
      return obj ? obj.text : ''
    },

    scenesFilter (val) {
      const obj = this.scenes.find(item => item.value === val)
      return obj ? obj.text : ''
    },
    // 光源控制
    statusControl (val) { // 1：命令控制；0：自动控制；
      return val === 1 ? '手动控制' : '自动控制'
    }
  },

  async created () {
    this.id = this.$route.query.id
    // 获取终端详情
    await devIceDetails(this.id)
      .then(res => {
        if (res.data.stateOnline === 0) {
          // todo
          // Dialog.alert({
          //   title: '提示',
          //   message: '智能终端已离线'
          // }).then(() => {
          //   this.$router.go(-1)
          // })
          // return
        }
        this.detailInfo = res.data
      })
      .catch(e => {
        console.log(e)
      })
    this.formatParams()
  },

  mounted () {
    // 头部图标点击事件监听
    eventBus.$on('onClickRight', (icon) => {
      this.onClickRight(icon)
    })
  },

  methods: {
    tapImg () {
      this.count++
      if (this.count >= 5) {
        this.systemShow = true
      }
    },

    formatParams () {
      for (const key in this.dataForm) {
        if (this.detailInfo[key] === undefined) {
          if (key === 'lightBrightness') {
            this.dataForm[key] = 0
          } else {
            this.dataForm[key] = ''
          }
          continue
        }
        this.dataForm[key] = this.detailInfo[key]
      }
    },
    // 获取终端设备详情
    getDeviceDetails (id) {
      setTimeout(async () => {
        await devIceDetails(id)
          .then(res => {
            if (res.data.stateOnline === 0) {
              Dialog.alert({
                title: '提示',
                message: '智能终端已离线'
              }).then(() => {
                // on close
                this.$router.go(-1)
              })
              return
            }
            this.detailInfo = res.data
          })
          .catch(e => {
            console.log(e)
          })
        this.formatParams()
      }, 1500)
    },
    // 显示播放列表
    toPlayList (id) {
      this.$router.push({ path: '/playList', query: { info: this.detailInfo } })
    },
    // 设置休眠状态
    async setTimeControl () {
      this.toast('设置中', 'loading', 0)
      await setTime(this.id, this.dataForm)
        .then(res => {
          this.prompt(res.state)
        })
        .catch(e => {
          console.log(e)
          Toast.clear()
        })
      this.getDeviceDetails(this.id)
    },
    // 设置工作时间
    async setTimeOpen () {
      this.toast('设置中', 'loading', 0)
      await this.setTimeRequest()
      this.getDeviceDetails(this.id)
    },
    // 设置休息时间
    async setTimeClose () {
      this.toast('设置中', 'loading', 0)
      await this.setTimeRequest()
      this.getDeviceDetails(this.id)
    },

    setTimeRequest () {
      return setTime(this.id, { devid: this.detailInfo.id, deviceCode: this.detailInfo.deviceCode, ...this.dataForm, timeControl: 1 })
        .then(res => {
          this.prompt(res.state)
        })
        .catch(e => {
          console.log(e)
          Toast.clear()
        })
    },
    // 光源参数
    // 设置光源控制
    async setLight () {
      this.toast('设置中', 'loading', 0)
      await light(this.id, { devid: this.detailInfo.id, deviceCode: this.detailInfo.deviceCode, ...this.dataForm })
        .then(res => {
          this.prompt(res.state)
        })
        .catch(e => {
          console.log(e)
          Toast.clear()
        })
      this.getDeviceDetails(this.id)
    },
    // 设置播放方向
    async setstateOrient () {
      this.toast('设置中', 'loading', 0)
      await direction(this.id, { deviceCode: this.detailInfo.deviceCode, devid: this.detailInfo.id, stateOrient: this.stateOrient })
        .then(res => {
          this.prompt(res.state)
        })
        .catch(e => {
          console.log(e)
          Toast.clear()
        })
      this.getDeviceDetails(this.id)
    },

    async setScenes () {
      this.toast('设置中', 'loading', 0)
      await orderNumber(this.id, { deviceCode: this.detailInfo.deviceCode, devid: this.detailInfo.id, playListNumber: this.orderNumber })
        .then(res => {
          this.prompt(res.state)
        })
        .catch(e => {
          console.log(e)
          Toast.clear()
        })
      this.getDeviceDetails(this.id)
    },
    // 设置声音
    async setVolume () {
      this.toast('设置中', 'loading', 0)
      await volume(this.id, this.dataForm)
        .then(res => {
          this.prompt(res.state)
        })
        .catch(e => {
          console.log(e)
          Toast.clear()
        })
      this.getDeviceDetails(this.id)
    },

    // 设置开机动画
    async setBootAnimation () {
      this.toast('设置中', 'loading', 0)
      await bootAnimation(this.id, this.dataForm)
        .then(res => {
          this.prompt(res.state)
        })
        .catch(e => {
          console.log(e)
          Toast.clear()
        })
      this.getDeviceDetails(this.id)
    },

    // 设置信息提示
    async setInfoAnimation () {
      this.toast('设置中', 'loading', 0)
      await infoAnimation(this.id, this.dataForm)
        .then(res => {
          this.prompt(res.state)
        })
        .catch(e => {
          console.log(e)
          Toast.clear()
        })
      this.getDeviceDetails(this.id)
    },

    // 系统设置
    async setSystem (fn) {
      console.log(fn)
      this.toast('设置中', 'loading', 0)
      await this[fn](this.id)
        .then(res => {
          this.prompt(res.state)
          this.getDeviceDetails(this.id)
          // if (res.state === 1) {
          //   if ( fn !== 'uploadLog') {
          //     this.$router.go(-1)
          //   }
          // }
        })
        .catch(e => {
          console.log(e)
          Toast.clear()
        })
    },
    // 头部right-icon点击
    onClickRight (icon) {
      if (icon === 'question-o') {
        this.$router.push({ path: '/question', query: { type: this.$route.path } })
      } else if (icon === 'edit') {
        this.$router.push({ path: '/deviceAddorEdit', query: { isAdd: false, info: this.detailInfo } })
      }
    },
    // 时间转换过滤器
    formatter (type, val) {
      if (type === 'hour') {
        return `${val} 时`
      } else if (type === 'minute') {
        return `${val} 分`
      }
      return val
    },
    // 弹出层弹出
    showPopup (type) {
      this.type = type
      this.popupTitle = this.titleObj[type]
      if (type === 'timeOpen' || type === 'timeClose') {
        // 判断是否为禁用模式
        if (this.timeDisabled) return
        this.showPicker = true
        this.timeShow = true
        type === 'timeOpen' ? this.currentTime = this.detailInfo.timeOpen : this.currentTime = this.detailInfo.timeClose
      } else {
        this.showPicker = true
        this.timeShow = false
        this.columns = this[type]
        if (type === 'stateOrient') {
          this.defaultIndex = stateOrient.findIndex(item => item.val === this.detailInfo.stateOrient)
        } else if (type === 'scenes') {
          this.defaultIndex = this.scenes.findIndex(item => item.value === this.detailInfo.scenes)
        }
      }
    },
    // 选择器确定回调函数
    onConfirm (obj) {
      if (this.type === 'lightBrightness') {
        this.dataForm[this.type] = obj.slice(0, -1)
      } else if (this.type === 'stateOrient') {
        this.stateOrientValue = obj.val
      } else if (this.type === 'scenes') {
        this.orderNumber = obj.val
      } else {
        this.dataForm[this.type] = obj.val
      }
      this.showPicker = false
      // 调取函数 页面实时更新
      this.controlFunction[this.type]()
    },
    // 时间选择器确定
    onConfirmTime (val) {
      this.dataForm[this.type] = val
      // 数据转化fliters
      this.showPicker = false
      // 调取函数 页面实时更新
      this.controlFunction[this.type]()
    },
    // g--mb转化
    filtersStorage (val) {
      if (typeof (val) === 'number' && !isNaN(val)) {
        return (val / 1024).toFixed(2)
      } else {
        return 0
      }
    },
    prompt (state) {
      if (state === 1) {
        this.toast('设置成功', 'success')
      } else if (state === 0) {
        this.toast('通讯超时', 'fail')
      } else if (state === -2) {
        this.toast('执行失败', 'fail')
      } else {
        this.toast('操作失败，请重试！', 'fail')
      }
    }
  }

}
</script>

<style lang="scss" scoped>
$bg0: #fff;
$bg1: #1989fa;
$bg2: #f6f6f6;
$color1: #000;
.deviceInfo{
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  background: $bg2;
}
.info-status-box{
  // background-image: url('../../assets/img/deviceBG.png');
  background-size: 100% 100%;
  margin-bottom: .1rem;
  background: $bg0;
}
.infoitem{
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  background: $bg2;
}
.infoItem-box{
  width: 100%;
  margin-bottom: .1rem;
  & .van-cell__value,.van-cell__title{
    color:$color1;
  }
  & .van-cell{
    padding: .1rem .2rem;
  }
}
.title{
  display: flex;
  align-items: center;
  &_bar{
    display: inline-block;
    vertical-align: middle;
    width: .045rem;
    height: .18rem;
    background: $bg1;
  }
  &_word{
    font-size: .16rem;
    padding-left: .09rem;
  }
}
.bg-0 {
  background: $bg0;
}
.bg-1 {
  background: $bg2;
}
.volume-box{
 height: .2rem;
  display: -webkit-box;
  width: 2.4rem;
  display: -ms-flexbox;
  display: flex;
  background: #fff;
  padding-right: .1rem;
  position: relative;
  top: .1rem;
}
.system-btns{
  width: 100%;
  height: 1.35rem;
  box-sizing: border-box;
  padding: .19rem .18rem .03rem .18rem;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  &-item {
    height: .38rem;
    width: 1.56rem;
    margin-bottom: .17rem;
  }
}
.volume .van-cell__value{
  overflow: visible;
}
</style>
