import request from '@/utils/request'

// 获取维护任务列表
export function getMaintainPlans(params) {
  return request({
    url: '/plan',
    method: 'get',
    params
  })
}

export function getMaintainbyId(id) {
  return request({
    url: `/plan/${id}`,
    method: 'get',
  })
}