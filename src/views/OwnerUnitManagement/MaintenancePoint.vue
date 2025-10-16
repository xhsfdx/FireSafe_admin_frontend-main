<template>
  <div class="maintenance-point-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <span class="breadcrumb-item">业主单位管理</span>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-item active">维保点位管理</span>
    </div>

    <!-- 搜索筛选区域 -->
    <div class="search-filter">
      <div class="filter-item">
        <input
          v-model="searchParams.projectName"
          type="text"
          placeholder="输入项目名称搜索"
          class="filter-input"
          @keyup.enter="handleSearch"
        >
      </div>
      <div class="filter-item">
        <input
          v-model="searchParams.entrustName"
          type="text"
          placeholder="输入委托单位搜索"
          class="filter-input"
          @keyup.enter="handleSearch"
        >
      </div>
      <div class="filter-item">
        <el-select
          v-model="searchParams.status"
          placeholder="选择服务状态"
          class="filter-select"
        >
          <el-option label="服务中" value="服务中" />
          <el-option label="已到期" value="已到期" />
        </el-select>
      </div>
      <div class="filter-actions">
        <button class="btn btn-primary" @click="handleSearch">
          <i class="el-icon-search search-icon" /> 查询
        </button>
        <button class="btn btn-secondary" @click="handleReset">
          <i class="el-icon-refresh reset-icon" /> 重置
        </button>
        <div v-if="hasActiveFilters" class="filter-status">
          <span class="filter-tag">
            <i class="el-icon-filter" />
            已应用筛选条件
          </span>
        </div>
      </div>
    </div>

    <!-- 表格区域 -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>序号</th>
            <th>项目名称</th>
            <th>委托单位</th>
            <th>服务状态</th>
            <th>维保方式</th>
            <th>点位数量</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="7" class="no-data">
              <div class="empty-state">
                <p>加载中...</p>
              </div>
            </td>
          </tr>
          <tr v-else-if="maintenancePointList.length === 0">
            <td colspan="7" class="no-data">
              <div class="empty-state">
                <img src="@/assets/无数据.jpg" alt="没有数据" class="empty-icon">
                <p>暂无数据</p>
              </div>
            </td>
          </tr>
          <template v-else>
            <tr v-for="(item, index) in maintenancePointList" :key="item.id || `maintenance-${index}`">
              <td>{{ (queryParams.page - 1) * queryParams.size + index + 1 }}</td>
              <td>{{ item.projectName }}</td>
              <td>{{ item.entrustName }}</td>
              <td>
                <span :class="item.status === '服务中' ? 'status-active' : 'status-expired'">
                  {{ item.status }}
                </span>
              </td>
              <td>
                <span class="maintenance-type">{{ item.maintenanceType }}</span>
              </td>
              <td>{{ item.pointCount }}</td>
              <td class="operation-column">
                <div class="operation-buttons">
                  <button class="btn btn-sm btn-primary" @click="handleDetail(item)">详情</button>
                  <button class="btn btn-sm btn-success" @click="handleAddPoint(item)">添加点位</button>
                  <button class="btn btn-sm btn-danger" @click="handleDelete(item)">删除</button>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <!-- 分页组件 -->
      <div class="pagination-container">
        <div class="pagination-info">
          共查询到{{ total }}条
        </div>
        <el-pagination
          :current-page="queryParams.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="queryParams.size"
          layout="prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'MaintenancePointManagement',
  data() {
    return {
      loading: false,
      allMaintenancePointList: [], // 存储所有数据
      maintenancePointList: [], // 显示的数据
      total: 0,
      searchParams: { // 搜索过滤条件
        projectName: '',
        entrustName: '',
        status: ''
      },
      queryParams: {
        page: 1,
        size: 10,
        projectName: '',
        entrustName: '',
        status: ''
      }
    }
  },
  computed: {
    // 检查是否有活跃的筛选条件
    hasActiveFilters() {
      return !!(this.searchParams.projectName ||
                this.searchParams.entrustName ||
                this.searchParams.status)
    }
  },
  created() {
    this.getMaintenancePointList()
  },
  methods: {
    // 获取维保点位列表
    async getMaintenancePointList() {
      try {
        this.loading = true
        console.log('【调试】开始获取维保点位数据，查询参数:', this.queryParams)

        // 尝试多个可能的API端点
        let response
        let apiEndpoint = ''

        // 尝试多个可能的API端点，添加时间戳强制刷新
        const timestamp = new Date().getTime()
        const possibleEndpoints = [
          `/plan?_t=${timestamp}`, // 优先使用 /plan 端点，因为它返回最新的数据
          `/maintenance/plan?_t=${timestamp}`,
          `/maintenance?_t=${timestamp}`,
          `/point/maintainPoint?_t=${timestamp}`,
          `/point/plan?_t=${timestamp}`,
          `/checkpoint?_t=${timestamp}`
        ]

        let lastError = null

        for (const endpoint of possibleEndpoints) {
          try {
            apiEndpoint = endpoint
            response = await request.get(apiEndpoint)
            console.log(`【调试】${endpoint} API响应:`, response)

            // 如果API调用成功，跳出循环
            if (response && response.success) {
              break
            }
          } catch (error) {
            console.log(`【调试】${endpoint} API失败:`, error.message)
            lastError = error
            response = null
          }
        }

        // 如果所有API都失败了
        if (!response || !response.success) {
          console.log('【调试】所有API端点都失败了，最后错误:', lastError)
          this.allMaintenancePointList = []
          this.maintenancePointList = []
          this.total = 0
          this.$message.info('无法连接到后端服务，当前没有点位维保数据')
          return
        }

        console.log('【调试】最终使用的API端点:', apiEndpoint)
        console.log('【调试】最终API响应:', response)

        if (response && response.success) {
          const data = response.data || []
          console.log('【调试】获取到的原始数据:', data)

          // 检查数据是否为空
          if (!data || data.length === 0) {
            console.log('【调试】后端返回空数据，说明没有点位维保数据')
            this.allMaintenancePointList = []
            this.maintenancePointList = []
            this.total = 0
            this.$message.info('当前没有点位维保数据')
            return
          }

          // 根据不同的API端点处理数据
          let processedData = []

          console.log('【调试】检查原始数据结构:', {
            dataType: typeof data,
            isArray: Array.isArray(data),
            length: data.length,
            firstItem: data[0] ? Object.keys(data[0]) : [],
            sampleData: data[0]
          })

          // 检查数据中的点位维保项目
          const pointMaintenanceItems = data.filter(item =>
            item.maintenanceMethod === '点位维保' || item.warrantyMethod === '点位维保'
          )
          console.log('【调试】找到的点位维保项目数量:', pointMaintenanceItems.length)
          console.log('【调试】点位维保项目详情:', pointMaintenanceItems.map(item => ({
            projectName: item.projectName || item.name,
            maintenanceMethod: item.maintenanceMethod,
            warrantyMethod: item.warrantyMethod,
            checkpoints: item.checkpoints,
            checkpointsCount: item.checkpoints ? item.checkpoints.length : 0
          })))

          // 统一的数据处理逻辑
          processedData = data
            .filter(item => {
              // 检查维保方式字段（支持两种字段名）
              const maintenanceMethod = item.maintenanceMethod || item.warrantyMethod
              const isPointMaintenance = maintenanceMethod === '点位维保'

              console.log(`【调试】项目 ${item.projectName || item.name || '未知'} 的维保方式: ${maintenanceMethod}, 是否点位维保: ${isPointMaintenance}`)

              return isPointMaintenance
            })
            // 按创建时间排序，最新的在前
            .sort((a, b) => {
              const timeA = new Date(a.createTime || 0).getTime()
              const timeB = new Date(b.createTime || 0).getTime()
              return timeB - timeA
            })
            // 去重：如果项目名称和委托单位相同，只保留最新的
            .filter((item, index, array) => {
              const currentKey = `${item.projectName || ''}_${item.ownerName || ''}`
              const firstIndex = array.findIndex(other =>
                `${other.projectName || ''}_${other.ownerName || ''}` === currentKey
              )
              return index === firstIndex
            })
            .map((item, index) => ({
              id: item._id || item.id || `maintenance-${index}`,
              projectName: item.projectId?.name || item.projectName || item.name || '未命名项目',
              entrustName: item.ownerName || item.entrustName || item.clientCompany || '未知委托单位',
              status: this.getServiceStatus(item),
              maintenanceType: '点位维保',
              pointCount: item.checkpoints ? item.checkpoints.length : (item.pointCount || 0),
              planData: item
            }))

          console.log('【调试】处理后的数据:', processedData)
          console.log('【调试】数据去重和排序详情:', processedData.map(item => ({
            id: item.id,
            projectName: item.projectName,
            entrustName: item.entrustName,
            createTime: item.planData.createTime,
            pointCount: item.pointCount
          })))

          // 检查是否有点位维保数据
          if (processedData.length === 0) {
            console.log('【调试】处理后没有点位维保数据')
            console.log('【调试】原始数据中可能包含非点位维保的数据，已过滤')
            this.allMaintenancePointList = []
            this.maintenancePointList = []
            this.total = 0
            this.$message.info('当前没有点位维保数据')
            return
          }

          // 额外验证：检查是否所有数据都是真正的点位维保
          const hasValidPointMaintenance = processedData.every(item =>
            item.maintenanceType === '点位维保' &&
            item.planData &&
            item.planData.maintenanceMethod === '点位维保'
          )

          if (!hasValidPointMaintenance) {
            console.log('【调试】数据验证失败，存在非点位维保数据')
            this.allMaintenancePointList = []
            this.maintenancePointList = []
            this.total = 0
            this.$message.info('数据验证失败，当前没有有效的点位维保数据')
            return
          }

          this.allMaintenancePointList = processedData

          // 应用过滤和分页
          this.applyFiltersAndPagination()
        } else {
          console.log('【调试】API调用失败或无数据')
          this.allMaintenancePointList = []
          this.maintenancePointList = []
          this.total = 0
          this.$message.info('当前没有点位维保数据')
        }
      } catch (error) {
        console.error('【调试】获取维保点位列表失败:', error)
        this.allMaintenancePointList = []
        this.maintenancePointList = []
        this.total = 0
        this.$message.error('获取数据失败: ' + (error.message || '未知错误'))
      } finally {
        this.loading = false
      }
    },

    // 将点位数据转换为项目维保数据格式
    transformPointDataToProjectData(pointList) {
      // 按项目分组
      const projectMap = new Map()

      pointList.forEach(point => {
        const projectKey = point.projectId || point.projectName || '默认项目'

        if (!projectMap.has(projectKey)) {
          projectMap.set(projectKey, {
            id: point.projectId || point._id,
            projectName: point.projectName || '未命名项目',
            entrustName: point.entrustName || point.organizationName || '未知委托单位',
            status: this.getServiceStatus(point),
            maintenanceType: '点位维保',
            pointCount: 0,
            points: []
          })
        }

        const project = projectMap.get(projectKey)
        project.pointCount++
        project.points.push(point)
      })

      return Array.from(projectMap.values())
    },

    getServiceStatus(plan) {
      // 根据维保计划状态判断服务状态
      const status = plan.planStatus || plan.status

      if (status === '进行中' || status === '待开始' || status === '已审核') {
        return '服务中'
      } else if (status === '已完成' || status === '已暂停' || status === '已到期') {
        return '已到期'
      } else {
        return '服务中' // 默认状态
      }
    },

    // 应用过滤和分页
    applyFiltersAndPagination() {
      console.log('【调试】开始应用过滤，搜索参数:', this.searchParams)

      // 1. 先过滤数据
      const filteredData = this.allMaintenancePointList.filter(item => {
        // 项目名称过滤
        if (this.searchParams.projectName &&
            !item.projectName.toLowerCase().includes(this.searchParams.projectName.toLowerCase())) {
          return false
        }

        // 委托单位过滤
        if (this.searchParams.entrustName &&
            !item.entrustName.toLowerCase().includes(this.searchParams.entrustName.toLowerCase())) {
          return false
        }

        // 服务状态过滤
        if (this.searchParams.status && item.status !== this.searchParams.status) {
          return false
        }

        return true
      })

      console.log('【调试】过滤后的数据:', filteredData)

      // 2. 更新总数
      this.total = filteredData.length

      // 3. 应用分页
      const startIndex = (this.queryParams.page - 1) * this.queryParams.size
      const endIndex = startIndex + this.queryParams.size
      this.maintenancePointList = filteredData.slice(startIndex, endIndex)

      console.log('【调试】分页后的数据:', this.maintenancePointList)
      console.log('【调试】总数:', this.total)
    },

    // 搜索
    handleSearch() {
      console.log('【调试】执行搜索，搜索参数:', this.searchParams)

      // 重置到第一页
      this.queryParams.page = 1

      // 应用过滤和分页
      this.applyFiltersAndPagination()

      // 显示搜索结果提示
      if (this.searchParams.projectName || this.searchParams.entrustName || this.searchParams.status) {
        this.$message.success(`搜索完成，共找到 ${this.total} 条记录`)
      }
    },

    // 重置
    handleReset() {
      console.log('【调试】执行重置')

      // 清空搜索参数
      this.searchParams = {
        projectName: '',
        entrustName: '',
        status: ''
      }

      // 重置分页参数
      this.queryParams = {
        page: 1,
        size: this.queryParams.size, // 保持当前页面大小
        projectName: '',
        entrustName: '',
        status: ''
      }

      // 应用过滤和分页（显示所有数据）
      this.applyFiltersAndPagination()

      this.$message.success('重置完成，显示所有数据')
    },

    // 查看详情
    handleDetail(item) {
      console.log('跳转到点位详情页面，项目信息:', item)
      // 跳转到点位详情页面，传递维保计划ID
      this.$router.push({
        name: 'MaintenancePointDetail',
        params: {
          pointId: item.id // 这里实际上是维保计划的ID
        },
        query: {
          projectName: item.projectName,
          entrustName: item.entrustName
        }
      })
    },

    // 添加点位
    handleAddPoint(item) {
      console.log('跳转到添加点位页面，项目信息:', item)
      // 跳转到添加点位页面，传递项目信息
      this.$router.push({
        name: 'AddMaintenancePoint',
        query: {
          projectId: item.id,
          projectName: item.projectName,
          entrustName: item.entrustName
        }
      })
    },

    // 分页大小改变
    handleSizeChange(val) {
      this.queryParams.size = val
      this.queryParams.page = 1
      this.applyFiltersAndPagination()
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.queryParams.page = val
      this.applyFiltersAndPagination()
    },

    // 删除维保点位
    handleDelete(item) {
      this.$confirm(`确定要删除项目"${item.projectName}"的维保点位吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 这里调用删除API
        this.deleteMaintenancePoint(item)
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },

    // 调用删除API
    async deleteMaintenancePoint(item) {
      try {
        console.log('删除维保点位:', item)

        // 调用后端删除API - 使用正确的plan端点
        const response = await request.delete(`/plan/${item.id}`)

        console.log('删除API响应:', response)

        if (response.success) {
          this.$message.success('删除成功')

          // 从本地数据中移除已删除的项目
          this.allMaintenancePointList = this.allMaintenancePointList.filter(point => point.id !== item.id)

          // 重新应用过滤和分页
          this.applyFiltersAndPagination()
        } else {
          this.$message.error(response.message || '删除失败')
        }
      } catch (error) {
        console.error('删除维保点位失败:', error)
        this.$message.error('删除失败: ' + (error.message || '未知错误'))
      }
    }
  }
}
</script>

<style scoped>
/* 页面容器 */
.maintenance-point-page {
  padding: 20px;
  background: #f9fbfd;
  min-height: 100vh;
}

/* 面包屑导航 */
.breadcrumb {
  margin-bottom: 20px;
  font-size: 14px;
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
  color: #ccc;
}

/* 搜索过滤区域 */
.search-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  align-items: flex-end;
}

.filter-item {
  display: flex;
  align-items: flex-end;
  height: 36px;
}

.filter-input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  height: 36px;
  width: 240px;
  box-sizing: border-box;
  line-height: 20px;
}

.filter-select {
  width: 240px !important;
}

.filter-select >>> .el-input__inner {
  height: 36px !important;
  line-height: 20px !important;
  padding: 8px 12px !important;
  border: 1px solid #ccc !important;
  border-radius: 6px !important;
  font-size: 14px !important;
  box-sizing: border-box !important;
}

.filter-actions {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  height: 36px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  height: 36px;
  box-sizing: border-box;
}

.btn-primary {
  background-color: #409EFF;
  color: white;
}

.btn-primary:hover {
  background-color: #66b1ff;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}

.btn-secondary:hover {
  background-color: #ddd;
}

.btn-sm {
  padding: 5px 10px;
  font-size: 12px;
  margin-right: 8px;
  height: auto;
  min-width: 60px;
}

/* 操作列样式优化 */
.operation-column {
  min-width: 150px;
}

.operation-buttons {
  display: flex;
  gap: 5px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-success {
  background-color: #67c23a;
  color: white;
}

.btn-success:hover {
  background-color: #5daf34;
}

.btn-danger {
  background-color: #f56c6c;
  color: white;
}

.btn-danger:hover {
  background-color: #f78989;
}

/* 图标样式 */
.search-icon, .reset-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 5px;
}

/* 筛选状态样式 */
.filter-status {
  margin-left: 15px;
  display: flex;
  align-items: center;
}

.filter-tag {
  background-color: #e6f7ff;
  color: #1890ff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  border: 1px solid #91d5ff;
  display: flex;
  align-items: center;
  gap: 4px;
}

.filter-tag i {
  font-size: 12px;
}

/* 表格样式 */
.table-container {
  border: 1px solid #eee;
  border-radius: 4px;
  overflow-x: auto;
  background: white;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.data-table th {
  background-color: #f5f7fa;
  font-weight: bold;
  text-align: center;
}

.data-table td {
  text-align: center;
}

/* 状态样式 */
.status-active {
  color: #409EFF;
  font-weight: bold;
}

.status-expired {
  color: #f56c6c;
  font-weight: bold;
}

.maintenance-type {
  color: #67c23a;
  font-weight: bold;
}

/* 无数据状态 */
.no-data {
  text-align: center;
  padding: 50px 0;
  color: #909399;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 10px;
  opacity: 0.7;
}

/* 分页样式 */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 0 20px 20px 20px;
}

.pagination-info {
  color: #666;
  font-size: 14px;
}
</style>
