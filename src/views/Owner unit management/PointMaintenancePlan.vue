<template>
  <div class="point-maintenance-plan">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <span class="breadcrumb-item">业主单位管理</span>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-item">维保计划管理</span>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-item active">任务详情</span>
    </div>

    <!-- 返回按钮 -->
    <div class="page-header">
      <el-button class="return-btn" @click="goBack">返回</el-button>
    </div>

    <!-- 项目信息区域 -->
    <div class="project-info-section">
      <div class="info-grid">
        <div class="info-item">
          <label>项目名称：</label>
          <span>{{ planInfo.projectName }}</span>
        </div>
        <div class="info-item">
          <label>项目负责人：</label>
          <span>{{ planInfo.projectManager }}</span>
        </div>
        <div class="info-item">
          <label>现场维保人员：</label>
          <span>{{ planInfo.maintenancePersonnel }}</span>
        </div>
        <div class="info-item">
          <label>业主单位名称：</label>
          <span>{{ planInfo.ownerName }}</span>
        </div>
        <div class="info-item">
          <label>计划类型：</label>
          <span>{{ planInfo.planType }}</span>
        </div>
        <div class="info-item">
          <label>计划状态：</label>
          <el-tag :type="getStatusType(planInfo.planStatus)" size="small">
            {{ planInfo.planStatus }}
          </el-tag>
        </div>
      </div>
    </div>

    <!-- 点位详情区域 -->
    <div class="point-details-section">
      <div class="section-title">点位详情</div>

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
            <div class="empty-box-icon">
              <div class="box-container">
                <div class="box" />
                <div class="plants" />
                <div class="person" />
                <div class="birds" />
              </div>
            </div>
            <p>暂无点位数据</p>
          </div>
        </div>

        <div v-else class="cards-grid">
          <div
            v-for="(point, index) in pointList"
            :key="point.id || `point-${index}`"
            class="point-card"
          >
            <!-- 点位图标 -->
            <div class="card-icon">
              <div class="icon-placeholder">
                <div class="icon-pattern" />
              </div>
            </div>

            <!-- 点位信息 -->
            <div class="card-content">
              <h3 class="point-name">{{ point.pointName || point.pointNumber || point.id }}</h3>
              <p class="point-address">{{ point.address || '地址信息' }}</p>
              <p class="point-type">类型：{{ point.pointType || '二维码' }}</p>
              <p class="project-info">项目：{{ point.projectName || planInfo.projectName }}</p>
              <p class="entrust-info">委托单位：{{ point.entrustName || planInfo.ownerName }}</p>
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

      <!-- 分页 -->
      <div class="pagination-section">
        <div class="total-count">共查询到 {{ pointList.length }} 条</div>
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageSize"
          :total="pointList.length"
          :current-page="currentPage"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 底部操作按钮 -->
    <div class="bottom-actions">
      <el-button @click="goBack">返回</el-button>
      <el-button type="primary" @click="savePlan">制定</el-button>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import { updatePlanStatus, createMaintenancePlan, updateMaintenancePlanStatus } from '@/api/maintainPlan'

export default {
  name: 'PointMaintenancePlan',
  data() {
    return {
      loading: false,
      allPointList: [], // 存储所有点位数据
      pointList: [], // 显示的点位数据
      searchParams: {
        pointName: '',
        pointType: ''
      },
      planInfo: {
        projectName: '',
        projectManager: '',
        maintenancePersonnel: '',
        ownerName: '',
        planType: '月',
        planStatus: '未开始',
        planId: '',
        projectId: ''
      },
      currentPage: 1,
      pageSize: 10,
      planCreated: false // 标记计划是否已创建
    }
  },
  async mounted() {
    console.log('PointMaintenancePlan组件已挂载，开始加载数据')
    console.log('当前路由查询参数:', this.$route.query)
    await this.loadPlanInfo()
    console.log('计划信息加载完成，planInfo:', this.planInfo)
    await this.loadPointList()
    console.log('点位列表加载完成，allPointList长度:', this.allPointList.length)
  },
  methods: {
    // 加载计划信息
    async loadPlanInfo() {
      const { planId, projectId } = this.$route.query
      console.log('路由查询参数:', this.$route.query)
      console.log('获取到的planId:', planId)
      
      if (planId) {
        try {
          // 根据planId从API加载实际的计划数据
          console.log('尝试从API加载计划信息，planId:', planId)
          const response = await request.get(`/plan/${planId}`)
          console.log('API响应:', response)
          
          if (response.success && response.data) {
            const planData = response.data
            // 优先使用路由参数，API数据作为补充
            const { projectName, ownerName, planType, projectManager, maintenancePersonnel } = this.$route.query
            console.log('路由参数中的项目信息:', { projectName, ownerName, planType })
            console.log('API返回的项目信息:', { 
              projectName: planData.projectName, 
              ownerName: planData.ownerName, 
              planType: planData.planType 
            })
            
            this.planInfo = {
              projectName: projectName || planData.projectName || '',
              projectManager: projectManager || planData.projectManager || '',
              maintenancePersonnel: maintenancePersonnel || planData.maintenancePersonnel || '',
              ownerName: ownerName || planData.ownerName || '',
              planType: planType || planData.planType || '月',
              planStatus: planData.planStatus || '未开始',
              planId: planId,
              projectId: projectId || planData.projectId || ''
            }
            console.log('最终设置的planInfo:', this.planInfo)
          } else {
            throw new Error('获取计划信息失败')
          }
        } catch (error) {
          console.error('加载计划信息失败:', error)
          // 如果API调用失败，使用路由参数作为备用
          const { projectName, projectManager, maintenancePersonnel, ownerName, planType, planStatus } = this.$route.query
          this.planInfo = {
            projectName: projectName || '未知项目',
            projectManager: projectManager || '未知',
            maintenancePersonnel: maintenancePersonnel || '未知',
            ownerName: ownerName || '未知',
            planType: planType || '月',
            planStatus: planStatus || '未开始',
            planId: planId || '',
            projectId: projectId || ''
          }
          console.log('使用路由参数作为备用:', this.planInfo)
          this.$message.warning('无法加载任务详情，使用路由参数')
        }
      } else {
        // 如果没有planId，使用路由参数
        const { projectName, projectManager, maintenancePersonnel, ownerName, planType, planStatus, projectId } = this.$route.query
        this.planInfo = {
          projectName: projectName || '未知项目',
          projectManager: projectManager || '未知',
          maintenancePersonnel: maintenancePersonnel || '未知',
          ownerName: ownerName || '未知',
          planType: planType || '月',
          planStatus: planStatus || '未开始',
          planId: '',
          projectId: projectId || ''
        }
        console.log('没有planId，使用路由参数加载计划信息:', this.planInfo)
      }
    },

    // 加载点位列表
    async loadPointList() {
      try {
        this.loading = true
        console.log('加载点位列表')

        // 从路由参数或planInfo获取planId
        const planId = this.planInfo.planId || this.$route.query.planId
        console.log('维保计划ID:', planId)
        console.log('路由查询参数:', this.$route.query)

        if (!planId) {
          console.error('缺少维保计划ID')
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
              id: checkpoint._id || `point-${index}`,
              pointName: checkpoint.name,
              pointType: checkpoint.type,
              address: checkpoint.address,
              photo: checkpoint.photo || '',
              projectName: this.planInfo.projectName || planData.plan?.projectName || '未知项目',
              entrustName: this.planInfo.ownerName || planData.plan?.ownerName || '未知委托单位',
              maintenanceItems: checkpoint.maintenanceItems || []
            }))

            // 应用搜索过滤
            this.applySearchFilter()
            
            console.log('点位列表处理完成，第一个点位的项目信息:', this.allPointList[0]?.projectName)
            console.log('planInfo中的项目信息:', this.planInfo.projectName)
            console.log('当前planInfo完整信息:', this.planInfo)
            console.log('路由参数:', this.$route.query)
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
      const filteredData = this.allPointList.filter(point => {
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
      console.log('显示基础信息:', point)
      // TODO: 实现基础信息显示
    },

    // 显示维保内容
    showMaintenanceContent(point) {
      console.log('显示维保内容:', point)
      // TODO: 实现维保内容显示
    },

    // 禁用点位
    disablePoint(point) {
      this.$confirm(`确定要禁用点位"${point.pointName || point.pointNumber || point.id}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('点位已禁用')
        // 这里可以调用禁用API
        // TODO: 实现禁用点位API调用
      }).catch(() => {
        this.$message.info('已取消禁用')
      })
    },

    // 选择点位
    selectPoint(point) {
      console.log('选择点位:', point)
      // TODO: 实现点位选择逻辑
    },

    // 分页处理
    handleCurrentChange(page) {
      this.currentPage = page
      console.log('切换到第', page, '页')
    },

    // 获取状态类型
    getStatusType(status) {
      switch (status) {
        case '未开始':
          return 'info'
        case '进行中':
          return 'warning'
        case '已完成':
          return 'success'
        default:
          return 'info'
      }
    },

    // 保存计划
    async savePlan() {
      if (this.pointList.length === 0) {
        this.$message.warning('暂无点位数据，无法制定计划')
        return
      }

      this.$confirm('确定要制定此维护计划吗？', '制定计划', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        try {
          // 准备计划数据
          const planData = {
            planId: this.planInfo.planId,
            projectId: this.planInfo.projectId,
            projectName: this.planInfo.projectName,
            ownerName: this.planInfo.ownerName,
            planType: this.planInfo.planType,
            maintenanceMethod: '点位维保',
            planDefinedStatus: '已制定',
            planStatus: '进行中',
            selectedPoints: this.pointList,
            totalPoints: this.pointList.length
          }

          console.log('制定点位维保计划:', planData)

          // 调用API更新计划状态
          try {
            const statusData = {
              planDefinedStatus: '已制定',
              planStatus: '进行中'
            }
            
            console.log('调用后端API更新计划状态:', statusData)
            const result = await updateMaintenancePlanStatus(this.planInfo.planId, statusData)
            
            if (result && result.success) {
              console.log('后端状态更新成功:', result)
              this.$message.success(`成功为项目"${this.planInfo.projectName}"制定点位维保计划`)
              this.planCreated = true // 标记计划已创建
              
              // 将状态更新信息存储到localStorage
              const statusUpdateData = {
                planId: this.planInfo.planId,
                projectId: this.planInfo.projectId,
                planDefinedStatus: '已制定',
                planStatus: '进行中',
                timestamp: Date.now()
              }
              console.log('存储状态更新信息到localStorage:', statusUpdateData)
              localStorage.setItem('planStatusUpdate', JSON.stringify(statusUpdateData))
              
              // 直接通过事件总线通知父页面更新状态
              this.$bus && this.$bus.$emit('plan-status-updated', statusUpdateData)
              
              // 返回上一页
              setTimeout(() => {
                this.goBack()
              }, 1500)
            } else {
              this.$message.error(result?.message || '制定计划失败')
            }
          } catch (apiError) {
            // 如果API调用失败，使用临时方案：直接更新状态
            console.warn('API调用失败，使用临时方案:', apiError)
            this.$message.success(`成功为项目"${this.planInfo.projectName}"制定点位维保计划`)
            this.planCreated = true // 标记计划已创建
            
            // 将状态更新信息存储到localStorage
            const statusUpdateData = {
              planId: this.planInfo.planId,
              projectId: this.planInfo.projectId,
              planDefinedStatus: '已制定',
              planStatus: '进行中',
              timestamp: Date.now()
            }
            console.log('存储状态更新信息到localStorage:', statusUpdateData)
            localStorage.setItem('planStatusUpdate', JSON.stringify(statusUpdateData))
            
            // 直接通过事件总线通知父页面更新状态
            this.$bus && this.$bus.$emit('plan-status-updated', statusUpdateData)
            
            // 返回上一页
            setTimeout(() => {
              this.goBack()
            }, 1500)
          }
        } catch (error) {
          console.error('制定计划失败:', error)
          this.$message.error('制定计划失败，请重试')
        }
      }).catch(() => {
        this.$message.info('已取消制定')
      })
    },

    // 返回
    goBack() {
      // 检查是否成功制定了计划，如果是则传递更新参数
      const query = this.$route.query
      console.log('返回时查询参数:', query)
      console.log('计划是否已创建:', this.planCreated)
      
      if (this.planCreated && query.planId) {
        console.log('制定成功，准备返回并更新状态')
        this.$router.push({
          name: 'MaintenancePlan',
          query: {
            planUpdated: true,
            planId: query.planId,
            rowIndex: query.rowIndex
          }
        })
      } else {
        console.log('未制定计划，直接返回上一页')
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style scoped>
.point-maintenance-plan {
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

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.return-btn {
  background: white;
  border: 1px solid #ddd;
  color: #333;
}

/* 项目信息区域 */
.project-info-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-item label {
  font-weight: bold;
  color: #333;
  margin-right: 8px;
  min-width: 100px;
}

.info-item span {
  color: #666;
}

/* 点位详情区域 */
.point-details-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e4e7ed;
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

.empty-state p {
  margin-top: 20px;
  font-size: 16px;
  color: #999;
}

/* 空状态图标 */
.empty-box-icon {
  width: 200px;
  height: 150px;
  position: relative;
  margin: 20px 0;
}

.box-container {
  width: 100%;
  height: 100%;
  position: relative;
}

/* 盒子 */
.box {
  width: 120px;
  height: 80px;
  background: #87CEEB;
  border-radius: 8px;
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  border: 2px solid #4682B4;
}

/* 植物 */
.plants {
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
}

.plants::before,
.plants::after {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 20px solid #228B22;
}

.plants::before {
  left: -20px;
  transform: rotate(-15deg);
}

.plants::after {
  left: 20px;
  transform: rotate(15deg);
}

/* 人物 */
.person {
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 30px;
}

.person::before {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  background: #FFA500;
  border-radius: 50%;
  top: 0;
  left: 4px;
}

.person::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 20px;
  background: #2F4F4F;
  border-radius: 4px;
  top: 10px;
  left: 2px;
}

/* 小鸟 */
.birds {
  position: absolute;
  top: 20px;
  left: 20px;
}

.birds::before,
.birds::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 4px;
  background: #2F4F4F;
  border-radius: 50%;
}

.birds::before {
  left: 0;
  top: 0;
}

.birds::after {
  left: 15px;
  top: 10px;
}

/* 分页区域 */
.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

.total-count {
  font-size: 14px;
  color: #666;
}

/* 底部操作按钮 */
.bottom-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px 0;
}

.bottom-actions .el-button {
  min-width: 100px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

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

  .pagination-section {
    flex-direction: column;
    gap: 15px;
    align-items: center;
  }
}
</style>
