import request from '@/utils/request'

export function getInfo(id) {
  return request({
    url: `/vue-element-admin/org/${id}`,
    method: 'get'
  })
}

export function updateOrg(id, data) {
  return request({
    url: `/vue-element-admin/org/${id}`,
    method: 'put',
    data
  })
}
