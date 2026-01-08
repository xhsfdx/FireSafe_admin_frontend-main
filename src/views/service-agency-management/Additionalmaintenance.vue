<template>
  <div class="additional-maintenance-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <div class="page-icon">
            <i class="el-icon-s-tools" />
          </div>
          <div class="title-info">
            <h1 class="page-title">附加维保</h1>
            <p class="page-subtitle">管理和监控附加维保任务的执行情况</p>
          </div>
        </div>
        <div class="header-stats">
          <div class="stat-card stat-total">
            <div class="stat-icon">
              <i class="el-icon-s-data" />
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ tableData.length }}</div>
              <div class="stat-label">总任务数</div>
            </div>
          </div>
          <div class="stat-card stat-completed">
            <div class="stat-icon">
              <i class="el-icon-circle-check" />
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ getStatusCount('已完成') }}</div>
              <div class="stat-label">已完成</div>
            </div>
          </div>
          <div class="stat-card stat-pending">
            <div class="stat-icon">
              <i class="el-icon-loading" />
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ getStatusCount('处理中') }}</div>
              <div class="stat-label">处理中</div>
            </div>
          </div>
          <div class="stat-card stat-overdue">
            <div class="stat-icon">
              <i class="el-icon-warning" />
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ getStatusCount('待处理') }}</div>
              <div class="stat-label">待处理</div>
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
                <i class="el-icon-time" /> 工单状态
              </label>
              <el-select v-model="filters.status" placeholder="请选择工单状态" clearable>
                <el-option label="待处理" value="待处理" />
                <el-option label="处理中" value="处理中" />
                <el-option label="待审批" value="待审批" />
                <el-option label="已完成" value="已完成" />
                <el-option label="已取消" value="已取消" />
              </el-select>
            </div>
            <div class="search-item">
              <label class="search-label">
                <i class="el-icon-document" /> 来源类型
              </label>
              <el-select v-model="filters.sourceType" placeholder="请选择来源类型" clearable>
                <el-option label="工作上报" value="工作上报" />
                <el-option label="故障工单" value="故障工单" />
                <el-option label="例行维保" value="例行维保" />
                <el-option label="手动创建" value="手动创建" />
              </el-select>
            </div>
          </div>

          <div class="search-row">
            <div class="search-item">
              <label class="search-label">
                <i class="el-icon-date" /> 创建时间
              </label>
              <el-date-picker
                v-model="filters.dateRange"
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
        <h3><i class="el-icon-s-grid" /> 附加维保列表</h3>
        <div class="table-actions">
          <el-button type="info" icon="el-icon-download" @click="exportData">
            导出数据
          </el-button>
          <el-button type="primary" icon="el-icon-plus" @click="handleCreate">
            新建附加维保
          </el-button>
        </div>
      </div>

      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="filteredData"
          stripe
          element-loading-text="数据加载中..."
          empty-text="暂无数据"
          class="maintenance-table"
          :header-cell-style="{
            background: '#f5f7fa',
            color: '#606266',
            fontWeight: 'bold',
            fontSize: '14px'
          }"
        >
          <el-table-column type="index" label="序号" width="70" align="center" />

          <el-table-column prop="projectName" label="项目名称" min-width="200" show-overflow-tooltip />

          <el-table-column prop="title" label="维保标题" min-width="200" show-overflow-tooltip />

          <el-table-column prop="sourceType" label="来源类型" width="120" align="center">
            <template slot-scope="{ row }">
              <el-tag :type="getSourceTypeTagType(row.sourceType)" size="small">
                {{ row.sourceType || '未知' }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="status" label="状态" width="100" align="center">
            <template slot-scope="{ row }">
              <el-tag :type="getStatusTagType(row.status)" size="small">
                {{ row.status || '未知' }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="createdAt" label="创建时间" width="180" align="center">
            <template slot-scope="{ row }">
              {{ formatDate(row.createdAt) }}
            </template>
          </el-table-column>

          <el-table-column prop="expectedCompletionDate" label="预计完成时间" width="180" align="center">
            <template slot-scope="{ row }">
              {{ row.expectedCompletionDate ? formatDate(row.expectedCompletionDate) : '-' }}
            </template>
          </el-table-column>

          <el-table-column label="操作" width="200" align="center" fixed="right">
            <template slot-scope="{ row }">
              <el-button
                type="text"
                size="small"
                icon="el-icon-view"
                @click="handleView(row)"
              >
                查看
              </el-button>
              <el-button
                v-if="row.status === '待审批'"
                type="text"
                size="small"
                icon="el-icon-check"
                @click="handleApprove(row)"
              >
                审批
              </el-button>
              <el-button
                v-if="['待处理', '已取消'].includes(row.status)"
                type="text"
                size="small"
                icon="el-icon-delete"
                style="color: #f56c6c"
                @click="handleDelete(row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            :current-page="pagination.page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pagination.limit"
            :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAdditionalMaintenances, deleteAdditionalMaintenance, approveAdditionalMaintenance } from '@/api/additionalMaintenance'

export default {
  name: 'AdditionalMaintenance',
  data() {
    return {
      loading: false,
      searchBarVisible: true,
      tableData: [],
      filters: {
        projectName: '',
        status: '',
        sourceType: '',
        dateRange: null
      },
      pagination: {
        page: 1,
        limit: 10,
        total: 0
      }
    }
  },
  computed: {
    filteredData() {
      let data = this.tableData

      if (this.filters.projectName) {
        data = data.filter(item => 
          item.projectName && item.projectName.includes(this.filters.projectName)
        )
      }

      if (this.filters.status) {
        data = data.filter(item => item.status === this.filters.status)
      }

      if (this.filters.sourceType) {
        data = data.filter(item => item.sourceType === this.filters.sourceType)
      }

      if (this.filters.dateRange && this.filters.dateRange.length === 2) {
        const [start, end] = this.filters.dateRange
        data = data.filter(item => {
          const createdAt = new Date(item.createdAt)
          const startDate = new Date(start)
          const endDate = new Date(end)
          endDate.setHours(23, 59, 59, 999)
          return createdAt >= startDate && createdAt <= endDate
        })
      }

      return data
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.loading = true
      try {
        const params = {
          page: this.pagination.page,
          limit: this.pagination.limit
        }

        if (this.filters.projectName) params.projectName = this.filters.projectName
        if (this.filters.status) params.status = this.filters.status
        if (this.filters.sourceType) params.sourceType = this.filters.sourceType

        const res = await getAdditionalMaintenances(params)
        if (res.success) {
          this.tableData = res.data || []
          if (res.pagination) {
            this.pagination.total = res.pagination.total
            this.pagination.page = res.pagination.page
            this.pagination.limit = res.pagination.limit
          }
        } else {
          this.$message.error(res.message || '获取数据失败')
          this.tableData = []
        }
      } catch (error) {
        console.error('加载附加维保数据失败:', error)
        this.$message.error('网络异常或接口出错')
        this.tableData = []
      } finally {
        this.loading = false
      }
    },
    toggleSearchBar() {
      this.searchBarVisible = !this.searchBarVisible
    },
    onSearch() {
      this.pagination.page = 1
      this.loadData()
    },
    onReset() {
      this.filters = {
        projectName: '',
        status: '',
        sourceType: '',
        dateRange: null
      }
      this.pagination.page = 1
      this.loadData()
    },
    handleSizeChange(size) {
      this.pagination.limit = size
      this.pagination.page = 1
      this.loadData()
    },
    handlePageChange(page) {
      this.pagination.page = page
      this.loadData()
    },
    handleView(row) {
      // 跳转到详情页
      this.$router.push({
        name: 'AdditionalMaintenanceDetail',
        params: { id: row._id }
      })
    },
    handleApprove(row) {
      this.$prompt('请输入审批意见', '审批附加维保', {
        confirmButtonText: '通过',
        cancelButtonText: '不通过',
        inputPlaceholder: '请输入审批意见'
      }).then(({ value }) => {
        return approveAdditionalMaintenance(row._id, {
          approved: true,
          approvalComment: value || '审批通过'
        })
      }).then(() => {
        this.$message.success('审批成功')
        this.loadData()
      }).catch((error) => {
        if (error !== 'cancel') {
          console.error('审批失败:', error)
          this.$message.error('审批失败')
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确定要删除此附加维保吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return deleteAdditionalMaintenance(row._id)
      }).then(() => {
        this.$message.success('删除成功')
        this.loadData()
      }).catch((error) => {
        if (error !== 'cancel') {
          console.error('删除失败:', error)
          this.$message.error('删除失败')
        }
      })
    },
    handleCreate() {
      // 跳转到创建页面
      this.$router.push({
        name: 'AdditionalMaintenanceCreate'
      })
    },
    exportData() {
      this.$message.info('导出功能开发中')
    },
    getStatusCount(status) {
      return this.tableData.filter(item => item.status === status).length
    },
    getStatusTagType(status) {
      const typeMap = {
        '待处理': 'info',
        '处理中': 'warning',
        '待审批': 'primary',
        '已完成': 'success',
        '已取消': 'danger'
      }
      return typeMap[status] || 'info'
    },
    getSourceTypeTagType(sourceType) {
      const typeMap = {
        '工作上报': 'primary',
        '故障工单': 'warning',
        '例行维保': 'success',
        '手动创建': 'info'
      }
      return typeMap[sourceType] || 'info'
    },
    formatDate(dateStr) {
      if (!dateStr) return '-'
      const date = new Date(dateStr)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}`
    }
  }
}
</script>

<style scoped>
.additional-maintenance-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 50px);
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-section {
  display: flex;
  align-items: center;
}

.page-icon {
  font-size: 48px;
  margin-right: 16px;
}

.title-info {
  flex: 1;
}

.page-title {
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
}

.header-stats {
  display: flex;
  gap: 16px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 16px;
  min-width: 120px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon {
  font-size: 32px;
  opacity: 0.9;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  line-height: 1.2;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
  margin-top: 4px;
}

.search-section {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.search-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.search-bar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.search-item {
  flex: 1;
  min-width: 200px;
}

.search-label {
  display: block;
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.search-actions {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.table-section {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.table-actions {
  display: flex;
  gap: 8px;
}

.pagination-container {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.maintenance-table {
  width: 100%;
}
</style>
