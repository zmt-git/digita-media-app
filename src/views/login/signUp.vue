<template>
  <div class="signUp">
    <van-icon name="arrow-left" class="back" @click="back('sign')"></van-icon>
    <div class="form-box">
      <!-- 注册第一步获取验证码 -->
      <transition name="van-slide-left">
          <Code-form
          v-if="signUpShow"
          :formList='formList'
          :title="title"
          :btnName='btnName'
          :dataForm='dataForm'
          :showBack='false'
          @onSubmit='onSubmit'
          @blur='itemBlur'
          @touchstart='itemTouchstart'
        ></Code-form>
      </transition>
      <!-- 注册第一步获取验证码 -->

      <!-- 注册第二步完善个人信息 -->
      <transition name="van-slide-right">
        <div class="info" v-if="!signUpShow">
          <p class="protocol_title">
            <span class="protocol_title--bar"></span>
            <span>注册</span>
          </p>
          <van-form @submit="onSubmitInfo" class="info_form" ref="formInfo">
            <!-- 用户身份 -->
            <van-field name="radio" label="用户身份">
              <template #input>
                <van-radio-group v-model="dataForm2.userType" direction="horizontal">
                  <van-radio :name="1">企业</van-radio>
                  <van-radio :name="2">个人</van-radio>
                </van-radio-group>
              </template>
            </van-field>
            <!-- 姓名 -->
            <van-field
              v-if="dataForm2.userType === 2"
              v-model="dataForm2.username"
              name="name"
              clearable
              label="姓名"
              placeholder="请输入姓名"
            />
            <!-- 身份证号 -->
            <van-field
              v-if="dataForm2.userType === 2"
              v-model="dataForm2.isNumber"
              name="idCard"
              clearable
              clickable
              readonly
              label="身份证号"
              placeholder="请输入身份证号"
              @touchstart.native.stop="showNumberShow"
            />
            <!-- 企业名称 -->
            <van-field
              v-if="dataForm2.userType === 1"
              v-model="dataForm2.username"
              name="password"
              clearable
              label="企业名称"
              placeholder="请输入企业名称"
            />
            <!-- 企业代码 -->
            <van-field
              v-if="dataForm2.userType === 1"
              v-model="dataForm2.isNumber"
              name="companyCode"
              clearable
              label="企业代码"
              placeholder="请输入企业代码"
              @input="replace"
            />
            <!-- 城市 -->
            <van-field
              v-model="city"
              name="city"
              label="城市"
              center
              readonly
              clickable
              placeholder="点击选择城市"
              @click="showPickerFn('city')"
            >
            </van-field>
            <!-- 行业 -->
            <van-field
              v-model="tradeType"
              name="tradeType"
              label="行业"
              center
              readonly
              clickable
              placeholder="点击选择行业"
              @click="showPickerFn('tradeType')"
            />
            <!-- 密码 -->
            <van-field
              v-model="dataForm2.password"
              name="password"
              type="password"
              clearable
              label="密码"
              placeholder="请输入密码"
              @blur="checkPassword('password')"
            />
            <div class="btn">
              <van-button block type="info" native-type="submit">
                完成
              </van-button>
            </div>
          </van-form>
          <slogan class="slogan"></slogan>
        </div>
      </transition>
      <!-- 注册第二步完善个人信息 -->
    </div>
    <van-number-keyboard
      v-model="dataForm2.isNumber"
      extra-key="X"
      close-button-text="完成"
      :show="isNumberShow"
      @blur="isNumberShow = false"
    />
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
    <!-- 用户协议 -->
    <van-popup
      :overlay='false'
      v-model="show"
      position="bottom"
      :style="{ height: '100%' }"
      >
      <div class="protocol">
        <van-icon name="arrow-left" class="back" @click="back('login')"></van-icon>
        <p class="protocol_title">
          <span class="protocol_title--bar"></span>
          <span>注册</span>
        </p>
        <div class="protocol_content">
          <p class="protocol_content--title">用户协议</p>
          <img class="protocol_content--img" src="../../assets/img/protocol.png" alt="">
        </div>
        <div class="protocol_btn">
          <van-button class="protocol_btn--left" type="default" @click="protocol(0)">拒绝</van-button>
          <van-button class="protocol_btn--right" type="info" @click="protocol(1)">同意</van-button>
        </div>
      </div>
    </van-popup>
    <!-- 关于实名认证的说明 -->
    <van-popup
      style="background-color: transparent"
      :overlay='false'
      v-model="show2"
      position="bottom"
      :style="{ height: '100%' }"
      >
      <div class="name">
        <p class="name_title">
          关于实名认证的说明
        </p>
        <div class="name_article">
          <p>
            根据《中华人名共和国广告法》以及国信办通字﹝2019﹞3号《网络音视频信息服务管理规定》，您必须完成实名认证；
          </p>
          <p>
            请选择用户身份，完成认证
          </p>
          <p>
            企业用户请填写组织机构名称和组织机构代码；
          </p>
          <p>
            个人用户请填写姓名和居民身份信息
          </p>
        </div>
        <div class="name_btn">
          <van-button class="name_btn--item border-top border-right" type="default" @click="realName(0)">取消</van-button>
          <van-button class='name_btn--item border-top' type="default" @click="realName(1)" >确认</van-button>
        </div>
      </div>
    </van-popup>
    <!-- 用户信息popup选项 -->
    <van-popup
      v-model="showPicker"
      position="bottom"
      >
      <van-picker
         v-show="popupType === 'tradeType'"
        show-toolbar
        title="行业"
        :columns="columns"
        @cancel="cancel('tradeType')"
        @confirm="onConfirmTradeType"
      />
      <van-area
        v-show="popupType === 'city'"
        :area-list="areaList"
        :columns-num="2"
        @cancel="cancel('city')"
        @confirm='onConfirmCity'
      />
    </van-popup>
  </div>
</template>

<script>
// components
import slogan from './components/slogan'
import CodeForm from './components/CodeForm'
import { Toast } from 'vant'
import common from '@/mixins/common'
import provinceList from '@/config/province'
import { isExist } from '@/api/login/login'
import { getSignUpCode, update } from '@/api/login/signUp'
import { setToken } from '../../utils/auth'
export default {
  name: 'signUp',
  mixins: [common],
  components: {
    CodeForm, slogan
  },
  data () {
    return {
      numberShow: false,
      codeShow: false,
      isNumberShow: false,
      serveCode: '',
      pattern: /[a-zA-Z0-9]{6,20}/,
      show2: false,
      show: false,
      checked: false,
      showPicker: false,
      signUpShow: true,
      popupType: 'city',
      city: null,
      tradeType: null,
      dataForm2: {
        userType: 1,
        username: '',
        isNumber: '',
        city: '',
        tradeType: '',
        password: ''
      },
      codeNum: 60,
      codeTime: null,
      title: '注册',
      patternTel: /^1[3456789]\d{9}$/,
      patternCode: /^\d{4}$/,
      testTel: false,
      testCode: false,
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
          readonly: true,
          placeholder: '请输入验证码',
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
        code: ''
      },
      btnName: '下一步',
      tradeTypeList: [
        { name: '美食餐饮', val: 1 },
        { name: '服装服饰', val: 2 },
        { name: '酒店住宿', val: 3 },
        { name: '美容美发', val: 4 },
        { name: '烟酒便利', val: 5 },
        { name: '鲜果蔬菜', val: 6 },
        { name: '房产中介', val: 7 },
        { name: '汽车服务', val: 8 },
        { name: '教育培训', val: 9 },
        { name: '家居用品', val: 10 },
        { name: '家用电器', val: 11 },
        { name: '银行保险', val: 12 },
        { name: '其他行业', val: 13 }
      ],
      columns: ['美食餐饮', '服装服饰', '酒店住宿', '美容美发', '烟酒便利', '鲜果蔬菜', '房产中介', '汽车服务', '教育培训', '家居用品', '家用电器', '银行保险', '其他行业'],
      areaList: provinceList,
      patternPassword: /[a-zA-Z0-9]{6,20}/,
      idCardpattern: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
      emptyList: {
        username: false,
        isNumber: false,
        city: false,
        tradeType: false,
        password: false
      },
      emptyMessage: {
        city: '城市不能为空',
        tradeType: '行业不能为空'
      },
      checkFn: {
        username: this.checkUsername,
        isNumber: this.checkNumber,
        city: this.change,
        tradeType: this.change,
        password: this.checkPassword
      }
    }
  },
  created () {
    StatusBar.styleDefault()
    StatusBar.backgroundColorByHexString("#FFFFFF");
  },
  mounted () {
    setTimeout(() => {
      this.show = true
    }, 200)
  },
  methods: {
    showNumberShow () {
      document.activeElement.blur()
      this.isNumberShow = true
    },
    itemTouchstart (type) {
      if (type === 'mobile') {
        this.codeShow = false
        this.numberShow = true
      } else if (type === 'code') {
        this.numberShow = false
        this.codeShow = true
      }
    },
    replace () {
      this.dataForm2.isNumber = this.dataForm2.isNumber.replace(/[\W]/g, '')
    },
    // 用户协议
    protocol (type) {
      if (type === 0) {
        this.show = false
        this.$router.push('/login')
      } else {
        // 用户协议签署是否发送请求
        this.show = false
      }
    },
    // 实名认证
    realName (type) {
      this.show2 = false
      if (type === 0) {
        this.$router.push('/login')
      } else {
        // 实名认证是否发送请求
      }
    },
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
    // 下一步
    async onSubmit () {
      this.checkTel()
      this.checkCdoe()
      if (!this.empty()) return
      this.signUpShow = false
      this.show2 = true
    },
    // 完善信息
    async onSubmitInfo () {
      this.checkNumber()

      this.checkUsername()

      this.checkPassword()

      if (!this.emptyInfo()) return

      this.toast('提交中', 'loading', 0)

      this.dataForm2 = Object.assign(this.dataForm2, this.dataForm)

      this.dataForm2.city = ''
      await update(this.dataForm2)
        .then(res => {
          setToken(res.data.token)

          this.$store.commit('SET_USER', res.data)

          this.$router.push('/')
        })
        .catch(e => {
          console.log(e)
        })
      Toast.clear()
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
          if (res.msg === 'true') {
            this.toast('该手机号码已被注册，请前往登录页进行登录', 'text')
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
      // 表单空验证
      if (!this.dataForm.mobile) {
        this.toast('前填写手机号码', 'fail')
        return
      }
      // 手机号码注册验证
      const isSignUp = await this.isSignUp()
      if (isSignUp) {
        return
      }
      // 验证码按钮定时器
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
      getSignUpCode(this.dataForm.mobile)
        .then(res => {
          this.serveCode = res.smsCode
        })
        .catch(e => {
          console.log(e)
        })
    },
    // 登录页面
    login () {
      this.$router.push('/login')
    },
    cancel (type) {
      this.showPicker = false
      this.change(type)
    },
    // 显示弹出层
    showPickerFn (type) {
      this.popupType = type
      this.showPicker = true
    },
    // 行业
    onConfirmTradeType (value) {
      this.tradeType = value
      this.dataForm2.tradeType = this.tradeTypeList.find(item => {
        return item.name === this.tradeType
      }).val
      this.showPicker = false
      this.change('tradeType')
    },
    // 城市
    onConfirmCity (value) {
      let str = ''
      value.forEach(item => {
        str += item.name + '/'
      })
      this.dataForm2.city = value[value.length - 1]
      this.city = str.slice(0, -1)
      this.showPicker = false
      this.change('city')
    },
    // 返回上一级
    back (type) {
      if (type === 'login') {
        this.$router.push('/login')
      } else {
        if (this.signUpShow === true && this.show === false) {
          this.show = true
        } else if (this.signUpShow === false && this.show === false) {
          this.signUpShow = true
        }
      }
    },
    // 验证手机号
    checkTel () {
      if (!this.patternTel.test(this.dataForm.mobile)) {
        this.testTel = false
      } else {
        this.testTel = true
      }
    },
    // 验证密码
    checkCdoe () {
      if (!this.patternCode.test(this.dataForm.code)) {
        this.testCode = false
      } else {
        this.testCode = true
      }
    },

    // 验证 身份证 企业代码
    checkNumber (val = 'isNumber') {
      if (this.dataForm2.userType === 2) {
        if (!this.dataForm2[val]) {
          this.toast('请填写身份证号码', 'fail')
          return false
        } else if (!this.idCardpattern.test(this.dataForm2[val])) {
          this.toast('身份证号格式错误', 'fail')
          this.emptyList[val] = false
          return false
        } else {
          this.emptyList[val] = true
          return true
        }
      } else {
        if (!this.dataForm2[val]) {
          this.toast('请填写企业代码', 'fail')
          this.emptyList[val] = false
          return false
        } else {
          this.emptyList[val] = true
          return true
        }
      }
    },
    // 验证名称
    checkUsername (val = 'username') {
      if (this.dataForm2.userType === 2) {
        if (!this.dataForm2[val]) {
          this.toast('请填写姓名', 'fail')
          this.emptyList[val] = false
          return false
        } else {
          this.emptyList[val] = true
          return true
        }
      } else {
        if (!this.dataForm2[val]) {
          this.toast('请填写企业名称', 'fail')
          this.emptyList[val] = false
          return false
        } else {
          this.emptyList.username = true
          return true
        }
      }
    },
    // 验证密码
    checkPassword (val = 'password') {
      if (!this.patternPassword.test(this.dataForm2[val])) {
        this.toast('请输入密码(6-20位字母数字组合)', 'fail')
        this.emptyList[val] = false
        return false
      } else {
        this.emptyList[val] = true
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

    blurInfo (type) {
      if (type === 'isNumber') {
        this.checkNumber(type)
      } else if (type === 'username') {
        this.checkUsername(type)
      }
    },

    change (type) {
      if (!this.dataForm2[type]) {
        this.emptyList[type] = false
        this.toast(this.emptyMessage[type], 'fail')
        return false
      } else {
        this.emptyList[type] = true
        return true
      }
    },

    emptyInfo () {
      let result = true
      for (const key in this.emptyList) {
        if (!this.emptyList[key]) {
          this.checkFn[key](key)
          result = this.emptyList[key]
          break
        }
      }
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
$color1: #398bfa;
$color2: #000;
$color3: #fff;
$color4: #ff0000;
$color5: #ebedf0;
.signUp {
  height: 100%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background: white;
  display: flex;
  flex-direction: column;
  padding-top: .2rem;
}
.logo{
  width: 100%;
  height: 1rem;
  text-align: center;
  line-height: 1rem;
  & i{
    font-size: .3rem;
  }
}
.form-box {
  position: relative;
  height: 100%;
}
.checked{
  padding-left: .4rem;
  font-size: .12rem;
  height: .32rem;
}
.login-tip{
  line-height: .32rem;
  font-size: .12rem;
  width: calc(100% - .8rem);
  margin: 0 .4rem;
  overflow: hidden;
  &_forget{
    float: left;
  }
  &_registered{
    float: right;
  }
}
.protocol {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding:.4rem .33rem 0;
  &_title{
    padding-left: .12rem;
    height: .88rem;
    width: 100%;
    box-sizing: border-box;
    line-height: 0.88rem;
    font-size: .32rem;
    font-weight: 600;
    &--bar{
      width: .1rem;
      height: .36rem;
      margin-right: .18rem;
      background: $color1;
      }
    & span{
      display: inline-block;
      vertical-align: middle;
    }
  }
  &_content{
    width: 100%;
    height: 4rem;
    border-radius: .09rem;
    border: 2px solid $color1;
    overflow-y: auto;
    &--title{
      font-size: .19rem;
      line-height: .4rem;
      font-weight: 600;
      text-align: center;
    }
    &--img{
      width: 100%;
    }
  }
  &_btn{
    margin-top:.28rem;
    height: .36rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    &--left{
      float: left;
    }
    &--right{
      float: right;
    }
    & button{
      height: .36rem;
      line-height: .36rem;
      border-color: $color1;
      border-radius: .08rem;
      width: 1.03rem;
    }
  }
}
.name{
  width: 3.5rem;
  height: 2.77rem;
  border-radius: .09rem;
  border:2px solid $color2;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background: $color3;
  box-sizing: border-box;
  padding: .1rem .13rem 0;
  &_title{
   font-size: .19rem;
   line-height: .38rem;
   text-align: center;
   color: $color4;
   font-weight: 600;
  }
  &_article{
    color: $color4;
    line-height: .24rem;
    & p{
      text-indent: .28rem;
      font-size: .16rem;
    }
  }
  &_btn{
    height: .5rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: .05rem;
    &--item{
      width: 1.46rem;
      height: 100%;
      border-color: transparent;
    }
  }
}
.info{
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding:.2rem .45rem 0;
  display: flex;
  flex-direction: column;
  &_form{
    width: 100%;
  }
}
.slogan{
  flex: 1;
  box-sizing: border-box;
  align-items: flex-end;
  padding-bottom: .39rem;
  display: flex;
  justify-content: center;
}
.border-top{
  border-top-color: $color5;
}
.border-right{
  border-right-color: $color5;
}
.btn{
  width: 100%;
  border-radius: .08rem;
  overflow: hidden;
  margin-top: .52rem;
  & button{
  height: .38rem;
  line-height: .38rem;
  }
}
.back{
  font-size: .2rem;
  position: fixed;
  top: .285rem;
  left: .055rem;
  z-index: 1;
}
</style>
