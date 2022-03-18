
<template>
  <div class="task" ref="task">
    <div>
      <refresh-load
          :options='refreshOption'
          @onLoad='loading'
          @onRefresh='onRefresh'
        >
          <template v-for="(item, index) in taskLists">
            <task-item :key="index" :taskInfo='item'></task-item>
          </template>
      </refresh-load>
    </div>
  </div>
</template>

<script>
// import backTop from '@/components/backTop/backTop'
import eventBus from '@/utils/eventBus'
import common from '@/mixins/common'
// 组件
import TaskItem from './components/taskItem'
import RefreshLoad from '@/components/RefreshLoad/RefreshLoad'
// api
import { taskList, clean } from '@/api/task/task'
import { devIceDetails } from '@/api/device/details'
import { Dialog } from 'vant'

export default {
  name: 'task',
  mixins: [common],
  components: {
    TaskItem, RefreshLoad
  },
  data () {
    return {
      showBar: false,
      taskLists: [],
      totalCount: 0,
      ele: {}
    }
  },
  mounted () {
    eventBus.$on('onClickRight', (icon) => {
      this.onClickRight(icon)
    })
  },
  methods: {
    // 扫描按钮
    onClickRight (icon) {
      if (icon === 'delete') {
        // 删除
        Dialog.confirm({
          title: '提示',
          message: '确定要清空任务列表吗？'
        })
          .then(() => {
            this.cleanTask()
          })
          .catch(() => {})
      } else if (icon === 'question-o') {
        this.$router.push({ path: '/question', query: { type: this.$route.path } })
      }
    },
    // 获取任务列表
    getTaskList () {
      return taskList(this.page)
        .then(res => {
          this.addDeviceInfo(res.page.list)
          this.taskLists.push(...res.page.list)
          this.totalCount = res.page.totalCount
        })
        .catch(e => {
          console.log(e)
          this.refreshOption.finished = true
        })
    },
    addDeviceInfo (list) {
      let deviceIds = []

      list.forEach(item => {
        deviceIds.push(item.deviceId)
        item.deviceInfo = { location: '', name: '' }
      })

      deviceIds = Array.from(new Set(deviceIds))

      deviceIds.forEach(id => {
        this.getDeviceInfo(id, list)
      })
    },
    getDeviceInfo (deviceId, list) {
      return devIceDetails(deviceId)
        .then(res => {
          if (!res.data) return
          list.forEach(item => {
            if (item.deviceId === deviceId) {
              item.deviceInfo = res.data
            }
          })
        })
        .catch(e => console.log(e))
    },
    // 清除任务
    cleanTask () {
      this.toast('清空任务中', 'loading', 0)
      clean()
        .then(res => {
          this.toast('清空成功', 'success')
          this.taskLists = []
          this.page = { page: 0, limit: 10 }
          this.refreshOption.refreshing = false
          this.onRefresh()
        })
        .catch(e => {
          console.log(e)
          this.toast('清空失败', 'fail')
        })
    },
    // 加载数据
    async loading () {
      // 判断是否为刷新状态，为刷新状态时 清空列表 刷新状态改为false
      if (this.refreshOption.refreshing) {
        this.taskLists = []
        this.page = { page: 0, limit: 10 }
        this.refreshOption.refreshing = false
      }
      this.page.page += 1
      // 发送请求获取数据
      await this.getTaskList()
      this.refreshOption.loading = false
      // 获取的数据末尾判断
      const result = this.judge()
      if (result) {
        this.refreshOption.finished = true
      }
    },
    // 判断是否加载完所有设备
    judge () {
      if (this.taskLists.length >= this.totalCount) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.task{
  height: 100%;
  background: #fff;
  box-sizing: border-box;
}
</style>
