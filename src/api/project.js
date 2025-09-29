// @/api/project.js
import request from '@/utils/request'

export function fetchProjectDetail(id) {
  return request({
    url: `/api/project/${id}`, // 或 /api/contracts/${id}，看后端实际
    method: 'get'
  })
}

// 获取项目列表
export function getProjects(params) {
  return request({
    url: '/project',
    method: 'get',
    params
  })
}
