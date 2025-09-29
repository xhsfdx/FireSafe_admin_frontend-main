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
    method: 'get'
  })
}

// 获取维护计划详情（别名）
export function getMaintenancePlan(id) {
  return request({
    url: `/plan/${id}`,
    method: 'get'
  })
}

// 更新计划状态
export function updatePlanStatus(id, status) {
  return request({
    url: `/plan/${id}/status`,
    method: 'put',
    data: { status }
  })
}

// 创建维护计划
export function createMaintenancePlan(planData) {
  return request({
    url: '/plan',
    method: 'post',
    data: planData
  })
}

// 删除维护计划
export function deleteMaintenancePlan(id) {
  return request({
    url: `/plan/${id}`,
    method: 'delete'
  })
}

// 更新维护计划状态
export function updateMaintenancePlanStatus(id, statusData) {
  return request({
    url: `/plan/${id}`,
    method: 'put',
    data: statusData
  })
}

// 更新维护计划人员
export function updateMaintenancePlan(id, data) {
  return request({
    url: `/plan/${id}`,
    method: 'put',
    data
  })
}

// 获取任务详情
export function getTaskDetail(taskId) {
  return request({
    url: `/task/${taskId}`,
    method: 'get'
  })
}

// 获取任务统计信息
export function getTaskStatistics(taskId) {
  return request({
    url: `/task/${taskId}/statistics`,
    method: 'get'
  })
}

// 获取系统组件列表
export function getSystemComponents(projectId) {
  return request({
    url: `/project/${projectId}/components`,
    method: 'get'
  })
}

// 获取检测项目列表
export function getInspectionItems(systemId, componentId) {
  return request({
    url: `/inspection/items`,
    method: 'get',
    params: { systemId, componentId }
  })
}

// 更新检测结果
export function updateInspectionResult(itemId, result) {
  return request({
    url: `/inspection/${itemId}/result`,
    method: 'put',
    data: { result }
  })
}

// 获取故障列表
export function getFaultList(taskId) {
  return request({
    url: `/task/${taskId}/faults`,
    method: 'get'
  })
}
