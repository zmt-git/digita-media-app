<template>
  <van-radio-group
    v-model="value1"
    :disabled="disabled"
    class="radio"
    @change="onChange"
  >
    <van-radio :name="0" class="radio-item red"></van-radio>
    <van-radio :name="1" class="radio-item green"></van-radio>
    <van-radio :name="9" class="radio-item yellow"></van-radio>
  </van-radio-group>
</template>

<script>
export default {
  name: "ColorRadio",
  props: {
    value: {
      type: [String, Number],
      default: 0,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      value1: this.value,
    };
  },
  methods: {
    onChange(val) {
      console.log("🚀 ~ file: ColorRadio.vue:33 ~ onChange ~ val:", val);
      this.$emit("change", val);
    },
  },
};
</script>

<style lang="scss" scoped>
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
