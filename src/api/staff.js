import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}

export function getAllStaff() {
  return request({
    url: '/staff/all',
    method: 'get'
  })
}

export function getStaffById() {
  return request({
    url: '/staff/:id',
    method: 'get'
  })
}
export function createStaff(data) {
  return request({
    url: '/staff/create',
    method: 'post',
    data
  })
}

// 获取人员列表
export function getStaff(params) {
  return request({
    url: '/staff',
    method: 'get',
    params
  })
}

export function updateRole(id, data) {
  return request({
    url: `/vue-element-admin/staff/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/vue-element-admin/staff/${id}`,
    method: 'delete'
  })
}
