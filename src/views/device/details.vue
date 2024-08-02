<template>
  <div class="deviceInfo">
    <div class="info-status-box">
      <device-item :itemInfo="detailInfo" @tapImg="tapImg"></device-item>
    </div>
    <div class="infoitem">
      <!-- 媒体 -->
      <div class="infoItem-box">
        <van-cell>
          <template slot="title">
            <p class="title">
              <span class="title_bar"></span
              ><span class="title_word">媒体</span>
            </p>
          </template>
        </van-cell>
        <van-cell title="播放列表" is-link @click="toPlayList" />
        <van-cell
          title="切换场景"
          is-link
          @click="showPopup('scenes')"
          :value="orderNumberFormatter(orderNumber)"
        />
      </div>
      <!-- 运行状态 -->
      <div class="infoItem-box">
        <van-cell>
          <template slot="title">
            <p class="title">
              <span class="title_bar"></span
              ><span class="title_word">运行状态</span>
            </p>
          </template>
        </van-cell>
        <van-cell
          title="在线状态"
          :value="detailInfo.stateOnline | statusOnline"
        />
        <van-cell title="工作状态" :value="detailInfo.stateWork | statusWork" />
        <van-cell :value="temperature">
          <template slot="title">
            <span class="custom-title">核心温度</span>

            <template v-if="temp">
              <van-tag type="danger" style="margin-left: 0.1rem">高温</van-tag>
            </template>
          </template>
        </van-cell>
        <van-cell :value="registerTime">
          <template slot="title">
            <span class="custom-title">到期时间</span>
          </template>
        </van-cell>
        <!-- <van-cell :value="filtersStorage(detailInfo.storageTotal - detailInfo.storageUsable) + 'G/' + filtersStorage(detailInfo.storageTotal)+ 'G'">
         &lt;!&ndash; 使用 title 插槽来自定义标题 &ndash;&gt;
         <template slot="title">
           <span class="custom-title">内存使用</span>
           <template v-if="storageStatus">
             <van-tag type="danger" style="margin-left: .1rem">存储将满</van-tag>
           </template>
         </template>
       </van-cell> -->
      </div>
      <!-- 设备信息 -->
      <div class="infoItem-box">
        <van-cell>
          <template slot="title">
            <p class="title">
              <span class="title_bar"></span
              ><span class="title_word">设备信息</span>
            </p>
          </template>
        </van-cell>
        <van-cell title="设备型号" :value="detailInfo.type" />
        <van-cell title="设备编号" :value="detailInfo.code" />
        <!-- <van-cell title="安装方向" :value="orient" /> -->
        <van-cell title="供电方式" :value="power" />
      </div>

      <!-- 参数设置 -->
      <div class="infoItem-box">
        <van-cell>
          <template slot="title">
            <p class="title">
              <span class="title_bar"></span
              ><span class="title_word">参数设置</span>
            </p>
          </template>
        </van-cell>
        <van-cell
          title="投影方向"
          :disabled="disabled"
          is-link
          @click="showPopup('stateOrient')"
          :value="stateOrientValue | stateOrientFilter"
        />
        <van-cell
          title="投影闪烁"
          :disabled="disabled"
          is-link
          @click="showPopup('lightBlink')"
          :value="dataForm.lightBlink | stateBlinkFilter"
        />
        <!--        <van-cell center title="启用休眠">-->
        <!--          <van-switch :active-value='1' :inactive-value='0' v-model="dataForm.timeControl" @change='setTimeControl' slot="right-icon" size="24" />-->
        <!--        </van-cell>-->
        <van-cell center title="投影控制">
          <div class="cell-slot" slot="right-icon">
            <span
              class="cell-slot-left"
              :class="dataForm.lightControl !== 1 ? 'active' : ''"
              >时间控制</span
            >
            <van-switch
              :disabled="disabled"
              :inactive-value="0"
              :active-value="1"
              v-model="dataForm.lightControl"
              @change="setLight"
              inactive-color="#1989fa"
              active-color="#07c160"
              slot="right-icon"
              size="24"
            />
            <span
              class="cell-slot-right"
              :class="dataForm.lightControl === 1 ? 'active' : ''"
              >手动</span
            >
          </div>
        </van-cell>
        <van-cell center title="投影开关" v-if="timeDisabled">
          <div class="cell-slot" slot="right-icon">
            <span
              class="cell-slot-left"
              :class="lightBrightness ? 'active' : ''"
              >开启</span
            >
            <van-switch
              :disabled="!timeDisabled || disabled"
              :inactive-value="true"
              :active-value="false"
              v-model="lightBrightness"
              active-color="#ee0a24"
              inactive-color="#07c160"
              @change="setLight"
              size="24"
            />
            <span
              class="cell-slot-right"
              :class="!lightBrightness ? 'active' : ''"
              >关闭</span
            >
          </div>
        </van-cell>
        <template v-if="!timeDisabled">
          <van-cell
            title="休眠时间"
            :class="timeDisabled ? 'bg-1' : 'bg-0'"
            is-link
            @click="showPopup('timeClose')"
            :value="dataForm.timeClose"
          />
          <van-cell
            title="唤醒时间"
            :class="timeDisabled ? 'bg-1' : 'bg-0'"
            is-link
            @click="showPopup('timeOpen')"
            :value="dataForm.timeOpen"
          />
        </template>
        <template v-if="isR">
          <van-cell center title="警灯开关">
            <div class="cell-slot" slot="right-icon">
              <span
                class="cell-slot-left"
                :class="dataForm.lamp === 1 ? 'active' : ''"
                >开启</span
              >
              <van-switch
                :disabled="disabled"
                :inactive-value="1"
                :active-value="0"
                v-model="dataForm.lamp"
                @change="onChangeLamp"
                active-color="#ee0a24"
                inactive-color="#07c160"
                slot="right-icon"
                size="24"
              />
              <span
                class="cell-slot-right"
                :class="dataForm.lamp === 0 ? 'active' : ''"
                >关闭</span
              >
            </div>
          </van-cell>
          <van-cell center title="雷达开关">
            <div class="cell-slot" slot="right-icon">
              <span
                class="cell-slot-left"
                :class="dataForm.radar !== 0 ? 'active' : ''"
                >开启</span
              >
              <van-switch
                :disabled="disabled"
                :inactive-value="1"
                :active-value="0"
                v-model="dataForm.radar"
                @change="onChangeRadar"
                active-color="#ee0a24"
                inactive-color="#07c160"
                slot="right-icon"
                size="24"
              />
              <span
                class="cell-slot-right"
                :class="dataForm.radar === 0 ? 'active' : ''"
                >关闭</span
              >
            </div>
          </van-cell>
        </template>
        <!-- <van-cell title="光源控制" is-link @click="showPopup('lightControl')" :value="dataForm.lightControl | statusControl" /> -->
        <!-- <van-cell title="光源亮度" is-link @click="showPopup('lightBrightness')" :value="dataForm.lightBrightness + '%'" /> -->
        <!--        <van-cell title="媒体音量" class="volume" :border='false'>-->
        <!--          <div class="volume-box">-->
        <!--            <van-slider v-model="dataForm.stateVolume" :min="0" :max="15" bar-height="0.04rem" @change='setVolume'/>-->
        <!--          </div>-->
        <!--        </van-cell>-->
      </div>

      <!-- 参数设置 -->
      <template v-if="isR">
        <div class="infoItem-box">
          <van-cell>
            <template slot="title">
              <p class="title">
                <span class="title_bar"></span
                ><span class="title_word">联动设置</span>
              </p>
            </template>
          </van-cell>
          <van-cell center title="交汇路口联动预警">
            <div class="cell-slot" slot="right-icon">
              <span
                class="cell-slot-left"
                :class="linkForm.lora === 1 ? 'active' : ''"
                >开启</span
              >
              <van-switch
                :disabled="disabled"
                :inactive-value="1"
                :active-value="0"
                v-model="linkForm.lora"
                @change="changeLora"
                active-color="#ee0a24"
                inactive-color="#07c160"
                slot="right-icon"
                size="24"
              />
              <span
                class="cell-slot-right"
                :class="linkForm.lora === 0 ? 'active' : ''"
                >关闭</span
              >
            </div>
          </van-cell>
          <template v-if="linkForm.lora === 1">
            <van-cell center title="本机安装方向">
              <div class="cell-slot" slot="right-icon">
                <span
                  class="cell-slot-left"
                  :class="linkForm.loraMode === 1 ? 'active' : ''"
                  >方向1</span
                >
                <van-switch
                  :disabled="disabled"
                  :inactive-value="1"
                  :active-value="0"
                  v-model="linkForm.loraMode"
                  @change="changeLora"
                  active-color="#07c160"
                  inactive-color="#1989fa"
                  slot="right-icon"
                  size="24"
                />
                <span
                  class="cell-slot-right"
                  :class="linkForm.loraMode === 0 ? 'active' : ''"
                  >方向2</span
                >
              </div>
            </van-cell>
            <van-cell
              title="远程雷达设备编号"
              is-link
              @click="showDialog"
              :value="linkForm.loraCode"
            />
          </template>

          <van-cell
            title="警灯雷达联动"
            is-link
            @click="showPopup('linkLamp')"
            :value="linkForm.linkLamp | linkLampFilter"
          />
          <van-cell
            title="投影雷达联动"
            is-link
            @click="showPopup('linkLight')"
            :value="linkForm.linkLight | linkLightFilter"
          />
          <van-cell
            v-if="linkForm.linkLight !== 0"
            title="投影雷达联动模式"
            is-link
            @click="showPopup('linkLightMode')"
            :value="linkForm.linkLightMode | linkLightModeFilter"
          />
        </div>
      </template>

      <div class="infoItem-box">
        <van-cell
          v-if="hasOrient"
          title="画面方向"
          is-link
          @click="showPopup('stateOrient')"
          :value="stateOrientValue | stateOrientFilter"
        />
      </div>

      <!-- 系统设置 systemShow-->
      <!-- <div class="infoItem-box" v-if="false">
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
      </div> -->

      <!-- 系统设置按钮  systemShow-->
      <!-- <div class="system-btns" v-if="false">
        <van-button type="info" class="system-btns-item" @click="setSystem('rebootAll')">重启智能终端</van-button>
        <van-button type="info" class="system-btns-item" @click="setSystem('rebootApp')">重启核心程序</van-button>
        <van-button type="info" class="system-btns-item" @click="setSystem('uploadLog')">上传工作日志</van-button>
        <van-button type="danger" class="system-btns-item" @click="setSystem('reset')">恢复出厂设置</van-button>
      </div> -->
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
        :default-index="defaultIndex"
        :title="popupTitle"
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>

    <van-dialog
      v-model="showInput"
      title="远程雷达设备编号"
      show-cancel-button
      @cancel="onCancel"
      @confirm="onConfirmCode"
    >
      <van-field
        v-model="linkForm.loraCode"
        label=""
        placeholder="请输入远程雷达设备编号"
        autofocus
        maxlength="20"
      />
    </van-dialog>
  </div>
</template>

<script>
// 组件
import eventBus from "@/utils/eventBus";
import DeviceItem from "./components/DeviceItem";
import common from "@/mixins/common";
// api
import {
  devIceDetails,
  setTime,
  light,
  direction,
  orderNumber,
  volume,
  bootAnimation,
  infoAnimation,
  rebootAll,
  rebootApp,
  uploadLog,
  reset,
} from "@/api/device/details";
import {
  radarDevice,
  lampDevice,
  loraDevice,
  linkLampDevice,
  linkLightDevice,
} from "@/api/device/device";
import { Toast, Dialog } from "vant";
import { omit, pick } from "lodash";
import {
  lightControl,
  stateOrient,
  scenesOptions,
  orientArr,
  powerArr,
  orientProjection,
  lightBlinkOptions,
  linkOptions,
  linkModeOptions,
} from "@/common/common";
export default {
  name: "deviceDetails",
  mixins: [common],
  components: {
    DeviceItem,
  },
  computed: {
    isR() {
      return ["TA-R", "TB-R", "TC-R"].includes(this.detailInfo.type);
    },
    orient() {
      const obj = orientArr.find(
        (item) => item.val === this.detailInfo.stateOrient
      );
      return obj ? obj.text : "";
    },
    power() {
      const obj = powerArr.find((item) => item.val === this.detailInfo.power);
      return obj ? obj.text : "";
    },
    timeDisabled() {
      return this.dataForm.lightControl === 1;
    },
    temp() {
      if (this.detailInfo.alarm) {
        return this.detailInfo.alarm.includes("2001");
      } else {
        return false;
      }
    },
    temperature() {
      if (this.detailInfo.stateWork !== 1 && this.detailInfo.stateWork !== 0)
        return "";

      if (typeof this.detailInfo.temperature === "number") {
        return this.detailInfo.temperature + "℃";
      } else {
        return "0℃";
      }
    },
    registerTime() {
      if (this.detailInfo.stateWork !== 1 && this.detailInfo.stateWork !== 0)
        return "";

      return this.detailInfo.registerTime;
    },
    storageStatus() {
      if (this.detailInfo.alarm) {
        return this.detailInfo.alarm.includes("2002");
      } else {
        return false;
      }
    },
    scenes() {
      if (this.detailInfo.type) {
        const type = this.detailInfo.type;
        return scenesOptions[type];
      }
      return scenesOptions["ELF-A"];
    },
    disabled() {
      return this.detailInfo.stateOnline !== 1;
    },
    hasOrient() {
      return this.detailInfo.type === "ELF-A";
    },
    getType() {
      return this.detailInfo.type
        ? this.detailInfo.type.split("-").shift()
        : "";
    },
    orientOptions() {
      if (this.getType === "TB") return this.getTBorient;
      return orientProjection;
    },
    getTBorient() {
      return orientProjection.filter(
        (item) => item.val === 1 || item.val === 3
      );
    },
  },
  data() {
    const that = this;
    return {
      count: 0,
      systemShow: false,
      rebootAll: rebootAll,
      rebootApp: rebootApp,
      uploadLog: uploadLog,
      reset: reset,
      id: null,
      lightBrightness: false,
      defaultIndex: 0,
      detailInfo: {},
      stateOrientObj: {},
      timeDefault: [0, 0],
      showPicker: false,
      currentTime: "12:00:00",
      timeShow: true,
      type: "",
      columns: [],
      linkLightMode: linkModeOptions,
      linkLight: linkOptions,
      linkLamp: linkOptions,
      lightControl: lightControl,
      stateOrient: stateOrient,
      popupTitle: "",
      titleObj: {
        timeClose: "休眠时间",
        timeOpen: "唤醒时间",
        lightControl: "光源控制",
        lightBrightness: "光源亮度",
        lightBlink: "投影闪烁",
        stateOrient: "投影方向",
        scenes: "切换场景",
        linkLamp: "警灯雷达联动",
        linkLight: "投影雷达联动",
        linkLightMode: "投影雷达联动模式",
      },
      dataForm: {
        timeClose: "00:00",
        timeOpen: "00:00",
        lightControl: 0,
        lightBrightness: 1,
        lightBlink: 1,
        radar: 0,
        lamp: 0,
      },
      showInput: false,
      linkForm: {
        lora: 0,
        loraMode: 0,
        loraCode: "",
        linkLamp: 0,
        linkLight: 0,
        linkLightMode: 0,
      },
      stateOrientValue: 0,
      orderNumber: 0,
      dataForm1: {
        bootAnimation: "",
        infoAnimation: "",
      },
      controlFunction: {
        timeClose: that.setTimeClose,
        timeOpen: that.setTimeOpen,
        lightControl: that.setLight,
        lightBrightness: that.setLight,
        lightBlink: that.setLight,
        stateOrient: that.setstateOrient,
        linkLamp: that.changeLinkLamp,
        linkLight: that.changeLinkLight,
        linkLightMode: that.changeLinkLight,
        scenes: that.setScenes,
      },
    };
  },
  filters: {
    // 在线状态
    statusOnline(val) {
      return val === 1 ? "在线" : "离线";
    },
    // 工作状态
    statusWork(val) {
      return val === 1 ? "工作" : val === 0 ? "休眠" : "";
    },
    // 画面方向
    stateOrientFilter(val) {
      const obj = orientProjection.find((item) => item.val === val);
      return obj ? obj.text : "";
    },
    // 画面方向
    stateBlinkFilter(val) {
      const obj = lightBlinkOptions.find((item) => item.val === val);
      return obj ? obj.text : "";
    },
    linkLampFilter(val) {
      const obj = linkOptions.find((item) => item.val === val);
      return obj ? obj.text : "";
    },
    linkLightFilter(val) {
      const obj = linkOptions.find((item) => item.val === val);
      return obj ? obj.text : "";
    },
    linkLightModeFilter(val) {
      const obj = linkModeOptions.find((item) => item.val === val);
      return obj ? obj.content : "";
    },
    // 光源控制
    statusControl(val) {
      // 1：命令控制；0：自动控制；
      return val === 1 ? "手动控制" : "自动控制";
    },
  },

  async created() {
    this.id = this.$route.query.id;
    // 获取终端详情
    await devIceDetails(this.id)
      .then((res) => {
        this.detailInfo = res.data;
        this.lightBrightness = this.detailInfo.lightBrightness > 0;
        this.stateOrientValue = res.data.stateOrient;
        this.ordernumber = res.data.playListNumber;
      })
      .catch((e) => {
        console.log(e);
      });
    this.formatParams();

    eventBus.$on("onClickLeft", this.back);

    eventBus.$on("devList", this.updateList);

    this.$once("hook:beforeDestroy", () => {
      eventBus.$off("devList", this.updateList);
      eventBus.$off("onClickLeft", this.back);
    });
  },

  mounted() {
    // 头部图标点击事件监听
    eventBus.$on("onClickRight", (icon) => {
      this.onClickRight(icon);
    });
  },

  methods: {
    back() {
      this.$router.push("/");
    },
    updateList(data) {
      const obj = data.find((item) => item.id === this.id);

      if (obj) {
        this.detailInfo = Object.assign(this.detailInfo, obj);
      }
    },

    tapImg() {
      this.count++;
      if (this.count >= 5) {
        this.systemShow = true;
      }
    },

    orderNumberFormatter() {
      const obj = this.scenes.find(
        (item) => item.value === this.detailInfo.playListNumber
      );
      return obj ? obj.text : "";
    },

    formatParams() {
      for (const key in this.dataForm) {
        if (this.detailInfo[key] === undefined) {
          if (key === "lightBrightness") {
            this.dataForm[key] = 0;
          } else {
            this.dataForm[key] = "";
          }
          continue;
        }
        this.dataForm[key] = this.detailInfo[key];
      }
      for (const key in this.linkForm) {
        this.linkForm[key] = this.detailInfo[key];
      }
    },
    // 获取终端设备详情
    getDeviceDetails(id) {
      setTimeout(async () => {
        await devIceDetails(id)
          .then((res) => {
            if (res.data.stateOnline === 0) {
              Dialog.alert({
                title: "提示",
                message: "智能终端已离线",
              }).then(() => {
                // on close
                this.$router.go(-1);
              });
              return;
            }
            this.detailInfo = res.data;
            this.stateOrientValue = res.data.stateOrient;
            this.ordernumber = res.data.playListNumber;
          })
          .catch((e) => {
            console.log(e);
          });
        this.formatParams();
      }, 1500);
    },
    // 显示播放列表
    toPlayList() {
      this.$router.push({
        path: "/playList",
        query: { info: JSON.stringify(this.detailInfo), from: "deviceDetail" },
      });
    },
    // 设置休眠状态
    async setTimeControl() {
      this.toast("设置中", "loading", 0);
      await setTime(this.id, this.dataForm)
        .then((res) => {
          this.prompt(res.state);
        })
        .catch((e) => {
          console.log(e);
          Toast.clear();
        });
      this.getDeviceDetails(this.id);
    },
    // 设置工作时间
    async setTimeOpen() {
      this.toast("设置中", "loading", 0);
      await this.setLightRequest();
      this.getDeviceDetails(this.id);
    },
    // 设置休息时间
    async setTimeClose() {
      this.toast("设置中", "loading", 0);
      await this.setLightRequest();
      this.getDeviceDetails(this.id);
    },

    setLightRequest() {
      const param = omit(this.dataForm, "lamp", "radar");
      return light(this.id, {
        devid: this.detailInfo.id,
        deviceCode: this.detailInfo.code,
        ...param,
      })
        .then((res) => {
          this.prompt(res.state);
        })
        .catch((e) => {
          console.log(e);
          Toast.clear();
        });
    },

    setLampRequest() {
      return lampDevice(this.id, {
        devid: this.detailInfo.id,
        deviceCode: this.detailInfo.code,
        lamp: this.dataForm.lamp,
      })
        .then((res) => {
          this.prompt(res.state);
        })
        .catch((e) => {
          console.log(e);
          Toast.clear();
        });
    },

    setRadarRequest() {
      return radarDevice(this.id, {
        devid: this.detailInfo.id,
        deviceCode: this.detailInfo.code,
        radar: this.dataForm.radar,
      })
        .then((res) => {
          this.prompt(res.state);
        })
        .catch((e) => {
          console.log(e);
          Toast.clear();
        });
    },
    // 光源参数
    // 设置光源控制
    async setLight() {
      this.toast("设置中", "loading", 0);
      if (this.lightBrightness) {
        this.dataForm.lightBrightness = 100;
      } else {
        this.dataForm.lightBrightness = 0;
      }
      await this.setLightRequest();
      this.getDeviceDetails(this.id);
    },
    // 设置播放方向
    async setstateOrient() {
      this.toast("设置中", "loading", 0);
      await direction(this.id, {
        deviceCode: this.detailInfo.code,
        devid: this.detailInfo.id,
        stateOrient: this.stateOrientValue,
      })
        .then((res) => {
          this.prompt(res.state);
        })
        .catch((e) => {
          console.log(e);
          Toast.clear();
        });
      this.getDeviceDetails(this.id);
    },

    async onChangeLamp() {
      this.toast("设置中", "loading", 0);
      await this.setLampRequest();
      this.getDeviceDetails(this.id);
    },

    async onChangeRadar() {
      this.toast("设置中", "loading", 0);
      await this.setRadarRequest();
      this.getDeviceDetails(this.id);
    },

    async setScenes() {
      this.toast("设置中", "loading", 0);
      await orderNumber(this.id, {
        deviceCode: this.detailInfo.code,
        devid: this.detailInfo.id,
        playListNumber: this.orderNumber,
      })
        .then((res) => {
          this.prompt(res.state);
        })
        .catch((e) => {
          console.log(e);
          Toast.clear();
        });
      this.getDeviceDetails(this.id);
    },
    // 设置声音
    async setVolume() {
      this.toast("设置中", "loading", 0);
      await volume(this.id, this.dataForm)
        .then((res) => {
          this.prompt(res.state);
        })
        .catch((e) => {
          console.log(e);
          Toast.clear();
        });
      this.getDeviceDetails(this.id);
    },

    // 设置开机动画
    async setBootAnimation() {
      this.toast("设置中", "loading", 0);
      await bootAnimation(this.id, this.dataForm)
        .then((res) => {
          this.prompt(res.state);
        })
        .catch((e) => {
          console.log(e);
          Toast.clear();
        });
      this.getDeviceDetails(this.id);
    },

    // 设置信息提示
    async setInfoAnimation() {
      this.toast("设置中", "loading", 0);
      await infoAnimation(this.id, this.dataForm)
        .then((res) => {
          this.prompt(res.state);
        })
        .catch((e) => {
          console.log(e);
          Toast.clear();
        });
      this.getDeviceDetails(this.id);
    },

    showDialog() {
      this.showInput = true;
    },

    onCancel() {
      this.showInput = false;
    },

    async onConfirmCode() {
      this.toast("设置中", "loading", 0);
      await this.changeLora();
      this.showInput = false;
    },
    async changeLora() {
      this.toast("设置中", "loading", 0);
      await this.setLora();
      this.getDeviceDetails(this.id);
    },

    async changeLinkLamp() {
      this.toast("设置中", "loading", 0);
      await this.setLinkLamp();
      this.getDeviceDetails(this.id);
    },

    async changeLinkLight() {
      this.toast("设置中", "loading", 0);
      await this.setLinkLight();
      this.getDeviceDetails(this.id);
    },

    async setLora() {
      try {
        const params = pick(this.linkForm, "lora", "loraMode", "loraCode");
        const res = await loraDevice(this.id, {
          devid: this.detailInfo.id,
          deviceCode: this.detailInfo.code,
          ...params,
        });
        this.prompt(res.state);
      } catch (e) {
        console.log("🚀 ~ file: details.vue:854 ~ setLora ~ e:", e);
      }
    },

    async setLinkLamp() {
      try {
        const params = pick(this.linkForm, "linkLamp");
        const res = await linkLampDevice(this.id, {
          devid: this.detailInfo.id,
          deviceCode: this.detailInfo.code,
          ...params,
        });
        this.prompt(res.state);
      } catch (e) {
        console.log("🚀 ~ file: details.vue:868 ~ setLinkLamp ~ e:", e);
      }
    },

    async setLinkLight() {
      try {
        const params = pick(this.linkForm, "linkLight", "linkLightMode");
        const res = await linkLightDevice(this.id, {
          devid: this.detailInfo.id,
          deviceCode: this.detailInfo.code,
          ...params,
        });
        this.prompt(res.state);
      } catch (e) {
        console.log("🚀 ~ file: details.vue:882 ~ setLinkLight ~ e:", e);
      }
    },

    // 系统设置
    async setSystem(fn) {
      console.log(fn);
      this.toast("设置中", "loading", 0);
      await this[fn](this.id)
        .then((res) => {
          this.prompt(res.state);
          this.getDeviceDetails(this.id);
          // if (res.state === 1) {
          //   if ( fn !== 'uploadLog') {
          //     this.$router.go(-1)
          //   }
          // }
        })
        .catch((e) => {
          console.log(e);
          Toast.clear();
        });
    },
    // 头部right-icon点击
    onClickRight(icon) {
      if (icon === "question-o") {
        this.$router.push({
          path: "/question",
          query: { type: this.$route.path },
        });
      } else if (icon === "edit") {
        this.$router.push({
          path: "/deviceAddorEdit",
          query: { isAdd: false, info: this.detailInfo },
        });
      }
    },
    // 时间转换过滤器
    formatter(type, val) {
      if (type === "hour") {
        return `${val} 时`;
      } else if (type === "minute") {
        return `${val} 分`;
      }
      return val;
    },
    // 弹出层弹出
    showPopup(type) {
      // if (this.disabled) {
      //   Toast.fail("设备离线");
      //   return;
      // }
      this.type = type;
      this.popupTitle = this.titleObj[type];
      if (type === "timeOpen" || type === "timeClose") {
        // 判断是否为禁用模式
        if (this.timeDisabled) return;
        this.showPicker = true;
        this.timeShow = true;
        type === "timeOpen"
          ? (this.currentTime = this.detailInfo.timeOpen)
          : (this.currentTime = this.detailInfo.timeClose);
      } else {
        this.showPicker = true;
        this.timeShow = false;
        this.columns = this[type];

        if (type === "stateOrient") {
          this.columns = this.orientOptions;
          this.defaultIndex = this.orientOptions.findIndex(
            (item) => item.val === this.detailInfo.stateOrient
          );
        } else if (type === "scenes") {
          this.defaultIndex = this.scenes.findIndex(
            (item) => item.value === this.detailInfo.playListNumber
          );
        } else if (type === "linkLamp") {
          this.defaultIndex = this.linkLamp.findIndex(
            (item) => item.val === this.detailInfo.linkLamp
          );
        } else if (type === "linkLight") {
          this.defaultIndex = this.linkLight.findIndex(
            (item) => item.val === this.detailInfo.linkLight
          );
        } else if (type === "linkLightMode") {
          this.defaultIndex = this.linkLightMode.findIndex(
            (item) => item.val === this.detailInfo.linkLightMode
          );
        } else if (type === "lightBlink") {
          this.columns = lightBlinkOptions;
          this.defaultIndex = lightBlinkOptions.findIndex(
            (item) => item.val === this.detailInfo.lightBlinkO
          );
        }
      }
    },
    // 选择器确定回调函数
    onConfirm(obj) {
      if (this.type === "stateOrient") {
        this.stateOrientValue = obj.val;
      } else if (this.type === "scenes") {
        this.orderNumber = obj.value;
      } else if (
        ["linkLight", "linkLightMode", "linkLamp"].includes(this.type)
      ) {
        this.linkForm[this.type] = obj.val;
      } else {
        this.dataForm[this.type] = obj.val;
      }
      this.showPicker = false;
      // 调取函数 页面实时更新
      this.controlFunction[this.type]();
    },
    // 时间选择器确定
    onConfirmTime(val) {
      this.dataForm[this.type] = val;
      // 数据转化fliters
      this.showPicker = false;
      // 调取函数 页面实时更新
      this.controlFunction[this.type]();
    },
    // g--mb转化
    filtersStorage(val) {
      if (typeof val === "number" && !isNaN(val)) {
        return (val / 1024).toFixed(2);
      } else {
        return 0;
      }
    },
    prompt(state) {
      // 1成功，-1失败，-3 执行超时
      if (state === 1) {
        this.toast("设置成功", "success");
      } else if (state === -3) {
        this.toast("执行超时", "fail");
      } else if (state === -1) {
        this.toast("执行失败", "fail");
      } else {
        this.toast("操作失败，请重试！", "fail");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$bg0: #fff;
$bg1: #1989fa;
$bg2: #f6f6f6;
$color1: #000;
.deviceInfo {
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  background: $bg2;
}
.info-status-box {
  // background-image: url('../../assets/img/deviceBG.png');
  background-size: 100% 100%;
  margin-bottom: 0.1rem;
  background: $bg0;
  box-sizing: border-box;
  padding-right: 0.13rem;
}
.infoitem {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  background: $bg2;
}
.infoItem-box {
  width: 100%;
  margin-bottom: 0.1rem;
  & .van-cell__value,
  .van-cell__title {
    color: $color1;
  }
  & .van-cell {
    padding: 0.1rem 0.2rem;
  }
}
.title {
  display: flex;
  align-items: center;
  &_bar {
    display: inline-block;
    vertical-align: middle;
    width: 0.045rem;
    height: 0.18rem;
    background: $bg1;
  }
  &_word {
    font-size: 0.16rem;
    padding-left: 0.09rem;
  }
}
.bg-0 {
  background: $bg0;
}
.bg-1 {
  background: $bg2;
}
.volume-box {
  height: 0.2rem;
  display: -webkit-box;
  width: 2.4rem;
  display: -ms-flexbox;
  display: flex;
  background: #fff;
  padding-right: 0.1rem;
  position: relative;
  top: 0.1rem;
}
.system-btns {
  width: 100%;
  height: 1.35rem;
  box-sizing: border-box;
  padding: 0.19rem 0.18rem 0.03rem 0.18rem;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  &-item {
    height: 0.38rem;
    width: 1.56rem;
    margin-bottom: 0.17rem;
  }
}
.volume .van-cell__value {
  overflow: visible;
}
.cell-slot {
  display: flex;
  align-items: center;
  &-left {
    text-align: right;
    width: 0.6rem;
    margin-right: 0.05rem;
  }
  &-right {
    width: 0.4rem;
    margin-left: 0.05rem;
  }
}
.active {
  color: #1989fa;
}
</style>
