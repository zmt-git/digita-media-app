<template>
  <div class="scenes-list">
    <div class="scenes-list-header">
      <span></span>
    </div>
    <div class="scenes-list-content">
      <transition-group name="cell">
        <playItem
         v-for="item in publishList"
         :key="item.id"
         :playInfo='item'
         @changeOrder='changeOrder'
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
    scenes: {
      type: String,
      default: 'weatherScenes'
    }
  },

  data () {
    return {
      publishList: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }]
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
    }
  }
}
</script>

<style scoped>
.cell-move {
  transition: transform 1s;
}
</style>
