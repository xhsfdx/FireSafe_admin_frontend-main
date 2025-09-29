import request from '@/utils/request'

// 获取结款列表
export function getPaymentList(params) {
  return request({
    url: '/payment/list',
    method: 'get',
    params
  })
}

// 更新结款状态
export function updatePaymentStatus(contractId, data) {
  return request({
    url: `/payment/${contractId}/status`,
    method: 'put',
    data
  })
}

// 获取结款统计信息
export function getPaymentStats() {
  return request({
    url: '/payment/stats',
    method: 'get'
  })
}
