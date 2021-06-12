<template>
  <div class="scenes-list">
    <div class="scenes-list-content">
      <transition-group name="cell">
        <playItem
         v-for="item in mediaList"
         :key="item.mediaId"
         :playInfo='item'
         @changeOrder='changeOrder'
         @deleteMedia='deleteMedia'
        ></playItem>
      </transition-group>
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
        return JSON.parse(this.list[this.index].content)
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
