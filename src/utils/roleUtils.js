/**
 * 角色权限工具函数
 * 用于检查用户角色和控制敏感数据显示
 */

import store from '@/store'

/**
 * 获取当前用户的角色
 * @returns {string|null} 用户角色
 */
export function getUserRole() {
  const roles = store.getters.roles
  return roles && roles.length > 0 ? roles[0] : null
}

/**
 * 获取当前用户的所有角色
 * @returns {Array} 用户角色数组
 */
export function getUserRoles() {
  return store.getters.roles || []
}

/**
 * 检查当前用户是否是业主
 * 后端角色名为 'customer'，前端也支持 'owner'
 * @returns {boolean}
 */
export function isOwner() {
  const roles = getUserRoles()
  return roles.includes('owner') || roles.includes('customer')
}

/**
 * 检查当前用户是否是管理员（admin 或 superadmin）
 * @returns {boolean}
 */
export function isAdmin() {
  const roles = getUserRoles()
  return roles.includes('admin') || roles.includes('superadmin')
}

/**
 * 检查当前用户是否是超级管理员
 * @returns {boolean}
 */
export function isSuperAdmin() {
  const roles = getUserRoles()
  return roles.includes('superadmin')
}

/**
 * 检查当前用户是否可以查看敏感数据（金额、合同详情等）
 * 只有 admin 和 superadmin 可以查看敏感数据
 * @returns {boolean}
 */
export function canViewSensitiveData() {
  return isAdmin()
}

/**
 * 检查当前用户是否可以编辑数据
 * 业主只能查看，不能编辑
 * @returns {boolean}
 */
export function canEdit() {
  return isAdmin()
}

/**
 * 脱敏处理金额
 * 如果用户是业主，返回 "***"
 * @param {number|string} amount 金额
 * @returns {string}
 */
export function maskAmount(amount) {
  if (isOwner()) {
    return '***'
  }
  return amount
}

/**
 * 脱敏处理敏感文本
 * 如果用户是业主，返回 "***"
 * @param {string} text 敏感文本
 * @returns {string}
 */
export function maskSensitiveText(text) {
  if (isOwner()) {
    return '***'
  }
  return text
}

/**
 * 根据角色过滤数据字段
 * 业主看不到的字段会被移除
 * @param {Object} data 原始数据
 * @param {Array} sensitiveFields 敏感字段列表
 * @returns {Object}
 */
export function filterSensitiveFields(data, sensitiveFields = []) {
  if (!isOwner() || !data) {
    return data
  }
  
  const filteredData = { ...data }
  sensitiveFields.forEach(field => {
    if (field in filteredData) {
      filteredData[field] = '***'
    }
  })
  return filteredData
}

/**
 * 业主默认不可见的敏感字段列表
 */
export const SENSITIVE_FIELDS = [
  'contractAmount',      // 合同金额
  'totalAmount',         // 总金额
  'paymentAmount',       // 付款金额
  'price',               // 价格
  'cost',                // 成本
  'profit',              // 利润
  'salary',              // 工资
  'commission',          // 佣金
  'discount',            // 折扣
  'receivable',          // 应收款
  'received',            // 已收款
  'unpaid'               // 未付款
]

export default {
  getUserRole,
  getUserRoles,
  isOwner,
  isAdmin,
  isSuperAdmin,
  canViewSensitiveData,
  canEdit,
  maskAmount,
  maskSensitiveText,
  filterSensitiveFields,
  SENSITIVE_FIELDS
}
