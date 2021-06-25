import request from '@/utils/request'

/**
 *@description /device/media/info/{id} 根据id获取详情
 * @param {longid} id
 */
export function mediaDetails (id) {
  return request({
    url: `device/media/info/${id}`,
    method: 'GET'
  })
}
// POST/device/media/publish媒体发布
/**
 * @param { } deviceIds
 * @param { } mediaid
 */
export function publish (params) {
  return request({
    url: 'device/media/publish',
    method: 'POST',
    params
  })
}
// POST /device/media/recall 撤回媒体
/**
 * @param {*} deviceId
 * @param {*} isDeletMedia
 * @param {*} mediaId
 */
export function recall (params) {
  return request({
    url: 'device/media/recall',
    method: 'POST',
    params
  })
}
// 媒体发布全部 led/media/publish/all POST mediaid
/**
 * @param {* mediaid} params
 */
export function publishAll (params) {
  return request({
    url: 'led/media/publish/all',
    method: 'POST',
    params
  })
}
// POST/device/media/delete删除媒体信息
// /device/media/delete/{id} 删除媒体信息
/**
 * @param {Array Longid} id
 * @param {0 1} isDeletMedia
 */
export function deleteMedia (params) {
  return request({
    url: `device/media/delete/${params.id}`,
    method: 'POST',
    params
  })
}
// device/device/list/unpublish 媒体未发布设备列表
/**
 * @param {mediaid} params
 */
export function unpublish (params) {
  return request({
    url: 'device/device/list/unpublish',
    method: 'GET',
    params
  })
}
// device/device/list/unpublish 媒体发布设备列表
/**
 * @param {mediaid} params
 */
export function publishList (params) {
  return request({
    url: 'device/device/list/publish',
    method: 'GET',
    params
  })
}
// device/media/length 媒体发布设备列表
/**
 * @param {mediaid} params
 */
export function setLength (params) {
  return request({
    url: 'device/media/length',
    method: 'GET',
    params
  })
}
