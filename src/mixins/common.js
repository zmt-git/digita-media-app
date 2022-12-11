// eslint-disable-next-line no-unused-vars
import { Toast, Dialog } from "vant";
import eventBus from "@/utils/eventBus";
export default {
  data() {
    return {
      page: {
        page: 0,
        limit: 10,
      },
      refreshOption: {
        loading: false,
        finished: false,
        refreshing: false,
      },
    };
  },
  mounted() {
    this.$once("hook:beforeDestroy", () => {
      eventBus.$off("onClickRight");
      eventBus.$off("onClickLeft");
    });
  },
  methods: {
    // 提示函数
    toast(msg, type = "text", duration = 1500, forbidClick = true) {
      Toast({
        message: msg,
        type: type,
        duration: duration,
        forbidClick: forbidClick,
      });
    },
    toastClear() {
      Toast.clear();
    },
    dialog(
      success = this.successDialog,
      cancel = this.cancelDialog,
      message = "确定要执行该操作吗？",
      type = "confirm"
    ) {
      Dialog({
        type: type,
        message: message,
      })
        .then(() => {
          success();
        })
        .catch(() => {
          cancel();
        });
    },
    successDialog() {
      console.log("确定");
    },
    cancelDialog() {
      console.log("取消");
    },
    async onRefresh() {
      Toast.clear();
      // 清空列表数据
      this.refreshOption.finished = false;
      this.refreshOption.refreshing = true;
      // 重新加载数据
      this.page = { page: 0, limit: 10 };
      // 将 loading 设置为 true，表示处于加载状态
      this.refreshOption.loading = true;
      await this.loading();
    },
  },
};
