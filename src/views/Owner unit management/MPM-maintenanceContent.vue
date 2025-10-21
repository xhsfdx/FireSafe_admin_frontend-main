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
        <div class="point-info" v-if="pointInfo.pointName">
          <span class="point-name-label">点位名称：</span>
          <span class="point-name-value">{{ pointInfo.pointName }}</span>
          <span class="point-type-label">类型：</span>
          <span class="point-type-value">{{ pointInfo.pointType }}</span>
        </div>
        <div class="header-actions">
          <el-button type="primary" @click="handleSave">保存</el-button>
          <el-button @click="goBack">
            <i class="el-icon-back"></i> 返回
          </el-button>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content" v-loading="loading" element-loading-text="加载中...">
      <el-row :gutter="14">
        <!-- 左侧选择区域 -->
        <el-col :span="6">
          <div style="margin-bottom: 12px;">
            <el-checkbox v-model="treeCheckAll" style="margin-left: 2px;" @change="handleCheckAll">一键全选</el-checkbox>
          </div>
          <el-tabs v-model="activeTab" class="tab-tree">
            <el-tab-pane label="平台标准系统" name="standard">
              <el-tree
                ref="maintTree"
                :data="maintTree"
                show-checkbox
                node-key="id"
                :default-checked-keys="checkedKeys"
                :expand-on-click-node="false"
                @check="handleTreeCheck"
              />
            </el-tab-pane>
            <el-tab-pane label="自建标准系统" name="custom">
              <div class="tab-empty">暂无内容</div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        
        <!-- 右侧已选择内容 -->
        <el-col :span="18">
          <el-table :data="checkedMaintList" border style="width: 100%;">
            <el-table-column type="index" label="序号" width="55" align="center" />
            <el-table-column prop="system" label="消防系统/设施" align="center" />
            <el-table-column prop="item" label="维保项目" align="center" />
            <el-table-column prop="content" label="检测内容" align="center" />
            <el-table-column prop="period" label="维保周期" align="center" />
            <el-table-column prop="standard" label="规范" align="center" />
          </el-table>
          
          <div v-if="checkedMaintList.length === 0" class="empty-box">
            <img src="@/assets/无数据.jpg" style="width: 128px; opacity: 0.7; margin-top: 20px;">
            <div style="color: #888; margin-top: 8px;">暂无数据</div>
          </div>
        </el-col>
      </el-row>
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
      activeTab: 'standard',
      maintTree: [],
      checkedKeys: [],
      checkedMaintList: [],
      treeCheckAll: false,
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
    this.loadPointMaintenanceContent()
  },
  methods: {
    // 维保内容相关方法
    transformToTree(data) {
      const getPeriodLabel = (p) => {
        if (!p) return ''
        if (p === 1) return '月检'
        if (p === 12) return '年检'
        return `${p}`
      }

      return data.map(system => ({
        id: `system_${system.category}`, // 系统级别的ID
        label: system.category,
        children: (system.devices || []).map(device => ({
          id: `device_${device.device}`, // 设备级别的ID
          label: device.device,
          children: (device.items || []).map(item => ({
            id: item._id, // 使用维保项目的真实ID
            label: item.maintainSlim,
            data: {
              id: item._id, // 保存真实的维保项目ID
              system: system.category,
              item: device.device,
              content: item.maintainContent,
              period: getPeriodLabel(item.frequency),
              standard: '' // 后端API没有返回attention字段，暂时设为空
            }
          }))
        }))
      }))
    },

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
        
        // 调用后端API获取维保计划的所有点位
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
              
              // 更新点位信息用于显示
              this.pointInfo = {
                pointName: targetPoint.name || '未知点位',
                pointType: targetPoint.type || '未知类型',
                address: targetPoint.address || '未知地址',
                projectName: planData.plan?.projectName || '未知项目',
                entrustName: planData.plan?.ownerName || '未知委托单位'
              }
              
              // 如果点位有维保内容，显示已选择的项目
              if (targetPoint.maintenanceItems && Array.isArray(targetPoint.maintenanceItems) && targetPoint.maintenanceItems.length > 0) {
                console.log('点位有维保项目，数量:', targetPoint.maintenanceItems.length)
                
                // 将字符串数组转换为表格显示格式
                this.checkedMaintList = targetPoint.maintenanceItems.map((itemName, index) => ({
                  id: `item_${index}`,
                  system: '消防系统',
                  item: itemName,
                  content: `${itemName}检查`,
                  period: '月检',
                  standard: `${itemName}相关规范要求`
                }))
                
                console.log('转换后的维保列表:', this.checkedMaintList)
                return
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
        
        // 如果点位没有维保内容或获取失败，加载标准维保项目
        await this.loadMaintainTree()
        
      } catch (error) {
        console.error('加载点位维保内容失败:', error)
        this.$message.error('加载维保内容失败: ' + (error.message || '未知错误'))
        this.setDefaultPointInfo()
        // 加载标准维保项目
        await this.loadMaintainTree()
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

    async loadMaintainTree() {
      try {
        const res = await getMaintainStandardItems()
        if (res.success && res.data) {
          const rawData = res.data
          this.maintTree = this.transformToTree(rawData)
          
          // 默认全选
          this.handleCheckAll(true)
        } else {
          console.error('获取标准维保项目失败:', res)
          this.maintTree = []
        }
      } catch (err) {
        console.error('加载维保项目失败:', err)
        this.$message.error('加载维保项目失败: ' + (err.message || '未知错误'))
      }
    },

    handleTreeCheck(data, { checkedKeys }) {
      this.checkedKeys = checkedKeys
      this.updateCheckedMaintList()
      // 控制全选
      const allIds = this.getAllLeafIds(this.maintTree)
      this.treeCheckAll = checkedKeys.length === allIds.length
    },

    // 全选
    handleCheckAll(val) {
      const getAllLeafIds = (nodes, arr = []) => {
        nodes.forEach(n => {
          if (n.children && n.children.length) {
            getAllLeafIds(n.children, arr)
          } else {
            arr.push(n.id)
          }
        })
        return arr
      }
      if (val) {
        const allIds = getAllLeafIds(this.maintTree)
        this.checkedKeys = allIds
        this.$refs.maintTree.setCheckedKeys(allIds)
      } else {
        this.checkedKeys = []
        this.$refs.maintTree.setCheckedKeys([])
      }
      this.updateCheckedMaintList()
    },

    // 提取所有叶子节点id
    getAllLeafIds(nodes, arr = []) {
      nodes.forEach(n => {
        if (n.children && n.children.length) {
          this.getAllLeafIds(n.children, arr)
        } else {
          arr.push(n.id)
        }
      })
      return arr
    },

    // 生成右侧表格完整内容
    updateCheckedMaintList() {
      const checkedNodes = this.$refs.maintTree.getCheckedNodes(true)
      this.checkedMaintList = checkedNodes
        .filter(n => !n.children || n.children.length === 0) // 只处理叶子节点
        .filter(n => n.data && n.data.id) // 确保有维保项目ID
        .map(n => n.data)

      console.log('勾选的维保项目:', this.checkedMaintList)
      console.log('维保项目ID列表:', this.checkedMaintList.map(item => item.id))
    },


    // 保存方法
    handleSave() {
      this.saveMaintenanceContentToServer(this.checkedMaintList)
    },

    // 保存维保内容到后端
    async saveMaintenanceContentToServer(maintenanceList) {
      try {
        const pointId = this.$route.params.pointId
        console.log('保存维保内容:', maintenanceList)
        
        if (!pointId) {
          this.$message.error('缺少点位ID')
          return
        }
        
        // 构建请求数据
        const requestData = {
          maintenanceItems: maintenanceList.map(item => {
            // 根据数据结构，maintenanceItems应该是字符串数组
            return item.item || item.id
          })
        }
        
        console.log('发送到后端的请求数据:', requestData)
        
        // 调用后端API更新点位的维保内容
        const response = await request.put(`/point/checkpoint/${pointId}/maintenance`, requestData)
        console.log('后端响应:', response)
        
        if (response.success) {
          this.$message.success('保存成功')
          
          // 保存成功后返回上一页
          setTimeout(() => {
            this.goBack()
          }, 1500)
        } else {
          this.$message.error(response.message || '保存失败')
        }
        
      } catch (error) {
        console.error('保存维保内容失败:', error)
        
        // 处理不同类型的错误
        if (error.response) {
          const errorMessage = error.response.data?.message || '服务器错误'
          this.$message.error(`保存失败: ${errorMessage}`)
        } else if (error.request) {
          this.$message.error('网络连接失败，请检查网络后重试')
        } else {
          this.$message.error('保存失败: ' + (error.message || '未知错误'))
        }
      }
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

.tab-tree {
  background: #fff;
  min-height: 320px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.tab-empty {
  color: #888;
  text-align: center;
  padding: 30px 0;
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
