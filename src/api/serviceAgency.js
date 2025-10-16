import request from '@/utils/request'

// 获取服务商列表
export function getServiceAgencyList(params) {
  return request({
    url: '/serviceAgency/list',
    method: 'get',
    params
  })
}

// 根据ID获取服务商详情
export function getServiceAgencyById(id) {
  return request({
    url: `/serviceAgency/${id}`,
    method: 'get'
  })
}

// 创建服务商
export function createServiceAgency(data) {
  return request({
    url: '/serviceAgency',
    method: 'post',
    data
  })
}

// 更新服务商
export function updateServiceAgency(id, data) {
  return request({
    url: `/serviceAgency/${id}`,
    method: 'put',
    data
  })
}

// 删除服务商
export function deleteServiceAgency(id) {
  return request({
    url: `/serviceAgency/${id}`,
    method: 'delete'
  })
}

// 更新服务商状态
export function updateServiceAgencyStatus(id, status) {
  return request({
    url: `/serviceAgency/${id}/status`,
    method: 'put',
    data: { status }
  })
}





