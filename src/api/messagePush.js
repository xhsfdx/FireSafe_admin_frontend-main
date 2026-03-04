import request from '@/utils/request'

/**
 * 获取消息类型列表
 */
export function getMessageTypes() {
  return request({
    url: '/message-push/types',
    method: 'get'
  })
}

/**
 * 获取可推送用户列表
 */
export function getPushableUsers(params) {
  return request({
    url: '/message-push/users',
    method: 'get',
    params
  })
}

/**
 * 发送推送消息
 */
export function sendPushMessage(data) {
  return request({
    url: '/message-push/send',
    method: 'post',
    data
  })
}

/**
 * 获取推送记录列表
 */
export function getPushRecords(params) {
  return request({
    url: '/message-push/records',
    method: 'get',
    params
  })
}

/**
 * 获取推送记录详情
 */
export function getPushRecordDetail(id) {
  return request({
    url: `/message-push/records/${id}`,
    method: 'get'
  })
}

/**
 * 获取推送统计
 */
export function getPushStats() {
  return request({
    url: '/message-push/stats',
    method: 'get'
  })
}

/**
 * 获取微信配置状态
 */
export function getWechatConfig() {
  return request({
    url: '/message-push/wechat-config',
    method: 'get'
  })
}

/**
 * 重试失败的推送
 */
export function retryPush(id) {
  return request({
    url: `/message-push/retry/${id}`,
    method: 'post'
  })
}
