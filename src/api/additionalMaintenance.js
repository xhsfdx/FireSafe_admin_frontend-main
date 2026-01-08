import request from '@/utils/request'

// 获取附加维保列表
export function getAdditionalMaintenances(params) {
  return request({
    url: '/additionalMaintenance',
    method: 'get',
    params
  })
}

// 获取附加维保详情
export function getAdditionalMaintenance(id) {
  return request({
    url: `/additionalMaintenance/${id}`,
    method: 'get'
  })
}

// 创建附加维保
export function createAdditionalMaintenance(data) {
  return request({
    url: '/additionalMaintenance',
    method: 'post',
    data
  })
}

// 更新附加维保
export function updateAdditionalMaintenance(id, data) {
  return request({
    url: `/additionalMaintenance/${id}`,
    method: 'put',
    data
  })
}

// 删除附加维保
export function deleteAdditionalMaintenance(id) {
  return request({
    url: `/additionalMaintenance/${id}`,
    method: 'delete'
  })
}

// 更新附加维保状态
export function updateAdditionalMaintenanceStatus(id, data) {
  return request({
    url: `/additionalMaintenance/${id}/status`,
    method: 'put',
    data
  })
}

// 审批附加维保
export function approveAdditionalMaintenance(id, data) {
  return request({
    url: `/additionalMaintenance/${id}/approve`,
    method: 'post',
    data
  })
}
