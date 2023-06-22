<template>
  <div class="scenes-list van-hairline--top">
    <van-cell title="灯光颜色" v-if="hasSwitch">
      <template #right-icon>
        <!-- <van-switch
          active-color="#13ce66"
          inactive-color="#ee0a24"
          size="24"
          :disabled="disabled"
          v-model="lightColor"
          :active-value="1"
          :inactive-value="0"
          @change="onChange"
        /> -->
        <van-radio-group
          :disabled="disabled"
          v-model="lightColor"
          class="radio"
          @change="onChange"
        >
          <van-radio :name="0" class="radio-item red"></van-radio>
          <van-radio :name="1" class="radio-item green"></van-radio>
          <van-radio :name="9" class="radio-item yellow"></van-radio>
        </van-radio-group>
      </template>
    </van-cell>
    <div class="scenes-list-content">
      <transition-group name="cell">
        <playItem
          v-for="item in mediaList"
          :key="item.mediaId"
          :index="index"
          :playInfo="item"
          :disabled="disabled"
          @changeOrder="changeOrder"
          @changeTime="changeTime"
          @deleteMedia="deleteMedia"
          :info="info"
          :activeName="activeName"
        ></playItem>
      </transition-group>
      <playItem
        key="add"
        isAdd
        :activeName="activeName"
        :index="index"
        :playInfo="{}"
        :info="info"
      >
      </playItem>
    </div>
  </div>
</template>

<script>
import playItem from "./playItem";
import { Dialog } from "vant";
export default {
  name: "scenes-list",

  props: {
    list: {
      type: Array,
      default: () => [],
    },
    index: {
      type: Number,
      default: 1,
    },
    disabled: {
      type: Boolean,
      default: true,
    },
    info: {
      type: Object,
      default: () => {},
    },
    activeName: {
      type: String,
      default: "",
    },
    hasSwitch: {
      type: Boolean,
      default: false,
    },
  },

  components: { playItem },

  computed: {
    mediaList() {
      try {
        return JSON.parse(this.list[this.index].content);
      } catch (e) {
        return [];
      }
    },
    lightColor: {
      get() {
        if (this.list.length > 0 && this.index !== undefined) {
          return this.list[this.index] ? this.list[this.index].color : 0;
        } else {
          return 0;
        }
      },
      set(val) {
        // eslint-disable-next-line vue/no-mutating-props
        this.list[this.index].color = val;
      },
    },
  },

  methods: {
    changeOrder(direction, target) {
      this.$emit("changeOrder", direction, target, this.index);
    },

    changeTime(value, info) {
      this.$emit("changeTime", value, info, this.index);
    },

    deleteMedia(info) {
      Dialog.confirm({
        title: "提示",
        message: "在播放列表中删除该媒体吗？",
      })
        .then(() => {
          this.$emit("deleteMedia", info, this.index);
        })
        .catch(() => {
          // on cancel
        });
    },
    onChange(val) {
      this.$emit("changeColor", this.list, this.index, val);
    },
  },
};
</script>

<style scoped lang="scss">
.cell-move {
  transition: transform 1s;
}
.releaseName {
  color: #000;
}
.primary {
  background: #1989fa;
}
.danger {
  background: #ee0a24;
}
.radio {
  display: flex;
  &-item {
    padding-left: 0.2rem;
  }
  ::v-deep {
    & .van-radio__icon .van-icon {
      border: transparent;
    }
    & .van-icon::before {
      display: none;
    }
    & .van-radio__icon--disabled .van-icon {
      background-color: transparent;
    }
  }
}
.red {
  ::v-deep {
    & .van-radio__icon .van-icon {
      border: 2px solid #ee0a24;
    }
    & .van-radio__icon--checked .van-icon {
      background: #ee0a25;
    }
    & .van-radio__icon--disabled.van-radio__icon--checked .van-icon {
      background: #ee0a2580;
    }
    & .van-radio__icon--disabled .van-icon {
      border-color: #ee0a2580;
    }
  }
}
.green {
  ::v-deep {
    & .van-radio__icon .van-icon {
      border: 2px solid #13ce66;
    }
    & .van-radio__icon--checked .van-icon {
      background: #13ce66;
    }
    & .van-radio__icon--disabled.van-radio__icon--checked .van-icon {
      background: #13ce6680;
    }
    & .van-radio__icon--disabled .van-icon {
      border-color: #13ce6680;
    }
  }
}

.yellow {
  ::v-deep {
    & .van-radio__icon .van-icon {
      border: 2px solid #eee416;
    }
    & .van-radio__icon--checked .van-icon {
      background: #eee416;
    }
    & .van-radio__icon--disabled.van-radio__icon--checked .van-icon {
      background: #eee41680;
    }
    & .van-radio__icon--disabled .van-icon {
      border-color: #eee41680;
    }
  }
}
</style>
