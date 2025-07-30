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

export function getStaffById(id) {
  return request({
    url: `/staff/${id}`,
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

export function updateRole(id, data) {
  return request({
    url: `/staff/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/staff/${id}`,
    method: 'delete'
  })
}

export function createUser(id, data) {
  return request({
    url: `/staff/usercreate/${id}`,
    method: 'post',
    data
  })
}
