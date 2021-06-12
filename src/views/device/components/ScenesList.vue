<template>
  <div class="scenes-list">
    <div class="scenes-list-content">
      <van-grid :border="false" :column-num="3">
        <van-grid-item :key="item.mediaId" v-for="item in mediaList">
        <transition-group name="cell">
          <playItem
            :key="item.mediaId"
            :playInfo='item'
            @changeOrder='changeOrder'
            @deleteMedia='deleteMedia'
            ></playItem>
          </transition-group>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import playItem from './playItem'
export default {
  name: 'scenes-list',

  components: { playItem },

  computed: {
    length () {
      return this.publishList.length
    },
    mediaList () {
      try {
        return JSON.parse(this.list[this.index].content).sort((a, b) => a.mediaOrder - b.mediaOrder)
      } catch (e) {
        return []
      }
    }
  },

  props: {
    list: {
      type: Array,
      default: () => []
    },

    index: {
      type: Number,
      default: 1
    }
  },

  data () {
    return {
      publishList: []
    }
  },

  methods: {
    changeOrder (direction, target) {
      this.$emit('changeOrder', direction, target, this.index)
    },

    deleteMedia (info) {
      this.$confirm('在播放列表中删除该媒体吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('deleteMidea', info, this.index)
      }).catch(() => {

      })
    }
  }
}
</script>

<style scoped>
.cell-move {
  transition: transform 1s;
}
</style>
