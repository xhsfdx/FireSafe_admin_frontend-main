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

// 获取maintainstandarditems数据
export function getMaintainStandardItems() {
  return request({
    url: '/contracts/maintainstandarditems',
    method: 'get'
  })
}

// 合同详情
export function getContractById(id) {
  return request({
    url: `/contracts/${id}`,
    method: 'get'
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
    url: `/contracts/project/${id}`, // 调用项目详情接口
    method: 'get'
  })
}

// 获取合同详情（用于续签）
export function getContractDetail(id) {
  return request({
    url: `/contracts/${id}/for-renewal`,
    method: 'get'
  }).then(response => {
    console.log('getContractDetail API响应:', response)
    // 确保返回正确的数据格式
    if (response.success && response.data) {
      return response
    } else {
      console.error('getContractDetail API响应格式错误:', response)
      throw new Error(response.message || '获取合同详情失败')
    }
  }).catch(error => {
    console.error('getContractDetail API调用失败:', error)
    throw error
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

// 审核合同 - 通过
export function approveContract(id, data) {
  return request({
    url: `/contracts/${id}/approve`,
    method: 'put',
    data
  })
}

// 审核合同 - 不通过
export function rejectContract(id, data) {
  return request({
    url: `/contracts/${id}/reject`,
    method: 'put',
    data
  })
}

