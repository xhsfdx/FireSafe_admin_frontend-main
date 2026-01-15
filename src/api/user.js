import request from '@/utils/request'

export function login(data) {
  // 标记为后台管理系统登录，用于后端区分“业主移动端”和“管理后台”登录
  const payload = {
    ...data,
    loginSource: 'admin'
  }
  return request({
    url: '/auth/login',
    method: 'post',
    data: payload
  })
}

export function getInfo(token) {
  return request({
    url: '/auth/me',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}
