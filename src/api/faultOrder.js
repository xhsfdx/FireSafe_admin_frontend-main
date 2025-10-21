import request from '@/utils/request'

// 获取故障工单列表
export function getFaultOrders(params) {
  return request({
    url: '/faultworkorder',
    method: 'get',
    params
  })
}

// 获取故障工单详情
export function getFaultOrder(id) {
  return request({
    url: `/faultworkorder/${id}`,
    method: 'get'
  })
}

// 创建故障工单
export function createFaultOrder(data) {
  return request({
    url: '/faultworkorder',
    method: 'post',
    data
  })
}

// 更新故障工单
export function updateFaultOrder(id, data) {
  return request({
    url: `/faultworkorder/${id}`,
    method: 'put',
    data
  })
}

// 删除故障工单
export function deleteFaultOrder(id) {
  return request({
    url: `/faultworkorder/${id}`,
    method: 'delete'
  })
}

// 接单
export function acceptFaultOrder(id) {
  return request({
    url: `/faultworkorder/${id}/accept`,
    method: 'put'
  })
}

// 分配工单
export function assignFaultOrder(id, data) {
  return request({
    url: `/faultworkorder/${id}/assign`,
    method: 'put',
    data
  })
}

// 添加沟通记录
export function addCommunicationLog(id, data) {
  return request({
    url: `/faultworkorder/${id}/add-communication`,
    method: 'post',
    data
  })
}

// 添加签到记录
export function addSignInLog(id, data) {
  return request({
    url: `/faultworkorder/${id}/add-sign-in`,
    method: 'post',
    data
  })
}

// 标记为已解决
export function markAsResolved(id) {
  return request({
    url: `/faultworkorder/${id}/mark-resolved`,
    method: 'put'
  })
}

// 评价工单
export function rateFaultOrder(id, data) {
  return request({
    url: `/faultworkorder/${id}/rate`,
    method: 'put',
    data
  })
}
