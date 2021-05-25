<template>
  <div class="forgetWord">
    <transition name='van-slide-left'>
    <!-- 重置密码验证码表单 -->
      <Code-form
        v-if="!showNext"
        :formList='formList'
        :title="title"
        :btnName='btnName'
        :dataForm='dataForm'
        @onSubmit='onSubmit'
        @blur="itemBlur"
        @touchstart="itemTouchstart"
      ></Code-form>
    </transition>
    <!-- 重置密码验证码表单 -->

    <!-- 密码表单 -->
    <transition name='van-slide-right'>
      <Code-form
        v-if="showNext"
        :formList='formList1'
        :title="title1"
        :btnName='btnName1'
        :dataForm='dataForm1'
        :backFn='true'
        @back='back'
        @onSubmit='onSubmitWord'
        @blur="checkPassword"
      ></Code-form>
    </transition>
    <!-- 密码表单 -->
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
// import { Toast } from 'vant'
import common from '@/mixins/common'
import { isExist } from '@/api/login/login'
import { getForgetCode, restPassword } from '@/api/login/forgetWord'
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
      showNext: false,
      codeNum: 60,
      codeTime: null,
      title: '重置密码',
      formList: [
        {
          model: 'mobile',
          icon: 'graphic',
          placeholder: '请输入手机号码',
          hasBtn: false,
          readonly: true
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
      patternTel: /^1[3456789]\d{9}$/,
      patternCode: /^\d{4}$/,
      testTel: false,
      testCode: false,
      serveCode: '',
      dataForm: {
        mobile: '',
        code: ''
      },
      btnName: '下一步',
      title1: '重置密码',
      formList1: [
        {
          model: 'newPassword',
          type: 'password',
          icon: '',
          label: '新密码',
          placeholder: '请输入新密码',
          hasBtn: false
        }
      ],
      patternPassword: /[a-zA-Z0-9]{6,20}/,
      dataForm1: {
        newPassword: ''
      },
      btnName1: '完成'
    }
  },
  created () {
    StatusBar.styleDefault()
    StatusBar.backgroundColorByHexString("#FFFFFF");
  },
  methods: {
    empty () {
      if (!this.testTel) {
        if (this.dataForm.mobile) {
          this.toast('手机号格式错误')
        } else {
          this.toast('请填写手机号')
        }
        return false
      } else if (!this.testCode) {
        if (this.dataForm.code) {
          this.toast('请填写正确验证码')
        } else {
          this.toast('请填写验证码')
        }
        return false
      } else if (this.testCode && this.testTel) return true
    },

    back () {
      if (this.showNext) {
        this.$router.forward()
        this.showNext = false
      }
    },
    // 下一步
    onSubmit () {
      this.checkTel()
      this.checkCdoe()
      if (!this.empty()) return
      this.showNext = true
    },

    // 提交新密码
    async onSubmitWord () {
      if (!this.checkPassword()) return
      this.toast('密码重置中...', 'loading', 0)
      this.dataForm1 = Object.assign(this.dataForm1, this.dataForm)
      await restPassword(this.dataForm1)
        .then(res => {
          this.toast('密码重置成功', 'success')
          this.$router.push('/login')
        })
        .catch(e => {
          console.log(e)
          this.toast('密码重置失败', 'fail')
          this.showNext = false
        })
    },

    // 清空密码验证码
    cleanWord () {
      this.$refs.form.resetValidation('code')
      this.code = ''
    },

    // 手机号是否注册
    isSignUp () {
      return isExist({ mobile: this.dataForm.mobile })
        .then(res => {
          if (res.msg === 'false') {
            this.toast('该手机号码还未注册，请前往注册页进行登录', 'text')
            return true
          } else {
            return false
          }
        })
        .catch(e => {
          console.log(e)
          return false
        })
    },

    // 获取验证码
    async getCode () {
      this.serveCode = ''
      if (!this.dataForm.mobile) {
        this.toast('前填写手机号码')
        return
      }
      // 手机号码注册验证
      const isSignUp = await this.isSignUp()
      if (isSignUp) {
        return
      }
      // 验证码dom数据操作
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
      getForgetCode(this.dataForm.mobile)
        .then(res => {
          this.serveCode = res.smsCode
        })
        .catch(e => {
          console.log(e)
        })
    },

    // 验证手机号
    checkTel () {
      if (!this.dataForm.mobile) {
        this.testTel = false
        return false
      }
      if (!this.patternTel.test(this.dataForm.mobile)) {
        this.testTel = false
      } else {
        this.testTel = true
      }
    },

    // 验证码
    checkCdoe () {
      if (!this.dataForm.code) {
        this.testCode = false
        return false
      }
      if (!this.patternCode.test(this.dataForm.code)) {
        this.testCode = false
      } else {
        this.testCode = true
      }
    },
    // 验证密码
    checkPassword (val) {
      if (!this.dataForm1.newPassword) {
        this.testNewPassword = false
        this.toast('请填写新密码')
        return false
      }
      if (!this.patternPassword.test(this.dataForm1.newPassword)) {
        this.testNewPassword = false

        return false
      } else {
        this.testNewPassword = true
        return true
      }
    },

    itemBlur (type) {
      if (type === 'mobile') {
        this.checkTel()
      } else if (type === 'code') {
        this.checkCdoe()
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
.forgetWord {
  height: 100%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background: white;
  position: relative;
  margin-top: .2rem;
  padding-bottom: .19rem;
}
</style>
