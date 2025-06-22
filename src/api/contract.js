// src/api/contract.js
import request from '@/utils/request'

export function createContract(data) {
  return request({
    url: '/contracts/', // 就是你提到的这一行，写在这里
    method: 'post',
    data
  })
}
// 查询合同列表
export function fetchContracts(params) {
  return request({
    url: '/contracts',
    method: 'get',
    params
  })
}

// 删除合同
export function deleteContract(id) {
  return request({
    url: `/contracts/${id}`,
    method: 'delete'
  })
}

export function fetchProjectDetail(id) {
  return request({
    url: `/contracts/${id}`, // 路径请根据实际后端接口调整
    method: 'get'
  })
}

// 获取合同详情（用于续签）
export function getContractDetail(id) {
  return request({
    url: `/contracts/${id}/for-renewal`,
    method: 'get'
  }).then(response => {
    // 确保返回正确的数据格式
    if (response.success && response.data) {
      return response
    } else {
      throw new Error('获取合同详情失败')
    }
  })
}

// 续签合同
export function renewalContract(data) {
  return request({
    url: '/contracts/renewal',
    method: 'post',
    data
  })
}

