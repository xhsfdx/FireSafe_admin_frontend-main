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
