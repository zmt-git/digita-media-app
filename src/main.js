/*
 * @Description:
 * @version: 1.0
 * @Author: ZMT
 * @Date: 2020-07-14 21:55:59
 * @LastEditors: ZMT
 * @LastEditTime: 2021-05-25 20:57:47
 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vant from "vant";
import vueTouch from "kim-vue-touch";
import "vant/lib/index.css";

import "babel-polyfill";

import "./styles/reset.css";
import "./assets/iconfont/iconfont.css";
import "./utils/permissions.js";
Vue.config.productionTip = false;

Vue.use(vueTouch);
Vue.use(Vant);
// // cordova设备准备完成初始化vue对象
// document.addEventListener('deviceready', onDeviceReady, false)
// // 初始化vue对象
// function onDeviceReady () {
//   new Vue({
//     router,
//     store,
//     render: h => h(App)
//   }).$mount('#app')
// }
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
