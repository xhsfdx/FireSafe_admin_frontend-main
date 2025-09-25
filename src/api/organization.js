import request from '@/utils/request'

// 获取维护任务列表
export function getOrganization() {
  return request({
    url: '/organization/info/684e6cd42d7fcdbad9c308e5',
    method: 'get'
  })
}

export function updateOrganization(data) {
  return request({
    url: '/organization/update',
    method: 'put',
    data
  })
}
