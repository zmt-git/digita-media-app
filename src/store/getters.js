const getters = {
  token: (state) => state.user.token,
  user: (state) => state.user.user,
  show: (state) => state.system.show,
  latestVersion: (state) => state.system.latestVersion,
  currentVersion: (state) => state.system.currentVersion,
  defaultTag: (state) => state.system.defaultTag,
  isImgview: (state) => state.system.isImgview,
  playList: (state) => state.system.playList,
};
export default getters;
