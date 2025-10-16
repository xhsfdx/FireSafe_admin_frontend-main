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
        >
      </div>
      <div class="filter-item">
        <input
          v-model="searchParams.pointType"
          type="text"
          placeholder="输入点位类型搜索"
          class="filter-input"
        >
      </div>
      <div class="filter-actions">
        <button class="btn btn-primary" @click="handleSearch">
          <i class="el-icon-search search-icon" /> 查询
        </button>
        <button class="btn btn-secondary" @click="handleReset">
          <i class="el-icon-refresh reset-icon" /> 重置
        </button>
        <button class="btn btn-primary" @click="goBack">
          <i class="el-icon-back" /> 返回
        </button>
      </div>
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
          :key="point.id" 
          class="point-card"
        >
          <!-- 点位图标 -->
          <div class="card-icon">
            <div class="icon-placeholder">
              <div class="icon-pattern"></div>
            </div>
          </div>
          
          <!-- 点位信息 -->
          <div class="card-content">
            <h3 class="point-name">{{ point.pointName }}</h3>
            <p class="point-address">{{ point.address }}</p>
            <p class="point-type">类型：{{ point.pointType }}</p>
            <p class="project-info">项目：{{ point.projectName }}</p>
            <p class="entrust-info">委托单位：{{ point.entrustName }}</p>
          </div>
          
          <!-- 操作按钮 -->
          <div class="card-actions">
            <span class="action-link active" @click="showBasicInfo(point)">基础信息</span>
            <span class="action-separator">|</span>
            <span class="action-link" @click="showMaintenanceContent(point)">维保内容</span>
            <span class="action-separator">|</span>
            <span class="action-link disable" @click="disablePoint(point)">禁用</span>
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
      }
    }
  },
  mounted() {
    this.loadPointList()
  },
  methods: {
    // 加载点位列表
    async loadPointList() {
      try {
        this.loading = true
        console.log('加载点位列表')
        
        // 从路由参数获取planId
        const planId = this.$route.params.pointId
        console.log('维保计划ID:', planId)
        
        if (!planId) {
          this.$message.error('缺少维保计划ID')
          return
        }
        
        // 调用后端API获取维保计划的点位列表
        const response = await request.get(`/point/maintainPoint/${planId}/checkpoint`)
        console.log('点位列表API响应:', response)
        
        if (response.success && response.data) {
          const planData = response.data
          console.log('维保计划数据:', planData)
          
          // 从checkpoints中提取点位信息
          if (planData.checkpoints && Array.isArray(planData.checkpoints)) {
            this.allPointList = planData.checkpoints.map((checkpoint, index) => ({
              id: checkpoint._id,
              pointName: checkpoint.name,
              pointType: checkpoint.type,
              address: checkpoint.address,
              photo: checkpoint.photo || '',
              projectName: planData.plan?.projectName || '未知项目',
              entrustName: planData.plan?.ownerName || '未知委托单位',
              maintenanceItems: checkpoint.maintenanceItems || []
            }))
            
            // 应用搜索过滤
            this.applySearchFilter()
          } else {
            this.allPointList = []
            this.pointList = []
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
      let filteredData = this.allPointList.filter(point => {
        // 点位名称过滤
        if (this.searchParams.pointName && 
            !point.pointName.toLowerCase().includes(this.searchParams.pointName.toLowerCase())) {
          return false
        }
        
        // 点位类型过滤
        if (this.searchParams.pointType && 
            !point.pointType.toLowerCase().includes(this.searchParams.pointType.toLowerCase())) {
          return false
        }
        
        return true
      })
      
      this.pointList = filteredData
      console.log('过滤后的点位列表:', this.pointList)
    },
    
    // 搜索
    handleSearch() {
      console.log('搜索点位:', this.searchParams)
      this.applySearchFilter()
    },
    
    // 重置
    handleReset() {
      this.searchParams = {
        pointName: '',
        pointType: ''
      }
      this.applySearchFilter()
    },
    
    // 显示基础信息
    showBasicInfo(point) {
      console.log('跳转到基础信息页面，点位信息:', point)
      const planId = this.$route.params.pointId // 这里的pointId实际上是planId
      this.$router.push({
        name: 'MaintenancePointBasicInfo',
        params: {
          pointId: point.id
        },
        query: {
          planId: planId
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
          pointId: point.id
        },
        query: {
          planId: planId
        }
      })
    },
    
    
    // 禁用点位
    disablePoint(point) {
      this.$confirm(`确定要禁用点位"${point.pointName}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('点位已禁用')
        // 这里可以调用禁用API
      }).catch(() => {
        this.$message.info('已取消禁用')
      })
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

.point-address {
  font-size: 14px;
  color: #666;
  margin: 0 0 6px 0;
}

.point-type {
  font-size: 12px;
  color: #999;
  margin: 0 0 4px 0;
}

.project-info {
  font-size: 12px;
  color: #999;
  margin: 0 0 4px 0;
}

.entrust-info {
  font-size: 12px;
  color: #999;
  margin: 0;
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
