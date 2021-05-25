import request from '@/utils/request'

/**
 * @description 任务列表 ops/job/list GET int page(页码1), int limit(条数10) {"code":0，"msg":"success",page:object}
 * @param {Obj} [params = { page: 0, limit: 10 }]
 * @returns Pormise
 */
export function taskList (params = { page: 0, limit: 10 }) {
  return request({
    url: 'ops/job/list',
    method: 'GET',
    params
  })
}

/**
 * @description 清空任务 ops/job/clean POST 无 {"code": 0， "msg": "success"}
 */
export function clean () {
  return request({
    url: 'ops/job/clean',
    method: 'POST'
  })
}
// GET /ops/job/info/{id} 根据id获取详情
export function taskInfo (id) {
  return request({
    url: `ops/job/info/${id}`,
    method: 'GET'
  })
}
