/**
 * 状态处理工具函数
 */

/**
 * 获取状态标签类型
 * @param {String} status - 状态值
 * @param {Object} statusMap - 状态映射表（可选，使用默认映射）
 */
export function getStatusTagType(status, statusMap = null) {
  if (!status) return 'info'
  
  const defaultMap = {
    '草稿': 'info',
    '已提交': 'warning',
    '已审核': 'success',
    '已归档': 'primary',
    '已续签': 'success',
    '待处理': 'info',
    '待审核': 'warning',
    '服务中': 'success',
    '已完成': 'primary',
    '已派发': 'info',
    '已到达': 'warning',
    '处理中': 'warning',
    '已提交': 'primary',
    '已完成': 'success',
    '已评价': 'success'
  }
  
  const map = statusMap || defaultMap
  return map[status] || 'info'
}

/**
 * 获取状态显示文本
 * @param {String} status - 状态值
 * @param {Object} statusMap - 状态映射表（可选，使用默认映射）
 */
export function getStatusDisplayText(status, statusMap = null) {
  if (!status) return '未知状态'
  
  const defaultMap = {
    '草稿': '待处理',
    '已提交': '待审核',
    '已审核': '服务中',
    '已归档': '已完成',
    '已续签': '已续签'
  }
  
  const map = statusMap || defaultMap
  return map[status] || status
}

/**
 * 计算剩余天数
 * @param {String|Date} endDate - 结束日期
 */
export function getRemainDays(endDate) {
  try {
    if (!endDate) return 0
    const end = new Date(endDate)
    const now = new Date()
    
    if (isNaN(end.getTime())) {
      console.warn('无效的结束日期:', endDate)
      return 0
    }
    
    const diff = Math.ceil((end - now) / (1000 * 3600 * 24))
    return diff > 0 ? diff : 0
  } catch (error) {
    console.error('计算剩余天数时出错:', error, 'endDate:', endDate)
    return 0
  }
}

/**
 * 格式化金额
 * @param {Number} amount - 金额
 * @param {String} prefix - 前缀，默认'￥'
 */
export function formatAmount(amount, prefix = '￥') {
  if (!amount && amount !== 0) return `${prefix}0`
  return `${prefix}${amount.toLocaleString()}`
}

/**
 * 格式化日期
 * @param {String|Date} date - 日期
 * @param {String} format - 格式，默认'YYYY-MM-DD'
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
}

