<template>
  <div class="report-download-page">
    <!-- 查询栏 -->
    <div class="search-bar">
      <el-input
        v-model="filters.projectName"
        placeholder="输入项目名称搜索"
        style="width: 220px; margin-right: 10px"
        clearable
      />
      <el-select v-model="filters.type" placeholder="选择上报类型" style="width: 180px; margin-right: 10px" clearable>
        <el-option label="全部" value="" />
        <el-option label="故障处理" value="故障处理" />
        <el-option label="维保抽查" value="维保抽查" />
        <el-option label="培训演练" value="培训演练" />
        <el-option label="其他事项" value="其他事项" />
      </el-select>
      <el-select v-model="filters.status" placeholder="选择状态" style="width: 150px; margin-right: 10px" clearable>
        <el-option label="全部" value="" />
        <el-option label="已上报" value="已上报" />
        <el-option label="已审核" value="已审核" />
        <el-option label="已转换为附加维保" value="已转换为附加维保" />
        <el-option label="已完成" value="已完成" />
      </el-select>
      <el-date-picker
        v-model="filters.dateRange"
        type="daterange"
        range-separator=" - "
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width: 300px; margin-right: 10px"
        value-format="yyyy-MM-dd"
        clearable
      />
      <el-button type="primary" icon="el-icon-search" style="margin-right:8px" @click="onSearch">查询</el-button>
      <el-button icon="el-icon-refresh" style="margin-right:8px" @click="onReset">重置</el-button>
      <el-button type="success" style="margin-right:0; font-weight:bold" @click="onDownload">一键下载所选报告</el-button>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="pagedData"
        border
        style="width: 100%; margin-top: 12px;"
        :header-cell-style="{ fontWeight: 'bold', fontSize: '15px' }"
        empty-text="暂无数据"
        @selection-change="onSelectionChange"
      >
        <el-table-column type="selection" width="48" align="center" />
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="projectName" label="项目名称" align="center" min-width="200" />
        <el-table-column prop="ownerUnitName" label="业主单位名称" align="center" min-width="150" />
        <el-table-column prop="reportType" label="上报类型" align="center" width="120">
          <template slot-scope="{ row }">
            <el-tag :type="getTypeTagType(row.reportType)" size="small">
              {{ row.reportType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="上报时间" align="center" width="160">
          <template slot-scope="{ row }">
            {{ formatDateTime(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="处理状态" align="center" width="150">
          <template slot-scope="{ row }">
            <el-tag :type="getStatusTagType(row.status)" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" align="center" fixed="right">
          <template slot-scope="{ row }">
            <div class="action-buttons">
              <el-button size="mini" type="primary" class="action-btn" @click="viewDetail(row)">详情</el-button>
              <el-button size="mini" type="success" class="action-btn" @click="downloadReport(row)">下载</el-button>
              <el-button v-if="row.status === '已上报'" size="mini" type="warning" class="action-btn" @click="reviewReport(row)">审核</el-button>
              <el-button v-if="row.status === '已审核' && !row.convertedToAdditionalMaintenance" size="mini" type="info" class="action-btn" @click="convertToAdditional(row)">转附加维保</el-button>
              <el-button size="mini" type="danger" class="action-btn" @click="deleteReport(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        layout="total, prev, pager, next, sizes"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :current-page.sync="currentPage"
        :total="tableData.length"
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

    <!-- 无数据自定义内容 -->
    <div v-if="pagedData.length === 0" class="table-empty">
      <img :src="require('@/assets/无数据.jpg')" alt="无数据" class="empty-img">

      <div class="empty-text">暂无数据</div>
    </div>

    <!-- 悬浮设置按钮（如不需要可删掉） -->
    <el-button class="setting-btn" type="primary" icon="el-icon-setting" circle @click="onSetting" />
  </div>
</template>

<script>
import { getWorkReports, downloadWorkReport, batchDownloadWorkReports, reviewWorkReport, convertToAdditionalMaintenance, deleteWorkReport } from '@/api/workReport'

export default {
  name: 'ReportDownloadPage',
  data() {
    return {
      filters: {
        projectName: '',
        type: '',
        status: '',
        dateRange: []
      },
      tableData: [],
      pagedData: [],
      selectedRows: [],
      currentPage: 1,
      pageSize: 10,
      loading: false,
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
        if (this.filters.type) params.reportType = this.filters.type
        if (this.filters.status) params.status = this.filters.status
        if (this.filters.dateRange && this.filters.dateRange.length === 2) {
          params.startDate = this.filters.dateRange[0]
          params.endDate = this.filters.dateRange[1]
        }

        console.log('请求参数:', params)
        console.log('当前token:', this.$store.getters.token)
        const res = await getWorkReports(params)
        console.log('工作上报API响应:', res)
        console.log('原始数据:', res.data)
        if (res.success) {
          // 处理数据结构
          const rawData = res.data || []
          this.tableData = rawData.map(item => ({
            ...item,
            projectName: item.projectName || item.project?.name || '未关联项目',
            ownerUnitName: item.ownerUnitName || item.ownerUnit?.name || '未设置',
            reportType: item.reportType || '其他事项',
            createdAt: item.createdAt || new Date().toISOString(),
            status: item.status || '已上报'
          }))

          if (res.pagination) {
            this.pagination.total = res.pagination.total
            this.pagination.page = res.pagination.page
            this.pagination.limit = res.pagination.limit
          } else {
            this.pagination.total = rawData.length
          }
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
      this.updatePagedData()
    },
    onSearch() {
      this.pagination.page = 1
      this.loadData()
    },
    onReset() {
      this.filters = { projectName: '', reporter: '', type: '', dateRange: [] }
      this.pagination.page = 1
      this.loadData()
    },
    updatePagedData() {
      const start = (this.currentPage - 1) * this.pageSize
      this.pagedData = this.tableData.slice(start, start + this.pageSize)
    },
    onSelectionChange(val) {
      this.selectedRows = val
    },
    async onDownload() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请先选择要下载的报告')
        return
      }

      try {
        const ids = this.selectedRows.map(row => row._id)
        const res = await batchDownloadWorkReports(ids)

        // 创建下载链接
        const blob = new Blob([res], { type: 'application/zip' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `工作上报报告_${new Date().toISOString().split('T')[0]}.zip`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        this.$message.success('批量下载成功')
      } catch (error) {
        console.error('批量下载失败:', error)
        this.$message.error('批量下载失败，请重试')
      }
    },
    viewDetail(row) {
      this.$router.push({
        name: 'WorkReportDetail',
        params: { id: row._id }
      })
    },
    onSetting() {
      this.$message.info('设置')
    },

    // 获取类型标签样式
    getTypeTagType(type) {
      const typeMap = {
        '故障处理': 'danger',
        '维保抽查': 'warning',
        '培训演练': 'success',
        '其他事项': 'info'
      }
      return typeMap[type] || 'info'
    },

    // 获取状态标签样式
    getStatusTagType(status) {
      const statusMap = {
        '已上报': 'info',
        '已审核': 'success',
        '已转换为附加维保': 'warning',
        '已完成': 'success'
      }
      return statusMap[status] || 'info'
    },
    
    // 审核工作上报
    async reviewReport(row) {
      try {
        const { value } = await this.$prompt('请输入审核意见', '审核工作上报', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入审核意见（可选）',
          inputType: 'textarea'
        })
        
        const res = await reviewWorkReport(row._id, {
          status: '已审核',
          reviewComment: value || ''
        })
        
        if (res.success) {
          this.$message.success('审核成功')
          this.loadData()
        } else {
          this.$message.error(res.message || '审核失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('审核失败:', error)
          this.$message.error('审核失败，请重试')
        }
      }
    },
    
    // 转换为附加维保
    async convertToAdditional(row) {
      try {
        const { value } = await this.$prompt('请输入转换原因', '转换为附加维保', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入转换原因',
          inputType: 'textarea'
        })
        
        const res = await convertToAdditionalMaintenance(row._id, {
          convertReason: value || ''
        })
        
        if (res.success) {
          this.$message.success('转换成功')
          this.loadData()
        } else {
          this.$message.error(res.message || '转换失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('转换失败:', error)
          this.$message.error('转换失败，请重试')
        }
      }
    },
    
    // 删除工作上报
    async deleteReport(row) {
      try {
        await this.$confirm('确定要删除该工作上报吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        const res = await deleteWorkReport(row._id)
        if (res.success) {
          this.$message.success('删除成功')
          this.loadData()
        } else {
          this.$message.error(res.message || '删除失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除失败:', error)
          this.$message.error('删除失败，请重试')
        }
      }
    },

    // 格式化日期时间
    formatDateTime(date) {
      if (!date) return '未设置'
      return new Date(date).toLocaleString('zh-CN')
    },

    // 下载单个报告（打开报告页面，由浏览器打印/导出PDF）
    downloadReport(row) {
      const route = this.$router.resolve({
        name: 'WorkReportReport',
        params: { id: row._id }
      })
      window.open(route.href, '_blank')
    },

    // 编辑报告
    editReport(row) {
      this.$message.info(`编辑 ${row.projectName} 的报告功能开发中...`)
    },

    // 分页处理
    handlePageChange(page) {
      this.currentPage = page
      this.updatePagedData()
    },

    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.updatePagedData()
    }
  }
}
</script>

<style scoped>
.report-download-page {
  min-height: 100vh;
  background: #fff;
  padding: 10px 12px 0 10px;
  position: relative;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.table-empty {
  position: absolute;
  left: 0;
  right: 0;
  top: 160px;
  text-align: center;
  z-index: 2;
  user-select: none;
}

.empty-img {
  width: 180px;
  opacity: 0.75;
  margin-bottom: 8px;
}

.empty-text {
  color: #888;
  font-size: 16px;
}

/* 操作按钮样式优化 */
.action-buttons {
  display: flex;
  flex-direction: row;
  gap: 6px;
  align-items: center;
  justify-content: center;
}

.action-btn {
  width: 50px;
  height: 24px;
  font-size: 12px;
  padding: 4px 8px;
  margin: 0;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 表格行高优化 */
.el-table .el-table__row {
  height: 50px;
}

.el-table .el-table__cell {
  padding: 8px 12px;
  vertical-align: middle;
}

/* 为表格容器添加底部边距，避免被固定分页遮挡 */
.table-container {
  margin-bottom: 100px;
}

/* 分页居中样式 - 固定在屏幕底部 */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  padding: 20px 0;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  border-top: 1px solid #e4e7ed;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.setting-btn {
  position: fixed;
  right: 32px;
  top: 320px;
  z-index: 10;
  box-shadow: 0 2px 8px #87b7fd33;
}
</style>
