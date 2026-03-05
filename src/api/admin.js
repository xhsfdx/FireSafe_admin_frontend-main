import request from '@/utils/request'

// 获取后台用户列表（用于超级管理员管理 admin 权限）
export function fetchAdminUsers(params) {
  return request({
    url: '/admin/users',
    method: 'get',
    params
  })
}

// 新建后台管理员账号（仅 superadmin 有权限成功）
export function createAdminUser(data) {
  return request({
    url: '/admin/users',
    method: 'post',
    data
  })
}

// 更新某个用户（包括 pagePermissions，只对 superadmin 有效）
export function updateAdminUser(id, data) {
  return request({
    url: `/admin/users/${id}`,
    method: 'put',
    data
  })
}

// 删除管理员用户
export function deleteAdminUser(id) {
  return request({
    url: `/admin/users/${id}`,
    method: 'delete'
  })
}

