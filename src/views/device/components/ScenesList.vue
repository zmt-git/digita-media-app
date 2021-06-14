<template>
  <div class="scenes-list">
    <div class="scenes-list-content">
      <transition-group name="cell">
        <playItem
          v-for="item in mediaList"
          :key="item.mediaOrder"
          :index='index'
          :playInfo='item'
          :disabled='disabled'
          @changeOrder='changeOrder'
          @deleteMedia='deleteMedia'
          :info='info'
          ></playItem>
          <playItem
          key="add"
          isAdd
          :index='index'
          :playInfo='{}'
          :info='info'
          ></playItem>
      </transition-group>
    </div>
  </div>
</template>

<script>
import playItem from './playItem'
import { Dialog } from 'vant'
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
    },
    disabled: {
      type: Boolean,
      default: true
    },
    info: {
      type: Object,
      default: () => {}
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
      Dialog.confirm({
        title: '提示',
        message: '在播放列表中删除该媒体吗？'
      })
        .then(() => {
          console.log(info)
          this.$emit('deleteMedia', info, this.index)
        })
        .catch(() => {
          // on cancel
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
