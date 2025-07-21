// src/api/contract.js
import request from '@/utils/request'

export function createContract(data) {
  return request({
    url: '/contracts/', // 移除/api前缀
    method: 'post',
    data
  })
}
// 查询合同列表
export function fetchContracts(params) {
  return request({
    url: '/contracts', // 移除/api前缀
    method: 'get',
    params
  })
}

// 删除合同
export function deleteContract(id) {
  return request({
    url: `/contracts/${id}`, // 移除/api前缀
    method: 'delete'
  })
}

export function fetchProjectDetail(id) {
  return request({
    url: `/contracts/${id}`, // 移除/api前缀
    method: 'get'
  })
}

// 获取合同详情（用于续签）
export function getContractDetail(id) {
  return request({
    url: `/contracts/${id}/for-renewal`, // 移除/api前缀
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
    url: '/contracts/renewal', // 移除/api前缀
    method: 'post',
    data
  })
}

// 审核合同 - 通过
export function approveContract(id, data) {
  return request({
    url: `/contracts/${id}/approve`, // 移除/api前缀
    method: 'put',
    data
  })
}

// 审核合同 - 不通过
export function rejectContract(id, data) {
  return request({
    url: `/contracts/${id}/reject`, // 移除/api前缀
    method: 'put'
  })
}

