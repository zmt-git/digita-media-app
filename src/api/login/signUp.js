import request from '@/utils/request'
// 注册短信验证码 mobile/register/code/{mobile} GET String mobile手机号
/**
 * @param {String} mobile
 */
export function getSignUpCode (mobile) {
  return request({
    url: `mobile/register/code/${mobile}`,
    method: 'GET'
  })
}
/**
 *
 *@description mobile/register用户注册并登录
 * @param {Object} params
 */
export function update (params) {
  return request({
    url: 'mobile/register',
    method: 'POST',
    params
  })
}
