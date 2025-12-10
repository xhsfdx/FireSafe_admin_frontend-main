<template>
  <div class="work-order-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <div class="page-icon">
            <i class="el-icon-warning-outline" />
          </div>
          <div class="title-info">
            <h1 class="page-title">故障工单</h1>
            <p class="page-subtitle">管理和跟踪故障工单的处理进度</p>
          </div>
        </div>
        <div class="header-stats">
          <div class="stat-card stat-total">
            <div class="stat-icon">
              <i class="el-icon-s-data" />
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ filteredData.length }}</div>
              <div class="stat-label">总工单数</div>
            </div>
          </div>
          <div class="stat-card stat-completed">
            <div class="stat-icon">
              <i class="el-icon-circle-check" />
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ getCompletedCount() }}</div>
              <div class="stat-label">已解决</div>
            </div>
          </div>
          <div class="stat-card stat-pending">
            <div class="stat-icon">
              <i class="el-icon-loading" />
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ getPendingCount() }}</div>
              <div class="stat-label">处理中</div>
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
                <i class="el-icon-user" /> 当前所属人
              </label>
              <el-input
                v-model="filters.owner"
                placeholder="请输入当前所属人进行搜索"
                prefix-icon="el-icon-user"
                clearable
              />
            </div>
            <div class="search-item">
              <label class="search-label">
                <i class="el-icon-phone" /> 上报人员
              </label>
              <el-input
                v-model="filters.reporter"
                placeholder="请输入上报人员"
                prefix-icon="el-icon-phone"
                clearable
              />
            </div>
          </div>

          <div class="search-row">
            <div class="search-item">
              <label class="search-label">
                <i class="el-icon-warning-outline" /> 故障来源
              </label>
              <el-select v-model="filters.source" placeholder="请选择故障来源" clearable>
                <el-option label="例行转故障" value="例行转故障" />
                <el-option label="紧急上报" value="紧急上报" />
                <el-option label="日常巡检" value="日常巡检" />
              </el-select>
            </div>
            <div class="search-item">
              <label class="search-label">
                <i class="el-icon-time" /> 工单状态
              </label>
              <el-select v-model="filters.status" placeholder="请选择工单状态" clearable>
                <el-option label="待处理" value="待处理" />
                <el-option label="已接单" value="已接单" />
                <el-option label="已分配" value="已分配" />
                <el-option label="已沟通" value="已沟通" />
                <el-option label="已签到" value="已签到" />
                <el-option label="处理中" value="处理中" />
                <el-option label="已解决" value="已解决" />
                <el-option label="已评价" value="已评价" />
                <el-option label="已关闭" value="已关闭" />
              </el-select>
            </div>
            <div class="search-item">
              <label class="search-label">
                <i class="el-icon-warning" /> 工单时效
              </label>
              <el-select v-model="filters.timeliness" placeholder="请选择工单时效" clearable>
                <el-option label="正常" value="正常" />
                <el-option label="已逾期" value="已逾期" />
              </el-select>
            </div>
          </div>

          <div class="search-row">
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
        <h3><i class="el-icon-s-grid" /> 工单列表</h3>
      </div>

      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="pagedData"
          stripe
          element-loading-text="数据加载中..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          class="work-order-table"
          :header-cell-style="{
            background: '#f5f7fa',
            color: '#606266',
            fontWeight: 'bold',
            fontSize: '14px'
          }"
          empty-text="暂无数据"
        >
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column prop="projectName" label="项目名称" align="center" />
          <el-table-column prop="reportTime" label="上报时间" align="center" />
          <el-table-column prop="source" label="工单来源" align="center" />
          <el-table-column prop="reporter" label="上报人员" align="center" />
          <el-table-column label="工单时效" align="center">
            <template slot-scope="{ row }">
              <el-tag
                :type="getTimelinessType(row.timeliness)"
                size="small"
                style="font-weight: bold;"
              >
                {{ row.timeliness || '正常' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="工单状态" align="center">
            <template slot-scope="{ row }">
              <el-tag
                :type="getWorkOrderStatusType(row.status)"
                size="small"
                style="font-weight: bold;"
              >
                {{ row.status || '待处理' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="owner" label="当前所属人" align="center" />
          <el-table-column label="操作" width="280" align="center">
            <template slot-scope="{ row }">
              <el-link type="primary" @click="viewDetail(row)">详情</el-link>
              <el-link style="margin-left:10px;color:#18b7fc" @click="viewFaultOrderReport(row)">报告预览</el-link>
              <el-dropdown v-if="getAvailableActions(row).length > 0" style="margin-left:10px" @command="(command) => handleAction(command, row)">
                <el-link type="warning">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </el-link>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="action in getAvailableActions(row)"
                    :key="action.command"
                    :command="action.command"
                    :disabled="action.disabled"
                  >
                    {{ action.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-link style="margin-left:10px;color:#ff4d1a" @click="onDelete(row)">删除</el-link>
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

    <!-- 悬浮设置按钮（可注释掉） -->
    <el-button class="setting-btn" type="primary" icon="el-icon-setting" circle @click="onSetting" />
  </div>
</template>

<script>
import {
  getFaultOrders,
  deleteFaultOrder,
  acceptFaultOrder,
  assignFaultOrder,
  markAsResolved,
  rateFaultOrder
} from '@/api/faultOrder'

export default {
  name: 'WorkOrderPage',
  data() {
    return {
      filters: {
        projectName: '',
        owner: '',
        reporter: '',
        source: '',
        status: '',
        timeliness: ''
      },
      tableData: [],
      filteredData: [],
      pagedData: [],
      currentPage: 1,
      pageSize: 10,
      loading: false,
      searchBarVisible: true,
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
        if (this.filters.owner) params.owner = this.filters.owner
        if (this.filters.reporter) params.reporter = this.filters.reporter
        if (this.filters.source) params.source = this.filters.source
        if (this.filters.status) params.status = this.filters.status
        if (this.filters.timeliness) params.timeliness = this.filters.timeliness

        const res = await getFaultOrders(params)
        console.log('故障工单API响应:', res)
        if (res.success) {
          // 检查数据结构，可能是 res.data.list 或 res.data
          const data = res.data?.list || res.data || []

          // 处理数据，确保状态和时效正确显示
          this.tableData = data.map(item => ({
            ...item,
            status: this.getMainStatus(item),
            timeliness: this.calculateTimeliness(item),
            owner: this.getCurrentOwner(item)
          }))

          this.filteredData = this.tableData
          console.log('故障工单表格数据:', this.tableData)
          console.log('故障工单总数:', this.filteredData.length)

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
        this.tableData = []
        this.filteredData = []
        this.pagination.total = 0
        this.$message.error('网络异常或接口出错')
      }
      this.loading = false
      this.updatePagedData()
    },
    onSearch() {
      this.pagination.page = 1
      this.loadData()
    },
    onReset() {
      this.filters = { projectName: '', owner: '', reporter: '', source: '', status: '', timeliness: '' }
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
    viewDetail(row) {
      this.$router.push({
        name: 'FaultOrderDetail',
        params: { id: row._id }
      })
    },
    viewFaultOrderReport(row) {
      // 你可以让 row 里提前配置 reportUrl，也可以写死
      const url = row.reportUrl || '/FaultOrderReports/高坪汽车站消防维保服务故障维修记录表668939350289752064.pdf'
      window.open(url, '_blank')
    },
    async onDelete(row) {
      try {
        await this.$confirm(`确定删除「${row.projectName}」的故障记录吗？`, '提示', { type: 'warning' })
        const res = await deleteFaultOrder(row._id)
        if (res.success) {
          this.$message.success('删除成功')
          this.loadData()
        } else {
          this.$message.error(res.message || '删除失败')
        }
      } catch (err) {
        // 用户取消无需处理
      }
    },
    onSetting() {
      this.$message.info('设置')
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

    // 获取工单状态类型
    getWorkOrderStatusType(status) {
      switch (status) {
        case '待处理':
          return 'info'
        case '处理中':
          return 'warning'
        case '已完成':
          return 'success'
        case '已逾期':
          return 'danger'
        default:
          return 'info'
      }
    },

    // 统计方法
    getCompletedCount() {
      return this.filteredData.filter(item =>
        item.status === '已解决' || item.status === '已评价' || item.status === '已关闭'
      ).length
    },

    getPendingCount() {
      return this.filteredData.filter(item =>
        item.status === '待处理' || item.status === '已接单' || item.status === '已分配' ||
        item.status === '已沟通' || item.status === '已签到' || item.status === '处理中'
      ).length
    },

    getOverdueCount() {
      return this.filteredData.filter(item =>
        item.timeliness === '已逾期'
      ).length
    },

    toggleSearchBar() {
      this.searchBarVisible = !this.searchBarVisible
    },

    // 获取主状态（根据位掩码计算）
    getMainStatus(item) {
      if (!item.statusMask) return '待处理'

      // 根据位掩码判断状态
      if (item.statusMask & 256) return '已关闭' // CLOSED
      if (item.statusMask & 128) return '已评价' // RATED
      if (item.statusMask & 64) return '已解决' // RESOLVED
      if (item.statusMask & 32) return '处理中' // IN_PROGRESS
      if (item.statusMask & 16) return '已签到' // SIGNED_IN
      if (item.statusMask & 8) return '已沟通' // COMMUNICATED
      if (item.statusMask & 4) return '已分配' // ASSIGNED
      if (item.statusMask & 2) return '已接单' // ACCEPTED
      if (item.statusMask & 1) return '待处理' // PENDING

      return '待处理'
    },

    // 计算时效（是否逾期）
    calculateTimeliness(item) {
      if (!item.expectedCompletionTime) return '正常'

      const now = new Date()
      const expectedTime = new Date(item.expectedCompletionTime)

      return now > expectedTime ? '已逾期' : '正常'
    },

    // 获取当前所属人
    getCurrentOwner(item) {
      // 优先显示分配的人员
      if (item.assignedTo && item.assignedTo.length > 0) {
        if (typeof item.assignedTo[0] === 'string') {
          return item.assignedTo[0] // 如果是字符串ID，直接返回
        }
        return item.assignedTo[0].name || '已分配' // 如果是对象，返回name
      }

      // 其次显示接单人员
      if (item.acceptedBy) {
        if (typeof item.acceptedBy === 'string') {
          return item.acceptedBy // 如果是字符串ID，直接返回
        }
        return item.acceptedBy.name || '已接单' // 如果是对象，返回name
      }

      return '未分配'
    },

    // 获取可用操作
    getAvailableActions(row) {
      const actions = []
      const status = row.status || '待处理'

      switch (status) {
        case '待处理':
          actions.push(
            { command: 'accept', label: '接单', disabled: false },
            { command: 'assign', label: '分配', disabled: false }
          )
          break
        case '已接单':
          actions.push(
            { command: 'assign', label: '分配', disabled: false },
            { command: 'communicate', label: '沟通', disabled: false },
            { command: 'signin', label: '签到', disabled: false }
          )
          break
        case '已分配':
          actions.push(
            { command: 'communicate', label: '沟通', disabled: false },
            { command: 'signin', label: '签到', disabled: false }
          )
          break
        case '已沟通':
        case '已签到':
        case '处理中':
          actions.push(
            { command: 'resolve', label: '解决', disabled: false }
          )
          break
        case '已解决':
          actions.push(
            { command: 'rate', label: '评价', disabled: false }
          )
          break
        case '已评价':
          actions.push(
            { command: 'close', label: '关闭', disabled: false }
          )
          break
      }

      return actions
    },

    // 处理操作命令
    async handleAction(command, row) {
      try {
        switch (command) {
          case 'accept':
            await this.acceptOrder(row)
            break
          case 'assign':
            await this.assignOrder(row)
            break
          case 'communicate':
            await this.addCommunication(row)
            break
          case 'signin':
            await this.addSignIn(row)
            break
          case 'resolve':
            await this.markResolved(row)
            break
          case 'rate':
            await this.rateOrder(row)
            break
          case 'close':
            await this.closeOrder(row)
            break
        }
      } catch (error) {
        console.error('操作失败:', error)
        this.$message.error('操作失败，请重试')
      }
    },

    // 接单操作
    async acceptOrder(row) {
      try {
        const res = await acceptFaultOrder(row._id)
        if (res.success) {
          this.$message.success('接单成功')
          this.loadData()
        } else {
          this.$message.error(res.message || '接单失败')
        }
      } catch (error) {
        this.$message.error('接单失败')
      }
    },

    // 分配工单
    async assignOrder(row) {
      // 这里应该打开一个对话框选择工作人员
      this.$prompt('请输入工作人员ID（多个用逗号分隔）:', '分配工单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '请输入工作人员ID'
      }).then(async({ value }) => {
        const staffIds = value.split(',').map(id => id.trim()).filter(id => id)
        const res = await assignFaultOrder(row._id, { staffIds })
        if (res.success) {
          this.$message.success('分配成功')
          this.loadData()
        } else {
          this.$message.error(res.message || '分配失败')
        }
      }).catch(() => {
        this.$message.info('已取消分配')
      })
    },

    // 添加沟通记录
    async addCommunication(row) {
      this.$prompt('请输入沟通内容:', '添加沟通记录', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPattern: /.+/,
        inputErrorMessage: '请输入沟通内容'
      }).then(async({ value }) => {
        // 这里需要当前用户ID，暂时使用固定值
        const staffId = 'current_user_id' // 应该从用户状态获取
        const res = await addCommunicationLog(row._id, { staffId, content: value })
        if (res.success) {
          this.$message.success('沟通记录添加成功')
          this.loadData()
        } else {
          this.$message.error(res.message || '添加沟通记录失败')
        }
      }).catch(() => {
        this.$message.info('已取消添加')
      })
    },

    // 添加签到记录
    async addSignIn(row) {
      // 获取当前位置
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async(position) => {
          try {
            const staffId = 'current_user_id' // 应该从用户状态获取
            const res = await addSignInLog(row._id, {
              staffId,
              longitude: position.coords.longitude,
              latitude: position.coords.latitude
            })
            if (res.success) {
              this.$message.success('签到成功')
              this.loadData()
            } else {
              this.$message.error(res.message || '签到失败')
            }
          } catch (error) {
            this.$message.error('签到失败')
          }
        }, (error) => {
          this.$message.error('无法获取位置信息，签到失败')
        })
      } else {
        this.$message.error('浏览器不支持地理位置服务')
      }
    },

    // 标记为已解决
    async markResolved(row) {
      try {
        await this.$confirm('确定标记该工单为已解决吗？', '提示', { type: 'warning' })
        const res = await markAsResolved(row._id)
        if (res.success) {
          this.$message.success('工单已标记为已解决')
          this.loadData()
        } else {
          this.$message.error(res.message || '操作失败')
        }
      } catch (err) {
        // 用户取消无需处理
      }
    },

    // 评价工单
    async rateOrder(row) {
      this.$prompt('请为工单评分（1-5分）:', '评价工单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'number',
        inputPattern: /^[1-5]$/,
        inputErrorMessage: '请输入1-5之间的数字'
      }).then(async({ value }) => {
        const comment = await new Promise((resolve) => {
          this.$prompt('请输入评价内容（可选）:', '评价工单', {
            confirmButtonText: '确定',
            cancelButtonText: '跳过',
            inputType: 'textarea'
          }).then(({ value: commentValue }) => resolve(commentValue)).catch(() => resolve(''))
        })

        const res = await rateFaultOrder(row._id, { rating: parseInt(value), comment })
        if (res.success) {
          this.$message.success('评价成功')
          this.loadData()
        } else {
          this.$message.error(res.message || '评价失败')
        }
      }).catch(() => {
        this.$message.info('已取消评价')
      })
    },

    // 关闭工单
    async closeOrder(row) {
      try {
        await this.$confirm('确定关闭该工单吗？', '提示', { type: 'warning' })
        // 这里应该调用关闭工单的API
        this.$message.success('工单已关闭')
        this.loadData()
      } catch (err) {
        // 用户取消无需处理
      }
    }
  }
}
</script>

<style scoped>
.work-order-page {
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
  flex-wrap: wrap;
  gap: 24px;
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

.work-order-table {
  border: none;
}

.work-order-table .el-table__header {
  background: #f8fafc;
}

.work-order-table .el-table__header th {
  background: #f8fafc !important;
  color: #374151 !important;
  font-weight: 600 !important;
  font-size: 13px !important;
  border-bottom: 1px solid #e5e7eb !important;
  padding: 16px 12px !important;
}

.work-order-table .el-table__row:hover {
  background: #f8fafc !important;
}

.work-order-table .el-table__row {
  height: 60px;
  transition: all 0.2s ease;
}

.work-order-table .el-table__cell {
  padding: 12px;
  border-bottom: 1px solid #f3f4f6;
  transition: all 0.2s ease;
}

.work-order-table .el-table__row:hover .el-table__cell {
  background: transparent !important;
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

.setting-btn {
  position: fixed;
  right: 32px;
  top: 320px;
  z-index: 10;
  box-shadow: 0 2px 8px #87b7fd33;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .header-content {
    flex-direction: column;
    gap: 24px;
  }

  .header-stats {
    flex-direction: column;
    gap: 16px;
  }

  .search-row {
    flex-direction: column;
  }

  .search-item {
    min-width: 100%;
  }
}

@media (max-width: 768px) {
  .work-order-page {
    padding: 16px 20px;
  }

  .page-header {
    padding: 20px;
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
</style>
