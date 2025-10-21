import request from '@/utils/request'


// 获取维护任务列表
export function getOrganization() {
  return request({
    url: '/organization/info/6881cc98ac2d27087a6492d1',
    method: 'get',
  })
}

export function updateOrganization(data) {
  return request({
    url: '/organization/update',
    method: 'put',
    data
  })
}