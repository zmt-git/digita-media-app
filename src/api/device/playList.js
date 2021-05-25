import requset from '@/utils/request'
// 播放列表 device/playlist/list/{devid} GET "int page(页码1), int limit(条数10) int devid"
/**
 * @param {int} devid
 * @param {int page(页码1), int limit(条数10)} params
 */
export function listMedia (devid, params) {
  return requset({
    url: `device/playlist/list/${devid}`,
    method: 'GET',
    params
  })
}
export function listMediaAll (devid, params) {
  return requset({
    url: `device/playlist/alllist/${devid}`,
    method: 'GET',
    params
  })
}
// 播放列表添加 led/playlist/save/{devid} POST mediaid, devid 默认加到最后一个
/**
 *
 *
 * @export
 * @param {*} devid
 * @param {mediaid} params
 * @returns
 */
export function saveMedia (devid, params) {
  return requset({
    url: `device/playlist/list/${devid}`,
    method: 'POST',
    params
  })
}
// 播放列表修改 led/playlist/update/order/{devid} POST mediaid, devid, order
/**
 *
 *
 * @export
 * @param {*} devid
 * @param {mediaid, order} params
 * @returns
 */
export function updateMedia (devid, params) {
  return requset({
    url: `device/playlist/list/${devid}`,
    method: 'POST',
    params
  })
}
// 播放列表修改 led/playlist/update/state/{devid} POST mediaid, devid，state(0隐藏1正常)
/**
 *
 *
 * @export
 * @param {*} devid
 * @param {mediaid,state} params
 * @returns
 */
export function stateMedia (devid, params) {
  return requset({
    url: `device/playlist/list/${devid}`,
    method: 'POST',
    params
  })
}
/**
 *
 *
 * @description 播放列表删除 led/playlist/delete/{devid} POST mediaid, devid
 * @param {*} devid
 * @param {mediaid} params
 * @returns
 */
export function deleteMedia (devid, params) {
  return requset({
    url: `device/playlist/list/${devid}`,
    method: 'POST',
    params
  })
}
// /device/playlist/delete/{playlistArr} delete
export function MediaAdjustment (params) {
  return requset({
    url: 'device/playlist/delete',
    method: 'POST',
    params
  })
}
