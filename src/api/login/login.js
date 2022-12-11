import request from "@/utils/request";
// 密码登录 mobile/login/pwd POST {String username, String password} sys/login login
/**
 * @param {String username, String password} params
 */
export function loginForPassword(params) {
  return request({
    url: "mobile/login/pwd",
    method: "POST",
    params,
  });
}
// 短信登录 mobile/login/sms POST String mobile, String code mobile/login/sms
/**
 * @param {String mobile, String code} params
 */
export function loginForSMS(params) {
  return request({
    url: "mobile/login/sms",
    method: "POST",
    params,
  });
}
// 获取登录短信验证码 mobile/login/code/{username} GET String username用户名
// mobile/login/code/{mobile} 发送短信【登录】验证码
/**
 * @param {String username} username
 */
export function getSMSCode(mobile) {
  return request({
    url: `mobile/login/code/${mobile}`,
    method: "GET",
  });
}
// 检查账号是否存在 mobile/exist GET String mobile手机号
/**
 * @param {String mobile} params
 */
export function isExist(params) {
  return request({
    url: "mobile/exist",
    method: "GET",
    params,
  });
}
// 注销登录 sys/logout POST 无 sys/logout 注销，并删除token信息
export function logout() {
  return request({
    url: "sys/logout",
    method: "POST",
  });
}
