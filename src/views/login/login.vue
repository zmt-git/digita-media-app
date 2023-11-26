<template>
  <div class="login">
    <div class="top-box"></div>
    <transition name="van-slide-up">
      <div class="form" v-show="loginShow">
        <div class="form_mobile">
          <p class="form_mobile--title">登录</p>
          <!-- 登录表单 -->
          <van-form
            @submit="onSubmitMobile"
            class="form_mobile--content"
            ref="form"
          >
            <!-- 手机号 -->
            <van-field
              v-model="dataForm.mobile"
              name="mobile"
              clearable
              clickable
              readonly
              placeholder="请输入手机号"
              @touchstart.native.stop="showKeyboard('numberShow')"
            >
              <img
                class="formiocn"
                slot="left-icon"
                src="../../assets/img/phone.png"
                alt=""
              />
            </van-field>
            <!-- 手机号 -->

            <!-- 密码 -->
            <van-field
              v-model="dataForm.password"
              type="password"
              name="password"
              left-icon="lock"
              clearable
              placeholder="请输入密码"
              @blur="checkPassword(dataForm.password)"
            >
              <img
                class="formiocn"
                slot="left-icon"
                src="../../assets/img/lock.png"
                alt=""
              />
            </van-field>
            <!-- 密码 -->

            <!-- 提示 -->
            <div class="login-tip tip-top">
              <!-- <van-checkbox v-model="dataForm.freeLogin" shape='square' class="login-tip_left" checked-color="#1989fa" icon-size=".16rem">自动登录</van-checkbox> -->
              <a class="login-tip_right" @click.prevent="forgetPassword"
                >忘记密码</a
              >
            </div>
            <!-- 提示 -->

            <!-- 登录按钮 -->
            <div class="submit">
              <van-button
                class="submit-btn"
                round
                block
                type="info"
                native-type="submit"
              >
                登录
              </van-button>
            </div>
            <!-- 登录按钮 -->
          </van-form>
          <!-- 登录表单 -->

          <!-- 提示 -->
          <div class="login-tip">
            <a class="login-tip_left" @click.prevent="signUp">注册</a>
            <a class="login-tip_right" @click.prevent="codeLogin">验证码登录</a>
          </div>
          <!-- 提示 -->
        </div>
      </div>
    </transition>
    <slogan class="slogan"></slogan>
    <van-number-keyboard
      v-model="dataForm.mobile"
      :show="numberShow"
      @blur="checkTel(dataForm.mobile)"
    />
  </div>
</template>

<script>
import slogan from "./components/slogan";
import { isExist } from "@/api/login/login";
import { Toast } from "vant";
import common from "@/mixins/common";
export default {
  name: "login-page",
  mixins: [common],
  components: {
    slogan,
  },
  data() {
    return {
      numberShow: false,
      height: "100%",
      loginShow: false,
      dataForm: {
        mobile: "",
        password: "",
        freeLogin: false,
      },
      code: "",
      btn: 0,
      testTel: false,
      testPassword: false,
      patternTel: /^1[3456789]\d{9}$/,
      patternPassword: /[a-zA-Z0-9]{6,20}/,
    };
  },
  created() {
    try {
      // eslint-disable-next-line no-undef
      StatusBar.backgroundColorByHexString("#398AFA");
      // eslint-disable-next-line no-undef
      StatusBar.styleBlackOpaque();
    } catch (e) {
      console.log(e);
    }
  },
  mounted() {
    setTimeout(() => {
      this.loginShow = true;
    }, 200);
  },
  methods: {
    empty() {
      if (!this.testTel) {
        if (this.dataForm.mobile) {
          this.toast("请输入正确的手机号码", "text");
        } else {
          this.toast("请填写手机号码", "text");
        }
        return false;
      } else if (!this.testPassword) {
        if (this.dataForm.password) {
          this.toast("请输入密码(6-20位字母数字组合)", "text");
        } else {
          this.toast("请填写密码", "text");
        }
        return false;
      } else if (this.testPassword && this.testTel) return true;
    },
    // 验证手机号
    async onSubmitMobile() {
      const that = this;

      if (!this.empty()) return;

      this.toast("请稍等", "loading", 0);
      try {
        // eslint-disable-next-line
        that.dataForm.uuid = device.uuid;
        // eslint-disable-next-line
        that.dataForm.manufacturer = device.manufacturer;
      } catch (e) {
        console.log(e);
      }

      await isExist({ mobile: that.dataForm.mobile })
        .then(async (res) => {
          if (res.msg === "true") {
            Toast.clear();
            that.toast("登录中", "loading", 0);
            await that.$store
              .dispatch("loginForWord", that.dataForm)
              .then(() => {
                // 登录成功
                Toast.clear();
                that.$router.push("/");
              })
              .catch((e) => {
                console.log(e);
              });
            Toast.clear();
          } else {
            that.toast("账号未注册", "fail");
          }
        })
        .catch((err) => {
          console.log(err);
          Toast.clear();
        });
    },
    // 清空密码验证码
    cleanWord() {
      this.$refs.form.resetValidation("password");
      this.password = "";
    },
    // 验证手机号
    checkTel() {
      this.dataForm.mobile = this.dataForm.mobile.replace(/\s/g, "");
      this.numberShow = false;
      if (!this.patternTel.test(this.dataForm.mobile)) {
        this.testTel = false;
      } else {
        this.testTel = true;
      }
    },
    // 验证密码
    checkPassword(val) {
      if (!this.patternPassword.test(val)) {
        this.testPassword = false;
      } else {
        this.testPassword = true;
      }
    },
    // 忘记密码路由
    forgetPassword() {
      this.$router.push("/forgetWord");
    },
    // 注册路由
    signUp() {
      this.$router.push("/signUp");
    },
    // 验证码登录路由
    codeLogin() {
      this.$router.push("/code");
    },
    showKeyboard(type) {
      document.activeElement.blur();
      if (type) {
        this[type] = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$bg1: linear-gradient(to bottom, #398afa, #4eb8f4);
$bg2: #d3e6fe;
// 根元素
.login {
  height: 100vh;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 1);
  display: flex;
  flex-direction: column;
  &_form {
    width: calc(100% - 0.8rem);
    margin: 0 0.4rem;
  }
}
// 蓝色背景
.top-box {
  height: 1.76rem;
  width: 100%;
  text-align: center;
  overflow: hidden;
  position: relative;
  z-index: 0;
  &::after {
    width: 140%;
    height: 1.76rem;
    position: absolute;
    left: -20%;
    top: 0;
    z-index: -1;
    content: "";
    border-radius: 0 0 50% 50%;
    background: $bg1;
  }
}
// 表单
.form {
  width: 2.66rem;
  min-height: 3.45rem;
  _height: 3.45rem;
  transition: all 0.3s;
  box-sizing: border-box;
  padding: 0 0.25rem;
  position: absolute;
  top: 1.12rem;
  right: 0;
  left: 0;
  margin: auto;
  border-radius: 0.25rem;
  box-shadow: 2px 2px 15px 0px $bg2;
  background: #fff;
  &_mobile {
    top: 0;
    left: 0;
    &--title {
      line-height: 0.65rem;
      font-size: 0.23rem;
      font-weight: 600;
      text-align: center;
    }
    &--content {
      width: 100%;
      & .van-cell {
        padding: 0.16rem 0;
      }
    }
  }
  &_word {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
}
.login-tip {
  height: 0.53rem;
  font-size: 0.14rem;
  font-weight: 600;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tip-top {
  justify-content: flex-end;
}
.submit {
  padding: 0.1rem 0;
  &-btn {
    padding: 0;
  }
}
.formiocn {
  width: 0.14rem;
  height: 0.19rem;
  position: relative;
  top: 0.02rem;
}
.slogan {
  flex: 1;
  box-sizing: border-box;
  align-items: flex-end;
  padding-bottom: 0.49rem;
  display: flex;
  justify-content: center;
}
</style>
