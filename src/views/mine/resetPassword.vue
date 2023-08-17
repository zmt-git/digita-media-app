<template>
  <div class="code">
    <TitleBar :title="title"></TitleBar>
    <van-form @submit="onSubmit">
      <van-field
        v-model="dataForm.password"
        label="旧密码"
        type="password"
        placeholder="请输入密码"
        @blur="checkPassword"
      />
      <van-field
        v-model="dataForm.newPassword"
        type="password"
        label="新密码"
        placeholder="请输入新密码"
        @blur="checkedNewPassword(dataForm.newPassword)"
      />
      <div class="btn">
        <van-button type="info" native-type="submit"> 确认 </van-button>
      </div>
    </van-form>
    <van-button type="default" @click.stop="cancel" class="cancel">
      取消
    </van-button>
  </div>
</template>

<script>
import { Toast } from "vant";
import common from "@/mixins/common";
// components
import TitleBar from "@/components/TitleBar/TitleBar";
// api
import { modifyPassword } from "@/api/mine/resetPassword";
// import { getToken } from '../../utils/auth'
export default {
  name: "suggest-list",
  mixins: [common],
  components: {
    TitleBar,
  },
  data() {
    return {
      title: "修改密码",
      dataForm: {
        password: "",
        newPassword: "",
      },
      patternPassword: /[a-zA-Z0-9]{6,20}/,
      testNewPassword: false,
      testPassword: false,
    };
  },
  methods: {
    // 验证密码
    checkPassword() {
      if (!this.dataForm.password) {
        this.testPassword = false;
      } else {
        this.testPassword = true;
      }
    },
    checkedNewPassword(val) {
      if (!this.patternPassword.test(val)) {
        this.testNewPassword = false;
      } else {
        this.testNewPassword = true;
      }
    },
    // 验证密码
    empty() {
      if (!this.dataForm.password) {
        this.toast("请填写旧密码", "fail");
        return false;
      } else if (!this.testNewPassword) {
        if (this.dataForm.newPassword) {
          this.toast("请输入密码(6-20位字母数字组合)", "fail");
        } else {
          this.toast("请填写新密码", "fail");
        }
        return false;
      } else if (this.testPassword && this.testNewPassword) return true;
    },
    async onSubmit() {
      if (!this.empty()) return;
      this.toast("修改中", "laoding", 0);
      modifyPassword(this.dataForm)
        .then(() => {
          this.toast("修改成功", "success");
          this.$store.dispatch("Logout").then(() => {
            this.$router.push("/login");
          });
        })
        .catch((e) => {
          console.log(e);
          this.toast("修改失败", "fail");
        });
      Toast.clear();
    },
    // 取消添加 编辑
    cancel() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.code {
  height: 100%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background: #f6f6f6;
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
