<template>
  <div class="maintenance-content-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <span class="breadcrumb-item">业主单位管理</span>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-item">维保点位管理</span>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-item">维保点位管理详情</span>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-item active">维保内容</span>
    </div>

    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">维保内容</h1>
        <div v-if="pointInfo.pointName" class="point-info">
          <span class="point-name-label">点位名称：</span>
          <span class="point-name-value">{{ pointInfo.pointName }}</span>
          <span class="point-type-label">类型：</span>
          <span class="point-type-value">{{ pointInfo.pointType }}</span>
        </div>
        <div class="header-actions">
          <el-button @click="goBack">
            <i class="el-icon-back" /> 返回
          </el-button>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div v-loading="loading" class="main-content" element-loading-text="加载中...">
      <!-- 维保内容表格 -->
      <div class="maintenance-table-section">
        <div class="table-header">
          <h3 class="table-title">维保内容</h3>
        </div>

        <el-table
          :data="checkedMaintList"
          border
          style="width: 100%;"
        >
          <el-table-column type="index" label="序号" width="55" align="center" />
          <el-table-column prop="systemCategory" label="消防系统/设施" align="center" />
          <el-table-column prop="deviceName" label="维保项目" align="center" />
          <el-table-column prop="maintainSlim" label="检测内容" align="center" />
          <el-table-column prop="frequency" label="维保周期" align="center" />
          <el-table-column prop="maintainContent" label="规范" align="center" />
        </el-table>

        <div v-if="!checkedMaintList || checkedMaintList.length === 0" class="empty-box">
          <img src="@/assets/无数据.jpg" style="width: 128px; opacity: 0.7; margin-top: 20px;">
          <div style="color: #888; margin-top: 8px;">暂无维保内容</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMaintainStandardItems } from '@/api/contract'
import request from '@/utils/request'

export default {
  name: 'MPMMaintenanceContent',
  data() {
    return {
      checkedMaintList: [], // 已选择的维保项目列表（用于显示）
      pointInfo: {
        pointName: '',
        pointType: '',
        address: '',
        projectName: '',
        entrustName: ''
      },
      loading: false
    }
  },
  mounted() {
    console.log('MPM-maintenanceContent 组件已挂载')
    console.log('路由参数:', this.$route.params)
    console.log('查询参数:', this.$route.query)
    this.loadPointMaintenanceContent()
  },
  methods: {

    // 加载点位维保内容
    async loadPointMaintenanceContent() {
      try {
        this.loading = true
        const pointId = this.$route.params.pointId
        const planId = this.$route.query.planId // 从查询参数获取planId
        console.log('加载点位维保内容，点位ID:', pointId, '计划ID:', planId)

        if (!pointId) {
          this.$message.error('缺少点位ID')
          return
        }

        if (!planId) {
          this.$message.error('缺少维保计划ID')
          return
        }

        // 尝试直接调用点位API获取点位数据
        try {
          console.log('尝试直接获取点位数据...')
          const pointResponse = await request.get(`/Maintain/checkpoint/${pointId}`)
          console.log('直接点位API响应:', pointResponse)

          if (pointResponse.success && pointResponse.data) {
            const targetPoint = pointResponse.data
            console.log('直接获取到的点位数据:', targetPoint)
            console.log('点位maintenanceItems:', targetPoint.maintenanceItems)
            console.log('maintenanceItems类型:', typeof targetPoint.maintenanceItems)
            console.log('maintenanceItems是否为数组:', Array.isArray(targetPoint.maintenanceItems))
            console.log('maintenanceItems长度:', targetPoint.maintenanceItems ? targetPoint.maintenanceItems.length : 'undefined')

            // 更新点位信息用于显示
            this.pointInfo = {
              pointName: targetPoint.name || '未知点位',
              pointType: targetPoint.type || '未知类型',
              address: targetPoint.address || '未知地址',
              projectName: '未知项目', // 直接获取点位时可能没有项目信息
              entrustName: '未知委托单位'
            }

            // 如果点位有维保内容，需要获取完整的维保项目信息
            if (targetPoint.maintenanceItems && Array.isArray(targetPoint.maintenanceItems) && targetPoint.maintenanceItems.length > 0) {
              console.log('点位有维保项目，数量:', targetPoint.maintenanceItems.length)
              console.log('点位维保项目ID列表:', targetPoint.maintenanceItems)

              // 根据已选择的项目ID获取完整的维保项目信息
              await this.loadSelectedMaintenanceItems(targetPoint.maintenanceItems)
              return
            } else {
              console.log('直接API也返回空维保项目')
            }
          }
        } catch (directApiError) {
          console.log('直接点位API调用失败:', directApiError)
        }

        // 如果直接API失败，回退到原来的方法
        console.log('回退到维保计划API...')
        const response = await request.get(`/point/maintainPoint/${planId}/checkpoint`)
        console.log('维保计划点位API响应:', response)

        if (response.success && response.data) {
          const planData = response.data
          console.log('维保计划数据:', planData)

          // 从checkpoints中查找对应的点位
          if (planData.checkpoints && Array.isArray(planData.checkpoints)) {
            const targetPoint = planData.checkpoints.find(checkpoint => checkpoint._id === pointId)

            if (targetPoint) {
              console.log('找到目标点位:', targetPoint)
              console.log('点位maintenanceItems:', targetPoint.maintenanceItems)
              console.log('maintenanceItems类型:', typeof targetPoint.maintenanceItems)
              console.log('maintenanceItems是否为数组:', Array.isArray(targetPoint.maintenanceItems))
              console.log('maintenanceItems长度:', targetPoint.maintenanceItems ? targetPoint.maintenanceItems.length : 'undefined')

              // 更新点位信息用于显示
              this.pointInfo = {
                pointName: targetPoint.name || '未知点位',
                pointType: targetPoint.type || '未知类型',
                address: targetPoint.address || '未知地址',
                projectName: planData.plan?.projectName || '未知项目',
                entrustName: planData.plan?.ownerName || '未知委托单位'
              }

              // 如果点位有维保内容，需要获取完整的维保项目信息
              if (targetPoint.maintenanceItems && Array.isArray(targetPoint.maintenanceItems) && targetPoint.maintenanceItems.length > 0) {
                console.log('点位有维保项目，数量:', targetPoint.maintenanceItems.length)
                console.log('点位维保项目ID列表:', targetPoint.maintenanceItems)

                // 根据已选择的项目ID获取完整的维保项目信息
                await this.loadSelectedMaintenanceItems(targetPoint.maintenanceItems)
                return
              } else {
                console.log('点位没有维保项目或维保项目为空')
                this.checkedMaintList = []
              }
            } else {
              this.$message.error('未找到对应的点位信息')
              this.setDefaultPointInfo()
            }
          } else {
            this.$message.error('维保计划中没有点位数据')
            this.setDefaultPointInfo()
          }
        } else {
          this.$message.error(response.message || '获取点位信息失败')
          this.setDefaultPointInfo()
        }

        // 如果点位没有维保内容，显示空状态
        this.checkedMaintList = []
      } catch (error) {
        console.error('加载点位维保内容失败:', error)
        this.$message.error('加载维保内容失败: ' + (error.message || '未知错误'))
        this.setDefaultPointInfo()
        // 显示空状态
        this.checkedMaintList = []
      } finally {
        this.loading = false
      }
    },

    // 设置默认点位信息
    setDefaultPointInfo() {
      this.pointInfo = {
        pointName: '未知点位',
        pointType: '未知类型',
        address: '未知地址',
        projectName: '未知项目',
        entrustName: '未知委托单位'
      }
    },

    // 根据已选择的项目ID获取完整的维保项目信息
    async loadSelectedMaintenanceItems(selectedItemIds) {
      try {
        console.log('=== 开始加载已选择的维保项目 ===')
        console.log('选择的项目ID列表:', selectedItemIds)
        console.log('选择的项目数量:', selectedItemIds.length)

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

        if (rawData) {
          console.log('原始数据长度:', rawData.length)
          // 从所有维保项目中筛选出已选择的项目
          this.checkedMaintList = this.getSelectedMaintenanceItems(rawData, selectedItemIds)
          console.log('=== 筛选结果 ===')
          console.log('已选择的维保项目详情:', this.checkedMaintList)
          console.log('筛选出的项目数量:', this.checkedMaintList.length)
        } else {
          console.error('获取标准维保项目失败，响应格式:', res)
          this.checkedMaintList = []
        }
      } catch (err) {
        console.error('加载已选择的维保项目失败:', err)
        this.$message.error('加载维保项目失败: ' + (err.message || '未知错误'))
        this.checkedMaintList = []
      }
    },

    // 从所有维保项目中筛选出已选择的项目
    getSelectedMaintenanceItems(allData, selectedItemIds) {
      console.log('开始筛选维保项目，要匹配的ID数量:', selectedItemIds.length)

      const getPeriodLabel = (p) => {
        if (!p) return ''
        if (p === 1) return '月检'
        if (p === 12) return '年检'
        return p.toString()
      }

      const selectedItems = []
      let totalItems = 0
      let matchedItems = 0

      // 遍历所有维保项目数据
      allData.forEach((system) => {
        if (system.devices && system.devices.length > 0) {
          system.devices.forEach((device) => {
            if (device.items && device.items.length > 0) {
              device.items.forEach((item) => {
                totalItems++

                // 检查当前项目是否在已选择的ID列表中
                const isSelected = selectedItemIds.some(selectedId => {
                  const selectedIdStr = selectedId.toString()
                  const itemIdStr = item._id.toString()
                  return selectedIdStr === itemIdStr
                })

                if (isSelected) {
                  matchedItems++
                  // 找到匹配的项目，添加到已选择列表
                  const selectedItem = {
                    id: item._id,
                    systemCategory: system.category,
                    deviceName: device.device,
                    maintainSlim: item.maintainSlim,
                    maintainContent: item.maintainContent,
                    frequency: getPeriodLabel(item.frequency)
                  }
                  selectedItems.push(selectedItem)
                }
              })
            }
          })
        }
      })

      console.log('筛选完成 - 总项目数:', totalItems, '匹配项目数:', matchedItems)
      return selectedItems
    },

    // 返回上一页
    goBack() {
      this.$router.go(-1)
    }

  }
}
</script>

<style scoped>
.maintenance-content-page {
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
  background: linear-gradient(135deg, #87CEEB, #4682B4);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  color: white;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.point-info {
  margin-top: 10px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  font-size: 14px;
}

.point-name-label,
.point-type-label {
  color: rgba(255, 255, 255, 0.8);
  margin-right: 8px;
}

.point-name-value,
.point-type-value {
  color: white;
  font-weight: bold;
  margin-right: 20px;
}

/* 主要内容区域 */
.main-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* 维保内容表格区域 */
.maintenance-table-section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e4e7ed;
}

.table-title {
  font-size: 18px;
  font-weight: bold;
  color: #222;
  margin: 0;
}

.table-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* 空状态 */
.empty-box {
  text-align: center;
  margin-top: 38px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .main-content .el-col {
    margin-bottom: 20px;
  }
}
</style>
