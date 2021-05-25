<template>
  <div class="code">
    <TitleBar :title="title"></TitleBar>
    <van-form @submit="onSubmit">
      <van-field
        v-model="dataForm.location"
        name="安装位置"
        label="安装位置"
        placeholder="请输入安装位置"
        :rules="[{ required: true, message: '请输入安装位置' }]"
      />
      <van-field
        v-model="dataForm.name"
        name="设备名称"
        label="设备名称"
        placeholder="请输入设备名称"
        :rules="[{ required: true, message: '请填写设备名称' }]"
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
  </div>
</template>

<script>
// import { Toast } from 'vant'
import common from '@/mixins/common'
// components
import TitleBar from '@/components/TitleBar/TitleBar'
// api
import { save } from '@/api/device/device'
export default {
  name: 'forgetWord',
  mixins: [common],
  components: {
    TitleBar
  },
  data () {
    return {
      title: '智能终端认证',
      dataForm: {
        location: '',
        code: '',
        name: ''
      },
      isAdd: true,
      toastInfo: '注册',
      info: {}
    }
  },
  mounted () {
    this.isAdd = this.$route.query.isAdd
    if (this.isAdd) {
      this.dataForm.code = this.$route.query.devCode
      this.dataForm.location = ''
      this.dataForm.name = ''
      this.title = '请输入信息'
      this.toastInfo = '认证'
    } else {
      this.info = this.$route.query.info
      this.dataForm.location = this.info.location
      this.dataForm.name = this.info.name
      this.dataForm.code = this.info.code
      this.title = '请修改信息'
      this.toastInfo = '修改'
    }
  },
  methods: {
    async onSubmit () {
      this.toast(`智能终端${this.toastInfo}中`, 'loading', 0)
      await this.deviceRegister(this.dataForm)
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
