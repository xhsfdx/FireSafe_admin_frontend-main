<template>
  <div class="additional-support-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <div class="page-icon">
            <i class="el-icon-s-tools"></i>
          </div>
          <div class="title-info">
            <h1 class="page-title">额外维护支持</h1>
            <p class="page-subtitle">管理和跟踪额外的维护服务请求</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 查询筛选区域 -->
    <div class="search-section">
      <div class="search-header">
        <h3><i class="el-icon-search"></i> 筛选条件</h3>
        <el-button 
          type="text" 
          @click="toggleSearchBar"
          class="toggle-btn"
        >
          {{ searchBarVisible ? '收起' : '展开' }}
          <i :class="searchBarVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        </el-button>
      </div>
      
      <el-collapse-transition>
        <div v-show="searchBarVisible" class="search-bar">
          <div class="search-row">
            <div class="search-item">
              <label class="search-label">
                <i class="el-icon-office-building"></i> 项目名称
              </label>
              <el-input v-model="filters.projectName" placeholder="请输入项目名称进行搜索" prefix-icon="el-icon-search" clearable />
            </div>
            <div class="search-item">
              <label class="search-label">
                <i class="el-icon-user"></i> 当前所属人
              </label>
              <el-input v-model="filters.owner" placeholder="请输入当前所属人进行搜索" prefix-icon="el-icon-user" clearable />
            </div>
            <div class="search-item">
              <label class="search-label">
                <i class="el-icon-phone"></i> 上报人员
              </label>
              <el-input v-model="filters.reporter" placeholder="请输入上报人员" prefix-icon="el-icon-phone" clearable />
            </div>
          </div>
          
          <div class="search-row">
            <div class="search-item">
              <label class="search-label">
                <i class="el-icon-warning-outline"></i> 支持类型
              </label>
              <el-select v-model="filters.supportType" placeholder="请选择支持类型" clearable>
                <el-option label="技术咨询" value="技术咨询" />
                <el-option label="设备维修" value="设备维修" />
                <el-option label="培训服务" value="培训服务" />
                <el-option label="应急响应" value="应急响应" />
              </el-select>
            </div>
            <div class="search-item">
              <label class="search-label">
                <i class="el-icon-time"></i> 工单状态
              </label>
              <el-select v-model="filters.status" placeholder="请选择工单状态" clearable>
                <el-option label="待处理" value="待处理" />
                <el-option label="处理中" value="处理中" />
                <el-option label="已完成" value="已完成" />
                <el-option label="已关闭" value="已关闭" />
              </el-select>
            </div>
            <div class="search-item">
              <label class="search-label">
                <i class="el-icon-warning"></i> 工单时效
              </label>
              <el-select v-model="filters.timeliness" placeholder="请选择工单时效" clearable>
                <el-option label="正常" value="正常" />
                <el-option label="已逾期" value="已逾期" />
              </el-select>
            </div>
          </div>
          
          <div class="search-row">
            <div class="search-item search-actions">
              <el-button type="primary" icon="el-icon-search" @click="onSearch" class="search-btn">
                查询
              </el-button>
              <el-button icon="el-icon-refresh" @click="onReset" class="reset-btn">
                重置
              </el-button>
            </div>
          </div>
        </div>
      </el-collapse-transition>
    </div>

    <!-- 统计信息 -->
    <div class="stats-section">
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-icon pending">
            <i class="el-icon-time"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.total }}</div>
            <div class="stat-label">总支持请求</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon processing">
            <i class="el-icon-loading"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.processing }}</div>
            <div class="stat-label">处理中</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon completed">
            <i class="el-icon-circle-check"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.completed }}</div>
            <div class="stat-label">已完成</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon overdue">
            <i class="el-icon-warning"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.overdue }}</div>
            <div class="stat-label">已逾期</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 表格区域 -->
    <div class="table-section">
      <div class="table-header">
        <div class="table-title">
          <h3><i class="el-icon-s-order"></i> 支持请求列表</h3>
          <span class="record-count">共 {{ pagination.total }} 条记录</span>
        </div>
        <div class="table-actions">
          <el-button-group>
            <el-button size="small" icon="el-icon-refresh" @click="refreshData">
              刷新
            </el-button>
            <el-button size="small" icon="el-icon-download" @click="exportTable">
              导出
            </el-button>
          </el-button-group>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }"
        :row-style="{ height: '65px' }"
        @selection-change="handleSelectionChange"
        empty-text="暂无数据"
      >
        <el-table-column type="selection" width="55" />
        
        <el-table-column label="工单编号" prop="faultOrderId" width="140" fixed="left">
          <template slot-scope="scope">
            <el-link type="primary" @click="viewDetail(scope.row)">
              {{ scope.row.faultOrderId }}
            </el-link>
          </template>
        </el-table-column>
        
        <el-table-column label="项目名称" prop="projectName" min-width="200" show-overflow-tooltip />
        
        <el-table-column label="支持类型" prop="supportType" width="120">
          <template slot-scope="scope">
            <el-tag :type="getSupportTypeTag(scope.row.supportType)">
              {{ scope.row.supportType || '未分类' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="当前所属人" prop="owner" width="120">
          <template slot-scope="scope">
            <div class="owner-info">
              <el-avatar :size="30" icon="el-icon-user-solid" />
              <span class="owner-name">{{ scope.row.owner || '未分配' }}</span>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="上报人员" prop="reporter" width="120" />
        
        <el-table-column label="工单状态" prop="status" width="120">
          <template slot-scope="scope">
            <el-tag :type="getStatusTagType(scope.row.status)" size="medium">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="工单时效" prop="timeliness" width="120">
          <template slot-scope="scope">
            <el-tag :type="scope.row.timeliness === '已逾期' ? 'danger' : 'success'" size="medium">
              <i :class="scope.row.timeliness === '已逾期' ? 'el-icon-warning' : 'el-icon-circle-check'"></i>
              {{ scope.row.timeliness }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="优先级" prop="priority" width="100">
          <template slot-scope="scope">
            <el-tag :type="getPriorityTag(scope.row.priority)" size="small">
              {{ scope.row.priority || '普通' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="上报时间" prop="reportTime" width="160">
          <template slot-scope="scope">
            <div class="time-info">
              <div class="time-date">{{ formatDate(scope.row.reportTime) }}</div>
              <div class="time-time">{{ formatTime(scope.row.reportTime) }}</div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <div class="action-buttons">
              <el-button size="mini" type="primary" @click="viewDetail(scope.row)">
                <i class="el-icon-view"></i> 详情
              </el-button>
              <el-button 
                size="mini" 
                type="success" 
                v-if="scope.row.status === '待处理'"
                @click="assignSupport(scope.row)"
              >
                <i class="el-icon-user"></i> 分配
              </el-button>
              <el-button 
                size="mini" 
                type="warning" 
                v-if="scope.row.status === '处理中'"
                @click="completeSupport(scope.row)"
              >
                <i class="el-icon-circle-check"></i> 完成
              </el-button>
              <el-dropdown trigger="click" @command="(command) => handleAction(command, scope.row)">
                <el-button size="mini">
                  更多<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="edit">
                    <i class="el-icon-edit"></i> 编辑
                  </el-dropdown-item>
                  <el-dropdown-item command="history">
                    <i class="el-icon-time"></i> 历史记录
                  </el-dropdown-item>
                  <el-dropdown-item command="delete" divided>
                    <i class="el-icon-delete"></i> 删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagination.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          :page-size-text="'条/页'"
          :total-text="'共'"
          :page-text="'页'"
          :prev-text="'上一页'"
          :next-text="'下一页'"
          :jumper-text="'跳至'"
        />
      </div>
    </div>

    <!-- 无数据时自定义内容 -->
    <div
      v-if="tableData.length === 0"
      class="table-empty"
    >
      <img :src="require('@/assets/无数据.jpg')" alt="无数据" class="empty-img">

      <div class="empty-text">暂无数据</div>
    </div>
  </div>
</template>

<script>
import { getFaultRecords } from '@/api/faultRecord'

export default {
  name: 'AdditionalSupport',
  data() {
    return {
      tableData: [],
      loading: false,
      searchBarVisible: true,
      selectedRows: [],
      filters: {
        projectName: '',
        owner: '',
        reporter: '',
        supportType: '',
        status: '',
        timeliness: ''
      },
      pagination: {
        page: 1,
        limit: 10,
        total: 0
      },
      stats: {
        total: 0,
        processing: 0,
        completed: 0,
        overdue: 0
      }
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
        
        // 添加筛选条件
        if (this.filters.projectName) params.projectName = this.filters.projectName
        if (this.filters.owner) params.owner = this.filters.owner
        if (this.filters.reporter) params.reporter = this.filters.reporter
        if (this.filters.supportType) params.supportType = this.filters.supportType
        if (this.filters.status) params.status = this.filters.status
        if (this.filters.timeliness) params.timeliness = this.filters.timeliness

        const res = await getFaultRecords(params)
        if (res.success) {
          // 处理数据，添加额外字段
          this.tableData = (res.data || []).map(item => ({
            ...item,
            faultOrderId: item._id ? item._id.toString().slice(0, 8) + 'xxxx' : 'N/A',
            supportType: item.supportType || '技术咨询',
            priority: item.priority || '普通',
            status: item.status || '待处理',
            timeliness: this.calculateTimeliness(item),
            owner: this.getCurrentOwner(item)
          }))
          
          if (res.pagination) {
            this.pagination.total = res.pagination.total
            this.pagination.page = res.pagination.page
            this.pagination.limit = res.pagination.limit
          }
          
          // 计算统计数据
          this.calculateStats()
        } else {
          this.tableData = []
          this.pagination.total = 0
          this.$message.error(res.message || '获取数据失败')
        }
      } catch (e) {
        this.tableData = []
        this.pagination.total = 0
        this.$message.error('网络异常或接口出错')
      }
      this.loading = false
    },
    onSearch() {
      this.pagination.page = 1
      this.loadData()
    },
    onReset() {
      this.filters = { 
        projectName: '', 
        owner: '', 
        reporter: '',
        supportType: '',
        status: '', 
        timeliness: '' 
      }
      this.pagination.page = 1
      this.loadData()
    },
    
    // 计算时效性
    calculateTimeliness(item) {
      if (!item.expectedCompletionTime) return '正常'
      const now = new Date()
      const expectedTime = new Date(item.expectedCompletionTime)
      return now > expectedTime ? '已逾期' : '正常'
    },
    
    // 获取当前负责人
    getCurrentOwner(item) {
      if (item.assignedTo && item.assignedTo.name) {
        return item.assignedTo.name
      }
      if (item.acceptedBy && item.acceptedBy.name) {
        return item.acceptedBy.name
      }
      return '未分配'
    },
    
    // 计算统计数据
    calculateStats() {
      this.stats.total = this.tableData.length
      this.stats.processing = this.tableData.filter(item => item.status === '处理中').length
      this.stats.completed = this.tableData.filter(item => item.status === '已完成').length
      this.stats.overdue = this.tableData.filter(item => item.timeliness === '已逾期').length
    },
    
    // 切换搜索栏显示
    toggleSearchBar() {
      this.searchBarVisible = !this.searchBarVisible
    },
    
    // 处理选择变化
    handleSelectionChange(selection) {
      this.selectedRows = selection
    },
    
    // 获取支持类型标签样式
    getSupportTypeTag(type) {
      const typeMap = {
        '技术咨询': 'info',
        '设备维修': 'warning',
        '培训服务': 'success',
        '应急响应': 'danger'
      }
      return typeMap[type] || 'info'
    },
    
    // 获取状态标签样式
    getStatusTagType(status) {
      const statusMap = {
        '待处理': 'info',
        '处理中': 'warning',
        '已完成': 'success',
        '已关闭': 'info'
      }
      return statusMap[status] || 'info'
    },
    
    // 获取优先级标签样式
    getPriorityTag(priority) {
      const priorityMap = {
        '低': 'info',
        '普通': '',
        '高': 'warning',
        '紧急': 'danger'
      }
      return priorityMap[priority] || ''
    },
    
    // 格式化日期
    formatDate(date) {
      if (!date) return ''
      return new Date(date).toLocaleDateString()
    },
    
    // 格式化时间
    formatTime(date) {
      if (!date) return ''
      return new Date(date).toLocaleTimeString()
    },
    
    // 格式化日期时间
    formatDateTime(date) {
      if (!date) return ''
      return new Date(date).toLocaleString()
    },
    
    // 刷新数据
    refreshData() {
      this.loadData()
    },
    
    // 导出表格
    exportTable() {
      this.$message.info('导出功能开发中...')
    },
    
    // 分页大小变化
    handleSizeChange(val) {
      this.pagination.limit = val
      this.pagination.page = 1
      this.loadData()
    },
    
    // 当前页变化
    handleCurrentChange(val) {
      this.pagination.page = val
      this.loadData()
    },
    
    
    // 分配支持
    assignSupport(row) {
      this.$message.info(`分配支持请求: ${row.faultOrderId}`)
    },
    
    // 完成支持
    completeSupport(row) {
      this.$message.info(`完成支持请求: ${row.faultOrderId}`)
    },
    
    // 处理操作
    handleAction(command, row) {
      switch (command) {
        case 'edit':
          this.$message.info(`编辑支持请求: ${row.faultOrderId}`)
          break
        case 'history':
          this.$message.info(`查看历史记录: ${row.faultOrderId}`)
          break
        case 'delete':
          this.$confirm('确定要删除这个支持请求吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message.success('删除成功')
          })
          break
      }
    },
    
    viewDetail(row) {
      this.$router.push({
        name: 'FaultOrderDetail',
        params: { id: row._id }
      })
    },
    onSetting() {
      this.$message.info('设置')
    }
  }
}
</script>

<style scoped>
.additional-support-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.page-icon i {
  font-size: 28px;
  color: white;
}

.title-info h1 {
  color: white;
  margin: 0;
  font-size: 28px;
  font-weight: 600;
}

.title-info p {
  color: rgba(255, 255, 255, 0.8);
  margin: 4px 0 0 0;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 搜索区域 */
.search-section {
  background: white;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.search-header h3 {
  margin: 0;
  color: #333;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.toggle-btn {
  color: #666;
  font-size: 14px;
}

.search-bar {
  padding: 24px;
}

.search-row {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.search-item {
  flex: 1;
  min-width: 200px;
}

.search-label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.search-label i {
  color: #666;
}

.search-actions {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.search-btn, .reset-btn {
  padding: 10px 24px;
  border-radius: 6px;
}

/* 统计卡片 */
.stats-section {
  margin-bottom: 20px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon i {
  font-size: 24px;
  color: white;
}

.stat-icon.pending {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
}

.stat-icon.processing {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.stat-icon.completed {
  background: linear-gradient(135deg, #d299c2 0%, #fef9d7 100%);
}

.stat-icon.overdue {
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa8a8 100%);
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

/* 表格区域 */
.table-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.table-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.table-title h3 {
  margin: 0;
  color: #333;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.record-count {
  color: #666;
  font-size: 14px;
}

.table-actions {
  display: flex;
  gap: 8px;
}

/* 表格内容 */
.owner-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.owner-name {
  font-size: 14px;
  color: #333;
}

.time-info {
  text-align: center;
}

.time-date {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.time-time {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}

.action-buttons {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

/* 分页 */
.pagination-container {
  padding: 20px 24px;
  display: flex;
  justify-content: center;
  border-top: 1px solid #f0f0f0;
}

/* 无数据状态 */
.table-empty {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-img {
  width: 200px;
  height: 200px;
  object-fit: contain;
  margin-bottom: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .search-row {
    flex-direction: column;
  }
  
  .search-item {
    min-width: auto;
  }
  
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .table-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>
