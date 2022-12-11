import { getToken, setToken, setRemember, removeToken } from "@/utils/auth";
import { loginForPassword, loginForSMS, logout } from "@/api/login/login";
import { getUserInfo } from "@/api/system/system";
import { initWebSocket } from "@/utils/websocket";
const user = {
  state: {
    user: {},
    token: getToken(),
    websocket: false,
  },
  mutations: {
    SET_USER: (state, user) => {
      state.user = user;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
  },
  actions: {
    // 账号密码登录
    loginForWord({ commit }, userInfo = {}) {
      return new Promise((resolve, reject) => {
        loginForPassword(userInfo)
          .then((res) => {
            commit("SET_USER", res.data);
            commit("SET_TOKEN", res.data.token);
            setToken(res.data.token);
            setRemember(userInfo.freeLogin);
            initWebSocket();
            resolve(res);
          })
          .catch((e) => {
            console.log(e);
            reject(e);
          });
      });
    },
    // 短信验证码登录
    loginSMS({ commit }, userInfo = {}) {
      return new Promise((resolve, reject) => {
        loginForSMS(userInfo)
          .then((res) => {
            commit("SET_USER", res.data);
            commit("SET_TOKEN", res.data.token);
            setToken(res.data.token);
            initWebSocket();
            resolve(res);
          })
          .catch((e) => {
            console.log(e);
            reject(e);
          });
      });
    },
    // 登出
    Logout({ commit }) {
      return new Promise((resolve, reject) => {
        logout()
          .then((res) => {
            commit("SET_TOKEN", null);
            removeToken();
            resolve(res);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },
    // 获取用户信息
    getUser({ commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then((res) => {
            commit("SET_USER", res.user);
            resolve(res);
          })
          .catch((e) => {
            console.log(e);
            reject(e);
          });
      });
    },
  },
};
export default user;
