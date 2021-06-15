import request from '@/utils/request'
// 终端详情 GET Long id device/device/info/{id} 根据id获取详情
/**
 * @param {* Long id} id
 */
export function devIceDetails (id) {
  return request({
    url: `device/device/info/${id}?t=${Date.now()}`,
    method: 'GET'
  })
}
// POST /device/device/time/{devid} 设置设备时间，时间格式HH:mm
/**
 * @param {*} deviceCode
 * @param {*} devid
 * @param {*} timeControl
 * @param {*} timeClose
 * @param {*} timeOpen
 */
export function setTime (devid, params) {
  return request({
    url: `device/device/time/${devid}`,
    method: 'POST',
    params
  })
}
// 设置亮度 设置光源 device/control/light/{devid} POST 0--100数字 /device/device/light/{devid}设置光源
/**
 * @param {* Long id} devid
 * @param {lightBrightness 0--100数字} params
 * @param {lightControl 0 1} params
 */
export function light (devid, params) {
  return request({
    url: `device/device/light/${devid}`,
    method: 'POST',
    params
  })
}
// 设置播放方向 // device/device/direction/{devid} POST  "1：竖屏且向上；9：竖屏且向下； 0：横屏且向右；8：横屏且向左；"
/**
 * @param {* Long id} devid
 * @param {Number 1：竖屏且向上；9：竖屏且向下； 0：横屏且向右；8：横屏且向左} params
 */
export function direction (devid, params) {
  return request({
    url: `device/device/direction/${devid}`,
    method: 'POST',
    params
  })
}

// 切换场景
// deviceCode playListNumber
export function orderNumber (devid, params) {
  return request({
    url: `/device/device/ordernumber/${devid}`,
    method: 'POST',
    params
  })
}

// 设置音量大小// device/device/volume/{devid} POST
export function volume (devid, params) {
  return request({
    url: `device/device/volume/${devid}`,
    method: 'POST',
    params
  })
}

// 开机动画
export function bootAnimation (devid, params) {
  return request({
    url: `device/device/logo/${devid}`,
    method: 'POST',
    params
  })
}

// 信息提示
export function infoAnimation (devid, params) {
  return request({
    url: `device/device/info/${devid}`,
    method: 'POST',
    params
  })
}

// 重启智能终端
export function rebootAll (devid) {
  return request({
    url: `device/device/rebootAll/${devid}`,
    method: 'POST'
  })
}

// 重启核心程序
export function rebootApp (devid) {
  return request({
    url: `device/device/rebootApp/${devid}`,
    method: 'POST'
  })
}

// 上传工作日志
export function uploadLog (devid) {
  return request({
    url: `device/device/uploadLog/${devid}`,
    method: 'POST'
  })
}

// 恢复出厂设置
export function reset (devid) {
  return request({
    url: `device/device/reset/${devid}`,
    method: 'POST'
  })
}
