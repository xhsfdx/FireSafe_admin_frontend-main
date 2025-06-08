import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'
// import { title } from '@/settings'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        hidden: true,
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/documentation',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/documentation/index'),
        name: 'Documentation',
        meta: { title: 'Documentation', icon: 'documentation', affix: true }
      }
    ]
  },
  {
    path: '/guide',
    hidden: true,
    component: Layout,
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/guide/index'),
        name: 'Guide',
        meta: { title: 'Guide', icon: 'guide', noCache: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/agency',
    component: Layout,
    redirect: '/agency/basic',
    alwaysShow: true,
    name: 'Agency',
    meta: {
      title: '服务机构管理',
      icon: 'nested' // 你可以换成你想用的图标
    },
    children: [
      {
        path: 'basic',
        name: 'AgencyBasicInfo',
        component: () => import('@/views/Service agency management/Institution Basic Information.vue'),
        meta: {
          title: '机构基础信息'
        }
      },
      {
        path: 'staff',
        name: 'AgencyStaffInfo',
        component: () => import('@/views/Service agency management/Institution personnel information.vue'),
        meta: {
          title: '机构人员信息'
        }
      }
    ]
  },
  {
    path: '/owner',
    component: Layout,
    redirect: '/owner/plan',
    alwaysShow: true,
    name: 'OwnerUnitManagement',
    meta: {
      title: '业主单位管理',
      icon: 'nested' // 可根据需要更换图标，比如 'tree', 'people', 'documentation'
    },
    children: [
      {
        path: 'plan',
        name: 'MaintenancePlan',
        component: () => import('@/views/Owner unit management/Maintenance Plan Management.vue'),
        meta: { title: '维保计划管理' }
      },
      {
        path: 'point',
        name: 'MaintenancePoint',
        component: () => import('@/views/Owner unit management/Maintenance point management.vue'),
        meta: { title: '维保点管理' }
      },
      {
        path: 'project',
        name: 'UnitProject',
        component: () => import('@/views/Owner unit management/Unit Project Management.vue'),
        meta: { title: '单位项目管理' }
      }
    ]
  },
  {
    path: '/maintenance',
    component: Layout,
    redirect: '/maintenance/routine',
    alwaysShow: true,
    name: 'MaintenanceServiceManagement',
    meta: {
      title: '维护业务管理',
      icon: 'el-icon-s-order' // 文档/工单类型图标
    },
    children: [
      {
        path: 'routine',
        name: 'RoutineMaintenance',
        component: () => import('@/views/Maintenance and Service Management/Routine maintenance.vue'),
        meta: { title: '例行维护', icon: 'el-icon-date' }
      },
      {
        path: 'fault',
        name: 'FaultWorkOrder',
        component: () => import('@/views/Maintenance and Service Management/Fault Work Order.vue'),
        meta: { title: '故障工单', icon: 'el-icon-warning-outline' }
      },
      {
        path: 'support',
        name: 'AdditionalSupport',
        component: () => import('@/views/Maintenance and Service Management/Additional maintenance and support.vue'),
        meta: { title: '附加维护', icon: 'el-icon-s-cooperation' }
      },
      {
        path: 'report',
        name: 'WorkReport',
        component: () => import('@/views/Maintenance and Service Management/Work report.vue'),
        meta: { title: '工作上报', icon: 'el-icon-upload2' }
      },
      {
        path: '/maintenance/task-detail/:id?',
        name: 'TaskDetail',
        hidden: true,
        component: () => import('@/views/Maintenance and Service Management/TaskDetail.vue'),
        meta: { title: '维保任务详情' }
      },
      {
        path: '/fault-list-detail',
        name: 'FaultListDetail',
        hidden: true,
        component: () => import('@/views/Maintenance and Service Management/FaultListDetail.vue'),
        meta: { title: '故障列表' }
      },
      {
        path: '/maintenance/dispatch/:id',
        name: 'DispatchStaff',
        hidden: true,
        component: () => import('@/views/Maintenance and Service Management/DispatchStaff.vue'),
        meta: { title: '改派人员' }
      },
      {
        path: '/fault-order/detail/:id',
        name: 'FaultOrderDetail',
        hidden: true,
        component: () => import('@/views/Maintenance and Service Management/FaultOrderDetail.vue'),
        meta: { title: '故障工单详情' }
      }
    ]
  },

  {
    path: '/system',
    component: Layout,
    redirect: '/system/checkin',
    alwaysShow: true,
    name: 'SystemManagement',
    meta: {
      title: '系统管理',
      icon: 'el-icon-s-tools' // 设置/系统管理
    },
    children: [
      {
        path: 'checkin',
        name: 'CheckinArea',
        component: () => import('@/views/System Management/Check-in area settings.vue'),
        meta: { title: '打卡区域设置', icon: 'el-icon-location-outline' }
      },
      {
        path: 'self-project',
        name: 'SelfBuiltProject',
        component: () => import('@/views/System Management/Self-built maintenance project.vue'),
        meta: { title: '自建维保项目', icon: 'el-icon-folder' }
      },
      {
        path: 'manual',
        name: 'OperationManual',
        component: () => import('@/views/System Management/Operation Manual.vue'),
        meta: { title: '操作手册', icon: 'el-icon-notebook-2' }
      },
      {
        path: 'owner-account',
        name: 'OwnerAccount',
        component: () => import('@/views/System Management/Owner unit account.vue'),
        meta: { title: '业主单位账号', icon: 'el-icon-user' }
      },
      {
        path: '/system-management/add-self-built-maintenance-project',
        name: 'AddSelfBuiltMaintenanceProject',
        hidden: true,
        component: () => import('@/views/System Management/AddSelf-builtMaintenanceProject.vue'),
        meta: { title: '新增自建维保项目' }
      },
      {
        path: '/system/account-add',
        name: 'AddCustomerAccount',
        hidden: true,
        component: () => import('@/views/System Management/AddCustomerAccount.vue'),
        meta: { title: '新增客户单位账号' }
      },
      {
        path: '/system/edit-customer-account',
        name: 'EditCustomerAccount',
        hidden: true,
        component: () => import('@/views/System Management/EditCustomerAccount.vue'),
        meta: { title: '编辑客户单位账号' }
      }
    ]
  },
  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index'),
        name: 'Icons',
        hidden: true,
        meta: { title: 'Icons', icon: 'icon', noCache: true }
      }
    ]
  },

  /** when your routing map is too long, you can split it into small modules **/
  componentsRouter,
  chartsRouter,
  nestedRouter,
  tableRouter,

  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: 'Example',
    hidden: true,
    meta: {
      title: 'Example',
      icon: 'el-icon-s-help'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/example/create'),
        name: 'CreateArticle',
        meta: { title: 'Create Article', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/example/edit'),
        name: 'EditArticle',
        meta: { title: 'Edit Article', noCache: true, activeMenu: '/example/list' },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/example/list'),
        name: 'ArticleList',
        meta: { title: 'Article List', icon: 'list' }
      }
    ]
  },

  {
    path: '/tab',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/tab/index'),
        name: 'Tab',
        hidden: true,
        meta: { title: 'Tab', icon: 'tab' }
      }
    ]
  },

  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    hidden: true,
    meta: {
      title: 'Error Pages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: '401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },

  {
    path: '/error-log',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'log',
        component: () => import('@/views/error-log/index'),
        name: 'ErrorLog',
        meta: { title: 'Error Log', icon: 'bug' }
      }
    ]
  },

  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'Excel',
    hidden: true,
    meta: {
      title: 'Excel',
      icon: 'excel'
    },
    children: [
      {
        path: 'export-excel',
        component: () => import('@/views/excel/export-excel'),
        name: 'ExportExcel',
        meta: { title: 'Export Excel' }
      },
      {
        path: 'export-selected-excel',
        component: () => import('@/views/excel/select-excel'),
        name: 'SelectExcel',
        meta: { title: 'Export Selected' }
      },
      {
        path: 'export-merge-header',
        component: () => import('@/views/excel/merge-header'),
        name: 'MergeHeader',
        meta: { title: 'Merge Header' }
      },
      {
        path: 'upload-excel',
        component: () => import('@/views/excel/upload-excel'),
        name: 'UploadExcel',
        meta: { title: 'Upload Excel' }
      }
    ]
  },

  {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    alwaysShow: true,
    name: 'Zip',
    hidden: true,
    meta: { title: 'Zip', icon: 'zip' },
    children: [
      {
        path: 'download',
        component: () => import('@/views/zip/index'),
        name: 'ExportZip',
        meta: { title: 'Export Zip' }
      }
    ]
  },

  {
    path: '/pdf',
    component: Layout,
    redirect: '/pdf/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/pdf/index'),
        name: 'PDF',
        meta: { title: 'PDF', icon: 'pdf' }
      }
    ]
  },
  {
    path: '/pdf/download',
    component: () => import('@/views/pdf/download'),
    hidden: true
  },

  {
    path: '/theme',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/theme/index'),
        name: 'Theme',
        hidden: true,
        meta: { title: 'Theme', icon: 'theme' }
      }
    ]
  },

  {
    path: '/clipboard',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/clipboard/index'),
        name: 'ClipboardDemo',
        meta: { title: 'Clipboard', icon: 'clipboard' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'https://github.com/PanJiaChen/vue-element-admin',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
