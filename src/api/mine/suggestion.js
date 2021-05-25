import request from '@/utils/request'
// 提交意见建议/ops/suggest/save 新增意见建议
/**
 * @param {content文字，image多个图片} params
 */
export function uploadSuggest (data) {
  return request({
    url: 'ops/suggest/save',
    method: 'POST',
    data
  })
}
