import request from '@/utils/request'

// 获取维护任务列表
export function getMaintainTasks(params) {
  return request({
    url: '/maintainTask',
    method: 'get',
    params
  })
}

// 获取维护任务详情
export function getMaintainTask(id) {
  return request({
    url: `/maintainTask/${id}`,
    method: 'get'
  })
}

// 获取维保任务 基于projectId
export function getMaintainbyProject(id) {
  return request({
    url: `/maintainTask/project/${id}`,
    method: 'get'
  })
}

// 获取维保任务 基于planId
export function getMaintainbyPlan(id) {
  return request({
    url: `/maintainTask/plan/${id}`,
    method: 'get'
  })
}

// 创建维护任务
export function createMaintainTask(data) {
  return request({
    url: '/maintainTask',
    method: 'post',
    data
  })
}

// 更新维护任务
export function updateMaintainTask(id, data) {
  return request({
    url: `/maintainTask/${id}`,
    method: 'put',
    data
  })
}

// 删除维护任务
export function deleteMaintainTask(id) {
  return request({
    url: `/maintainTask/${id}`,
    method: 'delete'
  })
}

// 更新任务状态
export function updateTaskStatus(id, data) {
  return request({
    url: `/maintainTask/${id}/status`,
    method: 'put',
    data
  })
}

// 分配维护人员
export function assignMaintainers(id, data) {
  return request({
    url: `/maintainTask/${id}/assign`,
    method: 'put',
    data
  })
}

// 重新分配维护人员
export function reassignMaintainers(id, data) {
  return request({
    url: `/maintainTask/${id}/reassign`,
    method: 'put',
    data
  })
}

// 生成任务
export function generateTasksFromPlan(data) {
  return request({
    url: '/plan/settask',
    method: 'post',
    data
  })
}

// 根据项目ID获取微信维保任务
export function getWechatMaintainByProjectId(projectId) {
  return request({
    url: `/Maintain/byProject/${projectId}`,
    method: 'get'
  })
}
