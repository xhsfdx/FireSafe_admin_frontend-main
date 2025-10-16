<template>
  <div class="task-detail-page">
    <!-- 页面标题卡片 -->
    <div class="card-block card-title">
      <div class="card-title-txt">维保任务详情</div>
      <div class="breadcrumb">
        <span class="breadcrumb-item">业主单位管理</span>
        <span class="breadcrumb-separator">></span>
        <span class="breadcrumb-item">维保计划管理</span>
        <span class="breadcrumb-separator">></span>
        <span class="breadcrumb-item">任务详情</span>
        <span class="breadcrumb-separator">></span>
        <span class="breadcrumb-item active">详情</span>
      </div>
      <!-- 时间戳 -->
      <div class="timestamp">
        {{ currentTime }}
      </div>
    </div>

    <!-- 任务状态时间线 -->
    <div class="status-timeline">
      <div class="timeline-container">
        <div
          v-for="(step, index) in timelineSteps"
          :key="index"
          class="timeline-step"
          :class="{ 'active': step.active, 'completed': step.completed }"
        >
          <div class="step-circle">
            <i v-if="step.completed" class="el-icon-check" />
          </div>
          <div class="step-label">{{ step.label }}</div>
        </div>
      </div>
    </div>

    <!-- 维保任务详情 -->
    <div class="task-detail-section">
      <div class="section-title">维保任务详情</div>
      <div class="detail-grid">
        <div class="detail-item">
          <div class="detail-label">项目名称</div>
          <div class="detail-value">{{ taskDetail.projectName || '汽车站' }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">计划类型</div>
          <div class="detail-value">
            <el-tag type="primary" size="small">{{ taskDetail.planType || '月' }}</el-tag>
          </div>
        </div>
        <div class="detail-item">
          <div class="detail-label">任务名称</div>
          <div class="detail-value">{{ taskDetail.taskName || '2025年9月任务' }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">业主单位名称</div>
          <div class="detail-value">{{ taskDetail.ownerName || '高坪汽车站2' }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">任务状态</div>
          <div class="detail-value">
            <el-tag :type="getTaskStatusType(taskDetail.status)" size="small">
              {{ taskDetail.status || '待处理' }}
            </el-tag>
          </div>
        </div>
        <div class="detail-item">
          <div class="detail-label">维保技术负责人</div>
          <div class="detail-value">{{ taskDetail.technicalLeader || '未分配' }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">维保项目负责人</div>
          <div class="detail-value">{{ taskDetail.projectManager || 'ljh' }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">现场维保人员</div>
          <div class="detail-value">{{ taskDetail.maintainer || '陈xx' }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">维保方式</div>
          <div class="detail-value">{{ taskDetail.maintenanceMethod || '系统维保' }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">服务评分</div>
          <div class="detail-value">
            <div class="rating-stars">
              <i
                v-for="n in 5"
                :key="n"
                class="el-icon-star-off"
                :class="{ 'rated': n <= (taskDetail.rating || 0) }"
              />
            </div>
          </div>
        </div>
        <div class="detail-item">
          <div class="detail-label">评价描述</div>
          <div class="detail-value">{{ taskDetail.evaluation || '暂无' }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">故障列表</div>
          <div class="detail-value">
            <el-link type="primary" @click="viewFaultList">详情></el-link>
          </div>
        </div>
        <div class="detail-item">
          <div class="detail-label">维护保养情况</div>
          <div class="detail-value">{{ taskDetail.maintenanceStatus || '暂无' }}</div>
        </div>
      </div>
    </div>

    <!-- 任务统计信息 -->
    <div class="task-statistics">
      <div class="stat-item">
        <div class="stat-icon detection-total">
          <i class="el-icon-pie-chart" />
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ statistics.totalInspections || 1 }}</div>
          <div class="stat-label">检测总数</div>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon uninspected">
          <i class="el-icon-view" />
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ statistics.uninspected || 1 }}</div>
          <div class="stat-label">未检数</div>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon inspected">
          <i class="el-icon-success" />
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ statistics.inspected || 0 }}</div>
          <div class="stat-label">已检数</div>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon fault-records">
          <i class="el-icon-warning" />
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ statistics.faultRecords || 0 }}</div>
          <div class="stat-label">故障记录</div>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon replaced-equipment">
          <i class="el-icon-setting" />
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ statistics.replacedEquipment || 0 }}</div>
          <div class="stat-label">更换设备</div>
        </div>
      </div>
    </div>

    <!-- 检测详情 -->
    <div class="inspection-detail-section">
      <div class="section-title">检测详情</div>
      <el-table :data="maintenanceContentList" border style="width: 100%;">
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="systemCategory" label="消防系统/设施" align="center" />
        <el-table-column prop="deviceName" label="维保项目" align="center" />
        <el-table-column prop="maintainSlim" label="检测内容" align="center" />
        <el-table-column prop="frequency" label="维保周期" align="center" />
        <el-table-column prop="inspectionResult" label="检测结果" align="center">
          <template #default="scope">
            <el-tag
              :type="getInspectionResultType(scope.row.inspectionResult)"
              size="small"
            >
              {{ scope.row.inspectionResult }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="maintainContent" label="规范" align="center" />
      </el-table>
      <div v-if="!maintenanceContentList || maintenanceContentList.length === 0" class="empty-box">
        暂无检测内容
      </div>
    </div>

    <!-- 返回按钮 -->
    <div class="page-header">
      <el-button class="return-btn" @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<script>
import { getMaintainTask } from '@/api/maintainTask'

export default {
  name: 'MpmTDDetail',
  data() {
    return {
      loading: false,
      currentTime: '',
      // 任务状态时间线
      timelineSteps: [
        { label: '已派发', active: false, completed: false },
        { label: '已到达', active: false, completed: false },
        { label: '开始处置', active: false, completed: false },
        { label: '处置完成提交审批', active: false, completed: false },
        { label: '完成维保', active: false, completed: false },
        { label: '已评价', active: false, completed: false }
      ],
      // 任务详情数据
      taskDetail: {
        projectName: '',
        planType: '',
        taskName: '',
        ownerName: '',
        status: '',
        maintainer: '',
        projectManager: '',
        maintenanceMethod: '',
        rating: 0,
        evaluation: '',
        maintenanceStatus: ''
      },
      // 统计信息
      statistics: {
        totalInspections: 0,
        uninspected: 0,
        inspected: 0,
        faultRecords: 0,
        replacedEquipment: 0
      },
      // 系统组件
      selectedSystem: '',
      selectedComponent: '',
      systemComponents: [],
      // 检测项目
      inspectionItems: [],
      // 故障列表
      faultList: [],
      // 维保内容列表
      maintenanceContentList: []
    }
  },

  // 监听路由变化，重新加载数据
  watch: {
    '$route'(to, from) {
      console.log('🔄 路由变化，重新加载数据')
      console.log('从:', from.path, from.query)
      console.log('到:', to.path, to.query)

      // 只有当路由变化到详情页面且新路由有参数时才重新加载数据
      if (to.path === '/owner/mpmTD-detail' &&
          Object.keys(to.query).length > 0 &&
          (to.query.id || to.query.planId || to.query.taskId)) {
        console.log('✅ 路由变化有效，重新加载数据')
        this.loadTaskDetail()
      } else {
        console.log('⚠️ 路由变化无效，跳过数据加载')
      }
    }
  },
  mounted() {
    this.updateCurrentTime()
    this.loadTaskDetail()

    // 定时更新时间
    this.timeInterval = setInterval(this.updateCurrentTime, 1000)
  },

  beforeDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval)
    }
  },

  methods: {
    // 更新当前时间
    updateCurrentTime() {
      const now = new Date()
      this.currentTime = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    },

    // 加载任务详情
    async loadTaskDetail() {
      const taskId = this.$route.query.id || this.$route.query.taskId
      const projectId = this.$route.query.projectId
      const planId = this.$route.query.planId

      console.log('任务详情页面接收到的参数:', this.$route.query)
      console.log('使用的taskId:', taskId)
      console.log('使用的projectId:', projectId)
      console.log('使用的planId:', planId)
      console.log('完整URL参数:', JSON.stringify(this.$route.query))

      // 检查是否有有效的ID参数（taskId或planId）
      if (!taskId && !planId) {
        this.$message.error('缺少任务ID或计划ID参数')
        return
      }

      this.loading = true
      try {
        // 优先使用planId，如果没有则使用taskId
        const targetPlanId = planId || taskId
        console.log('🔍 最终使用的计划ID:', targetPlanId)
        await this.loadPlanDetail(targetPlanId)

        // 使用默认的系统组件数据
        this.systemComponents = this.getDefaultSystemComponents()
        this.selectedSystem = 'sprinkler'
        this.selectedComponent = 'sprinkler-head'
        this.loadInspectionItems(this.selectedSystem, this.selectedComponent)

        // 强制更新视图
        this.$nextTick(() => {
          this.$forceUpdate()
        })
      } catch (error) {
        console.log('使用默认数据')
        // 使用默认数据
        this.processTaskDetail(this.getDefaultTaskData())
        this.systemComponents = this.getDefaultSystemComponents()
        this.selectedSystem = 'sprinkler'
        this.selectedComponent = 'sprinkler-head'
        this.loadInspectionItems(this.selectedSystem, this.selectedComponent)

        // 生成默认维保内容数据
        this.generateDefaultMaintenanceContent()
        console.log('📋 使用默认维保内容数据:', this.maintenanceContentList)

        // 强制更新视图
        this.$nextTick(() => {
          this.$forceUpdate()
        })
      } finally {
        this.loading = false
      }
    },

    // 加载计划详情
    async loadPlanDetail(planId) {
      if (!planId) {
        throw new Error('缺少计划ID参数')
      }

      console.log('🔄 正在从后端获取计划数据，planId:', planId)
      try {
        const { getMaintenancePlan } = await import('@/api/maintainPlan')
        const planRes = await getMaintenancePlan(planId)
        console.log('📋 后端返回的计划数据:', planRes)

        if (!planRes.success) {
          throw new Error('获取计划数据失败')
        }

        if (planRes.data) {
          const planData = planRes.data
          console.log('✅ 成功获取计划数据:', planData)

          // 先初始化系统组件数据
          this.systemComponents = this.getDefaultSystemComponents()

          // 将计划数据转换为任务数据格式
          this.processPlanAsTask(planData)

          this.selectedSystem = 'sprinkler'
          this.selectedComponent = 'sprinkler-head'
          this.loadInspectionItems(this.selectedSystem, this.selectedComponent)

          // 从计划数据中提取维保内容
          this.extractMaintenanceContentFromPlan(planData)
          console.log('📋 从计划数据提取的维保内容数据:', this.maintenanceContentList)

          // 强制更新视图
          this.$nextTick(() => {
            this.$forceUpdate()
          })
        } else {
          throw new Error('计划数据为空')
        }
      } catch (apiError) {
        console.log('⚠️ API调用失败，使用默认数据:', apiError.message)
        // 使用默认数据
        this.processTaskDetail(this.getDefaultTaskData())
        this.systemComponents = this.getDefaultSystemComponents()
        this.selectedSystem = 'sprinkler'
        this.selectedComponent = 'sprinkler-head'
        this.loadInspectionItems(this.selectedSystem, this.selectedComponent)

        // 生成默认维保内容数据
        this.generateDefaultMaintenanceContent()

        // 强制更新视图
        this.$nextTick(() => {
          this.$forceUpdate()
        })
      }
    },

    // 将计划数据转换为任务数据格式
    processPlanAsTask(planData) {
      // 处理维保人员信息
      const getPersonName = (person) => {
        if (!person) return '未分配'
        if (typeof person === 'string') return person
        return person.name || person.userName || '未知'
      }

      // 处理维保人员列表
      const getMaintainersText = (maintainers) => {
        if (!maintainers || !Array.isArray(maintainers)) return '未分配'
        return maintainers.map(m => getPersonName(m)).join('、')
      }

      console.log('🔍 处理计划数据，计划ID:', planData._id)
      console.log('🔍 原始项目名称:', planData.projectName)
      console.log('🔍 原始业主名称:', planData.ownerName)

      this.taskDetail = {
        projectName: planData.projectName || planData.project?.name || '未知项目',
        planType: planData.planType || '月',
        taskName: planData.planName || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}计划`,
        ownerName: planData.ownerName || planData.owner?.name || '未知业主',
        status: planData.planStatus || '计划已制定',
        maintainer: getMaintainersText(planData.maintainPersons?.maintainers) || '未分配',
        projectManager: getPersonName(planData.maintainPersons?.leader) || '未分配',
        maintenanceMethod: planData.maintenanceMethod || planData.contract?.warrantyMethod || '系统维保',
        rating: planData.rating || planData.score || 0,
        evaluation: planData.evaluation || planData.comment || '暂无',
        maintenanceStatus: planData.maintenanceStatus || planData.maintDesc || '暂无'
      }

      console.log('✅ 处理后的任务详情:', this.taskDetail)

      // 更新时间线状态
      this.updateTimelineStatus(planData.planStatus || '计划已制定')

      // 更新统计信息 - 从计划数据中提取
      this.statistics = {
        totalInspections: planData.totalCheckCount || 0,
        uninspected: (planData.totalCheckCount || 0) - (planData.passedCount || 0),
        inspected: planData.passedCount || 0,
        faultRecords: planData.abnormalCount || 0,
        replacedEquipment: planData.replacedCount || 0
      }

      // 处理故障列表
      if (planData.faultList && Array.isArray(planData.faultList)) {
        this.faultList = planData.faultList
      } else {
        this.faultList = []
      }

      // 处理检测项目 - 从计划详情中提取
      if (planData.details && Array.isArray(planData.details)) {
        this.inspectionItems = planData.details.map(item => ({
          content: item.maintainContent || item.category || '检测项目',
          result: item.result || '未检测'
        }))

        // 根据检测项目确定已勾选的系统组件
        this.processCheckedComponents(planData.details)
      } else {
        this.inspectionItems = [
          { content: '外观,清除异物及周边障碍物', result: '未检测' }
        ]
      }
    },

    // 处理任务详情数据
    processTaskDetail(data) {
      if (data) {
        // 处理维保人员信息
        const getPersonName = (person) => {
          if (!person) return '未分配'
          if (typeof person === 'string') return person
          return person.name || person.userName || '未知'
        }

        // 处理维保人员列表
        const getMaintainersText = (maintainers) => {
          if (!maintainers || !Array.isArray(maintainers)) return '未分配'
          return maintainers.map(m => getPersonName(m)).join('、')
        }

        this.taskDetail = {
          projectName: data.projectName || data.project?.name || '未知项目',
          planType: data.planType || '月',
          taskName: data.taskName || data.name || `${data.taskMonth || '未知'}任务`,
          ownerName: data.ownerName || data.owner?.name || '未知业主',
          status: data.status || '待处理',
          maintainer: getMaintainersText(data.maintainPersons?.maintainers) || '未分配',
          projectManager: getPersonName(data.maintainPersons?.leader) || '未分配',
          maintenanceMethod: data.maintenanceMethod || data.contract?.warrantyMethod || '系统维保',
          rating: data.rating || data.score || 0,
          evaluation: data.evaluation || data.comment || '暂无',
          maintenanceStatus: data.maintenanceStatus || data.maintDesc || '暂无'
        }

        // 更新时间线状态
        this.updateTimelineStatus(data.status)

        // 更新统计信息 - 从任务数据中提取
        this.statistics = {
          totalInspections: data.totalCheckCount || 0,
          uninspected: (data.totalCheckCount || 0) - (data.passedCount || 0),
          inspected: data.passedCount || 0,
          faultRecords: data.abnormalCount || 0,
          replacedEquipment: data.replacedCount || 0
        }

        // 处理故障列表
        if (data.faultList && Array.isArray(data.faultList)) {
          this.faultList = data.faultList
        } else {
          this.faultList = []
        }

        // 处理检测项目 - 从任务详情中提取
        if (data.details && Array.isArray(data.details)) {
          this.inspectionItems = data.details.map(item => ({
            content: item.maintainContent || item.category || '检测项目',
            result: item.result || '未检测'
          }))

          // 根据检测项目确定已勾选的系统组件
          this.processCheckedComponents(data.details)
        } else {
          this.inspectionItems = [
            { content: '外观,清除异物及周边障碍物', result: '未检测' }
          ]
        }
      }
    },

    // 处理已勾选的组件
    processCheckedComponents(details) {
      if (!details || !Array.isArray(details)) {
        console.log('❌ processCheckedComponents: 没有检测项目数据')
        return
      }

      console.log('🔄 processCheckedComponents: 开始处理检测项目', details)

      // 从检测项目中提取系统信息
      const systemMap = {}
      const componentMap = {}

      details.forEach(item => {
        const systemName = item.system || item.category || '自动喷水灭火系统'
        const componentName = item.device || item.item || '喷头'

        console.log(`📋 处理检测项目: 系统=${systemName}, 组件=${componentName}`)

        if (!systemMap[systemName]) {
          systemMap[systemName] = new Set()
        }
        systemMap[systemName].add(componentName)

        componentMap[componentName] = {
          system: systemName,
          component: componentName
        }
      })

      console.log('📊 系统映射:', systemMap)
      console.log('🔧 组件映射:', componentMap)

      // 更新系统组件数据，标记已勾选的项
      this.systemComponents = this.systemComponents.map(system => {
        const isSystemChecked = systemMap[system.name] && systemMap[system.name].size > 0

        console.log(`🔍 检查系统 ${system.name}: 已勾选=${isSystemChecked}`)

        return {
          ...system,
          checked: isSystemChecked,
          components: system.components.map(component => {
            const isComponentChecked = systemMap[system.name] && systemMap[system.name].has(component.name)
            console.log(`  🔍 检查组件 ${component.name}: 已勾选=${isComponentChecked}`)
            return {
              ...component,
              checked: isComponentChecked
            }
          })
        }
      })

      console.log('✅ 更新后的系统组件数据:', this.systemComponents)

      // 设置默认选中的系统和组件
      const firstCheckedSystem = this.systemComponents.find(s => s.checked)
      if (firstCheckedSystem) {
        this.selectedSystem = firstCheckedSystem.id
        const firstCheckedComponent = firstCheckedSystem.components.find(c => c.checked)
        if (firstCheckedComponent) {
          this.selectedComponent = firstCheckedComponent.id
        }
        console.log(`🎯 设置默认选中: 系统=${this.selectedSystem}, 组件=${this.selectedComponent}`)
      }
    },

    // 更新时间线状态
    updateTimelineStatus(status) {
      const statusMap = {
        '已派发': 0,
        '已到达': 1,
        '开始处置': 2,
        '处置完成提交审批': 3,
        '完成维保': 4,
        '已评价': 5,
        '待处理': 0,
        '处理中': 2,
        '已完成': 4,
        '已评价': 5
      }

      const currentStep = statusMap[status] || 0

      this.timelineSteps.forEach((step, index) => {
        step.completed = index <= currentStep
        step.active = index === currentStep
      })
    },

    // 获取默认任务数据
    getDefaultTaskData() {
      return {
        projectName: '汽车站',
        planType: '月',
        taskName: '2025年9月任务',
        ownerName: '高坪汽车站2',
        status: '待处理',
        maintainer: '陈xx',
        projectManager: 'ljh',
        maintenanceMethod: '系统维保',
        rating: 0,
        evaluation: '暂无',
        maintenanceStatus: '暂无'
      }
    },

    // 获取默认系统组件数据
    getDefaultSystemComponents() {
      return [
        {
          id: 'sprinkler',
          name: '自动喷水灭火系统',
          components: [
            { id: 'sprinkler-head', name: '喷头' },
            { id: 'wet-alarm-valve', name: '湿式报警阀组' },
            { id: 'dry-alarm-valve', name: '干式报警阀组' },
            { id: 'preaction-alarm-valve', name: '预作用报警阀组' },
            { id: 'deluge-alarm-valve', name: '雨淋报警阀组' },
            { id: 'water-flow-indicator', name: '水流指示器' },
            { id: 'end-test-device', name: '末端试水装置' },
            { id: 'system-control-valves', name: '系统所有控制阀门' },
            { id: 'outdoor-valve-well', name: '室外阀门井中控制阀门' }
          ]
        }
      ]
    },

    // 获取任务状态类型
    getTaskStatusType(status) {
      switch (status) {
        case '待处理':
          return 'info'
        case '处理中':
          return 'warning'
        case '已完成':
          return 'success'
        case '已评价':
          return 'success'
        case '已派发':
          return 'primary'
        case '已到达':
          return 'primary'
        case '开始处置':
          return 'warning'
        case '处置完成提交审批':
          return 'warning'
        case '完成维保':
          return 'success'
        default:
          return 'info'
      }
    },

    // 获取检测结果类型
    getInspectionResultType(result) {
      switch (result) {
        case '未检测':
          return 'info'
        case '正常':
          return 'success'
        case '异常':
          return 'danger'
        case '待处理':
          return 'warning'
        default:
          return 'info'
      }
    },

    // 选择系统
    selectSystem(systemId) {
      this.selectedSystem = systemId
      const system = this.systemComponents.find(s => s.id === systemId)
      if (system && system.components && system.components.length > 0) {
        this.selectedComponent = system.components[0].id
        this.loadInspectionItems(systemId, this.selectedComponent)
      }
    },

    // 选择组件
    selectComponent(componentId) {
      this.selectedComponent = componentId
      this.loadInspectionItems(this.selectedSystem, componentId)
    },

    // 加载检测项目
    loadInspectionItems(systemId, componentId) {
      if (!systemId || !componentId) {
        this.inspectionItems = []
        return
      }

      // 从任务详情中筛选出当前组件对应的检测项目
      const currentComponent = this.systemComponents
        .find(s => s.id === systemId)
        ?.components?.find(c => c.id === componentId)

      if (currentComponent) {
        // 从任务详情中筛选出当前组件的检测项目
        const componentInspectionItems = this.inspectionItems.filter(item => {
          // 根据组件名称匹配检测项目
          const componentName = currentComponent.name
          return item.content.includes(componentName) ||
                 item.content.includes('外观') ||
                 item.content.includes('检查') ||
                 item.content.includes('测试')
        })

        if (componentInspectionItems.length > 0) {
          this.inspectionItems = componentInspectionItems
        } else {
          // 如果没有匹配的项目，使用默认检测项目
          this.inspectionItems = [
            { content: '外观,清除异物及周边障碍物', result: '未检测' }
          ]
        }
      } else {
        this.inspectionItems = [
          { content: '外观,清除异物及周边障碍物', result: '未检测' }
        ]
      }
    },

    // 查看故障列表
    viewFaultList() {
      if (this.faultList.length === 0) {
        this.$message.info('暂无故障记录')
        return
      }

      // 这里可以跳转到故障列表页面或显示故障详情弹窗
      this.$message.info(`共有 ${this.faultList.length} 条故障记录`)
    },

    // 查看系统详情
    viewSystemDetail() {
      this.$message.info('查看系统详情功能待实现')
    },

    // 返回
    goBack() {
      this.$router.go(-1)
    },

    // 从计划数据中提取维保内容
    extractMaintenanceContentFromPlan(planData) {
      console.log('🔄 开始从计划数据提取维保内容...')
      console.log('📋 计划数据详情:', planData)
      console.log('📋 计划ID:', planData._id)
      console.log('📋 项目名称:', planData.projectName)

      if (!planData) {
        console.log('❌ 计划数据为空，显示空状态')
        this.maintenanceContentList = []
        return
      }

      // 尝试从计划数据中提取维保内容
      let maintenanceContent = []

      // 检查是否有维保详情数据
      if (planData.details && Array.isArray(planData.details)) {
        console.log('📋 找到计划详情数据，共', planData.details.length, '条')
        console.log('📋 详情数据样本:', planData.details.slice(0, 3)) // 只显示前3条
        maintenanceContent = planData.details.map((item, index) => ({
          systemCategory: item.system || item.category || '消防系统',
          deviceName: item.device || item.item || '维保项目',
          maintainSlim: item.maintainContent || item.content || '检测内容',
          frequency: item.frequency || item.period || '月检',
          inspectionResult: item.result || item.status || '未检测',
          maintainContent: item.standard || item.requirement || '符合相关规范要求'
        }))
      } else if (planData.maintenanceItems && Array.isArray(planData.maintenanceItems)) {
        console.log('📋 找到维保项目数据，共', planData.maintenanceItems.length, '条')
        console.log('📋 维保项目数据样本:', planData.maintenanceItems.slice(0, 3)) // 只显示前3条
        maintenanceContent = planData.maintenanceItems.map((item, index) => ({
          systemCategory: item.systemCategory || item.system || '消防系统',
          deviceName: item.deviceName || item.device || '维保项目',
          maintainSlim: item.maintainSlim || item.content || '检测内容',
          frequency: item.frequency || item.period || '月检',
          inspectionResult: item.inspectionResult || item.result || '未检测',
          maintainContent: item.maintainContent || item.standard || '符合相关规范要求'
        }))
      } else if (planData.checkedMaintList && Array.isArray(planData.checkedMaintList)) {
        console.log('📋 找到已选维保列表数据，共', planData.checkedMaintList.length, '条')
        console.log('📋 已选维保列表数据样本:', planData.checkedMaintList.slice(0, 3)) // 只显示前3条
        maintenanceContent = planData.checkedMaintList.map((item, index) => ({
          systemCategory: item.systemCategory || '消防系统',
          deviceName: item.deviceName || '维保项目',
          maintainSlim: item.maintainSlim || '检测内容',
          frequency: item.frequency || '月检',
          inspectionResult: '未检测', // 默认状态
          maintainContent: item.maintainContent || '符合相关规范要求'
        }))
      } else {
        console.log('❌ 未找到维保内容数据，检查其他可能的字段...')
        console.log('📋 计划数据的所有字段:', Object.keys(planData))

        // 检查是否有其他可能的维保相关字段
        const possibleFields = ['maintenanceItems', 'maintainContent', 'maintenanceContent', 'checkItems', 'inspectionItems', 'taskItems', 'items', 'content']
        let foundField = null

        for (const field of possibleFields) {
          if (planData[field]) {
            console.log(`✅ 找到可能的维保字段: ${field}`, planData[field])
            foundField = field
            break
          }
        }

        if (foundField) {
          // 尝试处理找到的字段
          const fieldData = planData[foundField]
          if (Array.isArray(fieldData)) {
            console.log(`📋 处理字段 ${foundField}，共`, fieldData.length, '条数据')
            console.log(`📋 字段数据样本:`, fieldData.slice(0, 3)) // 只显示前3条
            maintenanceContent = fieldData.map((item, index) => ({
              systemCategory: item.systemCategory || item.category || item.system || '消防系统',
              deviceName: item.deviceName || item.device || item.name || '维保项目',
              maintainSlim: item.maintainSlim || item.content || item.description || '检测内容',
              frequency: item.frequency || item.period || '月检',
              inspectionResult: item.inspectionResult || item.result || item.status || '未检测',
              maintainContent: item.maintainContent || item.standard || item.requirement || '符合相关规范要求'
            }))
          }
        }

        if (maintenanceContent.length === 0) {
          console.log('❌ 没有找到任何维保内容数据，显示空状态')
          // 如果都没有找到，显示空状态而不是默认数据
          this.maintenanceContentList = []
          return
        }
      }

      this.maintenanceContentList = maintenanceContent
      console.log('✅ 成功提取维保内容数据，共', maintenanceContent.length, '条')
      console.log('📋 提取的数据样本:', maintenanceContent.slice(0, 3)) // 只显示前3条
    },

    // 生成默认维保内容数据（当无法从计划数据中提取时使用）
    generateDefaultMaintenanceContent() {
      console.log('🔄 生成默认维保内容数据...')
      this.maintenanceContentList = [
        {
          systemCategory: '疏散指示标志',
          deviceName: '疏散指示标志',
          maintainSlim: '外观和工作状态',
          frequency: '月检',
          inspectionResult: '正常',
          maintainContent: '牢固、无遮挡,疏散方向的指示正确清晰。'
        },
        {
          systemCategory: '自动喷水灭火系统',
          deviceName: '喷头',
          maintainSlim: '外观,清除异物及周边障碍物',
          frequency: '月检',
          inspectionResult: '未检测',
          maintainContent: '喷头外观完好,无变形、损坏,喷头周围无障碍物。'
        }
      ]
    }

  }
}
</script>

<style scoped>
.task-detail-page {
  background: #fff;
  padding: 18px 18px 32px 18px;
  border-radius: 8px;
  min-height: 100vh;
}

.card-block {
  background: #f8f9fb;
  border-radius: 8px;
  padding: 18px 16px 10px 16px;
  margin-bottom: 18px;
  margin-top: 10px;
}

.card-title {
  padding: 12px 18px 12px 18px;
  margin-bottom: 18px;
}

.card-title-txt {
  font-size: 22px;
  font-weight: bold;
  color: #222;
  margin-bottom: 8px;
}

/* 面包屑导航 */
.breadcrumb {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.breadcrumb-item {
  color: #666;
}

.breadcrumb-item.active {
  color: #409EFF;
  font-weight: bold;
}

.breadcrumb-separator {
  margin: 0 8px;
  color: #999;
}

/* 时间戳 */
.timestamp {
  font-size: 14px;
  color: #666;
  text-align: right;
}

/* 任务状态时间线 */
.status-timeline {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.timeline-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.timeline-container::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 30px;
  right: 30px;
  height: 2px;
  background: #e0e0e0;
  z-index: 1;
}

.timeline-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
}

.step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.timeline-step.active .step-circle {
  background: #409EFF;
  color: white;
}

.timeline-step.completed .step-circle {
  background: #409EFF;
  color: white;
}

.step-label {
  font-size: 12px;
  color: #666;
  text-align: center;
  max-width: 80px;
  line-height: 1.2;
}

.timeline-step.active .step-label {
  color: #409EFF;
  font-weight: bold;
}

/* 维保任务详情 */
.task-detail-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #409EFF;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.detail-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.detail-label {
  font-weight: bold;
  color: #666;
  min-width: 120px;
  margin-right: 12px;
}

.detail-value {
  flex: 1;
  color: #333;
}

.rating-stars {
  display: flex;
  gap: 2px;
}

.rating-stars i {
  color: #ddd;
    font-size: 16px;
  }

.rating-stars i.rated {
  color: #f39c12;
}

/* 任务统计信息 */
.task-statistics {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-item {
  display: flex;
  align-items: center;
  flex: 1;
  padding: 16px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: white;
  font-size: 20px;
}

.stat-icon.detection-total {
  background: linear-gradient(135deg, #409EFF, #66b3ff);
}

.stat-icon.uninspected {
  background: linear-gradient(135deg, #909399, #b3b6bc);
}

.stat-icon.inspected {
  background: linear-gradient(135deg, #67C23A, #85ce61);
}

.stat-icon.fault-records {
  background: linear-gradient(135deg, #E6A23C, #ebb563);
}

.stat-icon.replaced-equipment {
  background: linear-gradient(135deg, #409EFF, #66b3ff);
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

/* 检测详情 */
.inspection-detail-section {
  margin-bottom: 30px;
}

.empty-box {
  text-align: center;
  padding: 20px;
  color: #888;
  background: #f8f9fa;
  border: 1px dashed #ddd;
  border-radius: 8px;
  margin-top: 12px;
}

/* 返回按钮 */
.page-header {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.return-btn {
  background: #409EFF;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.return-btn:hover {
  background: #66b3ff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .task-statistics {
    flex-direction: column;
  }

  .timeline-container {
    flex-wrap: wrap;
    gap: 10px;
  }

  .timeline-step {
    flex: 1;
    min-width: 80px;
  }
}
</style>
