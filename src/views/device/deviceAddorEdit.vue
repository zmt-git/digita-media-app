<template>
  <div class="code">
    <TitleBar :title="title"></TitleBar>
    <van-form @submit="onSubmit">
      <van-field
        v-if="isAdd"
        v-model="dataForm.code"
        name="设备编号"
        label="设备编号"
        required
        placeholder="请输入设备编号"
        :rules="[
          { required: true, message: '请输入设备编号' },
          { validator: codeValidator, message: '设备未注册' }
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
        v-model="dataForm.orient"
        name="安装方向"
        label="安装方向"
        required
        placeholder="请选择安装方向"
        readonly
        right-icon="warning-o"
        @click-right-icon.stop='clickRightIcon'
        @click="show('orient')"
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
        <van-button class="btn--button" type="info" native-type="submit">
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
      currentType: 'type',
      orient: orientArr,
      type: deviceTypeArr,
      power: powerArr,
      columns: [],
      dataForm: {
        location: '',
        code: '',
        name: '',
        type: '',
        orient: '',
        power: ''
      },
      isAdd: true,
      toastInfo: '注册',
      info: {}
    }
  },
  mounted () {
    this.isAdd = this.$route.query.isAdd === 'true'
    console.log(this.$route.query)
    if (this.isAdd) {
      this.dataForm.location = ''
      this.dataForm.name = ''
      this.dataForm.code = ''
      this.dataForm.type = ''
      this.dataForm.orient = ''
      this.dataForm.power = ''
      this.title = '请输入信息'
      this.toastInfo = '认证'
    } else {
      this.info = this.$route.query.info
      this.dataForm.location = this.info.location
      this.dataForm.name = this.info.name
      this.dataForm.code = this.info.code
      this.dataForm.type = this.info.type
      this.dataForm.orient = this.info.orient
      this.dataForm.power = this.power.type
      this.title = '请修改信息'
      this.toastInfo = '修改'
    }
  },
  methods: {
    show (type) {
      this.currentType = type
      this.columns = this[type]
      this.showPicker = true
    },

    clickRightIcon () {
      console.log(1)
      ImagePreview({
        images: [
          require('../../assets/img/orient.png')
        ],
        closeable: true,
        showIndex: false
      })
    },

    getParams () {
      if (this.isAdd) {
        return this.dataForm
      } else {
        return Object.assign(this.info, this.dataForm)
      }
    },

    async onSubmit () {
      this.toast(`智能终端${this.toastInfo}中`, 'loading', 0)
      const params = this.getParams()
      await this.deviceRegister(params)
    },

    codeValidator (val) {
      Toast.loading('验证中...')
      return new Promise((resolve) => {
        deviceCheckCode({ deviceCode: val })
          .then(res => {
            if (res.msg === 'true') {
              resolve(true)
            } else {
              resolve(false)
            }
          })
          .catch(e => console.log(e))
        // Toast.clear()
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
        .then(res => {
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
            this.$router.go(-1)
          }
        })
        .catch(e => {
          console.log(e)
          this.toast(`${this.toastInfo}失败`, 'fail')
        })
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
  /deep/ .van-popup{
    z-index: 2000;
  }
}
.btn{
  width: 100%;
  height: .39rem;
  position: fixed;
  bottom: 0;
  right: 0;
  & button {
    width: 50%;
    height: .39rem;
    line-height: .39rem;
    float: right;
    border-radius: 0;
    border-bottom: none;
    border-right: none;
    border-left: none;
  }
}
.cancel{
  border-radius: 0;
  border-bottom: none;
  border-right: none;
  border-left: none;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 50%;
  height: .39rem;
  line-height: .39rem;
}
</style>
