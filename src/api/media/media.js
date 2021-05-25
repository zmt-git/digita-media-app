import request from '@/utils/request'
// 媒体文件列表 led/media/list GET int page(页码1), int limit(条数10)
/**
 * @param {int page(页码1), int limit(条数10)} params
 */
export function getMediaList (params) {
  return request({
    url: 'device/media/list',
    method: 'GET',
    params
  })
}
export function getStorage () {
  return request({
    url: 'device/media/list',
    method: 'GET'
  })
}
