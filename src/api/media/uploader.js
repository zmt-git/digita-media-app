import request from "@/utils/request";
// POST/device/media/save 新增媒体信息
/**
 * @param {媒体对象，文件流} params
 */
export function mediaSave(data) {
  return request({
    url: "device/media/save",
    method: "POST",
    data,
  });
}
export const mediaSaveUrl = "device/media/save";

// sys/oss/upload
export function uploadMedia(data, onUploadProgress) {
  return request({
    url: "/sys/oss/upload",
    method: "POST",
    data,
    onUploadProgress,
  });
}
