import Cookies from "js-cookie";
import Config from "@/config";

const TokenKey = Config.TokenKey;
const RememberKey = Config.RememberKey;
/**
 * @description获取token
 */
export function getToken(key) {
  if (key === undefined) {
    return Cookies.get(TokenKey);
  }
}
/**
 * @description保存token
 */
export function setToken(token, expire = null) {
  return Cookies.set(TokenKey, token, { expires: expire });
}
/**
 * @description删除保存数据
 */
export function removeToken() {
  Cookies.remove(TokenKey);
  Cookies.remove(RememberKey);
}
/**
 * @description保存密码复选框状态
 */
export function setRemember(remember, expire = null) {
  return Cookies.set(RememberKey, remember, { expires: expire });
}
