import axios from "axios";
// import qs from 'qs'
// 导入配置参数
import vueRouter from "@/router";
// import store from '@/store'
import Config from "@/config";
import { getToken, removeToken } from "@/utils/auth";
import { Notify, Toast } from "vant";
// 创建axios对象
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL, // api请求baseURL '/api',
  timeout: Config.timeout, // 请求超时时间
});
// 请求拦截
service.interceptors.request.use(
  (config) => {
    if (getToken()) {
      // 请求每次携带token
      config.headers.token = getToken();
    }
    // 配置返回的内容的内容类型
    config.headers["Content-Type"] = "application/json;charset=UTF-8";
    // 禁止缓存请求
    config.headers["Cache-Control"] = "no-cache";
    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  }
);
// 响应拦截
service.interceptors.response.use(
  (response) => {
    const code = parseInt(response.data.code);
    if (code !== 200) {
      Toast.clear();
      if (code === 401) {
        removeToken();
        vueRouter.push("/login");
      } else {
        Notify({ type: "danger", message: response.data.msg, duration: 1500 });
      }
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject("error");
    } else {
      return response.data;
    }
  },
  (error) => {
    Toast.clear();
    // eslint-disable-next-line no-unused-vars
    let code = null;
    try {
      // eslint-disable-next-line no-unused-vars
      code = error.response.status;
    } catch (e) {
      if (error.toString().indexOf("Cancel") >= 0) {
        return Promise.reject(error);
      } else if (error.toString().indexOf("timeout")) {
        Notify({ type: "danger", message: "请求超时", duration: 1500 });
        return Promise.reject(error);
      }
    }
    Notify({
      type: "danger",
      message:
        error.response.data.msg || error.response.data.error || "请求超时",
      duration: 1500,
    });
    return Promise.reject(error);
  }
);
export default service;
