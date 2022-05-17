<template>
  <div class="code">
    <TitleBar :title="title"></TitleBar>
    <van-form @submit="onSubmit">
      <van-field
        v-if="isAdd"
        id="device-code-input"
        class="device-code-form"
        v-model="dataForm.code"
        name="设备编号"
        label="设备编号"
        required
        placeholder="请输入设备编号"
        :rules="[
          { required: true, message: '请输入设备编号' },
          { validator: codeValidator, message: '设备编号已注册！' }
        ]"
      />
      <van-field
        v-if="isAdd"
        v-model="dataForm.type"
        name="设备类型"
        label="设备类型"
        required
        placeholder="请选择设备类型"
        readonly
        @click="show('type')"
      />
      <van-field
        v-model="dataForm.name"
        name="设备名称"
        label="设备名称"
        required
        placeholder="请输入设备名称"
        :rules="[{ required: true, message: '请填写设备名称' }]"
      />
      <van-field
        v-model="dataForm.location"
        name="安装位置"
        label="安装位置"
        required
        placeholder="请输入安装位置"
        :rules="[{ required: true, message: '请输入安装位置' }]"
      />
      <van-field
        v-if="isAdd"
        v-model="dataForm.stateOrient"
        name="安装方向"
        label="安装方向"
        required
        placeholder="请选择安装方向"
        readonly
        right-icon="warning-o"
        @click-right-icon.stop="clickRightIcon"
        @click="show('stateOrient')"
      />
      <van-field
        v-if="isAdd"
        v-model="dataForm.power"
        name="供电方式"
        label="供电方式"
        required
        placeholder="请选择供电方式"
        readonly
        @click="show('power')"
      />
      <div class="btn">
        <van-button
          class="btn--button"
          type="info"
          native-type="submit"
          @click="onSubmit"
        >
          确认
        </van-button>
      </div>
    </van-form>
    <van-button type="default" @click.stop="cancel" class="cancel">
      取消
    </van-button>
    <van-popup v-model="showPicker" position="bottom">
      <van-picker
        title="标题"
        show-toolbar
        :columns="columns"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { Toast, ImagePreview } from 'vant'
import common from '@/mixins/common'
// components
import TitleBar from '@/components/TitleBar/TitleBar'
// api
import { save, deviceCheckCode } from '@/api/device/device'

import { deviceTypeArr, orientArr, powerArr } from '@/common/common'
export default {
  name: 'forgetWord',
  mixins: [common],
  components: {
    TitleBar,
    [ImagePreview.Component.name]: ImagePreview.Component
  },
  data () {
    return {
      title: '智能终端认证',
      showPicker: false,
      msgStatus: 0, // 0隐藏，1成功 绿色
      currentType: 'type',
      stateOrient: orientArr,
      type: deviceTypeArr,
      power: powerArr,
      columns: [],
      dataForm: {
        location: '',
        code: '',
        name: '',
        type: '',
        stateOrient: null,
        power: null
      },
      isAdd: true,
      toastInfo: '注册',
      info: {}
    }
  },

  mounted () {
    this.isAdd = this.$route.query.isAdd === 'true'

    this.setFormValue()
  },
  methods: {
    setFormValue () {
      if (this.isAdd) {
        this.dataForm.location = ''
        this.dataForm.name = ''
        this.dataForm.code = ''
        this.dataForm.type = ''
        this.dataForm.stateOrient = null
        this.dataForm.power = null
        this.title = '请输入信息'
        this.toastInfo = '认证'
      } else {
        this.info = this.$route.query.info
        this.dataForm.location = this.info.location
        this.dataForm.name = this.info.name
        this.dataForm.code = this.info.code
        this.dataForm.type = this.info.type
        this.dataForm.stateOrient = this.info.stateOrient
        this.dataForm.power = this.power.type
        this.title = '请修改信息'
        this.toastInfo = '修改'
      }
    },
    show (type) {
      this.currentType = type
      this.columns = this[type]
      this.showPicker = true
    },

    clickRightIcon () {
      ImagePreview({
        overlayStyle: { background: 'rgba(255,255,255,1)' },
        images: [require('../../assets/img/orient.png')],
        closeable: true,
        showIndex: false
      })
    },

    findVal (arr, text) {
      const obj = arr.find((item) => item.text === text)
      return obj.val
    },

    getParams () {
      const copyData = JSON.parse(JSON.stringify(this.dataForm))
      if (this.isAdd) {
        copyData.stateOrient = this.findVal(
          orientArr,
          this.dataForm.stateOrient
        )
        copyData.power = this.findVal(powerArr, this.dataForm.power)
      }
      if (this.isAdd) {
        return copyData
      } else {
        return Object.assign(this.info, copyData)
      }
    },

    async onSubmit () {
      try {
        this.toast(`智能终端${this.toastInfo}中`, 'loading', 0)
        const params = this.getParams()
        await this.deviceRegister(params)
      } catch (e) {
        console.log(e)
        Toast.clear()
      }
    },

    codeValidator (val) {
      Toast.loading('验证中...')
      return new Promise((resolve) => {
        deviceCheckCode({ deviceCode: val })
          .then((res) => {
            if (res.state === 1) {
              this.msgStatus = 1
              resolve(true)
            } else {
              this.msgStatus = 0
              resolve(false)
            }
            Toast.clear()
          })
          .catch((e) => {
            console.log(e)
            this.msgStatus = 0
            Toast.clear()
          })
      })
    },

    onConfirm (value, index) {
      this.dataForm[this.currentType] = value.text
      this.showPicker = false
    },

    // 取消添加 编辑
    cancel () {
      this.$router.go(-1)
    },

    deviceRegister (obj) {
      return save(obj)
        .then((res) => {
          if (res.state === 1) {
            this.toast(`智能终端${this.toastInfo}成功！`)
          } else if (res.state === 0) {
            this.toast('通信超时', 'fail')
          } else {
            this.toast('操作失败，请重试！', 'fail')
          }
          if (this.isAdd) {
            this.$router.push('/')
          } else {
            this.$router.push({ path: '/details', query: { id: this.info.id } })
          }
        })
        .catch((e) => {
          console.log(e)
          this.toast(`${this.toastInfo}失败`, 'fail')
        })
    }
  },

  watch: {
    'dataForm.code' (n, o) {
      if (n === '' || n === null) {
        this.msgStatus = 0
      }
    },
    msgStatus () {
      const ele = document.querySelector('.device-code-form').lastChild
      const eleInput = document.querySelector('#device-code-input')
      const tagInput = document.querySelector('.van-field__success-message')
      if (this.msgStatus === 1 && !tagInput) {
        const putEle = document.createElement('div')
        putEle.classList.add('van-field__success-message')
        putEle.innerHTML = '设备编号验证通过'
        ele.appendChild(putEle)
        eleInput.classList.add('success-color')
      } else if (this.msgStatus === 0 && tagInput) {
        const msgEle = document.querySelector('.van-field__success-message')
        if (msgEle) ele.removeChild(msgEle)
        eleInput.classList.remove('success-color')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.code {
  height: 100%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background: white;
  /deep/ .van-popup {
    z-index: 2000;
  }
}
.btn {
  width: 100%;
  height: 0.39rem;
  position: fixed;
  bottom: 0;
  right: 0;
  & button {
    width: 50%;
    height: 0.39rem;
    line-height: 0.39rem;
    float: right;
    border-radius: 0;
    border-bottom: none;
    border-right: none;
    border-left: none;
  }
}
.cancel {
  border-radius: 0;
  border-bottom: none;
  border-right: none;
  border-left: none;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 50%;
  height: 0.39rem;
  line-height: 0.39rem;
}
</style>
