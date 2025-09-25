import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('user/getInfo')
          console.log('获取到的用户角色:', roles)

          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          console.log('生成的访问路由:', accessRoutes)

          // 检查路由数据的完整性
          if (accessRoutes && Array.isArray(accessRoutes)) {
            accessRoutes.forEach((route, index) => {
              if (!route.path && !route.name) {
                console.error(`路由 ${index} 缺少 path 和 name:`, route)
              }
              if (route.children && Array.isArray(route.children)) {
                route.children.forEach((child, childIndex) => {
                  if (!child.path && !child.name) {
                    console.error(`子路由 ${index}-${childIndex} 缺少 path 和 name:`, child)
                  }
                })
              }
            })
          }

          // 添加路由数据清理，确保所有路由都有必要的属性
          const cleanRoutes = accessRoutes.map(route => {
            const cleanRoute = { ...route }
            if (!cleanRoute.path) cleanRoute.path = `/route-${Date.now()}-${Math.random()}`
            if (!cleanRoute.name) cleanRoute.name = `route-${Date.now()}-${Math.random()}`
            if (cleanRoute.children && Array.isArray(cleanRoute.children)) {
              cleanRoute.children = cleanRoute.children.map((child, index) => {
                const cleanChild = { ...child }
                if (!cleanChild.path) cleanChild.path = `/child-${index}-${Date.now()}`
                if (!cleanChild.name) cleanChild.name = `child-${index}-${Date.now()}`
                return cleanChild
              })
            }
            return cleanRoute
          })

          console.log('清理后的路由数据:', cleanRoutes)

          // dynamically add accessible routes
          router.addRoutes(cleanRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          console.error('权限检查出错:', error)
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
