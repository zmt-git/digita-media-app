<template>
  <div class="device-list_item van-hairline--bottom" @click="viewDevice(itemInfo)">
    <div class="device-list_item--img" @click.stop="tapImg(itemInfo)">
      <img src="../../../assets/img/device.png" alt="">
      <van-icon v-show="hasError" class="icon" name="clear" />
    </div>
    <div class="device-list_item--info">
      <p class="device-list_item--location van-multi-ellipsis--l2">{{itemInfo.type}}<span >{{itemInfo.name}}</span></p>
      <p class="device-list_item--location van-multi-ellipsis--l2">{{itemInfo.location}}</p>
      <!-- <p class="device-list_item--name van-ellipsis">{{itemInfo.name}}</p> -->
      <p class="device-list_item--status">
        <van-tag :type="itemInfo.stateOnline | tagType">{{itemInfo.stateOnline | statusOnline}}</van-tag>
        <template v-if="itemInfo.stateOnline === 1" >
          <van-tag :type="itemInfo.stateWork | tagType2">{{itemInfo.stateWork | statusWork}}</van-tag>
          <van-tag v-show="itemInfo.alarm.includes('2001')" type="danger">高温</van-tag>
          <!-- <van-tag v-show="itemInfo.alarm.includes('2002')" type="danger">存储将满</van-tag> -->
        </template>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    itemInfo: {
      type: Object,
      default: () => {}
    }
  },
  filters: {
    tagType (val) {
      if (val === 1) {
        return 'primary'
      } else {
        return 'default'
      }
    },
    statusOnline (val) {
      if (val === 1) {
        return '在线'
      } else {
        return '离线'
      }
    },
    tagType2 (val) {
      if (val === 1) {
        return 'success'
      } else {
        return 'default'
      }
    },
    statusWork (val) {
      if (val === 1) {
        return '工作'
      } else {
        return '休眠'
      }
    }
  },
  computed: {
    hasError () {
      return this.itemInfo.stateMedia === -1
    }
  },
  methods: {
    viewDevice (id) {
      this.$emit('viewDevice', id)
    },

    tapImg (id) {
      this.$emit('tapImg', id)
    }
  },
  name: 'deviceItem'
}
</script>

<style lang="scss" scoped>
$bg5: #f3f3f3;
.device-list_item{
  // height: .87rem;
  width: 100%;
  display: flex;
  margin-top: .05rem;
  &--img{
    margin: .05rem .14rem;
    width: .6rem;
    height: .6rem;
    border-radius: .06rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background: $bg5;
    padding: .05rem;
    box-sizing: border-box;
    position: relative;
    & img{
      width: 100%;
      height: 100%;
    }
  }
  &--info{
    flex: 1;
    overflow: hidden;
    padding: .05rem 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    & p{
      line-height: .2rem;
      font-size: .1rem;
    }
  }
  &--status{
    width: 2.61rem;
    white-space: nowrap;
    overflow: hidden;
    & span{
    display: inline-block;
    margin-right: .08rem;
  }
  }
}
.icon{
  position: absolute;
  top: .05rem;
  right: .05rem;
  font-size: .15rem;
  color: #ee0a24;
}
</style>
