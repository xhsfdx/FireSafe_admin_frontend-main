<template>
  <div class="additional-maintenance-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <div class="page-icon">
            <i class="el-icon-s-cooperation" />
          </div>
          <div class="title-info">
            <h1 class="page-title">附加维保</h1>
            <p class="page-subtitle">管理和监控附加维保任务的执行情况</p>
          </div>
        </div>
        <div class="header-actions">
          <el-button type="primary" icon="el-icon-plus" @click="createAdditionalMaintenance">
            新建附加维保
          </el-button>
        </div>
      </div>
      <div class="header-stats">
        <div class="stat-card stat-total">
          <div class="stat-icon">
            <i class="el-icon-s-data" />
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.total }}</div>
            <div class="stat-label">总任务数</div>
          </div>
        </div>
        <div class="stat-card stat-pending">
          <div class="stat-icon">
            <i class="el-icon-time" />
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.pending }}</div>
            <div class="stat-label">待处理</div>
          </div>
        </div>
        <div class="stat-card stat-processing">
          <div class="stat-icon">
            <i class="el-icon-loading" />
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.processing }}</div>
            <div class="stat-label">处理中</div>
          </div>
        </div>
        <div class="stat-card stat-completed">
          <div class="stat-icon">
            <i class="el-icon-circle-check" />
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.completed }}</div>
            <div class="stat-label">已完成</div>
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
                <i class="el-icon-s-home" /> 业主单位
              </label>
              <el-input
                v-model="filters.ownerUnitName"
                placeholder="请输入业主单位"
                prefix-icon="el-icon-search"
                clearable
              />
            </div>
            <div class="search-item">
              <label class="search-label">
                <i class="el-icon-time" /> 状态
              </label>
              <el-select v-model="filters.status" placeholder="请选择状态" clearable>
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
                <i class="el-icon-calendar" /> 创建时间
              </label>
              <el-date-picker
                v-model="filters.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                clearable
              />
            </div>
            <div class="search-item search-actions">
              <el-button type="primary" icon="el-icon-search" @click="onSearch">
                查询
              </el-button>
              <el-button icon="el-icon-refresh" @click="onReset">
                重置
              </el-button>
            </div>
          </div>
        </div>
      </el-collapse-transition>
    </div>

    <!-- 表格区域 -->
    <div class="table-section">
      <div class="table-header">
        <div class="table-title">
          <h3><i class="el-icon-s-grid" /> 附加维保列表</h3>
          <span class="record-count">共 {{ pagination.total }} 条记录</span>
        </div>
        <div class="table-actions">
          <el-button size="small" icon="el-icon-refresh" @click="loadData">
            刷新
          </el-button>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }"
        empty-text="暂无数据"
      >
        <el-table-column label="标题" prop="title" min-width="200" show-overflow-tooltip />

        <el-table-column label="项目名称" prop="projectName" min-width="180" show-overflow-tooltip />

        <el-table-column label="业主单位" prop="ownerUnitName" min-width="150" show-overflow-tooltip />

        <el-table-column label="来源类型" prop="sourceType" width="120">
          <template slot-scope="scope">
            <el-tag :type="getSourceTypeTag(scope.row.sourceType)" size="small">
              {{ scope.row.sourceType || '手动创建' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="状态" prop="status" width="120">
          <template slot-scope="scope">
            <el-tag :type="getStatusTagType(scope.row.status)" size="medium">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="预计费用" prop="estimatedCost" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.estimatedCost">¥{{ scope.row.estimatedCost.toLocaleString() }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column label="实际费用" prop="actualCost" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.actualCost">¥{{ scope.row.actualCost.toLocaleString() }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column label="创建时间" prop="createdAt" width="180">
          <template slot-scope="scope">
            {{ formatDateTime(scope.row.createdAt) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="250" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="viewDetail(scope.row)">
              详情
            </el-button>
            <el-button
              v-if="scope.row.status === '待审批'"
              size="mini"
              type="success"
              @click="approveAdditionalMaintenance(scope.row)"
            >
              审批
            </el-button>
            <el-button
              v-if="scope.row.status === '待处理' || scope.row.status === '处理中'"
              size="mini"
              type="warning"
              @click="updateStatus(scope.row)"
            >
              更新状态
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="deleteAdditionalMaintenance(scope.row)"
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
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {
  getAdditionalMaintenances,
  deleteAdditionalMaintenance,
  approveAdditionalMaintenance,
  updateAdditionalMaintenanceStatus
} from '@/api/additionalMaintenance'

export default {
  name: 'AdditionalSupport',
  data() {
    return {
      tableData: [],
      loading: false,
      searchBarVisible: true,
      filters: {
        projectName: '',
        ownerUnitName: '',
        status: '',
        sourceType: '',
        dateRange: []
      },
      pagination: {
        page: 1,
        limit: 10,
        total: 0
      },
      stats: {
        total: 0,
        pending: 0,
        processing: 0,
        completed: 0
      }
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
        if (this.filters.ownerUnitName) params.ownerUnitName = this.filters.ownerUnitName
        if (this.filters.status) params.status = this.filters.status
        if (this.filters.sourceType) params.sourceType = this.filters.sourceType
        if (this.filters.dateRange && this.filters.dateRange.length === 2) {
          params.startDate = this.filters.dateRange[0]
          params.endDate = this.filters.dateRange[1]
        }

        const res = await getAdditionalMaintenances(params)
        if (res.success) {
          this.tableData = res.data || []
          if (res.pagination) {
            this.pagination.total = res.pagination.total
            this.pagination.page = res.pagination.page
            this.pagination.limit = res.pagination.limit
          }
          this.calculateStats()
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
    onSearch() {
      this.pagination.page = 1
      this.loadData()
    },
    onReset() {
      this.filters = {
        projectName: '',
        ownerUnitName: '',
        status: '',
        sourceType: '',
        dateRange: []
      }
      this.pagination.page = 1
      this.loadData()
    },
    calculateStats() {
      this.stats.total = this.tableData.length
      this.stats.pending = this.tableData.filter(item => item.status === '待处理').length
      this.stats.processing = this.tableData.filter(item => item.status === '处理中').length
      this.stats.completed = this.tableData.filter(item => item.status === '已完成').length
    },
    toggleSearchBar() {
      this.searchBarVisible = !this.searchBarVisible
    },
    handleSizeChange(val) {
      this.pagination.limit = val
      this.pagination.page = 1
      this.loadData()
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.loadData()
    },
    getSourceTypeTag(type) {
      const typeMap = {
        '工作上报': 'success',
        '故障工单': 'danger',
        '例行维保': 'warning',
        '手动创建': 'info'
      }
      return typeMap[type] || 'info'
    },
    getStatusTagType(status) {
      const statusMap = {
        '待处理': 'info',
        '处理中': 'warning',
        '待审批': 'primary',
        '已完成': 'success',
        '已取消': 'danger'
      }
      return statusMap[status] || 'info'
    },
    formatDateTime(date) {
      if (!date) return ''
      return new Date(date).toLocaleString('zh-CN')
    },
    viewDetail(row) {
      this.$router.push({
        name: 'AdditionalMaintenanceDetail',
        params: { id: row._id }
      })
    },
    createAdditionalMaintenance() {
      this.$router.push({
        name: 'AdditionalMaintenanceCreate'
      })
    },
    async approveAdditionalMaintenance(row) {
      try {
        const { value } = await this.$prompt('请输入审批意见', '审批附加维保', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入审批意见（可选）',
          inputType: 'textarea'
        })

        const res = await approveAdditionalMaintenance(row._id, {
          approvalComment: value || ''
        })

        if (res.success) {
          this.$message.success('审批成功')
          this.loadData()
        } else {
          this.$message.error(res.message || '审批失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('审批失败:', error)
          this.$message.error('审批失败')
        }
      }
    },
    async updateStatus(row) {
      const statusOptions = []
      if (row.status === '待处理') {
        statusOptions.push('处理中')
      }
      if (row.status === '处理中') {
        statusOptions.push('待审批', '已完成')
      }
      if (row.status === '待审批') {
        statusOptions.push('已完成')
      }
      statusOptions.push('已取消')

      if (statusOptions.length === 0) {
        this.$message.warning('当前状态无法更新')
        return
      }

      try {
        const { value } = await this.$prompt(
          `请选择新状态（可选：${statusOptions.join('、')}）`,
          '更新状态',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPlaceholder: statusOptions[0]
          }
        )

        const selectedStatus = statusOptions.find(s => s === value) || statusOptions[0]

        const res = await updateAdditionalMaintenanceStatus(row._id, {
          status: selectedStatus
        })

        if (res.success) {
          this.$message.success('状态更新成功')
          this.loadData()
        } else {
          this.$message.error(res.message || '状态更新失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('更新状态失败:', error)
          this.$message.error('更新状态失败')
        }
      }
    },
    async deleteAdditionalMaintenance(row) {
      try {
        await this.$confirm('确定要删除此附加维保吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const res = await deleteAdditionalMaintenance(row._id)
        if (res.success) {
          this.$message.success('删除成功')
          this.loadData()
        } else {
          this.$message.error(res.message || '删除失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除失败:', error)
          this.$message.error('删除失败')
        }
      }
    }
  }
}
</script>

<style scoped>
.additional-maintenance-page {
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
  padding: 24px 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
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

.header-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
}

.stat-icon i {
  font-size: 24px;
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: 600;
  color: white;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 4px;
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

.search-actions {
  display: flex;
  gap: 12px;
  align-items: flex-end;
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

.pagination-container {
  padding: 20px 24px;
  display: flex;
  justify-content: center;
  border-top: 1px solid #f0f0f0;
}
</style>
