<template>
  <div class="task-detail-root">
    <!-- 页面标题卡片 -->
    <div class="card-block card-title">
      <div class="card-title-txt">维保计划管理</div>
      <div class="breadcrumb">
        <span class="breadcrumb-item">业主单位管理</span>
        <span class="breadcrumb-separator">></span>
        <span class="breadcrumb-item">维保计划管理</span>
        <span class="breadcrumb-separator">></span>
        <span class="breadcrumb-item active">计划详情</span>
      </div>
    </div>

    <!-- 返回按钮 -->
    <div class="page-header">
      <el-button class="return-btn" @click="goBack">返回</el-button>
    </div>

    <el-row :gutter="14" style="margin-bottom:16px;">
      <el-col :span="6">
        <el-select v-model="filter.time" placeholder="计划时效" style="width: 100%;">
          <el-option label="全部" value="" />
          <el-option label="正常" value="正常" />
          <el-option label="已逾期" value="已逾期" />
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-select v-model="filter.status" placeholder="计划状态" style="width: 100%;">
          <el-option label="全部" value="" />
          <el-option label="计划已制定" value="计划已制定" />
          <el-option label="任务已生成" value="任务已生成" />
          <el-option label="执行中" value="执行中" />
          <el-option label="已完成" value="已完成" />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
      </el-col>
      <el-col :span="4">
        <el-button icon="el-icon-refresh" @click="onReset">重置</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="tableData" border element-loading-text="加载中...">
      <el-table-column prop="index" label="序号" width="60" align="center" />
      <el-table-column prop="projectName" label="项目名称" align="center" />
      <el-table-column prop="planType" label="计划类型" align="center">
        <template slot-scope="{ row }">
          <el-tag
            :type="row.planType === '月' ? 'primary' : 'warning'"
            size="small"
            style="font-weight: bold;"
          >
            {{ row.planType }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="taskName" label="计划名称" align="center" />
      <el-table-column prop="technicalLeader" label="维保技术负责人" align="center" />
      <el-table-column prop="projectManager" label="维保项目负责人" align="center" />
      <el-table-column prop="maintainer" label="现场维保人员" align="center" />
      <el-table-column prop="status" label="计划状态" align="center">
        <template slot-scope="{ row }">
          <el-tag
            :type="getStatusType(row.status)"
            size="small"
            style="font-weight: bold;"
          >
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isOverdue" label="计划时效" align="center">
        <template slot-scope="{ row }">
          <el-tag
            :type="row.isOverdue === '正常' ? 'success' : 'danger'"
            size="small"
            style="font-weight: bold;"
          >
            {{ row.isOverdue }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="{ row }">
          <el-link type="primary" @click="goDetail(row)">详情</el-link>
          <el-link
            type="success"
            style="margin-left:8px;"
            @click="goDispatchStaff(row)"
          >
            改派人员
          </el-link>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>
<script>
// 计划详情页面，需要导入计划相关API
import { getMaintenancePlan } from '@/api/maintainPlan'

export default {
  name: 'PlanDetail',
  data() {
    return {
      filter: { time: '', status: '' },
      tableData: [],
      allData: [], // 存储所有数据用于筛选
      loading: false,
      planInfo: {} // 存储计划信息
    }
  },
  mounted() {
    this.onLoad()

    // 监听计划数据更新事件（使用window事件代替$bus）
    window.addEventListener('planDataUpdated', this.handlePlanDataUpdated)
  },

  beforeDestroy() {
    // 清理事件监听
    window.removeEventListener('planDataUpdated', this.handlePlanDataUpdated)
  },
  methods: {
    onSearch() {
      // 根据筛选条件过滤数据
      const { time, status } = this.filter
      this.tableData = this.allData.filter(item => {
        const timeMatch = !time || item.isOverdue === time
        const statusMatch = !status || item.status === status
        return timeMatch && statusMatch
      })
      this.$message.success(`查询完成，共找到 ${this.tableData.length} 条记录`)
    },
    async onLoad() {
      const projectId = this.$route.query.projectId
      const projectName = this.$route.query.projectName
      const planId = this.$route.query.planId || this.$route.query.id
      console.log('计划详情页面接收到的参数:', this.$route.query)
      console.log('使用的projectId:', projectId)
      console.log('使用的projectName:', projectName)
      console.log('使用的planId:', planId)

      if (!planId) {
        console.error('❌ 缺少计划ID参数，当前路由参数:', this.$route.query)
        this.$message.error('缺少计划ID参数，无法加载计划详情')
        // 直接返回维保计划管理页面
        setTimeout(() => {
          this.$router.push({ name: 'MaintenancePlan' })
        }, 2000)
        return
      }

      this.loading = true
      try {
        // 根据planId从后端获取具体的计划数据
        console.log('🔄 正在从后端获取计划数据，planId:', planId)
        const response = await getMaintenancePlan(planId)
        console.log('📋 后端返回的计划数据:', response)

        if (response.success && response.data) {
          const planData = response.data
          console.log('✅ 成功获取计划数据:', planData)

          // 使用后端返回的真实数据
          this.showPlanInfoFromBackend(planData)
          this.$message.success('计划数据加载成功')
        } else {
          console.log('❌ 后端返回数据格式错误:', response)
          this.$message.error('获取计划数据失败，请重试')
          this.allData = []
          this.tableData = []
        }
      } catch (error) {
        console.error('❌ 加载计划数据失败:', error)
        console.error('❌ 错误详情:', {
          message: error.message,
          response: error.response,
          status: error.response?.status,
          data: error.response?.data
        })

        if (error.response?.status === 404) {
          this.$message.error('项目或合同不存在，可能已被删除')
        } else {
          this.$message.error(`加载数据失败：${error.msg || error.message || '请重试'}`)
        }

        this.allData = []
        this.tableData = []

        // 如果是404错误，3秒后自动返回
        if (error.response?.status === 404) {
          setTimeout(() => {
            this.$router.push({ name: 'MaintenancePlan' })
          }, 3000)
        }
      } finally {
        this.loading = false
      }
    },

    // 处理计划数据更新事件
    async handlePlanDataUpdated(event) {
      try {
        const updatedPlanData = event.detail
        console.log('收到计划数据更新事件:', updatedPlanData)

        // 重新加载计划数据
        await this.onLoad()

        this.$message.success('计划数据已更新')
      } catch (error) {
        console.error('处理计划数据更新失败:', error)
      }
    },

    // 显示计划信息（使用后端真实数据）
    showPlanInfoFromBackend(planData) {
      console.log('📋 处理后端计划数据:', planData)
      console.log('🔍 检查maintainPersons字段:', planData.maintainPersons)
      console.log('🔍 检查leader字段:', planData.maintainPersons?.leader)
      console.log('🔍 检查maintainers字段:', planData.maintainPersons?.maintainers)
      console.log('🔍 检查technicalLeader字段:', planData.maintainPersons?.technicalLeader)
      console.log('🔍 检查technical字段:', planData.maintainPersons?.technical)

      // 处理维保人员信息
      const getPersonName = (person) => {
        console.log('🔍 处理人员信息:', person)
        if (!person) {
          console.log('❌ 人员信息为空')
          return '未分配'
        }
        if (typeof person === 'string') {
          console.log('✅ 人员信息为字符串:', person)
          return person
        }
        const name = person.name || person.userName || person.fullName || person.displayName || '未知'
        console.log('✅ 提取到人员姓名:', name)
        return name
      }

      // 处理维保人员列表
      const getMaintainersText = (maintainers) => {
        if (!maintainers || !Array.isArray(maintainers)) return '未分配'
        return maintainers.map(m => getPersonName(m)).join('、')
      }

      // 处理计划状态
      const getPlanStatus = (status) => {
        if (!status) return '计划已制定'
        return status
      }

      // 处理计划时效
      const getPlanOverdue = (planData) => {
        // 这里可以根据计划的创建时间或截止时间来判断是否逾期
        // 暂时返回正常，实际应该根据业务逻辑判断
        return '正常'
      }

      // 创建表格数据
      this.allData = [{
        _id: planData._id,
        index: 1,
        projectName: planData.projectName || planData.project?.name || '未知项目',
        planType: planData.planType || '月',
        taskName: planData.planName || planData.name || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}计划`,
        projectManager: getPersonName(
          planData.maintainPersons?.leader ||
          planData.leader ||
          planData.projectManager ||
          planData.manager
        ),
        maintainer: getMaintainersText(
          planData.maintainPersons?.maintainers ||
          planData.maintainers ||
          planData.maintenanceStaff
        ),
        technicalLeader: getPersonName(
          planData.maintainPersons?.technical ||
          planData.maintainPersons?.technicalLeader ||
          planData.technicalLeader ||
          planData.techLeader
        ),
        status: getPlanStatus(planData.planStatus || planData.status),
        isOverdue: getPlanOverdue(planData),
        isPlanData: true, // 标记这是计划数据
        // 保存完整的计划数据，供改派人员使用
        fullPlanData: planData
      }]

      this.tableData = [...this.allData]

      this.planInfo = {
        projectName: planData.projectName || '未知项目',
        ownerName: planData.ownerName || '未知业主',
        planType: planData.planType || '月'
      }

      console.log('✅ 计划数据已处理完成:', {
        allData: this.allData,
        planInfo: this.planInfo
      })
    },

    // 显示计划信息（保留原有方法作为备用）
    showPlanInfo(projectName, projectId, planId) {
      // 创建计划数据显示
      const currentDate = new Date()
      const planMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`

      this.allData = [{
        _id: planId || 'plan_' + Date.now(),
        index: 1,
        projectName: projectName || '未知项目',
        planType: '月',
        taskName: `${planMonth}计划`,
        projectManager: '待分配',
        maintainer: '待分配',
        technicalLeader: '待分配',
        status: '计划已制定',
        isOverdue: '正常',
        isPlanData: true // 标记这是计划数据
      }]

      this.tableData = [...this.allData]

      this.planInfo = {
        projectName: projectName || '未知项目',
        ownerName: '未知业主',
        planType: '月'
      }
    },

    getPersonName(person) {
      if (!person) return '未分配'
      return person.name || person.userName || '未知'
    },
    getStatusType(status) {
      switch (status) {
        case '计划已制定':
          return 'info'
        case '任务已生成':
          return 'primary'
        case '执行中':
          return 'warning'
        case '已完成':
          return 'success'
        // 兼容原有状态
        case '待处理':
          return 'info'
        case '处理中':
          return 'warning'
        case '待审批':
          return 'primary'
        case '获取详情':
          return 'info'
        case '打卡签到':
          return 'primary'
        case '开始维保':
          return 'warning'
        case '完成维保':
          return 'success'
        case '等待审批':
          return 'primary'
        case '完成审批':
          return 'success'
        default:
          return 'info'
      }
    },
    onReset() {
      this.filter = { time: '', status: '' }
      this.tableData = [...this.allData]
      this.$message.success('筛选条件已重置')
    },
    goDispatchStaff(row) {
      console.log('🚀 准备跳转到改派人员页面，行数据:', row)

      // 使用路径参数而不是query参数，因为路由配置需要:id参数
      this.$router.push({
        name: 'DispatchStaff',
        params: {
          id: row._id || this.$route.query.planId
        },
        query: {
          taskId: row._id,
          taskName: row.taskName,
          projectId: this.$route.query.projectId,
          planId: this.$route.query.planId,
          // 传递完整的计划数据
          fullPlanData: row.fullPlanData ? JSON.stringify(row.fullPlanData) : null
        }
      })
    },
    goDetail(row) {
      this.$router.push({
        name: 'MpmTDDetail',
        query: {
          id: row._id,
          projectId: this.$route.query.projectId,
          planId: this.$route.query.planId
        }
      })
    },
    goBack() {
      // 直接跳转到维保计划管理页面，避免路由参数丢失
      this.$router.push({ name: 'MaintenancePlan' })
    }
  }
}
</script>
<style scoped>
.task-detail-root {
  background: #fff;
  padding: 18px 18px 32px 18px;
  border-radius: 8px;
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

.breadcrumb {
  font-size: 14px;
  color: #666;
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

.page-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.return-btn {
  background: #409EFF;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
}

.return-btn:hover {
  background: #66b3ff;
}

</style>
