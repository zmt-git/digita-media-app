<template>
  <div class="taskItem van-hairline--bottom">
    <div class="taskItem-img">
      <img src="../../../assets/img/taskImg.png" alt="" />
    </div>
    <div class="taskItem-info">
      <!-- <div class="taskItem-info-box">
        <p class="taskItem-info--title van-ellipsis">
          {{taskInfo.jobContent | device}}
        </p>
      </div> -->
      <p class="taskItem-info--des van-ellipsis">
        <span class="taskItem-info--label">智能终端</span>
        <!-- <span>{{taskInfo.jobContent | device}}</span> -->
        <span>{{ content }}</span>
      </p>
      <p class="taskItem-info--des van-ellipsis">
        <span class="taskItem-info--label">任务内容</span>
        <span>{{ taskInfo.jobContent | device }}</span>
        <!-- <span>{{content}}</span> -->
      </p>
      <p class="taskItem-info--des van-ellipsis">
        <span class="taskItem-info--label">创建时间</span>
        <span>{{ taskInfo.timeCreate | formatTime }}</span>
      </p>
      <p class="taskItem-info--des">
        <span class="taskItem-info--label">执行时间</span>
        <span class="van-ellipsis">{{ taskInfo.timeFinish | formatTime }}</span>
        <van-tag
          class="taskItem-info--tag"
          :type="getTagInfo(taskInfo.jobState, 'type')"
          >{{ getTagInfo(taskInfo.jobState, "name") }}</van-tag
        >
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "taskItem",
  props: {
    taskInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      that: this,
      tagList: [
        // 任务列表中，1成功，0等待执行，-1失败，-2执行中，-3 执行超时
        { type: "success", name: "成功", state: 1 },
        { type: "primary", name: "等待", state: 0 },
        { type: "danger", name: "失败", state: -1 },
        { type: "primary", name: "执行中", state: -2 },
        { type: "danger", name: "超时", state: -3 },
      ],
      tag: {},
    };
  },
  computed: {
    content() {
      if (this.taskInfo.deviceInfo.name) {
        return `${this.taskInfo.deviceInfo.name}`;
      }
      return "";
    },
  },
  filters: {
    formatTime(val) {
      return val;
    },
    device(val) {
      const arr = val.split("&&");
      if (arr[0]) {
        return arr[0];
      } else {
        return "";
      }
    },
    content(val) {
      const arr = val.split("&&");
      if (arr[1]) {
        return arr[1];
      } else {
        return "";
      }
    },
  },
  methods: {
    getTagInfo(val, type, key = "state") {
      const element = this.tagList.find((item) => {
        return item[key] === val;
      });
      return element[type];
    },
  },
};
</script>

<style lang="scss" scoped>
.taskItem {
  height: 1rem;
  // width: 100%;
  display: flex;
  &-img {
    height: 100%;
    // width: .925rem;
    float: left;
    box-sizing: border-box;
    padding: 0.125rem 0.2rem 0.125rem 0.12rem;
    display: flex;
    justify-content: center;
    align-items: center;
    & img {
      max-width: 100%;
      max-height: 100%;
      // height: 100%;
    }
  }
  &-info {
    height: 100%;
    flex: 1;
    box-sizing: border-box;
    padding-right: 0.18rem;
    float: left;
    // padding-top: .125rem;
    // padding-bottom: .125rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    &-box {
      padding-top: 0.125rem;
      width: 100%;
      overflow: hidden;
      display: flex;
      align-items: center;
    }
    &--title {
      // line-height: .37rem;
      font-size: 0.15rem;
      float: left;
      flex: 1;
      padding-bottom: 0.05rem;
    }
    &--tag {
      width: 0.48rem;
      box-sizing: border-box;
      justify-content: center;
      float: right;
      padding: 0.03rem 0;
      position: absolute;
      right: 0;
      top: -0.07rem;
    }
    &--des {
      padding: 0.02rem 0;
      font-size: 0.12rem;
      position: relative;
    }
    &--label {
      padding-right: 0.05rem;
    }
  }
}
</style>
