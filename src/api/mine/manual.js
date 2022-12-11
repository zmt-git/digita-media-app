import request from "@/utils/request";
//   媒体添 led/media/save POST 媒体对象，文件流
/**
 * @param {媒体对象，文件流} params
 */
export function mediaList(params) {
  return request({
    url: "led/media/save",
    method: "POST",
    params,
  });
}
