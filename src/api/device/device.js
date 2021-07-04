import request from '@/utils/request'
// 终端注册码验证 led/device/register/check POST 序列号
/**
 * @param {*} params
 */
export function deviceCheck (params) {
  return request({
    url: 'led/device/register/check',
    method: 'POST',
    params
  })
}
// 注册终端(扫码) led/device/register POST 设备实体对象属性
/**
 * @param {设备实体对象属性} params
 */
export function deviceRegister (params) {
  return request({
    url: 'led/device/register',
    method: 'POST',
    params
  })
}
// 获取终端列表 led/device/list GET int page(页码1), int limit(条数10) device/device/list设备基本信息的分页查询
/**
 * @param {int page(页码1), int limit(条数10)} params
 */
export function deviceList (params) {
  return request({
    url: 'device/device/list',
    method: 'GET',
    params
  })
}
/**
 * @description终端删除 led/device/delete POST Long id
 * @param {Long id} params
 */
export function deleteDevice (params) {
  return request({
    url: 'led/device/delete',
    method: 'POST',
    params
  })
}
/**
 * @description GET/device/device/statistics统计当前终端用户所有的设备状态
 */
export function getDevicesStatus () {
  return request({
    url: 'device/device/statistics',
    method: 'GET'
  })
}
// GET /device/device/register/check/{code} 终端注册码验证
export function deviceCheckCode (params) {
  return request({
    url: 'device/device/check/',
    method: 'POST',
    params
  })
}
// PSOT /device/device/save 新增设备和修改设备调用同一个接口
/**
 * @param {string} address
 * @param {string} devCode
 * @param {string} devName
 */
export function save (data) {
  return request({
    url: 'device/device/save',
    method: 'POST',
    data
  })
}
