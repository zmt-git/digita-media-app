
<template>
  <div class="taskItem van-hairline--bottom">
    <div class="taskItem-img">
      <img src="../../../assets/img/taskImg.png" alt="">
    </div>
    <div class="taskItem-info">
      <div class="taskItem-info-box">
        <p class="taskItem-info--title van-ellipsis">
          {{taskInfo.jobContent | device}}
        </p>
      </div>
      <p class="taskItem-info--des van-ellipsis">
        任务内容
        <span>{{taskInfo.jobContent | content}}</span>
      </p>
      <p class="taskItem-info--des van-ellipsis">
        创建时间
        <span>{{taskInfo.timeCreate | formatTime}}</span>
      </p>
      <p class="taskItem-info--des van-ellipsis">
        执行时间
        <span>{{taskInfo.timeFinish | formatTime}}</span>
        <van-tag class="taskItem-info--tag" :type="getTagInfo(taskInfo.jobState, 'type')">{{getTagInfo(taskInfo.jobState, 'name')}}</van-tag>
      </p>
      
    </div>
  </div>
</template>

<script>
export default {
  name: 'taskItem',
  props: {
    taskInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      that: this,
      tagList: [
        { type: 'danger', name: '失败', state: -1 },
        { type: 'success', name: '成功', state: 1 },
        { type: 'primary', name: '执行中', state: -2 },
        { type: 'warning', name: '等待', state: 0 }
      ],
      tag: {}
    }
  },
  filters: {
    formatTime (val) {
      return val
    },
    device (val) {
      let arr = val.split('&&')
      if (arr[0]) {
        return arr[0]
      } else {
        return ''
      }
    },
    content (val) {
      let arr = val.split('&&')
      if (arr[1]) {
        return arr[1]
      } else {
        return ''
      }
    }
  },
  methods: {
    getTagInfo (val, type, key = 'state') {
      const element = this.tagList.find(item => {
        return item[key] === val
      })
      return element[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.taskItem{
  height: 1.1rem;
  width: 100%;
  &-img{
    height: 100%;
    width: .925rem;
    float: left;
    box-sizing: border-box;
    padding: .125rem .2rem .125rem .15rem;
    display: flex;
    justify-content: center;
    align-items: center;
    & img{
      width: 100%;
      // height: 100%;
    }
  }
  &-info{
    height: 100%;
    width: calc(100% - .925rem);
    box-sizing: border-box;
    padding-right: .18rem;
    float: left;
    // padding-top: .125rem;
    // padding-bottom: .125rem;
    &-box{
      padding-top: .125rem;
      width: 100%;
      overflow: hidden;
      display: flex;
      align-items: center;
    }
    &--title{
      // line-height: .37rem;
      font-size: .15rem;
      float: left;
      flex: 1;
      padding-bottom: .05rem;
    }
    &--tag{
      width: .48rem;
      box-sizing: border-box;
      justify-content: center;
      float: right;
    }
    &--des{
      line-height: .2rem;
      font-size: .13rem;
    }
  }
}
</style>
