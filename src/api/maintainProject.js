import request from '@/utils/request'

// 获取所有自建维保项目
export function getMaintainProjects(params) {
  return request({
    url: '/point/maintainPoint',
    method: 'get',
    params
  })
}

// 根据ID获取维保项目详情
export function getMaintainProject(id) {
  return request({
    url: `/point/maintainPoint/${id}`,
    method: 'get'
  })
}

// 创建维保项目
export function createMaintainProject(data) {
  return request({
    url: '/point/maintainPoint',
    method: 'post',
    data
  })
}

// 更新维保项目
export function updateMaintainProject(id, data) {
  return request({
    url: `/point/maintainPoint/${id}`,
    method: 'put',
    data
  })
}

// 删除维保项目
export function deleteMaintainProject(id) {
  return request({
    url: `/point/maintainPoint/${id}`,
    method: 'delete'
  })
}

// 获取消防系统类型列表
export function getSystemTypes() {
  return request({
    url: '/point/maintainPoint/system-types',
    method: 'get'
  })
}
