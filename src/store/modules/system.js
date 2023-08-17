import { getVersion } from "@/api/system/system";
const system = {
  state: {
    show: true,
    latestVersion: "",
    currentVersion: "",
    defaultTag: 0,
    isImgview: false,
    isFullscreen: false,
    playList: [],
  },
  mutations: {
    SET_MEDIA_LIST: (state, status) => {
      state.show = status;
    },
    SET_LATES_VERSION: (state, latestVersion) => {
      state.latestVersion = latestVersion;
    },
    SET_CURRENT_VERSION: (state, currentVersion) => {
      state.currentVersion = currentVersion;
    },
    SET_TAG: (state, defaultTag) => {
      state.defaultTag = defaultTag;
    },
    SET_IS_IMG_VIEW: (state, isImgview) => {
      state.isImgview = isImgview;
    },
    SET_FULLSCREEN: (state, isFullscreen) => {
      state.isFullscreen = isFullscreen;
    },
    setPlayList(state, playList) {
      state.playList = playList;
    },
  },
  actions: {
    getLatesVersion({ commit }) {
      return new Promise((resolve, reject) => {
        getVersion()
          .then((res) => {
            commit("SET_LATES_VERSION", res.version);
            resolve(res);
          })
          .catch((e) => {
            reject(e);
          });
      });
    },
  },
};
export default system;
