import request from '@/utils/request'

/**
 * 获取会话列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.limit - 每页数量
 * @param {string} params.search - 搜索关键词
 */
export function getConversations(params) {
  return request({
    url: '/chat/admin/conversations',
    method: 'get',
    params
  })
}

/**
 * 获取指定用户的聊天记录
 * @param {string} userId - 用户ID
 * @param {Object} params - 查询参数
 */
export function getMessagesByUserId(userId, params) {
  return request({
    url: `/chat/admin/messages/${userId}`,
    method: 'get',
    params
  })
}

/**
 * 管理员发送消息
 * @param {Object} data - 消息数据
 * @param {string} data.userId - 接收用户ID
 * @param {string} data.content - 消息内容
 * @param {string} data.messageType - 消息类型: 'text' | 'image'
 * @param {string} data.imageUrl - 图片URL
 */
export function adminSendMessage(data) {
  return request({
    url: '/chat/admin/send',
    method: 'post',
    data
  })
}

/**
 * 获取管理员未读消息总数
 */
export function getAdminUnreadCount() {
  return request({
    url: '/chat/admin/unread-count',
    method: 'get'
  })
}

/**
 * 标记会话消息为已读
 * @param {string} userId - 用户ID
 */
export function markAsRead(userId) {
  return request({
    url: `/chat/admin/mark-read/${userId}`,
    method: 'post'
  })
}

/**
 * 导出用户聊天记录
 * @param {string} userId - 用户ID
 */
export function exportChatHistory(userId) {
  return request({
    url: `/chat/admin/export/${userId}`,
    method: 'get',
    responseType: 'blob'
  })
}
