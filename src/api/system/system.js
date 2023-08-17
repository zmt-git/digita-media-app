import request from "@/utils/request";
// sys/app/download 获取app下载地址，不拦截
export function getDownloadUrl() {
  return request({
    url: "sys/app/download",
    method: "GET",
  });
}
// mobile/check/freelogin APP免登录检查
export function freelogin(params) {
  return request({
    url: "mobile/check/freelogin",
    method: "POST",
    params,
  });
}
// 获取APP最大版本号 apkversion/apkversion/code GET
export function getVersion() {
  return request({
    url: "apkversion/apkversion/code",
    method: "GET",
  });
}
// 获取用户信息
export function getUserInfo() {
  return request({
    url: `sys/user/info?t=${new Date().getTime()}`,
    method: "GET",
  });
}

export function getUrl() {
  return request({
    url: "apkversion/apkversion/get/download/url",
    method: "GET",
  });
}
