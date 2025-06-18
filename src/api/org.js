import request from '@/utils/request'

export function getInfo(id) {
  return request({
    url: `/api/org/${id}`,
    method: 'get'
  })
}

export function updateOrg(id, data) {
  return request({
    url: `/api/org/${id}`,
    method: 'put',
    data
  })
}
