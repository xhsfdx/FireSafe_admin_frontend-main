<template>
  <div class="fault-order-detail-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <div class="page-icon">
            <i class="el-icon-warning-outline"></i>
          </div>
          <div class="title-info">
            <h1 class="page-title">故障工单详情</h1>
            <p class="page-subtitle">查看和管理故障工单的详细信息</p>
          </div>
        </div>
        <div class="header-actions">
          <el-button @click="goBack" icon="el-icon-arrow-left">
            返回列表
          </el-button>
        </div>
      </div>
    </div>

    <!-- 工单基本信息 -->
    <div class="info-section">
      <el-card class="info-card" shadow="never">
        <div slot="header" class="card-header">
          <i class="el-icon-s-order"></i>
          <span>基本信息</span>
        </div>
        
        <el-row :gutter="20" v-if="orderInfo">
          <el-col :span="8">
            <div class="info-item">
              <label>工单ID:</label>
              <span>{{ orderInfo._id }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <label>业主单位:</label>
              <span>{{ orderInfo.ownerUnit || '未设置' }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <label>项目名称:</label>
              <span>{{ orderInfo.projectName || '未设置' }}</span>
            </div>
          </el-col>
        </el-row>
        
        <el-row :gutter="20" v-if="orderInfo">
          <el-col :span="8">
            <div class="info-item">
              <label>工单来源:</label>
              <el-tag :type="getSourceType(orderInfo.source)" size="small">
                {{ orderInfo.source || '例行转故障' }}
              </el-tag>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <label>上报时间:</label>
              <span>{{ formatDateTime(orderInfo.reportTime) }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <label>预计完成时间:</label>
              <span>{{ formatDateTime(orderInfo.expectedCompletionTime) }}</span>
            </div>
          </el-col>
        </el-row>
        
        <el-row :gutter="20" v-if="orderInfo">
          <el-col :span="8">
            <div class="info-item">
              <label>上报人员:</label>
              <span>{{ orderInfo.reporter || '未设置' }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <label>联系方式:</label>
              <span>{{ orderInfo.contact || '未设置' }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <label>工单状态:</label>
              <el-tag :type="getStatusType(mainStatus)" size="small">
                {{ mainStatus }}
              </el-tag>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!-- 故障信息 -->
    <div class="fault-section">
      <el-card class="fault-card" shadow="never">
        <div slot="header" class="card-header">
          <i class="el-icon-warning"></i>
          <span>故障信息</span>
        </div>
        
        <el-row :gutter="20" v-if="orderInfo">
          <el-col :span="12">
            <div class="info-item">
              <label>消防系统:</label>
              <span>{{ orderInfo.fireSystem || '未设置' }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <label>维保项目:</label>
              <span>{{ orderInfo.maintenanceItem || '未设置' }}</span>
            </div>
          </el-col>
        </el-row>
        
        <div class="info-item" v-if="orderInfo">
          <label>检测内容:</label>
          <div class="content-text">{{ orderInfo.inspectionContent || '未设置' }}</div>
        </div>
        
        <div class="info-item" v-if="orderInfo">
          <label>故障描述:</label>
          <div class="content-text">{{ orderInfo.faultDescription || '未设置' }}</div>
        </div>
      </el-card>
    </div>

    <!-- 处理进度 -->
    <div class="progress-section">
      <el-card class="progress-card" shadow="never">
        <div slot="header" class="card-header">
          <i class="el-icon-s-marketing"></i>
          <span>处理进度</span>
        </div>
        
        <el-steps :active="getProgressStep()" finish-status="success" align-center>
          <el-step title="待处理" description="工单已创建"></el-step>
          <el-step title="已接单" description="已有人接单"></el-step>
          <el-step title="已分配" description="已分配人员"></el-step>
          <el-step title="已沟通" description="已与客户沟通"></el-step>
          <el-step title="已签到" description="已到达现场"></el-step>
          <el-step title="处理中" description="正在处理故障"></el-step>
          <el-step title="已解决" description="故障已解决"></el-step>
          <el-step title="已评价" description="客户已评价"></el-step>
        </el-steps>
      </el-card>
    </div>

    <!-- 处理人员信息 -->
    <div class="staff-section" v-if="orderInfo">
      <el-card class="staff-card" shadow="never">
        <div slot="header" class="card-header">
          <i class="el-icon-user"></i>
          <span>处理人员</span>
        </div>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="info-item">
              <label>接单人员:</label>
              <span>{{ getAcceptedBy() }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <label>分配人员:</label>
              <span>{{ getAssignedTo() }}</span>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!-- 沟通记录 -->
    <div class="communication-section" v-if="orderInfo && orderInfo.communicationLogs && orderInfo.communicationLogs.length > 0">
      <el-card class="communication-card" shadow="never">
        <div slot="header" class="card-header">
          <i class="el-icon-chat-line-round"></i>
          <span>沟通记录</span>
        </div>
        
        <div class="communication-list">
          <div 
            v-for="(log, index) in orderInfo.communicationLogs" 
            :key="index" 
            class="communication-item"
          >
            <div class="communication-header">
              <span class="staff-name">{{ getStaffName(log.staff) }}</span>
              <span class="communication-time">{{ formatDateTime(log.timestamp) }}</span>
            </div>
            <div class="communication-content">{{ log.content }}</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 签到记录 -->
    <div class="signin-section" v-if="orderInfo && orderInfo.signInLogs && orderInfo.signInLogs.length > 0">
      <el-card class="signin-card" shadow="never">
        <div slot="header" class="card-header">
          <i class="el-icon-location"></i>
          <span>签到记录</span>
        </div>
        
        <div class="signin-list">
          <div 
            v-for="(log, index) in orderInfo.signInLogs" 
            :key="index" 
            class="signin-item"
          >
            <div class="signin-header">
              <span class="staff-name">{{ getStaffName(log.staff) }}</span>
              <span class="signin-time">{{ formatDateTime(log.timestamp) }}</span>
            </div>
            <div class="signin-location">
              <i class="el-icon-location"></i>
              经度: {{ log.location.coordinates[0] }}, 纬度: {{ log.location.coordinates[1] }}
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 故障照片 -->
    <div class="photos-section" v-if="orderInfo && orderInfo.faultPhotos && orderInfo.faultPhotos.length > 0">
      <el-card class="photos-card" shadow="never">
        <div slot="header" class="card-header">
          <i class="el-icon-picture"></i>
          <span>故障照片</span>
        </div>
        
        <div class="photos-grid">
          <div 
            v-for="(photo, index) in orderInfo.faultPhotos" 
            :key="index" 
            class="photo-item"
          >
            <el-image
              :src="photo.url"
              :preview-src-list="orderInfo.faultPhotos.map(p => p.url)"
              fit="cover"
              class="photo-image"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <div class="photo-description" v-if="photo.description">{{ photo.description }}</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 评价信息 -->
    <div class="rating-section" v-if="orderInfo && (orderInfo.rating || orderInfo.comment)">
      <el-card class="rating-card" shadow="never">
        <div slot="header" class="card-header">
          <i class="el-icon-star-on"></i>
          <span>评价信息</span>
        </div>
        
        <div class="rating-content">
          <div class="rating-score" v-if="orderInfo.rating">
            <label>评分:</label>
            <el-rate 
              :value="orderInfo.rating" 
              disabled 
              show-score 
              text-color="#ff9900"
            />
          </div>
          <div class="rating-comment" v-if="orderInfo.comment">
            <label>评价内容:</label>
            <div class="comment-text">{{ orderInfo.comment }}</div>
          </div>
          <div class="rating-time" v-if="orderInfo.ratedAt">
            <label>评价时间:</label>
            <span>{{ formatDateTime(orderInfo.ratedAt) }}</span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 操作按钮 -->
    <div class="action-section">
      <el-button @click="goBack" size="large">
        返回
      </el-button>
      <el-button 
        v-if="canAccept" 
        type="primary" 
        @click="acceptOrder" 
        size="large"
        :loading="actionLoading"
      >
        接单
      </el-button>
      <el-button 
        v-if="canAssign" 
        type="warning" 
        @click="assignOrder" 
        size="large"
        :loading="actionLoading"
      >
        分配
      </el-button>
      <el-button 
        v-if="canCommunicate" 
        type="info" 
        @click="addCommunication" 
        size="large"
        :loading="actionLoading"
      >
        沟通
      </el-button>
      <el-button 
        v-if="canSignIn" 
        type="success" 
        @click="addSignIn" 
        size="large"
        :loading="actionLoading"
      >
        签到
      </el-button>
      <el-button 
        v-if="canResolve" 
        type="danger" 
        @click="markResolved" 
        size="large"
        :loading="actionLoading"
      >
        解决
      </el-button>
      <el-button 
        v-if="canRate" 
        type="warning" 
        @click="rateOrder" 
        size="large"
        :loading="actionLoading"
      >
        评价
      </el-button>
      <el-button 
        v-if="canEdit" 
        type="primary" 
        @click="editOrder" 
        size="large"
      >
        编辑工单
      </el-button>
    </div>
  </div>
</template>

<script>
import { 
  getFaultOrder, 
  acceptFaultOrder, 
  assignFaultOrder,
  addCommunicationLog,
  addSignInLog,
  markAsResolved,
  rateFaultOrder
} from '@/api/faultOrder'

export default {
  name: 'FaultOrderDetail',
  data() {
    return {
      orderInfo: null,
      loading: false,
      actionLoading: false
    }
  },
  
  computed: {
    orderId() {
      return this.$route.params.id
    },
    
    // 获取主状态
    mainStatus() {
      if (!this.orderInfo) return '待处理'
      
      // 根据位掩码判断状态
      if (this.orderInfo.statusMask & 256) return '已关闭'  // CLOSED
      if (this.orderInfo.statusMask & 128) return '已评价'  // RATED
      if (this.orderInfo.statusMask & 64) return '已解决'   // RESOLVED
      if (this.orderInfo.statusMask & 32) return '处理中'   // IN_PROGRESS
      if (this.orderInfo.statusMask & 16) return '已签到'   // SIGNED_IN
      if (this.orderInfo.statusMask & 8) return '已沟通'    // COMMUNICATED
      if (this.orderInfo.statusMask & 4) return '已分配'    // ASSIGNED
      if (this.orderInfo.statusMask & 2) return '已接单'    // ACCEPTED
      if (this.orderInfo.statusMask & 1) return '待处理'    // PENDING
      
      return '待处理'
    },
    
    canEdit() {
      if (!this.orderInfo) return false
      return ['待处理', '已接单', '已分配'].includes(this.mainStatus)
    },
    
    canAccept() {
      if (!this.orderInfo) return false
      return this.mainStatus === '待处理' || this.mainStatus === '已分配'
    },
    
    canAssign() {
      if (!this.orderInfo) return false
      return this.mainStatus === '待处理' || this.mainStatus === '已接单'
    },
    
    canCommunicate() {
      if (!this.orderInfo) return false
      return ['已接单', '已分配', '已沟通', '已签到', '处理中'].includes(this.mainStatus)
    },
    
    canSignIn() {
      if (!this.orderInfo) return false
      return ['已接单', '已分配', '已沟通', '已签到', '处理中'].includes(this.mainStatus)
    },
    
    canResolve() {
      if (!this.orderInfo) return false
      return ['已接单', '已分配', '已沟通', '已签到', '处理中'].includes(this.mainStatus)
    },
    
    canRate() {
      if (!this.orderInfo) return false
      return this.mainStatus === '已解决'
    }
  },
  
  mounted() {
    this.loadOrderDetail()
  },
  
  methods: {
    // 加载工单详情
    async loadOrderDetail() {
      if (!this.orderId) {
        this.$message.error('工单ID不存在')
        this.goBack()
        return
      }
      
      this.loading = true
      try {
        const res = await getFaultOrder(this.orderId)
        if (res.success) {
          this.orderInfo = res.data
        } else {
          this.$message.error(res.message || '获取工单详情失败')
          this.goBack()
        }
      } catch (error) {
        console.error('加载工单详情失败:', error)
        this.$message.error('加载工单详情失败')
        this.goBack()
      } finally {
        this.loading = false
      }
    },
    
    // 获取进度步骤
    getProgressStep() {
      if (!this.orderInfo) return 0
      
      const stepMap = {
        '待处理': 0,
        '已接单': 1,
        '已分配': 2,
        '已沟通': 3,
        '已签到': 4,
        '处理中': 5,
        '已解决': 6,
        '已评价': 7
      }
      
      return stepMap[this.mainStatus] || 0
    },
    
    // 获取工单来源类型
    getSourceType(source) {
      const typeMap = {
        '例行转故障': 'primary',
        '紧急上报': 'danger',
        '日常巡检': 'success'
      }
      return typeMap[source] || 'info'
    },
    
    // 获取工单状态类型
    getStatusType(status) {
      const typeMap = {
        '待处理': 'info',
        '已接单': 'warning',
        '已分配': 'primary',
        '已沟通': 'success',
        '已签到': 'success',
        '处理中': 'warning',
        '已解决': 'success',
        '已评价': 'success',
        '已关闭': 'info'
      }
      return typeMap[status] || 'info'
    },
    
    // 获取接单人员信息
    getAcceptedBy() {
      if (!this.orderInfo || !this.orderInfo.acceptedBy) return '未接单'
      
      if (typeof this.orderInfo.acceptedBy === 'string') {
        return this.orderInfo.acceptedBy
      }
      
      return this.orderInfo.acceptedBy.name || '已接单'
    },
    
    // 获取分配人员信息
    getAssignedTo() {
      if (!this.orderInfo || !this.orderInfo.assignedTo || this.orderInfo.assignedTo.length === 0) {
        return '未分配'
      }
      
      if (typeof this.orderInfo.assignedTo[0] === 'string') {
        return this.orderInfo.assignedTo.join(', ')
      }
      
      return this.orderInfo.assignedTo.map(staff => staff.name || '已分配').join(', ')
    },
    
    // 获取工作人员姓名
    getStaffName(staff) {
      if (!staff) return '未知'
      
      if (typeof staff === 'string') {
        return staff
      }
      
      return staff.name || '工作人员'
    },
    
    // 格式化日期时间
    formatDateTime(date) {
      if (!date) return '未设置'
      return new Date(date).toLocaleString('zh-CN')
    },
    
    // 编辑工单
    editOrder() {
      this.$message.info('编辑功能开发中...')
    },
    
    // 接单操作
    async acceptOrder() {
      this.actionLoading = true
      try {
        const res = await acceptFaultOrder(this.orderId)
        if (res.success) {
          this.$message.success('接单成功')
          this.loadOrderDetail()
        } else {
          this.$message.error(res.message || '接单失败')
        }
      } catch (error) {
        this.$message.error('接单失败')
      } finally {
        this.actionLoading = false
      }
    },
    
    // 分配工单
    async assignOrder() {
      this.$prompt('请输入工作人员ID（多个用逗号分隔）:', '分配工单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '请输入工作人员ID'
      }).then(async ({ value }) => {
        this.actionLoading = true
        try {
          const staffIds = value.split(',').map(id => id.trim()).filter(id => id)
          const res = await assignFaultOrder(this.orderId, { staffIds })
          if (res.success) {
            this.$message.success('分配成功')
            this.loadOrderDetail()
          } else {
            this.$message.error(res.message || '分配失败')
          }
        } catch (error) {
          this.$message.error('分配失败')
        } finally {
          this.actionLoading = false
        }
      }).catch(() => {
        this.$message.info('已取消分配')
      })
    },
    
    // 添加沟通记录
    async addCommunication() {
      this.$prompt('请输入沟通内容:', '添加沟通记录', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPattern: /.+/,
        inputErrorMessage: '请输入沟通内容'
      }).then(async ({ value }) => {
        this.actionLoading = true
        try {
          const staffId = 'current_user_id' // 应该从用户状态获取
          const res = await addCommunicationLog(this.orderId, { staffId, content: value })
          if (res.success) {
            this.$message.success('沟通记录添加成功')
            this.loadOrderDetail()
          } else {
            this.$message.error(res.message || '添加沟通记录失败')
          }
        } catch (error) {
          this.$message.error('添加沟通记录失败')
        } finally {
          this.actionLoading = false
        }
      }).catch(() => {
        this.$message.info('已取消添加')
      })
    },
    
    // 添加签到记录
    async addSignIn() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          this.actionLoading = true
          try {
            const staffId = 'current_user_id' // 应该从用户状态获取
            const res = await addSignInLog(this.orderId, {
              staffId,
              longitude: position.coords.longitude,
              latitude: position.coords.latitude
            })
            if (res.success) {
              this.$message.success('签到成功')
              this.loadOrderDetail()
            } else {
              this.$message.error(res.message || '签到失败')
            }
          } catch (error) {
            this.$message.error('签到失败')
          } finally {
            this.actionLoading = false
          }
        }, (error) => {
          this.$message.error('无法获取位置信息，签到失败')
        })
      } else {
        this.$message.error('浏览器不支持地理位置服务')
      }
    },
    
    // 标记为已解决
    async markResolved() {
      try {
        await this.$confirm('确定标记该工单为已解决吗？', '提示', { type: 'warning' })
        this.actionLoading = true
        try {
          const res = await markAsResolved(this.orderId)
          if (res.success) {
            this.$message.success('工单已标记为已解决')
            this.loadOrderDetail()
          } else {
            this.$message.error(res.message || '操作失败')
          }
        } catch (error) {
          this.$message.error('操作失败')
        } finally {
          this.actionLoading = false
        }
      } catch (err) {
        // 用户取消无需处理
      }
    },
    
    // 评价工单
    async rateOrder() {
      this.$prompt('请为工单评分（1-5分）:', '评价工单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'number',
        inputPattern: /^[1-5]$/,
        inputErrorMessage: '请输入1-5之间的数字'
      }).then(async ({ value }) => {
        const comment = await new Promise((resolve) => {
          this.$prompt('请输入评价内容（可选）:', '评价工单', {
            confirmButtonText: '确定',
            cancelButtonText: '跳过',
            inputType: 'textarea'
          }).then(({ value: commentValue }) => resolve(commentValue)).catch(() => resolve(''))
        })
        
        this.actionLoading = true
        try {
          const res = await rateFaultOrder(this.orderId, { rating: parseInt(value), comment })
          if (res.success) {
            this.$message.success('评价成功')
            this.loadOrderDetail()
          } else {
            this.$message.error(res.message || '评价失败')
          }
        } catch (error) {
          this.$message.error('评价失败')
        } finally {
          this.actionLoading = false
        }
      }).catch(() => {
        this.$message.info('已取消评价')
      })
    },
    
    // 返回列表
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.fault-order-detail-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
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
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
}

.page-icon i {
  font-size: 28px;
  color: white;
}

.title-info h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
}

.title-info p {
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
}

.header-actions .el-button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
}

.header-actions .el-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.info-section,
.fault-section,
.progress-section,
.staff-section,
.communication-section,
.signin-section,
.photos-section,
.rating-section {
  margin-bottom: 24px;
}

.info-card,
.fault-card,
.progress-card,
.staff-card,
.communication-card,
.signin-card,
.photos-card,
.rating-card {
  border-radius: 12px;
  border: 1px solid #e4e7ed;
}

.card-header {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #303133;
}

.card-header i {
  margin-right: 8px;
  color: #667eea;
}

.info-item {
  margin-bottom: 20px;
}

.info-item label {
  display: block;
  font-weight: 600;
  color: #606266;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-item span {
  color: #303133;
  font-size: 14px;
}

.content-text {
  color: #303133;
  font-size: 14px;
  line-height: 1.6;
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  border-left: 4px solid #667eea;
}

.action-section {
  text-align: center;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.action-section .el-button {
  margin: 0 10px;
  min-width: 120px;
}

/* 沟通记录样式 */
.communication-list {
  max-height: 400px;
  overflow-y: auto;
}

.communication-item {
  border-bottom: 1px solid #f0f0f0;
  padding: 16px 0;
}

.communication-item:last-child {
  border-bottom: none;
}

.communication-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.staff-name {
  font-weight: 600;
  color: #3b82f6;
}

.communication-time {
  font-size: 12px;
  color: #909399;
}

.communication-content {
  color: #606266;
  line-height: 1.6;
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  border-left: 4px solid #3b82f6;
}

/* 签到记录样式 */
.signin-list {
  max-height: 400px;
  overflow-y: auto;
}

.signin-item {
  border-bottom: 1px solid #f0f0f0;
  padding: 16px 0;
}

.signin-item:last-child {
  border-bottom: none;
}

.signin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.signin-time {
  font-size: 12px;
  color: #909399;
}

.signin-location {
  color: #606266;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.signin-location i {
  color: #10b981;
}

/* 照片网格样式 */
.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.photo-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.photo-item:hover {
  transform: translateY(-2px);
}

.photo-image {
  width: 100%;
  height: 150px;
  cursor: pointer;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 24px;
}

.photo-description {
  padding: 8px 12px;
  background: white;
  font-size: 12px;
  color: #606266;
  border-top: 1px solid #f0f0f0;
}

/* 评价信息样式 */
.rating-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rating-score {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rating-score label {
  font-weight: 600;
  color: #606266;
  min-width: 60px;
}

.rating-comment {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rating-comment label {
  font-weight: 600;
  color: #606266;
}

.comment-text {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  border-left: 4px solid #f59e0b;
  color: #606266;
  line-height: 1.6;
}

.rating-time {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rating-time label {
  font-weight: 600;
  color: #606266;
  min-width: 80px;
}

.rating-time span {
  color: #909399;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .fault-order-detail-page {
    padding: 10px;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .title-section {
    margin-bottom: 20px;
  }
  
  .action-section .el-button {
    display: block;
    width: 100%;
    margin: 10px 0;
  }
}
</style>
