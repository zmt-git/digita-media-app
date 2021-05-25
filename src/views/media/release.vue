<template>
  <div class="code">
    <div class="tit">
      <TitleBar :title="title">
        <van-checkbox :disabled='allDisabled' v-model="allCheck" class="allselect" shape="square"  ref="checkboxes" @change="allChoose" />
      </TitleBar>
    </div>
    
    <!-- <Refresh-load
     :options='refreshOption'
      @onLoad='loading'
      @onRefresh='onRefresh'
    > -->
      <div class="box">
        <van-form @submit="onSubmit">
          <van-checkbox-group v-model="result" ref="checkboxGroup" @change="groupChange">
            <van-cell-group>
              <van-cell
                v-for="(item, index) in list"
                clickable
                :key="index"
                :title="item.name"
                @click="toggle(index, item)"
              >
                <van-checkbox shape="square" :disabled='item.stateOnline === 0 ? true : false' slot="right-icon" :name="item.id" ref="checkboxes"/>
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
          <!-- <div class="btn">
            <van-button type="info" native-type="submit">
              确认
            </van-button>
          </div> -->
        </van-form>
      </div>
    <!-- </Refresh-load> -->
    <div class="btn-box">
      <van-button type="default" @click.stop="cancel" class="cancel">取消</van-button>
      <van-button type="info" :disabled='empty' @click="onSubmit">发布</van-button>
    </div>
  </div>
</template>

<script>
import common from '@/mixins/common'
// components
import TitleBar from '@/components/TitleBar/TitleBar'
// import RefreshLoad from '@/components/RefreshLoad/RefreshLoad'
// api
import { unpublish, publish } from '@/api/media/details'
import { Toast } from 'vant'
export default {
  name: 'forgetWord',
  mixins: [common],
  components: {
    TitleBar
  },
  computed: {
    empty () {
      if (this.list.length > 0 &&  this.result.length > 0) {
        return false
      } else {
        return true
      }
    },

    allDisabled () {
      let result = true
      if (this.list.length === 0) {
        return true
      }

      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].stateOnline === 1) {
          result = false
          break
        }
      }

      return result
    }
  },
  created () {
    this.id = this.$route.query.id
    // 1。获取发布终端列表
    unpublish({ mediaid: this.id })
      .then(res => {
        this.list = res.list
        this.list.forEach(item => {
          if (item.stateOnline === 1) {
            this.allOnline.push(item.id)
          }
        })
      })
      .catch(e => {
        console.log(e)
      })
  },
  data () {
    return {
      title: '请选择智能终端',
      list: [],
      result: [],
      allOnline: [],
      allCheck: false
    }
  },
  methods: {
    allChoose () {
      if (this.allCheck) {
        let result = []

        this.list.forEach(item => {
          if (item.stateOnline === 1) {
            result.push(item.id)
          }
        })

        this.result = result

      } else {
        this.result = []
      }
      // if (this.allCheck) {
      //  this.$refs.checkboxGroup.toggleAll(true)
      // } else {
      //   this.$refs.checkboxGroup.toggleAll()
      // }
    },
    // 发布媒体
    async onSubmit () {
      this.toast('发布中', 'loading', 0)
      await publish({ mediaId: this.id, deviceIds: this.result.join(',') })
        .then(res => {
          if (res.state !== 1) {
            this.toast('发布失败', 'fail')
          } else {
            Toast.clear()
          }
        })
        .catch(e => {
          console.log(e)
        })
      this.$router.go(-1)
    },
    // 取消添加
    cancel () {
      this.$router.go(-1)
    },
    // 终端复选
    toggle (index, item) {
      if (item.stateOnline === 1) {
        this.$refs.checkboxes[index].toggle()
      }
    },
    groupChange () {
      let a = this.allOnline.sort().join()

      const arr = JSON.parse(JSON.stringify(this.result))
      const r = arr.sort().join()
      if (a === r) {
        this.allCheck = true
      } else {
        this.allCheck = false
      }
    },
    // 加载数据
    async loading () {
      this.page.page += 1
      // 判断是否为刷新状态，为刷新状态时 清空列表 刷新状态改为false
      if (this.$refs.refresh.refreshing) {
        this.list = []
        this.page = { page: 0, limit: 10 }
        this.$refs.refresh.refreshing = false
      }

      // 发送请求获取数据
      // await this.getDeviceList()
      // 加载状态改为false
      this.$refs.refresh.loading = false
      // 获取的数据末尾判断
      const result = this.judge()
      if (result) {
        this.$refs.refresh.finished = true
      }
    },
    // 判断是否加载完所有设备
    judge () {
      return true
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
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.box{
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
}
.btn{
  width: 100%;
  height: .39rem;
  // position: fixed;
  // bottom: 0;
  // right: 0;
  & button {
    width: 50%;
    height: .39rem;
    line-height: .39rem;
    float: right;
  }
}
.btn-box{
  // position: fixed;
  // bottom: 0;
  // left: 0;
  width: 100%;
  height: .39rem;
  line-height: .39rem;
  & button{
    width: 50%;
    border-radius: 0;
    border-bottom: none;
    border-right: none;
    border-left: none;
  }
}
.cancel{
  border-radius: 0;
  border-bottom: none;
  border-right: none;
  border-left: none;
}
.allselect{
  float: right;
  padding-top: .02rem;
}
</style>
