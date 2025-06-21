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

export function addStaff(data) {
  return request({
    url: '/staff/create',
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
