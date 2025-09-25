<template>
  <div class="point-detail-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <span class="breadcrumb-item">业主单位管理</span>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-item">维保点位管理</span>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-item active">维保点位详情</span>
    </div>

    <!-- 搜索筛选区域 -->
    <div class="search-filter">
      <div class="filter-item">
        <input
          v-model="searchParams.pointName"
          type="text"
          placeholder="输入点位名称搜索"
          class="filter-input"
          @keyup.enter="handleSearch"
          @input="handleRealTimeSearch"
        >
      </div>
      <div class="filter-item">
        <input
          v-model="searchParams.pointType"
          type="text"
          placeholder="输入点位类型搜索"
          class="filter-input"
          @keyup.enter="handleSearch"
          @input="handleRealTimeSearch"
        >
      </div>
      <div class="filter-actions">
        <button class="btn btn-primary" @click="handleSearch">
          <i class="el-icon-search search-icon" /> 查询
        </button>
        <button class="btn btn-secondary" @click="handleReset">
          <i class="el-icon-refresh reset-icon" /> 重置
        </button>
        <button class="btn btn-secondary" @click="refreshData">
          <i class="el-icon-refresh" /> 刷新数据
        </button>
        <button class="btn btn-primary" @click="goBack">
          <i class="el-icon-back" /> 返回
        </button>
      </div>
    </div>

    <!-- 统计信息 -->
    <div v-if="!loading && allPointList.length > 0" class="stats-info">
      <span class="total-count">共 {{ allPointList.length }} 个点位</span>
      <span v-if="pointList.length !== allPointList.length" class="filtered-count">
        ，显示 {{ pointList.length }} 个匹配结果
      </span>
    </div>

    <!-- 点位卡片展示区域 -->
    <div class="cards-container">
      <div v-if="loading" class="loading-state">
        <div class="empty-state">
          <p>加载中...</p>
        </div>
      </div>

      <div v-else-if="pointList.length === 0" class="no-data-state">
        <div class="empty-state">
          <img src="@/assets/无数据.jpg" alt="没有数据" class="empty-icon">
          <p>暂无数据</p>
        </div>
      </div>

      <div v-else class="cards-grid">
        <div
          v-for="(point, index) in pointList"
          :key="point.id || `point-${index}`"
          class="point-card"
          :class="{ 'disabled-card': point.status === 'disabled' }"
        >
          <!-- 点位图标 -->
          <div class="card-icon">
            <div class="icon-placeholder">
              <div class="icon-pattern" />
            </div>
          </div>

          <!-- 点位信息 -->
          <div class="card-content">
            <h3 class="point-name">{{ point.pointName || '未命名点位' }}</h3>
            <p class="point-address">
              <i class="el-icon-location-outline" />
              {{ point.address || '地址未设置' }}
            </p>
            <p class="point-type">
              <i class="el-icon-s-grid" />
              类型：{{ point.pointType || '未设置' }}
            </p>
            <p class="project-info">
              <i class="el-icon-office-building" />
              项目：{{ point.projectName || '未知项目' }}
            </p>
            <p class="entrust-info">
              <i class="el-icon-user" />
              委托单位：{{ point.entrustName || '未知委托单位' }}
            </p>
            <p class="status-info">
              <i v-if="point.status === 'enabled'" class="el-icon-circle-check" />
              <i v-else class="el-icon-circle-close" />
              状态：{{ point.status === 'enabled' ? '启用' : '禁用' }}
            </p>
          </div>

          <!-- 操作按钮 -->
          <div class="card-actions">
            <span class="action-link active" @click="showBasicInfo(point)">基础信息</span>
            <span class="action-separator">|</span>
            <span class="action-link" @click="showMaintenanceContent(point)">维保内容</span>
            <span class="action-separator">|</span>
            <span
              v-if="point.status === 'enabled'"
              class="action-link disable"
              :class="{ 'loading': updatingStatus }"
              @click="disablePoint(point)"
            >
              <i v-if="updatingStatus" class="el-icon-loading" />
              {{ updatingStatus ? '处理中...' : '禁用' }}
            </span>
            <span
              v-else
              class="action-link enable"
              :class="{ 'loading': updatingStatus }"
              @click="enablePoint(point)"
            >
              <i v-if="updatingStatus" class="el-icon-loading" />
              {{ updatingStatus ? '处理中...' : '启用' }}
            </span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'MPMPointDetail',
  data() {
    return {
      loading: false,
      allPointList: [], // 存储所有点位数据
      pointList: [], // 显示的点位数据
      searchParams: {
        pointName: '',
        pointType: ''
      },
      searchTimer: null, // 搜索防抖定时器
      isRealTimeSearch: false, // 是否为实时搜索标志
      updatingStatus: false // 是否正在更新状态
    }
  },
  mounted() {
    this.loadPointList()
  },
  beforeDestroy() {
    // 组件销毁前清除定时器
    if (this.searchTimer) {
      clearTimeout(this.searchTimer)
    }
  },
  methods: {
    // 加载点位列表
    async loadPointList() {
      try {
        this.loading = true
        console.log('加载点位列表')

        // 从路由参数获取planId（这里的pointId实际上是维保计划的ID）
        const planId = this.$route.params.pointId
        console.log('维保计划ID:', planId)

        if (!planId) {
          this.$message.error('缺少维保计划ID')
          return
        }

        // 调用后端API获取维保计划的点位列表
        // 尝试不同的API端点
        let response
        try {
          // 首先尝试原始API端点
          response = await request.get(`/point/maintainPoint/${planId}/checkpoint`)
          console.log('原始API响应:', response)
        } catch (error) {
          console.log('原始API失败，尝试备用API:', error)
          // 如果原始API失败，尝试其他可能的端点
          try {
            response = await request.get(`/maintenance/plan/${planId}/points`)
            console.log('备用API响应:', response)
          } catch (error2) {
            console.log('备用API也失败，尝试第三个端点:', error2)
            response = await request.get(`/point/plan/${planId}`)
            console.log('第三个API响应:', response)
          }
        }
        console.log('点位列表API响应:', response)

        if (response.success && response.data) {
          const planData = response.data
          console.log('维保计划数据:', planData)
          console.log('数据结构分析:', {
            hasCheckpoints: !!planData.checkpoints,
            checkpointsType: typeof planData.checkpoints,
            checkpointsIsArray: Array.isArray(planData.checkpoints),
            checkpointsLength: planData.checkpoints?.length,
            hasPlan: !!planData.plan,
            planKeys: planData.plan ? Object.keys(planData.plan) : [],
            dataKeys: Object.keys(planData)
          })

          // 从checkpoints中提取点位信息
          if (planData.checkpoints && Array.isArray(planData.checkpoints)) {
            console.log('处理checkpoints数据:', planData.checkpoints)
            this.allPointList = planData.checkpoints.map((checkpoint, index) => {
              console.log(`处理第${index + 1}个点位:`, checkpoint)
              console.log(`点位${index + 1}的status字段:`, checkpoint.status)
              return {
                id: checkpoint._id || checkpoint.id || `point-${index}`,
                pointName: checkpoint.name || checkpoint.pointName,
                pointType: checkpoint.type || checkpoint.pointType,
                address: checkpoint.address,
                photo: checkpoint.photo || '',
                projectName: planData.plan?.projectName || planData.projectName || '未知项目',
                entrustName: planData.plan?.ownerName || planData.ownerName || '未知委托单位',
                maintenanceItems: checkpoint.maintenanceItems || [],
                status: checkpoint.status || 'enabled' // 添加状态字段，默认为启用状态
              }
            })

            // 应用搜索过滤
            this.applySearchFilter()
          } else {
            console.log('没有找到checkpoints数据或数据格式不正确')
            console.log('尝试其他可能的数据结构...')

            // 尝试其他可能的数据结构
            if (Array.isArray(planData)) {
              console.log('数据是数组格式，直接处理:', planData)
              this.allPointList = planData.map((item, index) => {
                console.log(`数组格式处理第${index + 1}个点位:`, item)
                console.log(`数组格式点位${index + 1}的status字段:`, item.status)
                return {
                  id: item._id || item.id || `point-${index}`,
                  pointName: item.name || item.pointName,
                  pointType: item.type || item.pointType,
                  address: item.address,
                  photo: item.photo || '',
                  projectName: item.projectName || '未知项目',
                  entrustName: item.entrustName || item.ownerName || '未知委托单位',
                  maintenanceItems: item.maintenanceItems || [],
                  status: item.status || 'enabled' // 添加状态字段，默认为启用状态
                }
              })
              this.applySearchFilter()
            } else {
              this.allPointList = []
              this.pointList = []
            }
          }

          console.log('点位列表加载完成:', this.pointList)
        } else {
          this.$message.error(response.message || '获取点位列表失败')
          this.pointList = []
        }
      } catch (error) {
        console.error('加载点位列表失败:', error)
        this.$message.error('加载点位列表失败: ' + (error.message || '未知错误'))
        this.pointList = []
      } finally {
        this.loading = false
      }
    },

    // 应用搜索过滤
    applySearchFilter() {
      const filteredData = this.allPointList.filter(point => {
        // 点位名称过滤（支持模糊搜索）
        if (this.searchParams.pointName && this.searchParams.pointName.trim()) {
          const searchName = this.searchParams.pointName.trim().toLowerCase()
          const pointName = (point.pointName || '').toLowerCase()
          if (!pointName.includes(searchName)) {
            return false
          }
        }

        // 点位类型过滤（支持模糊搜索）
        if (this.searchParams.pointType && this.searchParams.pointType.trim()) {
          const searchType = this.searchParams.pointType.trim().toLowerCase()
          const pointType = (point.pointType || '').toLowerCase()
          if (!pointType.includes(searchType)) {
            return false
          }
        }

        return true
      })

      this.pointList = filteredData
      console.log('过滤后的点位列表:', this.pointList)

      // 显示搜索结果提示（只在手动搜索时显示，实时搜索不显示）
      if ((this.searchParams.pointName || this.searchParams.pointType) && !this.isRealTimeSearch) {
        if (this.pointList.length === 0) {
          this.$message.info('没有找到匹配的点位')
        } else {
          this.$message.success(`找到 ${this.pointList.length} 个匹配的点位`)
        }
      }
    },

    // 搜索
    handleSearch() {
      console.log('搜索点位:', this.searchParams)
      this.applySearchFilter()
    },

    // 实时搜索（防抖处理）
    handleRealTimeSearch() {
      // 清除之前的定时器
      if (this.searchTimer) {
        clearTimeout(this.searchTimer)
      }

      // 设置新的定时器，500ms后执行搜索
      this.searchTimer = setTimeout(() => {
        this.isRealTimeSearch = true
        this.applySearchFilter()
        this.isRealTimeSearch = false
      }, 500)
    },

    // 重置
    handleReset() {
      // 清除搜索定时器
      if (this.searchTimer) {
        clearTimeout(this.searchTimer)
        this.searchTimer = null
      }

      this.searchParams = {
        pointName: '',
        pointType: ''
      }
      this.applySearchFilter()
      this.$message.info('搜索条件已重置')
    },

    // 显示基础信息
    showBasicInfo(point) {
      console.log('跳转到基础信息页面，点位信息:', point)
      const planId = this.$route.params.pointId // 这里的pointId实际上是planId
      this.$router.push({
        name: 'MaintenancePointBasicInfo',
        params: {
          pointId: point.id // 点位的真实ID
        },
        query: {
          planId: planId // 维保计划ID
        }
      })
    },

    // 显示维保内容
    showMaintenanceContent(point) {
      console.log('跳转到维保内容页面，点位信息:', point)
      const planId = this.$route.params.pointId // 这里的pointId实际上是planId
      this.$router.push({
        name: 'MaintenancePointMaintenanceContent',
        params: {
          pointId: point.id // 点位的真实ID
        },
        query: {
          planId: planId // 维保计划ID
        }
      })
    },

    // 禁用点位
    async disablePoint(point) {
      this.$confirm(`确定要禁用点位"${point.pointName}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          this.updatingStatus = true

          // 保存原始状态，用于回滚
          const originalStatus = point.status

          // 先更新本地状态（乐观更新）
          point.status = 'disabled'

          // 调用后端API
          const response = await this.updatePointStatus(point.id, 'disabled')

          if (response.success) {
            this.$message.success('点位已禁用')
          } else {
            // API调用失败，回滚状态
            point.status = originalStatus
            this.$message.error('禁用失败: ' + response.message)
          }
        } catch (error) {
          // 发生错误，回滚状态
          point.status = 'enabled'
          console.error('禁用点位失败:', error)
          this.$message.error('禁用失败: ' + (error.message || '网络错误'))
        } finally {
          this.updatingStatus = false
        }
      }).catch(() => {
        this.$message.info('已取消禁用')
      })
    },

    // 启用点位
    async enablePoint(point) {
      this.$confirm(`确定要启用点位"${point.pointName}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(async() => {
        try {
          this.updatingStatus = true

          // 保存原始状态，用于回滚
          const originalStatus = point.status

          // 先更新本地状态（乐观更新）
          point.status = 'enabled'

          // 调用后端API
          const response = await this.updatePointStatus(point.id, 'enabled')

          if (response.success) {
            this.$message.success('点位已启用')
          } else {
            // API调用失败，回滚状态
            point.status = originalStatus
            this.$message.error('启用失败: ' + response.message)
          }
        } catch (error) {
          // 发生错误，回滚状态
          point.status = 'disabled'
          console.error('启用点位失败:', error)
          this.$message.error('启用失败: ' + (error.message || '网络错误'))
        } finally {
          this.updatingStatus = false
        }
      }).catch(() => {
        this.$message.info('已取消启用')
      })
    },

    // 更新点位状态（后端API调用）
    async updatePointStatus(pointId, status) {
      try {
        console.log(`调用API更新点位 ${pointId} 状态为: ${status}`)

        const response = await request.put(`/point/maintainPoint/checkpoint/${pointId}/status`, {
          status: status
        })

        console.log('点位状态更新API响应:', response)

        if (response.success) {
          console.log('点位状态更新成功:', response.data)
          return response
        } else {
          console.error('API返回失败:', response.message)
          return response
        }
      } catch (error) {
        console.error('更新点位状态API调用失败:', error)
        throw error
      }
    },

    // 刷新数据
    refreshData() {
      console.log('手动刷新数据...')
      this.loadPointList()
    },

    // 返回上一页
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.point-detail-page {
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

/* 图标样式 */
.search-icon, .reset-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 5px;
}

/* 统计信息 */
.stats-info {
  margin-bottom: 15px;
  padding: 10px 15px;
  background: #f0f8ff;
  border-radius: 4px;
  border-left: 4px solid #409EFF;
  font-size: 14px;
  color: #666;
}

.total-count {
  font-weight: bold;
  color: #409EFF;
}

.filtered-count {
  color: #67C23A;
}

/* 卡片容器 */
.cards-container {
  background: #f9fbfd;
  min-height: 400px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

/* 点位卡片 */
.point-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s ease;
}

.point-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.disabled-card {
  opacity: 0.6;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
}

.disabled-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 卡片图标 */
.card-icon {
  margin-bottom: 15px;
}

.icon-placeholder {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #87CEEB, #4682B4);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.icon-pattern {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 4px;
  position: relative;
}

.icon-pattern::before,
.icon-pattern::after {
  content: '';
  position: absolute;
  background: #4682B4;
  border-radius: 2px;
}

.icon-pattern::before {
  width: 8px;
  height: 8px;
  top: 6px;
  left: 6px;
}

.icon-pattern::after {
  width: 6px;
  height: 6px;
  top: 16px;
  left: 16px;
}

/* 卡片内容 */
.card-content {
  flex: 1;
  margin-bottom: 15px;
}

.point-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
}

.point-address,
.point-type,
.project-info,
.entrust-info,
.status-info {
  font-size: 12px;
  color: #999;
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
}

.point-address {
  font-size: 14px;
  color: #666;
  margin: 0 0 6px 0;
}

.point-address i,
.point-type i,
.project-info i,
.entrust-info i,
.status-info i {
  margin-right: 6px;
  color: #409EFF;
  font-size: 14px;
}

.status-info .el-icon-circle-check {
  color: #67c23a;
}

.status-info .el-icon-circle-close {
  color: #f56c6c;
}

/* 卡片操作 */
.card-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.action-link {
  color: #409EFF;
  cursor: pointer;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.action-link:hover {
  background-color: #f0f8ff;
  color: #66b1ff;
}

.action-link.active {
  color: #409EFF;
  font-weight: bold;
  text-decoration: underline;
}

.action-link.disable {
  color: #f56c6c;
}

.action-link.disable:hover {
  background-color: #fef0f0;
  color: #f78989;
}

.action-link.enable {
  color: #67c23a;
}

.action-link.enable:hover {
  background-color: #f0f9ff;
  color: #85ce61;
}

.action-link.loading {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-link.loading:hover {
  background-color: transparent;
}

.action-separator {
  color: #ddd;
  margin: 0 8px;
  font-size: 14px;
}

/* 加载和无数据状态 */
.loading-state, .no-data-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #909399;
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 10px;
  opacity: 0.7;
}

/* 弹窗样式 */
.basic-info-content {
  padding: 20px 0;
}

.maintenance-content {
  padding: 20px 0;
}

.content-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e4e7ed;
}

.content-header h4 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 16px;
  font-weight: bold;
}

.search-box {
  margin-top: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.total-count {
  color: #666;
  font-size: 14px;
}

.empty-box {
  text-align: center;
  margin-top: 38px;
}

/* 照片显示 */
.photo-display {
  display: flex;
  align-items: center;
}

.point-photo {
  max-width: 200px;
  max-height: 150px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.no-photo {
  display: flex;
  align-items: center;
  color: #999;
  font-size: 14px;
}

.no-photo i {
  font-size: 24px;
  margin-right: 8px;
}

/* 只读表单样式 */
.view-form >>> .el-input.is-disabled .el-input__inner,
.view-form >>> .el-textarea.is-disabled .el-textarea__inner {
  color: #606266 !important;
  background-color: #F5F7FA !important;
  border-color: #E4E7ED !important;
  cursor: default !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .search-filter {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-input {
    width: 100%;
  }
}
</style>
