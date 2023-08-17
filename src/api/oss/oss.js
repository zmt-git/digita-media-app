import request from "@/utils/request";
// 检查更新 led/job/list GET 无
export function getOSSConfig() {
  return request({
    url: "",
    method: "GET",
  });
}
