// src/api/contract.js
import request from '@/utils/request'

export function createContract(data) {
  return request({
    url: '/contracts/', // 就是你提到的这一行，写在这里
    method: 'post',
    data
  })
}
