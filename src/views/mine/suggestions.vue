<template>
  <div class="code">
    <TitleBar :title="title"></TitleBar>
    <van-form @submit="onSubmit">
      <van-field
        v-model="message"
        rows="11"
        autosize
        label="留言"
        label-width=".4rem"
        type="textarea"
        maxlength="200"
        placeholder="请输入留言"
        show-word-limit
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
// import { Toast } from 'vant'
import common from "@/mixins/common";
// components
import TitleBar from "@/components/TitleBar/TitleBar";
// api
import { uploadSuggest } from "@/api/mine/suggestion";
import { mapGetters } from "vuex";
export default {
  name: "suggest-age",
  mixins: [common],
  components: {
    TitleBar,
  },
  computed: {
    ...mapGetters(["user"]),
  },
  data() {
    return {
      title: "意见建议",
      message: "",
    };
  },
  methods: {
    onSubmit() {
      this.toast("提交中", "laoding", 0);
      uploadSuggest({ userId: this.user.userId, content: this.message })
        .then(() => {
          this.toast("提交成功", "success");
          this.$router.go(-1);
        })
        .catch((e) => {
          console.log(e);
          this.toast("提交失败", "fail");
        });
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
