<template>
  <div class="code">
    <!-- 验证码登录表单 -->
    <Code-form
      :formList='formList'
      :title="title"
      :btnName='btnName'
      :dataForm='dataForm'
      @onSubmit='onSubmit'
      @touchstart="itemTouchstart"
    >
    </Code-form>
    <!-- 验证码登录表单 -->
    <van-number-keyboard
      v-model="dataForm.mobile"
      :show="numberShow"
      @blur="numberShow = false"
    />
    <van-number-keyboard
      v-model="dataForm.code"
      :show="codeShow"
      @blur="codeShow = false"
    />
  </div>
</template>

<script>
// components
import CodeForm from './components/CodeForm'
import { Toast } from 'vant'
import common from '@/mixins/common'
// api
import { getSMSCode, isExist } from '@/api/login/login'
export default {
  name: 'forgetWord',
  mixins: [common],
  components: {
    CodeForm
  },
  data () {
    return {
      codeShow: false,
      numberShow: false,
      codeNum: 60,
      codeTime: null,
      patternTel: /^1[3456789]\d{9}$/,
      patternCode: /^\d{4}$/,
      testTel: false,
      testCode: false,
      title: '验证码登录',
      formList: [
        {
          model: 'mobile',
          icon: 'graphic',
          placeholder: '请输入手机号码',
          readonly: true,
          hasBtn: false
        },
        {
          model: 'code',
          icon: 'lock',
          placeholder: '请输入验证码',
          readonly: true,
          hasBtn: true,
          btnOptions: {
            disabled: false,
            callBack: this.getCode,
            name: '获取验证码'
          }
        }
      ],
      dataForm: {
        mobile: '',
        code: '',
        freeLogin: true
      },
      serveCode: '',
      btnName: '登录'
    }
  },
  created () {
    // eslint-disable-next-line
    StatusBar.styleDefault()
    // eslint-disable-next-line
    StatusBar.backgroundColorByHexString("#FFFFFF");
  },
  methods: {
    empty () {
      if (!this.testTel) {
        if (this.dataForm.mobile) {
          this.toast('手机号格式错误', 'fail')
        } else {
          this.toast('请填写手机号', 'fail')
        }
        return false
      } else if (!this.testCode) {
        if (this.dataForm.code) {
          this.toast('请填写正确验证码', 'fail')
        } else {
          this.toast('请填写验证码', 'fail')
        }
        return false
      } else if (this.testCode && this.testTel) return true
    },
    onSubmit () {
      this.checkTel()
      this.checkCode()
      if (!this.empty()) return
      this.toast('请稍等', 'loading', 0)
      // eslint-disable-next-line
      this.dataForm.uuid = device.uuid
      // eslint-disable-next-line
      this.dataForm.manufacturer = device.manufacturer
      this.$store.dispatch('loginSMS', this.dataForm)
        .then(res => {
          // 登录成功
          Toast.clear()
          this.$router.push('/')
        })
        .catch(e => {
          console.log(e)
        })
    },
    // 清空密码验证码
    cleanWord () {
      this.$refs.form.resetValidation('code')
      this.code = ''
    },
    // 手机号是否注册
    isSignUp () {
      this.toast('获取验证码中', 'loading', 0)
      return isExist({ mobile: this.dataForm.mobile })
        .then(res => {
          Toast.clear()
          if (res.msg === 'false') {
            this.toast('该手机号码还未注册，请前往注册页进行登录', 'text')
            return true
          } else {
            return false
          }
        })
        .catch(e => {
          Toast.clear()
          console.log(e)
          return false
        })
    },
    // 获取验证码
    async getCode () {
      this.serveCode = ''
      // 判断手机号是否为空
      if (!this.dataForm.mobile) {
        this.toast('前填写手机号码', 'fail')
        return
      }
      // 手机号码注册验证
      const isSignUp = await this.isSignUp()
      if (isSignUp) return
      // 验证码定时器
      this.formList[1].btnOptions.disabled = true
      const str = '重新获取'
      this.formList[1].btnOptions.name = this.codeNum + str
      this.codeTime = setInterval(() => {
        if (this.codeNum <= 0) {
          this.formList[1].btnOptions.name = '重新获取'
          this.formList[1].btnOptions.disabled = false
          this.codeNum = 60
          clearInterval(this.codeTime)
          return
        }
        this.codeNum--
        this.formList[1].btnOptions.name = this.codeNum + str
      }, 1000)
      // 获取验证码 后台
      getSMSCode(this.dataForm.mobile)
        .then(res => {
          this.serveCode = res.smsCode
        })
        .catch(e => {
          console.log(e)
        })
    },
    // 注册
    signUp () {
      this.$router.push('/signUp')
    },
    Login () {
      this.$router.push('/login')
    },
    // 验证手机号
    checkTel () {
      if (!this.dataForm.mobile) {
        this.testTel = false
      }
      if (!this.patternTel.test(this.dataForm.mobile)) {
        this.testTel = false
      } else {
        this.testTel = true
      }
    },

    // 验证码
    checkCode () {
      if (!this.dataForm.code) {
        this.testCode = false
      }
      if (!this.patternCode.test(this.dataForm.code)) {
        this.testCode = false
      } else {
        this.testCode = true
      }
    },
    itemTouchstart (type) {
      if (type === 'mobile') {
        this.codeShow = false
        this.numberShow = true
      } else if (type === 'code') {
        this.numberShow = false
        this.codeShow = true
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
  padding-top: .2rem;
}
.login-tip{
  height: .53rem;
  font-size: .14rem;
  font-weight: 600;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
