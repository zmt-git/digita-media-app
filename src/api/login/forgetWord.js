import request from '@/utils/request'
// 忘记密码验证码 mobile/reset/code/{username} GET String username用户名
/**
 * @param {String} username
 */
export function getForgetCode (mobile) {
  return request({
    url: `mobile/reset/code/${mobile}`,
    method: 'GET'
  })
}
// 重置密码 sys/user/password/reset POST String code, String newPassword
/**
 * @param {String code, String newPassword} params
 */
export function restPassword (params) {
  return request({
    url: 'sys/user/password/reset',
    method: 'POST',
    params
  })
}
