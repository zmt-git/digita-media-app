<template>
  <div class="scenes-list">
    <div class="scenes-list-content">
      <transition-group name="cell">
        <playItem
         v-for="item in publishList"
         :key="item.id"
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

  methods: {
    changeOrder (direction, target) {
      const currentIndex = this.publishList.indexOf(target)
      if (direction === 'down' && currentIndex < this.length) {
        const nextItem = this.publishList[currentIndex + 1]
        this.publishList.splice(currentIndex, 2, nextItem, target)
      } else if (direction === 'up' && currentIndex !== 0) {
        const nextItem = this.publishList[currentIndex - 1]
        this.publishList.splice(currentIndex - 1, 2, target, nextItem)
      }
      this.updatePlaylist()
    },

    deleteMedia (info) {
      this.$confirm('在播放列表中删除该媒体吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.scenesList.findeIndex(item => item.id === info.id)
        if (index >= 0) {
          this.scenesList.splice(index, 1)
          this.updatePlaylist()
        }
      }).catch(() => {

      })
    },

    updatePlaylist () {
      this.$emit('updatePlaylist', this.publishList, this.index)
    }
  },

  watch: {
    list: {
      handler: function (newVal, oldVal) {
        try {
          this.publishList = JSON.parse(newVal[this.index].content)
        } catch (e) {
          this.publishList = []
        }
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.cell-move {
  transition: transform 1s;
}
</style>
