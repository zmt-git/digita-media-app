<template>
  <div class="form">
    <van-icon v-if="showBack" name="arrow-left" class="back" @click="back"></van-icon>
    <p class="form_title">
      <span class="form_title--bar"></span>
      <span>{{title}}</span>
    </p>
    <van-form class="form-content" ref="form">
      <template v-for="(item, index) in formList">
        <van-field
          center
          clearable
          clickable
          :readonly='item.readonly !== undefined ? item.readonly : false'
          v-model="dataForm[item.model]"
          :type='item.type ? item.type : "text"'
          :label="item.label ? item.label : ''"
          :key='index'
          :name="item.model"
          :left-icon="item.icon ? item.icon : ''"
          :placeholder="item.placeholder ? item.placeholder : '请输入内容'"
          :rules="item.rules ? item.rules : []"
          @blur="itemBlur(item.model)"
          @touchstart.native.stop="itemTouchstart(item.model)"
          >
            <template v-if="item.hasBtn">
              <van-button
                class="verBtn"
                type="info"
                slot="button"
                size="small"
                :disabled="item.btnOptions.disabled"
                @click.stop="item.btnOptions.callBack">
                {{item.btnOptions.name}}
              </van-button>
            </template>
        </van-field>
      </template>
      <div class="btn">
        <van-button block type="info" @click="onSubmit">
          {{btnName}}
        </van-button>
      </div>
    </van-form>
    <slot name="tem"></slot>
    <slogan class="slogan"></slogan>
  </div>
</template>

<script>
import slogan from './slogan'
export default {
  name: 'form-code',
  components: {
    slogan
  },
  props: {
    title: {
      type: String,
      default: '测试'
    },
    btnName: {
      type: String,
      default: '提交'
    },
    formList: {
      type: Array,
      default: () => []
    },
    dataForm: {
      type: Object,
      default: () => {}
    },
    showBack: {
      type: Boolean,
      default: true
    },
    backFn: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onSubmit () {
      this.$emit('onSubmit')
    },
    back () {
      if (this.backFn) {
        this.$emit('back')
        return
      }
      this.$router.go(-1)
    },
    itemBlur (model) {
      this.$emit('blur', model)
    },
    itemTouchstart (model) {
      document.activeElement.blur()
      this.$emit('touchstart', model)
    }
  }
}
</script>

<style lang="scss" scoped>
$color1: #398bfa;
.form{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding:.2rem .45rem 0;
  display: flex;
  flex-direction: column;
  &_title{
    height: .88rem;
    width: 100%;
    box-sizing: border-box;
    line-height: 0.88rem;
    font-size: .32rem;
    font-weight: 600;
    &--bar{
      width: .1rem;
      height: .36rem;
      margin-right: .18rem;
      background: $color1;
    }
    & span{
      display: inline-block;
      vertical-align: middle;
    }
  }
  &-content{
    width: 100%;
    & .van-cell{
      padding: .12rem 0;
    }
  }
}
.btn{
  width: 100%;
  border-radius: .08rem;
  overflow: hidden;
  margin-top: .52rem;
  & button{
  height: .38rem;
  line-height: .38rem;
  }
}
.verBtn{
  height: .235rem;
  line-height: .235rem;
}
.back{
  font-size: .2rem;
  position: fixed;
  top: .285rem;
  left: .055rem;
  z-index: 1;
}
.slogan{
  flex: 1;
  box-sizing: border-box;
  align-items: flex-end;
  padding-bottom: .39rem;
  display: flex;
  justify-content: center;
}
</style>
