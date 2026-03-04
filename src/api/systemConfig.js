import request from '@/utils/request'

// 获取系统配置
export function getSystemConfig(key) {
  return request({
    url: `/system-config/${key}`,
    method: 'get'
  })
}

// 更新系统配置
export function updateSystemConfig(key, data) {
  return request({
    url: `/system-config/${key}`,
    method: 'put',
    data
  })
}

// 批量获取系统配置
export function batchGetConfigs(keys) {
  return request({
    url: '/system-config/batch-get',
    method: 'post',
    data: { keys }
  })
}

// 批量更新系统配置
export function batchUpdateConfigs(configs) {
  return request({
    url: '/system-config/batch-update',
    method: 'put',
    data: { configs }
  })
}
