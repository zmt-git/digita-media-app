/**
 * @description 系统全局配置
 */
export default {
  /**
   * @description 免登陆状态下的token在Cookie中存储的天数，默认10天
   */
  tokenCookieExpires: 10,
  /**
   * @description token key请求token
   */
  TokenKey: "digitalMedia",
  /**
   * @description记住密码key请求check
   */
  RememberKey: "rememberPassword",
  /**
   * @description密码
   */
  PasswordKey: "userPassword",
  /**
   * @description 请求超时时间，毫秒（默认2分钟）
   */
  timeout: 1200000,
};
