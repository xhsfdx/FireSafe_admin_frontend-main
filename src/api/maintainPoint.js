import request from '@/utils/request'

// 获取维护点位列表
export function getMaintenancePoints(params) {
  return request({
    url: '/point/maintainPoint/list',
    method: 'get',
    params
  })
}

// 获取维保点位计划列表
export function getMaintainPointPlans(params) {
  return request({
    url: '/point/maintainPoint',
    method: 'get',
    params
  })
}

// 获取指定计划的点位列表
export function getPlanCheckpoints(planId) {
  return request({
    url: `/point/maintainPoint/${planId}/checkpoint`,
    method: 'get'
  })
}

// 创建或更新点位信息
export function createOrUpdateCheckpoint(data) {
  return request({
    url: '/point/maintainPoint/checkpoint',
    method: 'post',
    data
  })
}