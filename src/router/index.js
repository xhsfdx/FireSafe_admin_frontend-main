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
    redirect: '/dashboard', // 改为统一首页，根据角色再跳转
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: { title: '首页' }
      },
      {
        path: 'digital-screen/digitalScreen',
        component: () => import('@/views/digital-screen/digitalScreen.vue'),
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
      title: '',
      roles: ['superadmin', 'admin'] // 业主不能访问数字大屏相关路由
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
      icon: 'el-icon-monitor',
      roles: ['superadmin', 'admin'] // 业主不能访问数字大屏
    },
    children: [
      {
        path: 'digitalScreen',
        name: 'DigitalScreenMain',
        component: () => import('@/views/digital-screen/digitalScreen.vue'),
        meta: {
          title: '数字可视化大屏',
          roles: ['superadmin', 'admin']
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
      icon: 'el-icon-office-building',
      roles: ['superadmin', 'admin'] // 业主不能访问服务机构管理
    },

    children: [
      {
        path: 'basic',
        name: 'AgencyBasicInfo',
        component: () => import('@/views/service-agency-management/InstitutionBasic.vue'),
        meta: {
          title: '机构基础信息'
        }
      },
      {
        path: 'basic/edit/:id',
        name: 'EditAgencyBasic',
        hidden: true, // 不显示在侧边栏
        component: () => import('@/views/service-agency-management/EditInstitutionBasic.vue'),
        meta: { title: '编辑机构信息' }
      },
      {
        path: 'staff',
        name: 'AgencyStaffInfo',
        hidden: true,
        component: () => import('@/views/service-agency-management/PersonCard.vue'),
        meta: {
          title: '机构人员信息'
        }
      },
      {
        path: 'person-info',
        name: 'PersonInfo',
        hidden: true, // 不显示在侧边栏
        component: () => import('@/views/service-agency-management/PersonInfo.vue'),
        meta: { title: '个人信息' }
      },
      {
        path: 'service-unit',
        name: 'ServiceUnit',
        hidden: true, // 不显示在侧边栏
        component: () => import('@/views/service-agency-management/ServiceUnit.vue'),
        meta: { title: '服务单位' }
      },
      {
        path: 'maintenance-tasks',
        name: 'MaintenanceTasks',
        hidden: true, // 不显示在侧边栏
        component: () => import('@/views/service-agency-management/MaintenanceTasks.vue'),
        meta: { title: '维保任务' }
      },
      {
        path: 'create-account',
        name: 'CreateAccount',
        hidden: true, // 不显示在侧边栏
        component: () => import('@/views/service-agency-management/CreateAccount.vue'),
        meta: { title: '创建账号' }
      },
      {
        path: 'person-list',
        name: 'PersonList',
        // hidden: true, // 不显示在侧边栏
        component: () => import('@/views/service-agency-management/PersonList.vue'),
        meta: { title: '人员列表' }
      },
      {
        path: 'FaultWorkOrder',
        name: 'Faultworkorder',
        hidden: true, // 不显示在侧边栏
        component: () => import('@/views/service-agency-management/Faultworkorder.vue'),
        meta: { title: '故障工单' }
      },
      {
        path: 'Additionalmaintenance',
        name: 'AdditionalMaintenance',
        hidden: true, // 不显示在侧边栏
        component: () => import('@/views/service-agency-management/Additionalmaintenance.vue'),
        meta: { title: '附加维保' }
      },
      {
        path: 'Workreport',
        name: 'AgencyWorkReport',
        hidden: true, // 不显示在侧边栏
        component: () => import('@/views/service-agency-management/WorkReport.vue'),
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
    meta: { 
      title: '项目管理', 
      icon: 'el-icon-folder-opened',
      roles: ['superadmin', 'admin', 'customer']
    },
    children: [
      {
        path: 'project',
        name: 'UnitProject',
        component: () => import('@/views/owner-unit-management/ProjectList.vue'),
        meta: {
          title: '单位项目管理',
          roles: ['superadmin', 'admin', 'customer'],
          permissionKey: 'owner.project'
        }
      },
      {
        path: 'point',
        name: 'MaintenancePoint',
        component: () => import('@/views/owner-unit-management/MaintenancePoint.vue'),
        meta: { 
          title: '维保点位管理',
          roles: ['superadmin', 'admin', 'customer'],
          permissionKey: 'owner.point'
        }
      },
      {
        path: 'payment',
        name: 'PaymentManagement',
        component: () => import('@/views/owner-unit-management/PaymentManagement.vue'),
        meta: {
          title: '结款管理',
          roles: ['superadmin', 'admin', 'customer'],
          permissionKey: 'owner.payment'
        }
      },
      {
        path: 'plan',
        name: 'MaintenancePlan',
        component: () => import('@/views/owner-unit-management/MaintenancePlan.vue'),
        meta: { 
          title: '维保计划管理',
          roles: ['superadmin', 'admin', 'customer'],
          permissionKey: 'owner.plan'
        }
      },
      // 维保点位管理相关子路由
      {
        path: 'point-detail/:pointId',
        name: 'MaintenancePointDetail',
        hidden: true,
        component: () => import('@/views/owner-unit-management/MaintenancePointDetail.vue'),
        meta: { 
          title: '维保点位详情',
          roles: ['superadmin', 'admin', 'customer']
        }
      },
      {
        path: 'add-point',
        name: 'AddMaintenancePoint',
        hidden: true,
        component: () => import('@/views/owner-unit-management/AddMaintenancePoint.vue'),
        meta: { 
          title: '添加点位',
          roles: ['superadmin', 'admin'] // 仅管理员
        }
      },
      {
        path: 'point-basic-info/:pointId',
        name: 'MaintenancePointBasicInfo',
        hidden: true,
        component: () => import('@/views/owner-unit-management/MaintenancePointBasicInfo.vue'),
        meta: { 
          title: '点位基础信息',
          roles: ['superadmin', 'admin', 'customer']
        }
      },
      {
        path: 'point-maintenance-content/:pointId',
        name: 'MaintenancePointMaintenanceContent',
        hidden: true,
        component: () => import('@/views/owner-unit-management/MaintenancePointContent.vue'),
        meta: { 
          title: '点位维保内容',
          roles: ['superadmin', 'admin', 'customer']
        }
      },

      // 🔧 补全缺失页面
      {
        path: 'new-contract-info',
        name: 'AddNewContractInfo',
        hidden: true,
        component: () => import('@/views/owner-unit-management/AddNewContract.vue'),
        meta: { 
          title: '新增合同信息',
          roles: ['superadmin', 'admin'] // 仅管理员
        }
      },
      {
        path: 'new-project-info',
        name: 'AddNewProjectInfo',
        hidden: true,
        component: () => import('@/views/owner-unit-management/AddNewProject.vue'),
        meta: { 
          title: '新增项目信息',
          roles: ['superadmin', 'admin'] // 仅管理员
        }
      },
      {
        path: 'contract-info',
        name: 'ContractInfo',
        hidden: true,
        component: () => import('@/views/owner-unit-management/ContractInfo.vue'),
        meta: { 
          title: '合同信息',
          roles: ['superadmin', 'admin', 'customer']
        }
      },
      {
        path: 'project-info',
        name: 'ProjectInfo',
        hidden: true,
        component: () => import('@/views/owner-unit-management/ProjectInfo.vue'),
        meta: { 
          title: '项目信息详情',
          roles: ['superadmin', 'admin', 'customer']
        }
      },
      {
        path: 'renewal-contract-info',
        name: 'RenewalContractInfo',
        hidden: true,
        component: () => import('@/views/owner-unit-management/RenewalContract.vue'),
        meta: { title: '续签合同信息' }
      },
      {
        path: 'renewal-project-info',
        name: 'RenewalProjectInfo',
        hidden: true,
        component: () => import('@/views/owner-unit-management/RenewalProject.vue'),
        meta: { title: '续签项目信息' }
      },
      {
        path: 'renewal-configure-personnel',
        name: 'RenewalConfigurePersonnel',
        hidden: true,
        component: () => import('@/views/owner-unit-management/RenewalConfigurePersonnel.vue'),
        meta: { title: '续签人员配置' }
      },

      // 原有隐藏页
      {
        path: 'UnitDetail',
        name: 'UnitDetail',
        hidden: true,
        component: () => import('@/views/owner-unit-management/UnitDetail.vue'),
        meta: {
          title: '项目详情',
          roles: ['superadmin', 'admin', 'customer']
        }
      },
      {
        path: 'EditContractDetail',
        name: 'EditContractDetail',
        hidden: true,
        component: () => import('@/views/owner-unit-management/ContractDetailView.vue'),
        meta: {
          title: '编辑合同',
          roles: ['superadmin', 'admin']
        }
      },
      {
        path: 'look_ContractDetail_View',
        name: 'ContractDetailView',
        hidden: true,
        component: () => import('@/views/owner-unit-management/ViewContractDetail.vue'),
        meta: {
          title: '合同完整详情',
          roles: ['superadmin', 'admin', 'customer']
        }
      },

      {
        path: 'contract/add',
        name: 'AddContractPage',
        hidden: true,
        component: () => import('@/views/owner-unit-management/AddContractAndProject.vue'),
        // 第一个contract试试写接口
        meta: { title: '新增项目管理页面' }
      },
      {
        path: 'contract/addnewdispatchStaff',
        name: 'addnewDispatchStaff',
        hidden: true,
        component: () => import('@/views/owner-unit-management/AddDispatchStaff.vue'),
        meta: { title: '新增配置维保人员' }
      },

      // 维保计划 & 任务详情
      {
        path: 'plan-detail',
        name: 'PlanDetail',
        hidden: true,
        component: () => import('@/views/owner-unit-management/MaintenancePlanDetail.vue'),
        meta: { title: '任务详情' }
      },
      {
        path: 'task-detail',
        name: 'OwnerTaskDetail',
        hidden: true,
        component: () => import('@/views/owner-unit-management/MaintenanceTaskList.vue'),
        meta: { title: '任务详情' }
      },
      {
        path: 'mpmTD-detail',
        name: 'MpmTDDetail',
        hidden: true,
        component: () => import('@/views/owner-unit-management/MaintenanceTaskDetail.vue'),
        meta: { title: '维保任务详情' }
      },
      {
        path: 'renewal',
        name: 'RenewalPage',
        hidden: true,
        component: () => import('@/views/owner-unit-management/Renewal.vue'),
        meta: { title: '续签合同' }
      },

      // 维保制定页面
      {
        path: 'system-maintenance-plan',
        name: 'SystemMaintenancePlan',
        hidden: true,
        component: () => import('@/views/owner-unit-management/SystemMaintenancePlanForm.vue'),
        meta: { title: '系统维保制定' }
      },
      {
        path: 'point-maintenance-plan',
        name: 'PointMaintenancePlan',
        hidden: true,
        component: () => import('@/views/owner-unit-management/PointMaintenancePlan.vue'),
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
      icon: 'el-icon-s-order',
      roles: ['superadmin', 'admin', 'customer']
    },
    children: [
      {
        path: 'routine',
        name: 'RoutineMaintenance',
        component: () => import('@/views/maintenance-management/RoutineMaintenance.vue'),
        meta: { title: '例行维护', icon: 'el-icon-date', permissionKey: 'maintenance.routine' }
      },
      {
        path: 'fault',
        name: 'FaultWorkOrder',
        component: () => import('@/views/maintenance-management/FaultWork.vue'),
        meta: { title: '故障工单', icon: 'el-icon-warning-outline', permissionKey: 'maintenance.fault' }
      },
      {
        path: 'fault/detail/:id',
        name: 'FaultOrderDetail',
        component: () => import('@/views/maintenance-management/FaultOrderDetail.vue'),
        hidden: true,
        meta: { title: '故障工单详情' }
      },
      {
        path: '/maintenance/fault-report/:id',
        name: 'FaultReport',
        hidden: true,
        component: () => import('@/views/maintenance-management/FaultReport.vue'),
        meta: { title: '故障工单报告' }
      },
      {
        path: 'support',
        name: 'AdditionalSupport',
        component: () => import('@/views/maintenance-management/AdditionalSupport.vue'),
        meta: { title: '附加维护', icon: 'el-icon-s-cooperation', permissionKey: 'maintenance.support' }
      },
      {
        path: 'report',
        name: 'WorkReport',
        component: () => import('@/views/maintenance-management/WorkReport.vue'),
        meta: { title: '工作上报', icon: 'el-icon-upload2', permissionKey: 'maintenance.report' }
      },
      {
        path: '/maintenance/task-detail/:id?',
        name: 'MaintenanceTaskDetail',
        hidden: true,
        component: () => import('@/views/maintenance-management/TaskDetail.vue'),
        meta: { title: '维保任务详情' }
      },
      {
        path: '/maintenance/task-report/:id',
        name: 'TaskReport',
        hidden: true,
        component: () => import('@/views/maintenance-management/TaskReport.vue'),
        meta: { title: '维保任务报告' }
      },
      {
        path: '/maintenance/work-report-detail/:id',
        name: 'WorkReportDetail',
        hidden: true,
        component: () => import('@/views/maintenance-management/WorkReportDetail.vue'),
        meta: { title: '工作上报详情' }
      },
      {
        path: '/maintenance/work-report-report/:id',
        name: 'WorkReportReport',
        hidden: true,
        component: () => import('@/views/maintenance-management/WorkReportReport.vue'),
        meta: { title: '工作上报报告' }
      },
      {
        path: '/maintenance/additional-maintenance-detail/:id',
        name: 'AdditionalMaintenanceDetail',
        hidden: true,
        component: () => import('@/views/maintenance-management/AdditionalMaintenanceDetail.vue'),
        meta: { title: '附加维保详情' }
      },
      {
        path: '/fault-list-detail',
        name: 'FaultListDetail',
        hidden: true,
        component: () => import('@/views/maintenance-management/FaultListDetail.vue'),
        meta: { title: '故障列表' }
      },
      {
        path: '/maintenance/dispatch/:id',
        name: 'DispatchStaff',
        hidden: true,
        component: () => import('@/views/maintenance-management/DispatchStaff.vue'),
        meta: { title: '改派人员' }
      },
      {
        path: '/maintenance/create-task',
        name: 'CreateTask',
        hidden: true,
        component: () => import('@/views/maintenance-management/CreateTask.vue'),
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
      icon: 'el-icon-setting',
      roles: ['superadmin', 'admin'] // 业主不能访问系统管理
    },
    children: [
      {
        path: 'checkin',
        name: 'CheckinArea',
        component: () => import('@/views/system-management/CheckinAreaSettings.vue'),
        meta: {
          title: '打卡区域设置',
          icon: 'el-icon-location-outline',
          permissionKey: 'system.checkin'
        }
      },
      {
        path: 'self-project',
        name: 'SelfBuiltProject',
        component: () => import('@/views/system-management/Self-builtMaintenance.vue'),
        meta: {
          title: '自建维保项目',
          icon: 'el-icon-folder',
          permissionKey: 'system.self-project'
        }
      },
      {
        path: 'manual',
        name: 'OperationManual',
        component: () => import('@/views/system-management/OperationManual.vue'),
        meta: { title: '操作手册', icon: 'el-icon-notebook-2', permissionKey: 'system.manual' }
      },
      {
        path: 'owner-account',
        name: 'OwnerAccount',
        component: () => import('@/views/system-management/OwnerUnitAccount.vue'),
        meta: { title: '业主单位账号', icon: 'el-icon-user', permissionKey: 'system.owner-account' }
      },
      {
        path: 'admin-permission',
        name: 'AdminPermission',
        component: () => import('@/views/system-management/AdminPermission.vue'),
        meta: {
          title: '管理员权限配置',
          icon: 'el-icon-lock',
          // 只有超级管理员可以看到这个页面
          roles: ['superadmin'],
          permissionKey: 'system.admin-permission'
        }
      },
      {
        path: 'upload-manager',
        name: 'UploadManager',
        component: () => import('@/views/system-management/UploadManager.vue'),
        meta: {
          title: '上传文件管理',
          icon: 'el-icon-folder-opened',
          roles: ['superadmin'],
          permissionKey: 'system.upload-manager'
        }
      },
      {
        path: 'ai-config',
        name: 'AIConfig',
        component: () => import('@/views/system-management/AIConfig.vue'),
        meta: {
          title: 'AI 配置',
          icon: 'el-icon-chat-line-round',
          roles: ['superadmin'],
          permissionKey: 'system.ai-config'
        }
      },
      {
        path: 'wechat-push-config',
        name: 'WechatPushConfig',
        component: () => import('@/views/system-management/WechatPushConfig.vue'),
        meta: {
          title: '微信推送配置',
          icon: 'el-icon-chat-dot-square',
          roles: ['superadmin', 'admin'],
          permissionKey: 'system.wechat-push-config'
        }
      },
      {
        path: '/system-management/add-self-built-maintenance-project',
        name: 'AddSelfBuiltMaintenanceProject',
        hidden: true,
        component: () => import('@/views/system-management/AddSelf-builtMaintenanceProject.vue'),
        meta: { title: '新增自建维保项目' }
      },
      {
        path: '/system/account-add',
        name: 'AddCustomerAccount',
        hidden: true,
        component: () => import('@/views/system-management/AddCustomerAccount.vue'),
        meta: { title: '新增客户单位账号' }
      },
      {
        path: '/system/edit-customer-account',
        name: 'EditCustomerAccount',
        hidden: true,
        component: () => import('@/views/system-management/EditCustomerAccount.vue'),
        meta: { title: '编辑客户单位账号' }
      },
      {
        path: '/system/customer-detail',
        name: 'CustomerDetail',
        hidden: true,
        component: () => import('@/views/system-management/CustomerDetail.vue'),
        meta: { title: '客户详情' }
      },
      {
        path: '/system/edit-self-built-maintenance-project/:id',
        name: 'EditSelfBuiltMaintenanceProject',
        hidden: true,
        component: () => import('@/views/system-management/EditSelf-builtMaintenanceProject.vue'),
        meta: { title: '编辑自建维保项目' }
      }
    ]
  },

  // 消息管理（客服聊天 + 微信推送）
  {
    path: '/chat',
    component: Layout,
    redirect: '/chat/management',
    alwaysShow: true,
    name: 'Chat',
    meta: {
      title: '消息管理',
      icon: 'el-icon-chat-dot-round',
      roles: ['superadmin', 'admin']
    },
    children: [
      {
        path: 'management',
        name: 'ChatManagement',
        component: () => import('@/views/chat-management/ChatManagement.vue'),
        meta: {
          title: '在线客服',
          icon: 'el-icon-service',
          permissionKey: 'chat.management'
        }
      },
      {
        path: 'message-push',
        name: 'MessagePush',
        component: () => import('@/views/system-management/MessagePush.vue'),
        meta: {
          title: '微信消息推送',
          icon: 'el-icon-message',
          permissionKey: 'chat.message-push'
        }
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
