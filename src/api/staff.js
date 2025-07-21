import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}

export function getAllStaff() {
  return request({
    url: '/vue-element-admin/staff/list',
    method: 'get'
  })
}

// 添加getStaffList函数，用于DispatchStaff组件
export function getStaffList() {
  return request({
    url: '/staff/all',
    method: 'get'
  })
}

export function addStaff(data) {
  return request({
    url: '/vue-element-admin/staff',
    method: 'post',
    data
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
