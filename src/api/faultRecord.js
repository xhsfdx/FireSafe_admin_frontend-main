import request from '@/utils/request'

// 获取故障记录列表
export function getFaultRecords(params) {
  return request({
    url: '/faultRecord',
    method: 'get',
    params
  })
}

// 获取故障记录详情
export function getFaultRecord(id) {
  return request({
    url: `/faultRecord/${id}`,
    method: 'get'
  })
}

// 创建故障记录
export function createFaultRecord(data) {
  return request({
    url: '/faultRecord',
    method: 'post',
    data
  })
}

// 更新故障记录
export function updateFaultRecord(id, data) {
  return request({
    url: `/faultRecord/${id}`,
    method: 'put',
    data
  })
}

// 删除故障记录
export function deleteFaultRecord(id) {
  return request({
    url: `/faultRecord/${id}`,
    method: 'delete'
  })
}

// 解决故障
export function resolveFault(id, data) {
  return request({
    url: `/faultRecord/${id}/resolve`,
    method: 'put',
    data
  })
}

// 从任务创建故障记录
export function createFaultFromTask(data) {
  return request({
    url: '/faultRecord/from-task',
    method: 'post',
    data
  })
}

// 从故障记录创建维护任务
export function createTaskFromFault(id, data) {
  return request({
    url: `/faultRecord/${id}/create-task`,
    method: 'post',
    data
  })
}

// 生成故障工单报告（PDF）
export function generateFaultReport(id) {
  return request({
    url: `/faultRecord/${id}/generate-report`,
    method: 'get',
    responseType: 'blob' // 重要：指定响应类型为 blob，用于下载 PDF
  })
}
