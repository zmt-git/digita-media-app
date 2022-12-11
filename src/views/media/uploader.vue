<template>
  <div class="box" @click="beforeRead">
    <div class="boxbtn"></div>
    <van-uploader
      ref="uploader"
      multiple
      :after-read="afterRead"
      v-model="fileList"
      :accept="accept"
      capture="camera"
    >
      <van-button icon="add-o" class="add-o" type="primary"></van-button>
    </van-uploader>
  </div>
</template>

<script>
import eventBus from "@/utils/eventBus";
import common from "@/mixins/common";
import { mapGetters } from "vuex";
export default {
  name: "up-loader",
  mixins: [common],
  computed: {
    ...mapGetters(["user"]),
  },
  data() {
    return {
      fileList: [],
      accept: "image/bmp, image/jpeg,image/gif",
    };
  },
  methods: {
    beforeRead() {
      if (this.user.storageUsed === this.user.storageTotal) {
        this.toast("云空间已满，请删除不需要的媒体", "text");
        return;
      }
      this.$refs.uploader.chooseFile();
    },

    afterRead(files) {
      let size = 0;

      if (files instanceof Array) {
        files.forEach((file) => {
          size += file.file.size;
        });
      } else {
        size = files.file.size;
      }

      size = size / 1024 / 1024;
      if (this.user.storageTotal < this.user.storageUsed + size) {
        this.toast("云空间不足，请删除不需要的媒体", "text");
        return;
      }

      eventBus.$emit("startUpload", files);
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  position: relative;
  display: inline-block;
}
.boxbtn {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}
.add-o {
  background: transparent;
  border-color: none;
  border: none;
  padding: 0;
  padding-left: 0.1rem;
  & i {
    color: #000;
    font-weight: 600;
    font-size: 0.2rem;
  }
}
</style>
