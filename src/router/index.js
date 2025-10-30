import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

Vue.use(Vuex)
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
    redirect: '/digitalscreen/digitalScreen', // 改成数字大屏路径
    children: [
      {
        path: 'digitalscreen/digitalScreen',
        component: () => import('@/views/digitalscreen/digitalScreen.vue'),
        name: 'DigitalScreen',
        hidden: true,
        meta: { title: '数字可视化大屏' }
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
    path: '/digiScreen',
    component: Layout,
    hidden: true, // 不显示在侧边栏
    name: 'digitalScreen',
    meta: {
      title: ''
    },
    children: [
      {
        path: '/Comprehensiveranking',
        name: 'ComprehensiveRanking',
        hidden: true,
        component: () => import('@/components/digitalScreen/ComprehensiveRanking.vue'),
        meta: {
          title: '综合排名'
        }
      },
      {
        path: '/Totalower',
        name: 'TotalOwer',
        hidden: true,
        component: () => import('@/components/digitalScreen/TotalOwer.vue'),
        meta: {
          title: '业主总数'
        }
      },
      {
        path: '/Personnelstatistics',
        name: 'PersonnelStatistics',
        hidden: true,
        component: () => import('@/components/digitalScreen/PersonnelStatistics.vue'),
        meta: {
          title: '人员统计'
        }
      },
      {
        path: '/Checkinrecord',
        name: 'CheckinRecord',
        hidden: true,
        component: () => import('@/components/digitalScreen/CheckinRecord.vue'),
        meta: {
          title: '打卡记录'
        }
      },
      {
        path: '/Totalmaintencearea',
        name: 'TotalmaintenceArea',
        hidden: true,
        component: () => import('@/components/digitalScreen/TotalmaintenanceArea.vue'),
        meta: {
          title: '维保总面积'
        }
      },
      {
        path: '/Businesstrend',
        name: 'BusinessTrend',
        hidden: true,
        component: () => import('@/components/digitalScreen/BusinessTrend.vue'),
        meta: {
          title: '业务趋势'
        }
      },
      {
        path: '/businessStats',
        name: 'BusinessStats',
        hidden: true,
        component: () => import('@/components/digitalScreen/BusinessStats.vue'),
        meta: {
          title: '业务状态'
        }
      },
      {
        path: '/leftPanel',
        name: 'LeftPanel',
        hidden: true,
        component: () => import('@/components/digitalScreen/LeftPanel.vue'),
        meta: {
          title: '左侧图表'
        }
      },
      {
        path: '/rightPanel',
        name: 'RightPanel',
        hidden: true,
        component: () => import('@/components/digitalScreen/RightPanel.vue'),
        meta: {
          title: '右侧图表'
        }
      },
      {
        path: '/mapChart',
        name: 'MapChart',
        hidden: true,
        component: () => import('@/components/digitalScreen/MapChart.vue'),
        meta: {
          title: '地图'
        }
      },
      {
        path: '/topBar',
        name: 'TopBar',
        hidden: true,
        component: () => import('@/components/digitalScreen/TopBar.vue'),
        meta: {
          title: '顶部'
        }
      }
    ]
  },
  {
    path: '/digitalscreen',
    component: Layout,
    alwaysShow: true,
    name: 'Screen',
    meta: {
      title: '数字大屏',
      icon: ''
    },
    children: [
      {
        path: 'digitalScreen',
        name: 'DigitalScreenMain',
        component: () => import('@/views/digitalscreen/digitalScreen.vue'),
        meta: {
          title: '数字可视化大屏'
        }
      }
    ]
  },

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
        component: () => import('@/views/ServiceAgencyManagement/InstitutionBasic.vue'),
        meta: {
          title: '机构基础信息'
        }
      },
      {
        path: 'basic/edit/:id',
        name: 'EditAgencyBasic',
        hidden: true, // 不显示在侧边栏
        component: () => import('@/views/ServiceAgencyManagement/EditInstitutionBasic.vue'),
        meta: { title: '编辑机构信息' }
      },
      {
        path: 'staff',
        name: 'AgencyStaffInfo',
        hidden: true,
        component: () => import('@/views/ServiceAgencyManagement/personCard.vue'),
        meta: {
          title: '机构人员信息'
        }
      },
      {
        path: 'person-info',
        name: 'PersonInfo',
        hidden: true, // 不显示在侧边栏
        component: () => import('@/views/ServiceAgencyManagement/PersonInfo.vue'),
        meta: { title: '个人信息' }
      },
      {
        path: 'service-unit',
        name: 'ServiceUnit',
        hidden: true, // 不显示在侧边栏
        component: () => import('@/views/ServiceAgencyManagement/ServiceUnit.vue'),
        meta: { title: '服务单位' }
      },
      {
        path: 'maintenance-tasks',
        name: 'MaintenanceTasks',
        hidden: true, // 不显示在侧边栏
        component: () => import('@/views/ServiceAgencyManagement/MaintenanceTasks.vue'),
        meta: { title: '维保任务' }
      },
      {
        path: 'create-account',
        name: 'CreateAccount',
        hidden: true, // 不显示在侧边栏
        component: () => import('@/views/ServiceAgencyManagement/CreateAccount.vue'),
        meta: { title: '创建账号' }
      },
      {
        path: 'person-list',
        name: 'PersonList',
        // hidden: true, // 不显示在侧边栏
        component: () => import('@/views/ServiceAgencyManagement/personList.vue'),
        meta: { title: '人员列表' }
      },
      {
        path: 'FaultWorkOrder',
        name: 'Faultworkorder',
        hidden: true, // 不显示在侧边栏
        component: () => import('@/views/ServiceAgencyManagement/Faultworkorder.vue'),
        meta: { title: '故障工单' }
      },
      {
        path: 'Additionalmaintenance',
        name: 'AdditionalMaintenance',
        hidden: true, // 不显示在侧边栏
        component: () => import('@/views/ServiceAgencyManagement/Additionalmaintenance.vue'),
        meta: { title: '附加维保' }
      },
      {
        path: 'Workreport',
        name: 'AgencyWorkReport',
        hidden: true, // 不显示在侧边栏
        component: () => import('@/views/ServiceAgencyManagement/WorkReport.vue'),
        meta: { title: '工作上报' }
      }
    ]
  },
  {
    path: '/owner',
    component: Layout,
    redirect: '/owner/plan',
    alwaysShow: true,
    name: 'OwnerUnitManagement',
    meta: { title: '项目管理', icon: 'nested' },
    children: [
      // 已有的
      {
        path: 'project',
        name: 'UnitProject',
        component: () => import('@/views/OwnerUnitManagement/ProjectList.vue'),
        meta: {
          title: '单位项目管理',
          roles: ['superadmin', 'admin', 'editor']
        }
      },
      {
        path: 'point',
        name: 'MaintenancePoint',
        component: () => import('@/views/OwnerUnitManagement/MaintenancePoint.vue'),
        meta: { title: '维保点位管理' }
      },
      {
        path: 'payment',
        name: 'PaymentManagement',
        component: () => import('@/views/OwnerUnitManagement/PaymentManagement.vue'),
        meta: {
          title: '结款管理',
          roles: ['superadmin', 'admin', 'editor']
        }
      },
      {
        path: 'plan',
        name: 'MaintenancePlan',
        component: () => import('@/views/OwnerUnitManagement/MaintenancePlan.vue'),
        meta: { title: '维保计划管理' }
      },
      // 维保点位管理相关子路由
      {
        path: 'point-detail/:pointId',
        name: 'MaintenancePointDetail',
        hidden: true,
        component: () => import('@/views/OwnerUnitManagement/MPM-pointDetail.vue'),
        meta: { title: '维保点位详情' }
      },
      {
        path: 'add-point',
        name: 'AddMaintenancePoint',
        hidden: true,
        component: () => import('@/views/OwnerUnitManagement/MPM-addPoint.vue'),
        meta: { title: '添加点位' }
      },
      {
        path: 'point-basic-info/:pointId',
        name: 'MaintenancePointBasicInfo',
        hidden: true,
        component: () => import('@/views/OwnerUnitManagement/MPM-basicInfo.vue'),
        meta: { title: '点位基础信息' }
      },
      {
        path: 'point-maintenance-content/:pointId',
        name: 'MaintenancePointMaintenanceContent',
        hidden: true,
        component: () => import('@/views/OwnerUnitManagement/MPM-maintenanceContent.vue'),
        meta: { title: '点位维保内容' }
      },

      // 🔧 补全缺失页面
      {
        path: 'new-contract-info',
        name: 'AddNewContractInfo',
        hidden: true,
        component: () => import('@/views/OwnerUnitManagement/add_new_contract.vue'),
        meta: { title: '新增合同信息' }
      },
      {
        path: 'new-project-info',
        name: 'AddNewProjectInfo',
        hidden: true,
        component: () => import('@/views/OwnerUnitManagement/add_new_project.vue'),
        meta: { title: '新增项目信息' }
      },
      {
        path: 'contract-detail',
        name: 'ContractDetail',
        hidden: true,
        component: () => import('@/views/OwnerUnitManagement/ContractDetail.vue'),
        meta: { title: '合同详情' }
      },
      {
        path: 'contract-info',
        name: 'ContractInfo',
        hidden: true,
        component: () => import('@/views/OwnerUnitManagement/ContractInfo.vue'),
        meta: { title: '合同信息' }
      },
      {
        path: 'project-info',
        name: 'ProjectInfo',
        hidden: true,
        component: () => import('@/views/OwnerUnitManagement/ProjectInfo.vue'),
        meta: { title: '项目信息详情' }
      },
      {
        path: 'renewal-contract-info',
        name: 'RenewalContractInfo',
        hidden: true,
        component: () => import('@/views/OwnerUnitManagement/RenewalContract.vue'),
        meta: { title: '续签合同信息' }
      },
      {
        path: 'renewal-project-info',
        name: 'RenewalProjectInfo',
        hidden: true,
        component: () => import('@/views/OwnerUnitManagement/RenewalProject.vue'),
        meta: { title: '续签项目信息' }
      },
      {
        path: 'renewal-configure-personnel',
        name: 'RenewalConfigurePersonnel',
        hidden: true,
        component: () => import('@/views/OwnerUnitManagement/RenewwalConfigure.vue'),
        meta: { title: '续签人员配置' }
      },

      // 原有隐藏页
      {
        path: 'UnitDetail',
        name: 'UnitDetail',
        hidden: true,
        component: () => import('@/views/OwnerUnitManagement/UnitDetail.vue'),
        meta: {
          title: '项目详情',
          roles: ['superadmin', 'admin', 'editor']
        }
      },
      {
        path: 'look_ContractDetail_View',
        name: 'ContractDetailView',
        hidden: true,
        component: () => import('@/views/OwnerUnitManagement/look_ContractDetail_View.vue'),
        meta: {
          title: '合同完整详情',
          roles: ['superadmin', 'admin', 'editor']
        }
      },

      {
        path: 'contract/add',
        name: 'AddContractPage',
        hidden: true,
        component: () => import('@/views/OwnerUnitManagement/add.vue'),
        // 第一个contract试试写接口
        meta: { title: '新增项目管理页面' }
      },
      {
        path: 'contract/addnewdispatchStaff',
        name: 'addnewDispatchStaff',
        hidden: true,
        component: () => import('@/views/OwnerUnitManagement/addnewdispatchStaff.vue'),
        meta: { title: '新增配置维保人员' }
      },

      // 维保计划 & 任务详情
      {
        path: 'plan-detail',
        name: 'PlanDetail',
        hidden: true,
        component: () => import('@/views/OwnerUnitManagement/mpm-PlanDetail.vue'),
        meta: { title: '任务详情' }
      },
      {
        path: 'task-detail',
        name: 'OwnerTaskDetail',
        hidden: true,
        component: () => import('@/views/OwnerUnitManagement/mpm-TaskDetail.vue'),
        meta: { title: '任务详情' }
      },
      {
        path: 'mpmTD-detail',
        name: 'MpmTDDetail',
        hidden: true,
        component: () => import('@/views/OwnerUnitManagement/mpmTD-detail.vue'),
        meta: { title: '维保任务详情' }
      },
      {
        path: 'renewal',
        name: 'RenewalPage',
        hidden: true,
        component: () => import('@/views/OwnerUnitManagement/Renewal.vue'),
        meta: { title: '续签合同' }
      },

      // 维保制定页面
      {
        path: 'system-maintenance-plan',
        name: 'SystemMaintenancePlan',
        hidden: true,
        component: () => import('@/views/OwnerUnitManagement/SystemMaintenancePlanForm.vue'),
        meta: { title: '系统维保制定' }
      },
      {
        path: 'point-maintenance-plan',
        name: 'PointMaintenancePlan',
        hidden: true,
        component: () => import('@/views/OwnerUnitManagement/PointMaintenancePlan.vue'),
        meta: { title: '点位维保制定' }
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
        component: () => import('@/views/MaintenanceManagement/RoutineMaintenance.vue'),
        meta: { title: '例行维护', icon: 'el-icon-date' }
      },
      {
        path: 'fault',
        name: 'FaultWorkOrder',
        component: () => import('@/views/MaintenanceManagement/FaultWork.vue'),
        meta: { title: '故障工单', icon: 'el-icon-warning-outline' }
      },
      {
        path: 'fault/detail/:id',
        name: 'FaultOrderDetail',
        component: () => import('@/views/MaintenanceManagement/FaultOrderDetail.vue'),
        hidden: true,
        meta: { title: '故障工单详情' }
      },
      {
        path: 'support',
        name: 'AdditionalSupport',
        component: () => import('@/views/MaintenanceManagement/AdditionalSupport.vue'),
        meta: { title: '附加维护', icon: 'el-icon-s-cooperation' }
      },
      {
        path: 'report',
        name: 'WorkReport',
        component: () => import('@/views/MaintenanceManagement/Workreport.vue'),
        meta: { title: '工作上报', icon: 'el-icon-upload2' }
      },
      {
        path: '/maintenance/task-detail/:id?',
        name: 'MaintenanceTaskDetail',
        hidden: true,
        component: () => import('@/views/MaintenanceManagement/TaskDetail.vue'),
        meta: { title: '维保任务详情' }
      },
      {
        path: '/fault-list-detail',
        name: 'FaultListDetail',
        hidden: true,
        component: () => import('@/views/MaintenanceManagement/FaultListDetail.vue'),
        meta: { title: '故障列表' }
      },
      {
        path: '/maintenance/dispatch/:id',
        name: 'DispatchStaff',
        hidden: true,
        component: () => import('@/views/MaintenanceManagement/DispatchStaff.vue'),
        meta: { title: '改派人员' }
      },
      {
        path: '/maintenance/create-task',
        name: 'CreateTask',
        hidden: true,
        component: () => import('@/views/MaintenanceManagement/CreateTask.vue'),
        meta: { title: '新建维保任务' }
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
        component: () => import('@/views/SystemManagement/Check-in area settings.vue'),
        meta: { title: '打卡区域设置', icon: 'el-icon-location-outline' }
      },
      {
        path: 'self-project',
        name: 'SelfBuiltProject',
        component: () => import('@/views/SystemManagement/Self-builtMaintenance.vue'),
        meta: { title: '自建维保项目', icon: 'el-icon-folder' }
      },
      {
        path: 'manual',
        name: 'OperationManual',
        component: () => import('@/views/SystemManagement/OperationManual.vue'),
        meta: { title: '操作手册', icon: 'el-icon-notebook-2' }
      },
      {
        path: 'owner-account',
        name: 'OwnerAccount',
        component: () => import('@/views/SystemManagement/OwnerUnitAccount.vue'),
        meta: { title: '业主单位账号', icon: 'el-icon-user' }
      },
      {
        path: '/system-management/add-self-built-maintenance-project',
        name: 'AddSelfBuiltMaintenanceProject',
        hidden: true,
        component: () => import('@/views/SystemManagement/AddSelf-builtMaintenanceProject.vue'),
        meta: { title: '新增自建维保项目' }
      },
      {
        path: '/system/account-add',
        name: 'AddCustomerAccount',
        hidden: true,
        component: () => import('@/views/SystemManagement/AddCustomerAccount.vue'),
        meta: { title: '新增客户单位账号' }
      },
      {
        path: '/system/edit-customer-account',
        name: 'EditCustomerAccount',
        hidden: true,
        component: () => import('@/views/SystemManagement/EditCustomerAccount.vue'),
        meta: { title: '编辑客户单位账号' }
      },
      {
        path: '/system/customer-detail',
        name: 'CustomerDetail',
        hidden: true,
        component: () => import('@/views/SystemManagement/CustomerDetail.vue'),
        meta: { title: '客户详情' }
      },
      {
        path: '/system/edit-self-built-maintenance-project/:id',
        name: 'EditSelfBuiltMaintenanceProject',
        hidden: true,
        component: () => import('@/views/SystemManagement/EditSelf-builtMaintenanceProject.vue'),
        meta: { title: '编辑自建维保项目' }
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
