import { asyncRoutes, constantRoutes } from '@/router'
import store from '@/store'

/**
 * 根据角色 + 页面权限判断是否可以访问某个路由
 * @param roles 当前用户角色数组，例如 ['superadmin']
 * @param pagePermissions 当前用户拥有的页面 key 数组
 * @param route 路由对象
 */
function hasPermission(roles, pagePermissions, route) {
  const userRole = roles && roles.length > 0 ? roles[0] : null

  // 1. 超级管理员直接放行所有路由
  if (userRole === 'superadmin') {
    return true
  }

  // 2. 先按 meta.roles 进行粗粒度过滤（保持原有逻辑）
  if (route.meta && route.meta.roles) {
    const roleMatched = roles.some(role => route.meta.roles.includes(role))
    if (!roleMatched) return false
  }

  // 3. 如果配置了页面级权限 key，则再按 pagePermissions 细粒度过滤
  if (route.meta && route.meta.permissionKey) {
    return Array.isArray(pagePermissions) && pagePermissions.includes(route.meta.permissionKey)
  }

  // 4. 未配置 permissionKey 的路由默认允许访问
  return true
}

/**
 * 递归过滤异步路由表
 * @param routes asyncRoutes
 * @param roles
 * @param pagePermissions
 */
export function filterAsyncRoutes(routes, roles, pagePermissions) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, pagePermissions, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles, pagePermissions)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      const pagePermissions = store.getters['user/pagePermissions'] || []

      accessedRoutes = filterAsyncRoutes(asyncRoutes, roles, pagePermissions)

      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
