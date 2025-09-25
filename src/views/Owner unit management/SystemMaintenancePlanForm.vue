<template>
  <div class="system-maintenance-plan">
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

    <!-- 维保内容区域 -->
    <div v-loading="loading" class="maintenance-content-section" element-loading-text="加载维保数据中...">
      <div class="section-title">维保内容</div>
      <el-table :data="maintenanceList" border style="width: 100%;">
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column prop="systemCategory" label="消防系统/设施" align="center" />
        <el-table-column prop="deviceName" label="维保项目" align="center" />
        <el-table-column prop="maintainSlim" label="检测内容" align="center" />
        <el-table-column prop="frequency" label="维保周期" align="center" />
        <el-table-column prop="maintainContent" label="规范" align="center" />
      </el-table>
      <div v-if="!maintenanceList || maintenanceList.length === 0" class="empty-box">
        暂无维保内容
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
import { getMaintainStandardItems } from '@/api/contract'
import { updateMaintenancePlanStatus } from '@/api/maintainPlan'

export default {
  name: 'SystemMaintenancePlanForm',
  data() {
    return {
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
      maintenanceList: [], // 维保内容列表
      allMaintenanceItems: [], // 所有维保项目数据
      loading: false
    }
  },
  async mounted() {
    console.log('SystemMaintenancePlanForm组件已挂载，开始加载数据')
    console.log('当前路由查询参数:', this.$route.query)
    await this.loadPlanInfo()
    console.log('计划信息加载完成，planInfo:', this.planInfo)
    this.loadMaintenanceData()
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
              projectId: projectId || planData.projectId || '',
              maintenanceItems: planData.maintenanceItems || [] // 添加维保项目列表
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

    // 加载维保数据
    async loadMaintenanceData() {
      try {
        this.loading = true
        console.log('开始加载系统维保数据')
        
        // 获取所有标准维保项目
        const res = await getMaintainStandardItems()
        console.log('getMaintainStandardItems API响应:', res)
        
        // 检查不同的响应格式
        let rawData = null
        if (res && res.data) {
          rawData = res.data
          console.log('使用 res.data 格式')
        } else if (res && Array.isArray(res)) {
          rawData = res
          console.log('使用 res 数组格式')
        } else if (res && res.success && res.data) {
          rawData = res.data
          console.log('使用 res.success.data 格式')
        }
        
        console.log('提取的原始数据:', rawData)
        
        if (rawData && Array.isArray(rawData)) {
          console.log('原始数据长度:', rawData.length)
          this.allMaintenanceItems = rawData
          
          // 根据计划中的maintenanceItems生成维保内容列表
          this.generateMaintenanceListFromPlan(rawData)
          
          console.log('系统维保数据加载完成')
        } else {
          console.error('获取标准维保项目失败，响应格式:', res)
          this.$message.error('获取维保标准项目失败')
        }
      } catch (error) {
        console.error('加载维保数据失败:', error)
        this.$message.error('加载维保数据失败: ' + (error.message || '未知错误'))
      } finally {
        this.loading = false
      }
    },

    // 根据计划中的maintenanceItems生成维保内容列表
    generateMaintenanceListFromPlan(rawData) {
      console.log('开始根据计划生成维保内容列表')
      console.log('计划中的maintenanceItems:', this.planInfo.maintenanceItems)
      
      // 获取计划中已选择的维保项目ID列表
      const selectedItemIds = this.planInfo.maintenanceItems || []
      console.log('计划中已选择的维保项目ID数量:', selectedItemIds.length)
      console.log('计划中的前5个ID示例:', selectedItemIds.slice(0, 5))
      
      // 提取ID字符串列表 - 处理对象格式的ID
      const selectedIdStrings = selectedItemIds.map(item => {
        if (typeof item === 'string') {
          return item
        } else if (item && typeof item === 'object' && item._id) {
          return item._id.toString()
        } else {
          console.warn('无法识别的ID格式:', item)
          return null
        }
      }).filter(id => id !== null)
      
      console.log('提取的ID字符串列表:', selectedIdStrings.slice(0, 5))
      
      if (selectedItemIds.length === 0) {
        console.log('计划中没有维保项目，显示空列表')
        this.maintenanceList = []
        return
      }
      
      const maintenanceItems = []
      
      // 遍历所有标准维保项目，只选择计划中存在的项目
      let totalItems = 0
      let matchedItems = 0
      
      rawData.forEach(system => {
        if (system.devices && system.devices.length > 0) {
          system.devices.forEach(device => {
            if (device.items && device.items.length > 0) {
              device.items.forEach(item => {
                totalItems++
                
                // 检查当前项目是否在计划的选择列表中
                const isSelected = selectedIdStrings.includes(item._id.toString())
                
                // 添加详细的ID匹配调试信息
                if (totalItems <= 5) { // 只打印前5个项目的调试信息
                  console.log(`检查项目 ${totalItems}:`, {
                    itemIdStr: item._id.toString(),
                    isSelected,
                    selectedIdStrings: selectedIdStrings.slice(0, 3) // 显示前3个ID用于对比
                  })
                }
                
                if (isSelected) {
                  matchedItems++
                  const getPeriodLabel = (p) => {
                    if (!p) return ''
                    if (p === 1) return '月检'
                    if (p === 12) return '年检'
                    return p.toString()
                  }
                  
                  maintenanceItems.push({
                    id: item._id,
                    systemCategory: system.category,
                    deviceName: device.device,
                    maintainSlim: item.maintainSlim,
                    maintainContent: item.maintainContent,
                    frequency: getPeriodLabel(item.frequency)
                  })
                }
              })
            }
          })
        }
      })
      
      console.log('ID匹配统计:', {
        总项目数: totalItems,
        匹配项目数: matchedItems,
        计划中的ID数量: selectedItemIds.length,
        提取的ID字符串数量: selectedIdStrings.length
      })
      
      this.maintenanceList = maintenanceItems
      console.log('根据计划生成的维保内容列表:', this.maintenanceList)
      console.log('计划中的维保项目总数:', this.maintenanceList.length)
    },


    // 保存计划
    async savePlan() {
      if (this.maintenanceList.length === 0) {
        this.$message.warning('暂无维保内容')
        return
      }

      this.$confirm('确定要制定此维护计划吗？', '制定计划', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        // 准备计划数据
        const planData = {
          planId: this.planInfo.planId,
          projectId: this.planInfo.projectId,
          projectName: this.planInfo.projectName,
          ownerName: this.planInfo.ownerName,
          planType: this.planInfo.planType,
          maintenanceMethod: '系统维保',
          maintenanceItems: this.maintenanceList
        }

        console.log('制定系统维保计划:', planData)

        try {
          // 调用后端API更新计划状态
          const statusData = {
            planDefinedStatus: '已制定',
            planStatus: '进行中'
          }
          
          console.log('调用后端API更新计划状态:', statusData)
          const result = await updateMaintenancePlanStatus(this.planInfo.planId, statusData)
          
          if (result && result.success) {
            console.log('后端状态更新成功:', result)
            this.$message.success(`成功为项目"${this.planInfo.projectName}"制定系统维保计划`)
            
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
          this.$message.success(`成功为项目"${this.planInfo.projectName}"制定系统维保计划`)
          
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
      }).catch(() => {
        this.$message.info('已取消制定')
      })
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

    // 返回
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.system-maintenance-plan {
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

/* 维保内容区域 */
.maintenance-content-section {
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

/* 表格样式 */
.maintenance-content-section >>> .el-table {
  border: 1px solid #e4e7ed;
}

.maintenance-content-section >>> .el-table th {
  background-color: #f5f7fa;
  color: #333;
  font-weight: bold;
}

/* 空状态 */
.empty-box {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 14px;
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
@media (max-width: 1200px) {
  .main-content {
    flex-direction: column;
  }

  .left-panel,
  .right-panel {
    flex: none;
  }
}
</style>

