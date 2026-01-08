<template>
  <div class="task-detail-root">
    <!-- 页面标题卡片 -->
    <div class="card-block card-title">
      <div class="card-title-txt">维保任务列表</div>
      <div class="breadcrumb">
        <span class="breadcrumb-item">业主单位管理</span>
        <span class="breadcrumb-separator">></span>
        <span class="breadcrumb-item">维保计划管理</span>
        <span class="breadcrumb-separator">></span>
        <span class="breadcrumb-item active">任务列表</span>
      </div>
    </div>

    <!-- 返回按钮 -->
    <div class="page-header">
      <el-button class="return-btn" @click="goBack">返回</el-button>
    </div>

    <el-row :gutter="14" style="margin-bottom:16px;">
      <el-col :span="6">
        <el-select v-model="filter.time" placeholder="任务时效" style="width: 100%;">
          <el-option label="全部" value="" />
          <el-option label="正常" value="正常" />
          <el-option label="已逾期" value="已逾期" />
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-select v-model="filter.status" placeholder="任务状态" style="width: 100%;">
          <el-option label="全部" value="" />
          <el-option label="已派发" value="已派发" />
          <el-option label="已到达" value="已到达" />
          <el-option label="处理中" value="处理中" />
          <el-option label="已提交" value="已提交" />
          <el-option label="已完成" value="已完成" />
          <el-option label="已评价" value="已评价" />
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
      <el-table-column type="index" label="序号" width="60" align="center" :index="indexMethod" />
      <el-table-column prop="projectName" label="项目名称" align="center" />
      <el-table-column prop="planType" label="计划类型" align="center">
        <template slot-scope="{ row }">
          <el-tag
            :type="row.planType === '月' ? 'primary' : row.planType === '季度' ? 'warning' : 'success'"
            size="small"
            style="font-weight: bold;"
          >
            {{ row.planType }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="taskMonth" label="任务月份" align="center" />
      <el-table-column label="维保技术负责人" align="center">
        <template slot-scope="{ row }">
          {{ getPersonName(row.maintainPersons && row.maintainPersons.technical) }}
        </template>
      </el-table-column>
      <el-table-column label="维保项目负责人" align="center">
        <template slot-scope="{ row }">
          {{ getPersonName(row.maintainPersons && row.maintainPersons.leader) }}
        </template>
      </el-table-column>
      <el-table-column label="现场维保人员" align="center">
        <template slot-scope="{ row }">
          {{ getMaintainersText(row.maintainPersons && row.maintainPersons.maintainers) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="任务状态" align="center">
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
      <el-table-column prop="isOverdue" label="任务时效" align="center">
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
            v-if="row.status === '已派发' || row.status === '已到达'"
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
// 任务列表页面，需要导入任务相关API
import { getMaintainbyPlan } from '@/api/maintainTask'

export default {
  name: 'TaskList',
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
    indexMethod(index) {
      return index + 1
    },
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
      console.log('任务列表页面接收到的参数:', this.$route.query)
      console.log('使用的projectId:', projectId)
      console.log('使用的projectName:', projectName)
      console.log('使用的planId:', planId)

      if (!planId) {
        console.error('❌ 缺少计划ID参数，当前路由参数:', this.$route.query)
        this.$message.error('缺少计划ID参数，无法加载任务列表')
        // 直接返回维保计划管理页面
        setTimeout(() => {
          this.$router.push({ name: 'MaintenancePlan' })
        }, 2000)
        return
      }

      this.loading = true
      try {
        // 根据planId从后端获取任务列表
        console.log('🔄 正在从后端获取任务列表，planId:', planId)
        const response = await getMaintainbyPlan(planId)
        console.log('📋 后端返回的任务列表数据:', response)

        if (response.success && response.data) {
          const tasks = response.data
          console.log('✅ 成功获取任务列表数据:', tasks)

          // 处理任务数据
          this.processTaskList(tasks)
          this.$message.success(`任务列表加载成功，共 ${tasks.length} 条任务`)
        } else {
          console.log('❌ 后端返回数据格式错误:', response)
          this.$message.error('获取任务列表失败，请重试')
          this.allData = []
          this.tableData = []
        }
      } catch (error) {
        console.error('❌ 加载任务列表失败:', error)
        console.error('❌ 错误详情:', {
          message: error.message,
          response: error.response,
          status: error.response && error.response.status,
          data: error.response && error.response.data
        })

        if (error.response && error.response.status === 404) {
          this.$message.error('计划不存在或该计划下暂无任务')
        } else {
          this.$message.error(`加载数据失败：${error.msg || error.message || '请重试'}`)
        }

        this.allData = []
        this.tableData = []

        // 如果是404错误，3秒后自动返回
        if (error.response && error.response.status === 404) {
          setTimeout(() => {
            this.$router.push({ name: 'MaintenancePlan' })
          }, 3000)
        }
      } finally {
        this.loading = false
      }
    },

    // 处理任务数据
    processTaskList(tasks) {
      this.allData = tasks.map((task, index) => ({
        _id: task._id,
        projectName: task.projectName || (task.project && task.project.name) || '未知项目',
        planType: task.planType || '月',
        taskMonth: task.taskMonth || '',
        status: task.status || '已派发',
        isOverdue: task.isOverdue || '正常',
        maintainPersons: task.maintainPersons || {},
        createdAt: task.createdAt
      }))

      this.tableData = [...this.allData]
      console.log('✅ 任务数据已处理完成:', {
        allData: this.allData,
        tableData: this.tableData
      })
    },

    // 处理计划数据更新事件
    async handlePlanDataUpdated(event) {
      try {
        const updatedPlanData = event.detail
        console.log('收到计划数据更新事件:', updatedPlanData)

        // 重新加载任务数据
        await this.onLoad()

        this.$message.success('任务数据已更新')
      } catch (error) {
        console.error('处理任务数据更新失败:', error)
      }
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
      if (typeof person === 'string') return person
      return person.name || person.userName || '未知'
    },
    getMaintainersText(maintainers) {
      if (!maintainers || !Array.isArray(maintainers)) return '未分配'
      return maintainers.map(m => this.getPersonName(m)).join('、')
    },
    getStatusType(status) {
      switch (status) {
        case '已派发':
          return 'info'
        case '已到达':
          return 'primary'
        case '处理中':
          return 'warning'
        case '已提交':
          return 'success'
        case '已完成':
          return 'success'
        case '已评价':
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
        name: 'MaintenanceTaskDetail',
        params: {
          id: row._id
        },
        query: {
          projectId: this.$route.query.projectId,
          planId: this.$route.query.planId,
          projectName: this.$route.query.projectName
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
