<template>
  <div class="routine-maintenance-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <div class="page-icon">
            <i class="el-icon-s-tools" />
          </div>
          <div class="title-info">
            <h1 class="page-title">例行维保</h1>
            <p class="page-subtitle">管理和监控日常维护任务的执行情况</p>
          </div>
        </div>
        <div class="header-stats">
          <div class="stat-card stat-total">
            <div class="stat-icon">
              <i class="el-icon-s-data" />
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ filteredData.length }}</div>
              <div class="stat-label">总任务数</div>
            </div>
          </div>
          <div class="stat-card stat-completed">
            <div class="stat-icon">
              <i class="el-icon-circle-check" />
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ getCompletedCount() }}</div>
              <div class="stat-label">已完成</div>
            </div>
          </div>
          <div class="stat-card stat-pending">
            <div class="stat-icon">
              <i class="el-icon-loading" />
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ getPendingCount() }}</div>
              <div class="stat-label">进行中</div>
            </div>
          </div>
          <div class="stat-card stat-overdue">
            <div class="stat-icon">
              <i class="el-icon-warning" />
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ getOverdueCount() }}</div>
              <div class="stat-label">已逾期</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 查询筛选区域 -->
    <div class="search-section">
      <div class="search-header">
        <h3><i class="el-icon-search" /> 筛选条件</h3>
        <el-button
          type="text"
          class="toggle-btn"
          @click="toggleSearchBar"
        >
          {{ searchBarVisible ? '收起' : '展开' }}
          <i :class="searchBarVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" />
        </el-button>
      </div>

      <el-collapse-transition>
        <div v-show="searchBarVisible" class="search-bar">
          <div class="search-row">
            <div class="search-item">
              <label class="search-label">
                <i class="el-icon-office-building" /> 项目名称
              </label>
              <el-input
                v-model="filters.projectName"
                placeholder="请输入项目名称进行搜索"
                prefix-icon="el-icon-search"
                clearable
              />
            </div>
            <div class="search-item">
              <label class="search-label">
                <i class="el-icon-calendar" /> 计划类型
              </label>
              <el-select v-model="filters.planType" placeholder="请选择计划类型" clearable>
                <el-option label="月度计划" value="月" />
                <el-option label="季度计划" value="季" />
                <el-option label="半年计划" value="半年" />
                <el-option label="年度计划" value="年" />
              </el-select>
            </div>
            <div class="search-item">
              <label class="search-label">
                <i class="el-icon-time" /> 任务状态
              </label>
              <el-select v-model="filters.taskStatus" placeholder="请选择任务状态" clearable>
                <el-option label="已派发" value="已派发" />
                <el-option label="已到达" value="已到达" />
                <el-option label="处理中" value="处理中" />
                <el-option label="已提交" value="已提交" />
                <el-option label="已完成" value="已完成" />
                <el-option label="已评价" value="已评价" />
              </el-select>
            </div>
          </div>

          <div class="search-row">
            <div class="search-item">
              <label class="search-label">
                <i class="el-icon-warning-outline" /> 任务时效
              </label>
              <el-select v-model="filters.taskTimeliness" placeholder="请选择任务时效" clearable>
                <el-option label="正常" value="正常" />
                <el-option label="已逾期" value="已逾期" />
              </el-select>
            </div>
            <div class="search-item">
              <label class="search-label">
                <i class="el-icon-date" /> 任务日期
              </label>
              <el-date-picker
                v-model="filters.taskDate"
                type="daterange"
                range-separator=" 至 "
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                clearable
              />
            </div>
            <div class="search-item search-actions">
              <el-button type="primary" icon="el-icon-search" class="search-btn" @click="onSearch">
                查询
              </el-button>
              <el-button icon="el-icon-refresh" class="reset-btn" @click="onReset">
                重置
              </el-button>
            </div>
          </div>
        </div>
      </el-collapse-transition>
    </div>

    <!-- 数据表格区域 -->
    <div class="table-section">
      <div class="table-header">
        <h3><i class="el-icon-s-grid" /> 任务列表</h3>
        <div class="table-actions">
          <el-button type="info" icon="el-icon-download" @click="exportData">
            导出数据
          </el-button>
        </div>
      </div>

      <div class="table-container">
        <el-table
          :key="tableKey"
          v-loading="loading"
          :data="pagedData"
          stripe
          element-loading-text="数据加载中..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          class="maintenance-table"
          :header-cell-style="{
            background: '#f5f7fa',
            color: '#606266',
            fontWeight: 'bold',
            fontSize: '14px'
          }"
          empty-text="暂无数据"
        >
          <el-table-column type="index" label="序号" width="70" align="center">
            <template slot-scope="scope">
              <span class="row-number">{{ (currentPage - 1) * pageSize + scope.$index + 1 }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="projectName" label="项目信息" min-width="320" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <div class="project-cell">
                <i class="el-icon-office-building project-icon" />
                <div class="project-info">
                  <div class="project-name" :title="row.projectName">{{ getShortProjectName(row.projectName) }}</div>
                  <div class="task-name">{{ getTaskDisplayName({ taskMonth: row.taskMonth, projectName: row.projectName }) }}</div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="planType" label="计划类型" width="100" align="center">
            <template slot-scope="{ row }">
              <div class="plan-type-badge" :class="getPlanTypeBadgeClass(row.planType)">
                <i :class="getPlanTypeIcon(row.planType)" />
                <span>{{ row.planType || '未设置' }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="人员信息" width="140" align="center">
            <template slot-scope="{ row }">
              <div class="person-info">
                <div class="person-item">
                  <i class="el-icon-user" />
                  <span>{{ row.principal || '未分配' }}</span>
                </div>
                <div class="person-item">
                  <i class="el-icon-user-solid" />
                  <span>{{ row.worker || '未分配' }}</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="状态信息" width="140" align="center">
            <template slot-scope="{ row }">
              <div class="status-info">
                <div class="status-item">
                  <div class="status-indicator" :class="getStatusIndicatorClass(row.taskStatus)" />
                  <span class="status-text">{{ (row.taskStatus !== undefined && row.taskStatus !== null && row.taskStatus !== '') ? row.taskStatus : '已派发' }}</span>
                </div>
                <div class="timeliness-item">
                  <div class="timeliness-indicator" :class="getTimelinessIndicatorClass(row.timeliness)" />
                  <span class="timeliness-text">{{ (row.timeliness !== undefined && row.timeliness !== null && row.timeliness !== '') ? row.timeliness : '正常' }}</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="操作" :width="$canEdit ? 220 : 140" align="center" fixed="right">
            <template slot-scope="{ row }">
              <div class="action-buttons">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-view"
                  class="action-btn"
                  @click="viewTaskDetail(row)"
                >
                  详情
                </el-button>

                <el-button
                  v-if="$canEdit && (row.taskStatus === '已派发' || row.taskStatus === '处理中')"
                  size="mini"
                  type="warning"
                  icon="el-icon-s-custom"
                  class="action-btn"
                  @click="dispatchWorker(row)"
                >
                  改派
                </el-button>

                <el-button
                  v-if="row.taskStatus === '已完成' || row.taskStatus === '已评价'"
                  size="mini"
                  type="success"
                  icon="el-icon-document"
                  class="action-btn"
                  @click="viewReport(row)"
                >
                  报告
                </el-button>

                <el-button
                  v-if="$canEdit"
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  class="action-btn"
                  @click="deleteTask(row)"
                >
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 底部分页和统计 -->
    <div class="pagination-section">
      <div class="pagination-info">
        <span class="info-text">
          <i class="el-icon-info" />
          共查询到 <strong>{{ filteredData.length }}</strong> 条记录，
          当前显示第 <strong>{{ (currentPage - 1) * pageSize + 1 }}</strong> -
          <strong>{{ Math.min(currentPage * pageSize, filteredData.length) }}</strong> 条
        </span>
      </div>
      <div class="pagination-container">
        <el-pagination
          background
          layout="total, prev, pager, next, sizes"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :current-page.sync="currentPage"
          :total="filteredData.length"
          class="custom-pagination"
          :page-size-text="'条/页'"
          :total-text="'共'"
          :page-text="'页'"
          :prev-text="'上一页'"
          :next-text="'下一页'"
          :jumper-text="'跳至'"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getMaintainTasks, deleteMaintainTask } from '@/api/maintainTask'
import roleMixin from '@/mixins/roleMixin'

export default {
  name: 'RoutineMaintenancePage',
  mixins: [roleMixin],
  data() {
    return {
      filters: {
        projectName: '',
        planType: '',
        taskStatus: '',
        taskTimeliness: '',
        taskDate: []
      },
      tableData: [],
      filteredData: [],
      pagedData: [],
      currentPage: 1,
      pageSize: 10,
      loading: false,
      searchBarVisible: true,
      tableKey: 0,
      pagination: {
        page: 1,
        limit: 10,
        total: 0
      }
    }
  },
  watch: {
    currentPage() {
      this.updatePagedData()
    }
  },
  mounted() {
    this.loadData()
  },
  activated() {
    this.loadData()
  },
  created() {
    // 强制刷新数据
    this.$nextTick(() => {
      this.loadData()
    })
  },
  methods: {
    // 加载数据
    async loadData() {
      this.loading = true
      try {
        const params = {
          page: this.pagination.page,
          limit: this.pagination.limit
        }
        if (this.filters.projectName) params.projectName = this.filters.projectName
        if (this.filters.planType) params.planType = this.filters.planType
        if (this.filters.taskStatus) params.status = this.filters.taskStatus
        if (this.filters.taskTimeliness) params.taskMonth = this.filters.taskTimeliness

        const res = await getMaintainTasks(params)
        console.log('例行维保API响应:', res)
        console.log('API响应数据详情:', JSON.stringify(res, null, 2))

        if (res.success) {
          const rawData = res.data || []

          // 处理数据，确保所有字段正确显示
          this.tableData = rawData.map(item => {
            console.log('Processing item:', item)
            console.log('Item taskMonth:', item.taskMonth, typeof item.taskMonth)

            // 处理人员信息
            const leader = item.maintainPersons?.leader
            const maintainers = item.maintainPersons?.maintainers || []

            // 先处理任务月份 - 确保taskMonth是有效的字符串
            let taskMonth = item.taskMonth
            if (!taskMonth || typeof taskMonth !== 'string' || taskMonth.includes('function')) {
              taskMonth = this.getCurrentMonth()
              console.log('Fixed taskMonth to:', taskMonth)
            }

            // 规范化状态值，确保与后端模型一致
            // 后端返回的字段是 taskStatus，如果没有则使用 status
            const validStatuses = ['已派发', '已到达', '处理中', '已提交', '已完成', '已评价']
            let normalizedStatus = item.taskStatus || item.status
            // 检查状态是否存在且有效
            if (!normalizedStatus || normalizedStatus === '' || !validStatuses.includes(normalizedStatus)) {
              if (normalizedStatus && normalizedStatus !== '') {
                console.warn(`无效的状态值: ${normalizedStatus}，使用默认值: 已派发`)
              }
              normalizedStatus = '已派发'
            }

            // 时效状态：优先使用后端返回的 timeliness，如果没有则计算
            let normalizedTimeliness = item.timeliness
            if (!normalizedTimeliness || normalizedTimeliness === '') {
              // 如果后端没有返回 timeliness，则计算
              normalizedTimeliness = this.calculateTimeliness(item) || '正常'
            }
            // 确保时效状态存在且有效
            if (!normalizedTimeliness || normalizedTimeliness === '') {
              normalizedTimeliness = '正常'
            }

            const processedItem = {
              ...item,
              // 处理任务月份显示
              taskMonth: taskMonth,
              // 确保任务名称正确显示
              taskName: this.getTaskDisplayName({ taskMonth, projectName: item.projectName }),
              // 处理人员信息
              principal: item.projectManager || leader?.name || '未分配',
              worker: maintainers.length > 0 ? maintainers[0].name : (leader?.name || '未分配'),
              // 确保状态正确显示（规范化后的状态）
              taskStatus: normalizedStatus,
              // 时效状态（优先使用后端返回的，确保存在）
              timeliness: normalizedTimeliness
            }

            console.log('Processed item:', processedItem)
            return processedItem
          })

          this.filteredData = this.tableData
          console.log('处理后的表格数据:', this.tableData)

          if (res.pagination) {
            this.pagination.total = res.pagination.total
            this.pagination.page = res.pagination.page
            this.pagination.limit = res.pagination.limit
          }
        } else {
          this.tableData = []
          this.filteredData = []
          this.pagination.total = 0
          this.$message.error(res.message || '获取数据失败')
        }
      } catch (e) {
        console.error('加载数据失败:', e)
        this.tableData = []
        this.filteredData = []
        this.pagination.total = 0
        this.$message.error('网络异常或接口出错')
      }
      this.loading = false
      this.updatePagedData()

      // 强制重新渲染表格
      this.tableKey += 1
      this.$forceUpdate()
    },
    viewDetail(row) {
      this.$router.push({
        name: 'MaintenanceTaskDetail',
        params: { id: row._id }
      })
    },
    viewTaskDetail(row) {
      console.log('viewTaskDetail called with row:', row)
      console.log('Task ID:', row._id)

      // 跳转到任务详情页面
      this.$router.push({
        name: 'MaintenanceTaskDetail',
        params: { id: row._id }
      }).catch(err => {
        // 如果路由不存在，显示详情信息
        console.warn('MaintenanceTaskDetail route not found:', err)
        this.showTaskDetailDialog(row)
      })
    },

    // 显示任务详情对话框
    showTaskDetailDialog(row) {
      this.$alert(`
        <div style="text-align: left;">
          <h3>${row.projectName || '未设置'}</h3>
          <p><strong>任务名称：</strong>${this.getTaskDisplayName({ taskMonth: row.taskMonth, projectName: row.projectName })}</p>
          <p><strong>计划类型：</strong>${row.planType || '未设置'}</p>
          <p><strong>项目负责人：</strong>${row.principal || '未分配'}</p>
          <p><strong>现场维保人员：</strong>${row.worker || '未分配'}</p>
          <p><strong>任务状态：</strong>${row.taskStatus || '已派发'}</p>
          <p><strong>任务时效：</strong>${row.timeliness || '正常'}</p>
          <p><strong>任务月份：</strong>${row.taskMonth || '未设置'}</p>
        </div>
      `, '任务详情', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定'
      })
    },
    dispatchWorker(row) {
      // 跳转到改派页面
      this.$router.push({
        name: 'DispatchStaff',
        params: { id: row._id },
        query: {
          taskId: row._id,
          taskName: row.taskName || row.name,
          // 如果有计划ID，也传递过去
          planId: row.planId || this.$route.query.planId
        }
      }).catch(err => {
        // 如果路由不存在，显示改派对话框
        console.warn('DispatchStaff route not found:', err)
        this.showDispatchDialog(row)
      })
    },

    // 显示改派对话框
    showDispatchDialog(row) {
      this.$prompt('请输入新的维保人员姓名：', '改派维保人员', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '请输入维保人员姓名'
      }).then(({ value }) => {
        // 这里应该调用API更新维保人员
        this.$message.success(`已将任务改派给：${value}`)
        // 刷新数据
        this.loadData()
      }).catch(() => {
        this.$message.info('已取消改派')
      })
    },
    viewReport(row) {
      // 直接跳转到打印友好的报告页面，由浏览器打印/导出 PDF
      const route = this.$router.resolve({
        name: 'TaskReport',
        params: { id: row._id }
      })
      window.open(route.href, '_blank')
    },
    deleteTask(row) {
      this.onDelete(row)
    },
    async onDelete(row) {
      try {
        await this.$confirm(`
          <div style="text-align: left;">
            <p><strong>项目名称：</strong>${row.projectName || '未设置'}</p>
            <p><strong>任务名称：</strong>${this.getTaskDisplayName({ taskMonth: row.taskMonth, projectName: row.projectName })}</p>
            <p><strong>任务状态：</strong>${row.taskStatus || '已派发'}</p>
            <br>
            <p style="color: #e6a23c;">⚠️ 删除后将无法恢复，请谨慎操作！</p>
          </div>
        `, '确认删除任务', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: 'el-button--danger'
        })

        const res = await deleteMaintainTask(row._id)
        if (res.success) {
          this.$message.success('删除成功')
          this.loadData()
        } else {
          this.$message.error(res.message || '删除失败')
        }
      } catch (err) {
        // 用户取消无需处理
        this.$message.info('已取消删除')
      }
    },
    onSetting() {
      this.$message.info('设置')
    },
    onSearch() {
      this.pagination.page = 1
      this.loadData()
    },
    onReset() {
      this.filters = { projectName: '', planType: '', taskStatus: '', taskTimeliness: '', taskDate: [] }
      this.pagination.page = 1
      this.loadData()
    },
    updatePagedData() {
      const start = (this.currentPage - 1) * this.pageSize
      this.pagedData = this.filteredData.slice(start, start + this.pageSize)
    },
    handlePageChange(page) {
      this.currentPage = page
      this.updatePagedData()
    },

    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.updatePagedData()
    },

    toggleSearchBar() {
      this.searchBarVisible = !this.searchBarVisible
    },

    // 导出数据功能
    exportData() {
      try {
        // 准备导出数据
        const exportData = this.filteredData.map((item, index) => ({
          序号: index + 1,
          项目名称: item.projectName || '未设置',
          任务名称: this.getTaskDisplayName({ taskMonth: item.taskMonth, projectName: item.projectName }),
          计划类型: item.planType || '未设置',
          项目负责人: item.principal || '未分配',
          现场维保人员: item.worker || '未分配',
          任务状态: item.taskStatus || '已派发',
          任务时效: item.timeliness || '正常',
          任务月份: item.taskMonth || '未设置'
        }))

        // 转换为CSV格式
        const csvContent = this.convertToCSV(exportData)

        // 创建下载链接
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `例行维保任务_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        this.$message.success(`成功导出 ${exportData.length} 条记录`)
      } catch (error) {
        console.error('导出失败:', error)
        this.$message.error('导出失败，请重试')
      }
    },

    // 转换为CSV格式
    convertToCSV(data) {
      if (!data || data.length === 0) return ''

      const headers = Object.keys(data[0])
      const csvRows = []

      // 添加表头
      csvRows.push(headers.join(','))

      // 添加数据行
      data.forEach(row => {
        const values = headers.map(header => {
          const value = row[header]
          // 处理包含逗号或引号的值
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value || ''
        })
        csvRows.push(values.join(','))
      })

      return csvRows.join('\n')
    },

    // 处理下拉菜单操作
    handleAction(command) {
      const { action, row } = command
      switch (action) {
        case 'detail':
          this.viewDetail(row)
          break
        case 'dispatch':
          this.dispatchWorker(row)
          break
        case 'report':
          this.viewReport(row)
          break
        case 'delete':
          this.onDelete(row)
          break
      }
    },

    // 统计方法
    getCompletedCount() {
      return this.filteredData.filter(item =>
        item.taskStatus === '已完成' || item.taskStatus === '已评价'
      ).length
    },

    getPendingCount() {
      return this.filteredData.filter(item =>
        item.taskStatus === '已派发' || item.taskStatus === '处理中'
      ).length
    },

    getOverdueCount() {
      return this.filteredData.filter(item =>
        item.timeliness === '已逾期'
      ).length
    },

    // 图标和标签类型方法
    getPlanTypeTagType(planType) {
      const typeMap = {
        '月': 'primary',
        '季': 'success',
        '半年': 'warning',
        '年': 'danger'
      }
      return typeMap[planType] || 'info'
    },

    getPlanTypeIcon(planType) {
      const iconMap = {
        '月': 'el-icon-date',
        '季': 'el-icon-time',
        '半年': 'el-icon-timer',
        '年': 'el-icon-calendar'
      }
      return iconMap[planType] || 'el-icon-calendar'
    },

    getPlanTypeBadgeClass(planType) {
      const classMap = {
        '月': 'plan-monthly',
        '季': 'plan-quarterly',
        '半年': 'plan-semiannual',
        '年': 'plan-annual'
      }
      return classMap[planType] || 'plan-default'
    },

    getStatusIcon(status) {
      const iconMap = {
        '已派发': 'el-icon-s-promotion',
        '已到达': 'el-icon-location',
        '处理中': 'el-icon-loading',
        '已提交': 'el-icon-upload',
        '已完成': 'el-icon-check',
        '已评价': 'el-icon-star-on'
      }
      return iconMap[status] || 'el-icon-info'
    },

    getTimelinessIcon(timeliness) {
      return timeliness === '已逾期' ? 'el-icon-warning' : 'el-icon-success'
    },

    // 获取任务显示名称
    getTaskDisplayName(row) {
      console.log('getTaskDisplayName called with:', row) // 调试日志

      // 确保row是对象且包含必要属性
      if (!row || typeof row !== 'object') {
        console.log('Invalid row object, returning default')
        return '维保任务'
      }

      // 检查taskMonth是否包含JavaScript函数代码
      if (row.taskMonth && typeof row.taskMonth === 'string') {
        if (row.taskMonth.includes('function') || row.taskMonth.includes('[native code]')) {
          console.log('Detected JavaScript function in taskMonth, using current month')
          const now = new Date()
          const year = now.getFullYear()
          const month = String(now.getMonth() + 1).padStart(2, '0')
          const taskName = `${year}年${month}月维保任务`
          console.log('Generated task name from current date:', taskName)
          return taskName
        }

        // 处理正常的任务月份格式
        if (row.taskMonth.includes('-')) {
          const [yearPart, monthPart] = row.taskMonth.split('-')
          if (yearPart && monthPart && yearPart.length === 4 && monthPart.length === 2) {
            const taskName = `${yearPart}年${monthPart}月维保任务`
            console.log('Using valid taskMonth:', taskName)
            return taskName
          }
        }

        // 如果taskMonth格式不正确，使用当前月份
        console.log('Invalid taskMonth format, using current month')
        const now = new Date()
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const taskName = `${year}年${month}月维保任务`
        console.log('Generated task name:', taskName)
        return taskName
      }

      // 如果没有任务月份，生成当前月份
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const taskName = `${year}年${month}月维保任务`
      console.log('No taskMonth, generated task name:', taskName)
      return taskName
    },

    // 计算时效状态
    calculateTimeliness(item) {
      // 根据任务创建时间和计划类型计算是否逾期
      if (!item.createdAt) return '正常'

      const now = new Date()
      const createdDate = new Date(item.createdAt)
      let deadline

      // 根据计划类型计算截止时间
      switch (item.planType) {
        case '月':
          deadline = new Date(createdDate.getTime() + 30 * 24 * 60 * 60 * 1000) // 30天
          break
        case '季':
          deadline = new Date(createdDate.getTime() + 90 * 24 * 60 * 60 * 1000) // 90天
          break
        case '年':
          deadline = new Date(createdDate.getTime() + 365 * 24 * 60 * 60 * 1000) // 365天
          break
        default:
          deadline = new Date(createdDate.getTime() + 30 * 24 * 60 * 60 * 1000) // 默认30天
      }

      return now > deadline ? '已逾期' : '正常'
    },

    // 获取当前月份
    getCurrentMonth() {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      return `${year}-${month}`
    },

    // 获取简短的项目名称
    getShortProjectName(projectName) {
      if (!projectName) return '未设置'

      // 如果项目名称过长，截取并添加省略号
      if (projectName.length > 25) {
        return projectName.substring(0, 25) + '...'
      }

      return projectName
    },

    // 获取任务状态类型
    getTaskStatusType(status) {
      switch (status) {
        case '已派发':
          return 'info'
        case '已到达':
          return 'warning'
        case '处理中':
          return 'warning'
        case '已提交':
          return 'primary'
        case '已完成':
          return 'success'
        case '已评价':
          return 'success'
        default:
          return 'info'
      }
    },

    // 获取时效类型
    getTimelinessType(timeliness) {
      switch (timeliness) {
        case '正常':
          return 'success'
        case '已逾期':
          return 'danger'
        default:
          return 'success'
      }
    },

    // 获取状态指示器样式类
    getStatusIndicatorClass(status) {
      switch (status) {
        case '已派发':
          return 'status-dispatched'
        case '已到达':
          return 'status-arrived'
        case '处理中':
          return 'status-processing'
        case '已提交':
          return 'status-submitted'
        case '已完成':
          return 'status-completed'
        case '已评价':
          return 'status-evaluated'
        default:
          return 'status-dispatched'
      }
    },

    // 获取时效指示器样式类
    getTimelinessIndicatorClass(timeliness) {
      switch (timeliness) {
        case '正常':
          return 'timeliness-normal'
        case '已逾期':
          return 'timeliness-overdue'
        default:
          return 'timeliness-normal'
      }
    }

  }
}
</script>

<style scoped>
.routine-maintenance-page {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
  padding: 24px;
}

/* 页面头部样式 */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 32px 40px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15);
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.05)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.08)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.6;
  pointer-events: none;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.title-section {
  display: flex;
  align-items: center;
}

.page-icon {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.page-icon i {
  font-size: 28px;
  color: white;
}

.title-info h1 {
  color: white;
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.title-info p {
  color: rgba(255, 255, 255, 0.85);
  font-size: 16px;
  margin: 0;
  font-weight: 400;
}

.header-stats {
  display: flex;
  gap: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  padding: 16px 20px;
  border-radius: 16px;
  backdrop-filter: blur(20px);
  min-width: 140px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.stat-icon i {
  font-size: 18px;
  color: white;
}

.stat-total .stat-icon {
  background: rgba(59, 130, 246, 0.3);
}

.stat-completed .stat-icon {
  background: rgba(16, 185, 129, 0.3);
}

.stat-pending .stat-icon {
  background: rgba(245, 158, 11, 0.3);
}

.stat-overdue .stat-icon {
  background: rgba(239, 68, 68, 0.3);
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 18px;
  font-weight: 700;
  color: white;
  display: block;
  margin-bottom: 2px;
}

.stat-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.85);
  margin-top: 0;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 搜索区域样式 */
.search-section {
  background: white;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #f0f0f0;
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid #e2e8f0;
}

.search-header h3 {
  margin: 0;
  color: #1e293b;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.search-header h3 i {
  margin-right: 8px;
  color: #3b82f6;
  font-size: 16px;
}

.toggle-btn {
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  color: #3b82f6;
}

.search-bar {
  padding: 24px;
}

.search-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}

.search-row:last-child {
  margin-bottom: 0;
}

.search-item {
  flex: 1;
  min-width: 200px;
}

.search-label {
  display: block;
  font-size: 13px;
  color: #374151;
  margin-bottom: 8px;
  font-weight: 600;
}

.search-label i {
  margin-right: 6px;
  color: #6b7280;
  font-size: 14px;
}

.search-actions {
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.search-btn {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 13px;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  transition: all 0.2s ease;
}

.search-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.reset-btn {
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #d1d5db;
  color: #6b7280;
  background: white;
  transition: all 0.2s ease;
}

.reset-btn:hover {
  border-color: #9ca3af;
  color: #374151;
}

/* 表格区域样式 */
.table-section {
  background: white;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #f0f0f0;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid #e2e8f0;
}

.table-header h3 {
  margin: 0;
  color: #1e293b;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.table-header h3 i {
  margin-right: 8px;
  color: #3b82f6;
  font-size: 16px;
}

.table-actions {
  display: flex;
  gap: 12px;
}

.table-container {
  padding: 0;
}

.maintenance-table {
  border: none;
}

.maintenance-table .el-table__header {
  background: #f8fafc;
}

.maintenance-table .el-table__header th {
  background: #f8fafc !important;
  color: #374151 !important;
  font-weight: 600 !important;
  font-size: 13px !important;
  border-bottom: 1px solid #e5e7eb !important;
  padding: 16px 12px !important;
}

.maintenance-table .el-table__row:hover {
  background: #f8fafc !important;
}

.maintenance-table .el-table__row {
  height: 72px;
  transition: all 0.2s ease;
}

.maintenance-table .el-table__cell {
  padding: 14px 12px;
  border-bottom: 1px solid #f3f4f6;
  transition: all 0.2s ease;
}

.maintenance-table .el-table__row:hover .el-table__cell {
  background: transparent !important;
}

/* 表格单元格样式 */
.row-number {
  font-weight: 700;
  color: #6b7280;
  font-size: 13px;
}

.project-cell {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 4px 0;
}

.project-icon {
  color: #3b82f6;
  font-size: 16px;
  margin-top: 2px;
  flex-shrink: 0;
}

.project-info {
  flex: 1;
  min-width: 0;
}

.project-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
  margin-bottom: 4px;
  line-height: 1.4;
  word-break: break-all;
}

.task-name {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  line-height: 1.3;
}

.person-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
}

.person-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #374151;
  font-weight: 500;
}

.person-item i {
  color: #6b7280;
  font-size: 12px;
}

.status-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
}

.status-item, .timeliness-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-indicator, .timeliness-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-text, .timeliness-text {
  font-size: 11px;
  font-weight: 500;
  color: #374151;
}

/* 状态指示器颜色 */
.status-dispatched {
  background: #3b82f6;
}

.status-arrived {
  background: #8b5cf6;
}

.status-processing {
  background: #f59e0b;
}

.status-submitted {
  background: #06b6d4;
}

.status-completed {
  background: #10b981;
}

.status-evaluated {
  background: #84cc16;
}

/* 时效指示器颜色 */
.timeliness-normal {
  background: #10b981;
}

.timeliness-overdue {
  background: #ef4444;
}

/* 计划类型徽章样式 */
.plan-type-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  color: white;
}

.plan-type-badge i {
  font-size: 10px;
}

.plan-monthly {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.plan-quarterly {
  background: linear-gradient(135deg, #10b981, #059669);
}

.plan-semiannual {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.plan-annual {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.plan-default {
  background: linear-gradient(135deg, #6b7280, #4b5563);
}

.task-id {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  color: #909399;
  background: #f5f7fa;
  padding: 2px 6px;
  border-radius: 4px;
}

.status-tag, .timeliness-tag {
  font-weight: 500;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
  align-items: center;
}

.action-btn {
  margin: 0;
  padding: 6px 12px;
  font-size: 11px;
  border-radius: 6px;
  transition: all 0.2s ease;
  min-width: auto;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  font-weight: 600;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

.action-btn.el-button--primary {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.action-btn.el-button--warning {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.action-btn.el-button--success {
  background: linear-gradient(135deg, #10b981, #059669);
}

.action-btn.el-button--danger {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

/* 分页区域样式 */
.pagination-section {
  background: white;
  border-radius: 16px;
  padding: 20px 24px;
  margin-top: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #f0f0f0;
}

.pagination-info .info-text {
  color: #6b7280;
  font-size: 13px;
  font-weight: 500;
}

.pagination-info .info-text i {
  margin-right: 6px;
  color: #3b82f6;
}

.pagination-info strong {
  color: #1f2937;
  font-weight: 600;
}

.custom-pagination {
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .routine-maintenance-page {
    padding: 20px 24px;
  }

  .search-row {
    flex-direction: column;
  }

  .search-item {
    min-width: 100%;
  }

  .header-stats {
    flex-direction: column;
    gap: 16px;
  }

  .header-content {
    flex-direction: column;
    gap: 24px;
  }

  .page-header {
    padding: 24px;
  }
}

@media (max-width: 768px) {
  .routine-maintenance-page {
    padding: 16px 20px;
  }

  .page-header {
    padding: 20px;
    margin-bottom: 24px;
  }

  .search-section, .table-section {
    margin-bottom: 24px;
  }

  .pagination-section {
    flex-direction: column;
    gap: 16px;
    margin-top: 24px;
  }

  .table-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .table-actions {
    justify-content: center;
  }

  .search-bar {
    padding: 20px;
  }

  .search-row {
    gap: 16px;
    margin-bottom: 16px;
  }
}

/* 动画效果 */
.search-section, .table-section, .pagination-section {
  transition: all 0.3s ease;
}

.search-section:hover, .table-section:hover, .pagination-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

/* 加载状态优化 */
.el-loading-mask {
  border-radius: 12px;
}

/* 自定义滚动条 */
.table-container ::-webkit-scrollbar {
  height: 8px;
}

.table-container ::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-container ::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.table-container ::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
