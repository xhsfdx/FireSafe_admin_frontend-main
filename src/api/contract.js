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
    url: `/contracts/${id}`, // 路径请根据实际后端接口调整
    method: 'get',
    // 添加时间戳防止缓存
    params: {
      _t: Date.now()
    }
  })
}

// 获取合同详情（用于续签）
export function getContractDetail(id) {
  return request({
    url: `/contracts/${id}`,
    method: 'get',
    timeout: 10000 // 设置10秒超时
  }).then(response => {
    console.log('getContractDetail API响应:', response)
    // 确保返回正确的数据格式
    if (response && response.success && response.data) {
      return response
    } else {
      // 如果后端返回的数据格式不符合预期，尝试直接返回数据
      if (response && response.data) {
        return {
          success: true,
          data: response.data,
          message: '获取成功'
        }
      }
      throw new Error(response?.message || '获取合同详情失败')
    }
  }).catch(error => {
    console.error('getContractDetail API错误:', error)

    // 如果是500错误，提供更详细的错误信息
    if (error.response && error.response.status === 500) {
      const errorMsg = error.response.data?.message || error.response.data?.error || '服务器内部错误'
      throw new Error(`服务器错误: ${errorMsg}`)
    }

    // 如果是网络错误
    if (error.code === 'ECONNABORTED') {
      throw new Error('请求超时，请检查网络连接')
    }

    // 其他错误
    throw new Error(error.message || '获取合同详情失败')
  })
}

// 获取合同详情（备用方法1，用于续签）
export function getContractDetailForRenewal(id) {
  return request({
    url: `/contracts/${id}/detail`,
    method: 'get',
    timeout: 10000
  }).then(response => {
    console.log('getContractDetailForRenewal API响应:', response)
    if (response && response.success && response.data) {
      return response
    } else if (response && response.data) {
      return {
        success: true,
        data: response.data,
        message: '获取成功'
      }
    }
    throw new Error(response?.message || '获取合同详情失败')
  }).catch(error => {
    console.error('getContractDetailForRenewal API错误:', error)
    throw error
  })
}

// 获取合同详情（备用方法2，用于续签）
export function getContractDetailAlternative(id) {
  return request({
    url: `/contracts/${id}/info`,
    method: 'get',
    timeout: 10000
  }).then(response => {
    console.log('getContractDetailAlternative API响应:', response)
    if (response && response.success && response.data) {
      return response
    } else if (response && response.data) {
      return {
        success: true,
        data: response.data,
        message: '获取成功'
      }
    }
    throw new Error(response?.message || '获取合同详情失败')
  }).catch(error => {
    console.error('getContractDetailAlternative API错误:', error)
    throw error
  })
}

// 获取合同详情（备用方法3，用于续签）
export function getContractDetailBasic(id) {
  return request({
    url: `/contracts/${id}/basic`,
    method: 'get',
    timeout: 10000
  }).then(response => {
    console.log('getContractDetailBasic API响应:', response)
    if (response && response.success && response.data) {
      return response
    } else if (response && response.data) {
      return {
        success: true,
        data: response.data,
        message: '获取成功'
      }
    }
    throw new Error(response?.message || '获取合同详情失败')
  }).catch(error => {
    console.error('getContractDetailBasic API错误:', error)
    throw error
  })
}

// 获取续签合同详情（专门用于续签）
export function getContractForRenewal(id) {
  return request({
    url: `/contracts/${id}/for-renewal`,
    method: 'get',
    timeout: 10000
  }).then(response => {
    console.log('getContractForRenewal API响应:', response)
    if (response && response.success && response.data) {
      return response
    } else if (response && response.data) {
      return {
        success: true,
        data: response.data,
        message: '获取成功'
      }
    }
    throw new Error(response?.message || '获取续签合同详情失败')
  }).catch(error => {
    console.error('getContractForRenewal API错误:', error)

    // 如果是500错误，提供更详细的错误信息
    if (error.response && error.response.status === 500) {
      const errorMsg = error.response.data?.message || error.response.data?.error || '服务器内部错误'
      throw new Error(`服务器错误: ${errorMsg}`)
    }

    // 如果是404错误
    if (error.response && error.response.status === 404) {
      throw new Error('合同不存在或已被删除')
    }

    // 如果是网络错误
    if (error.code === 'ECONNABORTED') {
      throw new Error('请求超时，请检查网络连接')
    }

    // 其他错误
    throw new Error(error.message || '获取续签合同详情失败')
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

