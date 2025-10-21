import request from '@/utils/request'

// 获取所有打卡区域设置
export function getCheckinRegions(params) {
  return request({
    url: '/checkin-regions',
    method: 'get',
    params
  })
}

// 根据ID获取打卡区域详情
export function getCheckinRegion(id) {
  return request({
    url: `/checkin-regions/${id}`,
    method: 'get'
  })
}

// 创建打卡区域设置
export function createCheckinRegion(data) {
  return request({
    url: '/checkin-regions',
    method: 'post',
    data
  })
}

// 更新打卡区域设置
export function updateCheckinRegion(id, data) {
  return request({
    url: `/checkin-regions/${id}`,
    method: 'put',
    data
  })
}

// 删除打卡区域设置
export function deleteCheckinRegion(id) {
  return request({
    url: `/checkin-regions/${id}`,
    method: 'delete'
  })
}

// 批量删除打卡区域设置
export function batchDeleteCheckinRegions(ids) {
  return request({
    url: '/checkin-regions/batch/delete',
    method: 'delete',
    data: { ids }
  })
}

// 获取所有单位名称
export function getAllUnits() {
  return request({
    url: '/checkin-regions/units',
    method: 'get'
  })
}
