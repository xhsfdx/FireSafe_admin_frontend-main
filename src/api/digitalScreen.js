import request from '@/utils/request'

export function getDigitalScreenData() {
  return request({
    url: '/digital-screen/all',
    method: 'get'
  })
}
