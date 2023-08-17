import request from "@/utils/request";
// 下载app并安装 app/download GET 无
export function download(params) {
  return request({
    url: "app/download",
    method: "GET",
    params,
  });
}
