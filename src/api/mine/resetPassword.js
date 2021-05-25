import request from '@/utils/request'
// 修改密码 modify sys/user/password POST String password, String newPassword
/**
 * @param {String password, String newPassword} params
 */
export function modifyPassword (params) {
  return request({
    url: 'sys/user/password',
    method: 'POST',
    params
  })
}
