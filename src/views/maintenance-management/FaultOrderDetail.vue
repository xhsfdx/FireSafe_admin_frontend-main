<template>
  <div class="fault-order-detail-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <div class="page-icon">
            <i class="el-icon-warning-outline" />
          </div>
          <div class="title-info">
            <h1 class="page-title">故障工单详情</h1>
            <p class="page-subtitle">查看和管理故障工单的详细信息</p>
          </div>
        </div>
        <div class="header-actions">
          <el-button icon="el-icon-arrow-left" @click="goBack">
            返回列表
          </el-button>
        </div>
      </div>
    </div>

    <div v-loading="loading" class="content-wrapper">
      <!-- 工单基本信息 -->
      <div class="info-section">
        <el-card class="info-card" shadow="never">
          <div slot="header" class="card-header">
            <i class="el-icon-s-order" />
            <span>基本信息</span>
          </div>

          <el-row v-if="orderInfo" :gutter="20">
            <el-col :span="8">
              <div class="info-item">
                <label>工单ID:</label>
                <span>{{ orderInfo._id }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="info-item">
                <label>业主单位:</label>
                <span>{{ orderInfo.ownerCompany || '未设置' }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="info-item">
                <label>项目名称:</label>
                <span>{{ orderInfo.project || (orderInfo.task && orderInfo.task.projectName) || '未设置' }}</span>
              </div>
            </el-col>
          </el-row>

          <el-row v-if="orderInfo" :gutter="20">
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
                <span>{{ formatDateTime(orderInfo.createdAt) }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="info-item">
                <label>预计完成时间:</label>
                <span>{{ formatDateTime(orderInfo.expectedCompletionTime) }}</span>
              </div>
            </el-col>
          </el-row>

          <el-row v-if="orderInfo" :gutter="20">
            <el-col :span="8">
              <div class="info-item">
                <label>上报人员:</label>
                <span>{{ (orderInfo.reporter && orderInfo.reporter.name) || '未设置' }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="info-item">
                <label>联系方式:</label>
                <span>{{ (orderInfo.reporter && orderInfo.reporter.phone) || '未设置' }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="info-item">
                <label>工单状态:</label>
                <el-tag :type="getStatusType(orderInfo.status)" size="small">
                  {{ orderInfo.status || '待处理' }}
                </el-tag>
              </div>
            </el-col>
          </el-row>

          <el-row v-if="orderInfo" :gutter="20">
            <el-col :span="8">
              <div class="info-item">
                <label>当前负责人:</label>
                <span>{{ getCurrentOwner() }}</span>
              </div>
            </el-col>
            <el-col :span="8" v-if="orderInfo.resolved">
              <div class="info-item">
                <label>解决人员:</label>
                <span>{{ (orderInfo.resolvedBy && orderInfo.resolvedBy.name) || '未设置' }}</span>
              </div>
            </el-col>
            <el-col :span="8" v-if="orderInfo.resolvedAt">
              <div class="info-item">
                <label>解决时间:</label>
                <span>{{ formatDateTime(orderInfo.resolvedAt) }}</span>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>

      <!-- 故障信息 -->
      <div class="fault-section">
        <el-card class="fault-card" shadow="never">
          <div slot="header" class="card-header">
            <i class="el-icon-warning" />
            <span>故障信息</span>
          </div>

          <el-row v-if="orderInfo" :gutter="20">
            <el-col :span="12">
              <div class="info-item">
                <label>消防系统:</label>
                <span>{{ (orderInfo.taskItem && orderInfo.taskItem.category) || '未设置' }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <label>维保项目:</label>
                <span>{{ (orderInfo.taskItem && orderInfo.taskItem.device) || '未设置' }}</span>
              </div>
            </el-col>
          </el-row>

          <div v-if="orderInfo" class="info-item">
            <label>检测内容:</label>
            <div class="content-text">{{ (orderInfo.taskItem && (orderInfo.taskItem.maintainContent || orderInfo.taskItem.maintaSlim)) || '未设置' }}</div>
          </div>

          <div v-if="orderInfo" class="info-item">
            <label>故障描述:</label>
            <div class="content-text">{{ orderInfo.description || '未设置' }}</div>
          </div>

          <!-- 故障照片 -->
          <div v-if="orderInfo && orderInfo.problemphotoUrls && orderInfo.problemphotoUrls.length > 0" class="photo-section">
            <label>故障照片:</label>
            <div class="photo-list">
              <el-image
                v-for="(photo, index) in orderInfo.problemphotoUrls"
                :key="index"
                :src="photo"
                :preview-src-list="orderInfo.problemphotoUrls"
                fit="cover"
                class="photo-item"
              />
            </div>
          </div>
        </el-card>
      </div>

      <!-- 处理信息 -->
      <div v-if="orderInfo && orderInfo.resolved" class="resolution-section">
        <el-card class="resolution-card" shadow="never">
          <div slot="header" class="card-header">
            <i class="el-icon-check" />
            <span>处理信息</span>
          </div>

          <div v-if="orderInfo.resolution" class="info-item">
            <label>处理描述:</label>
            <div class="content-text">{{ orderInfo.resolution }}</div>
          </div>

          <div v-if="orderInfo.remarks" class="info-item">
            <label>备注信息:</label>
            <div class="content-text">{{ orderInfo.remarks }}</div>
          </div>

          <!-- 处理照片 -->
          <div v-if="orderInfo.solutionphotoUrls && orderInfo.solutionphotoUrls.length > 0" class="photo-section">
            <label>处理照片:</label>
            <div class="photo-list">
              <el-image
                v-for="(photo, index) in orderInfo.solutionphotoUrls"
                :key="index"
                :src="photo"
                :preview-src-list="orderInfo.solutionphotoUrls"
                fit="cover"
                class="photo-item"
              />
            </div>
          </div>
        </el-card>
      </div>

      <!-- 处理进度 -->
      <div class="progress-section">
        <el-card class="progress-card" shadow="never">
          <div slot="header" class="card-header">
            <i class="el-icon-s-marketing" />
            <span>处理进度</span>
          </div>

          <el-steps :active="getProgressStep()" finish-status="success" align-center>
            <el-step title="待处理" description="工单已创建" />
            <el-step title="处置中" description="已接单处理" />
            <el-step title="已完成" description="故障已解决" />
          </el-steps>
        </el-card>
      </div>

      <!-- 操作按钮 -->
      <div class="action-section">
        <el-card shadow="never">
          <div class="action-buttons">
            <el-button
              v-if="canAccept"
              type="primary"
              :loading="actionLoading"
              @click="handleAccept"
            >
              接单
            </el-button>
            <el-button
              v-if="canAssign"
              type="warning"
              :loading="actionLoading"
              @click="handleAssign"
            >
              分配
            </el-button>
            <el-button
              v-if="canResolve"
              type="success"
              :loading="actionLoading"
              @click="handleResolve"
            >
              标记为已完成
            </el-button>
            <el-button
              v-if="canDelete"
              type="danger"
              :loading="actionLoading"
              @click="handleDelete"
            >
              删除
            </el-button>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 分配对话框 -->
    <el-dialog
      title="分配工单"
      :visible.sync="assignDialogVisible"
      width="500px"
    >
      <el-select
        v-model="selectedStaffIds"
        multiple
        placeholder="请选择要分配的人员"
        style="width: 100%"
      >
        <el-option
          v-for="staff in staffList"
          :key="staff._id"
          :label="staff.name"
          :value="staff._id"
        />
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="actionLoading" @click="confirmAssign">确定</el-button>
      </div>
    </el-dialog>

    <!-- 处理对话框 -->
    <el-dialog
      title="标记为已完成"
      :visible.sync="resolveDialogVisible"
      width="600px"
    >
      <el-form :model="resolveForm" label-width="100px">
        <el-form-item label="处理描述">
          <el-input
            v-model="resolveForm.resolution"
            type="textarea"
            :rows="4"
            placeholder="请输入处理描述"
          />
        </el-form-item>
        <el-form-item label="备注信息">
          <el-input
            v-model="resolveForm.remarks"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息（可选）"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resolveDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="actionLoading" @click="confirmResolve">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getFaultRecord,
  updateFaultRecord,
  deleteFaultRecord
} from '@/api/faultRecord'
import { getAllStaff } from '@/api/staff'

export default {
  name: 'FaultOrderDetail',
  data() {
    return {
      orderInfo: null,
      loading: false,
      actionLoading: false,
      assignDialogVisible: false,
      resolveDialogVisible: false,
      staffList: [],
      selectedStaffIds: [],
      resolveForm: {
        resolution: '',
        remarks: ''
      }
    }
  },

  computed: {
    orderId() {
      return this.$route.params.id
    },

    mainStatus() {
      if (!this.orderInfo) return '待处理'
      return this.orderInfo.status || '待处理'
    },

    canAccept() {
      if (!this.orderInfo) return false
      return this.mainStatus === '待处理'
    },

    canAssign() {
      if (!this.orderInfo) return false
      return ['待处理', '处置中'].includes(this.mainStatus)
    },

    canResolve() {
      if (!this.orderInfo) return false
      return ['待处理', '处置中'].includes(this.mainStatus) && !this.orderInfo.resolved
    },

    canDelete() {
      return true // 管理员可以删除
    }
  },

  mounted() {
    this.loadOrderDetail()
    this.loadStaffList()
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
        const res = await getFaultRecord(this.orderId)
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

    // 加载员工列表
    async loadStaffList() {
      try {
        const res = await getAllStaff()
        if (res.success) {
          this.staffList = res.data || []
        }
      } catch (error) {
        console.error('加载员工列表失败:', error)
      }
    },

    // 获取进度步骤
    getProgressStep() {
      if (!this.orderInfo) return 0

      const stepMap = {
        '待处理': 0,
        '处置中': 1,
        '处理中': 1,
        '已完成': 2
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
        '处置中': 'warning',
        '处理中': 'warning',
        '已完成': 'success'
      }
      return typeMap[status] || 'info'
    },

    // 获取当前负责人
    getCurrentOwner() {
      if (!this.orderInfo) return '未分配'
      if (this.orderInfo.owner && this.orderInfo.owner.name) {
        return this.orderInfo.owner.name
      }
      if (typeof this.orderInfo.owner === 'string') {
        return this.orderInfo.owner
      }
      return '未分配'
    },

    // 格式化日期时间
    formatDateTime(date) {
      if (!date) return '未设置'
      const d = new Date(date)
      if (isNaN(d.getTime())) return '未设置'
      return d.toLocaleString('zh-CN')
    },

    // 接单操作
    async handleAccept() {
      this.actionLoading = true
      try {
        const res = await updateFaultRecord(this.orderId, {
          status: '处置中'
        })
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
    handleAssign() {
      this.selectedStaffIds = this.orderInfo.owner ? [this.orderInfo.owner._id || this.orderInfo.owner] : []
      this.assignDialogVisible = true
    },

    // 确认分配
    async confirmAssign() {
      if (!this.selectedStaffIds || this.selectedStaffIds.length === 0) {
        this.$message.warning('请选择要分配的人员')
        return
      }

      this.actionLoading = true
      try {
        const res = await updateFaultRecord(this.orderId, {
          owner: this.selectedStaffIds[0] // FaultRecord 的 owner 是单个 ObjectId
        })
        if (res.success) {
          this.$message.success('分配成功')
          this.assignDialogVisible = false
          this.loadOrderDetail()
        } else {
          this.$message.error(res.message || '分配失败')
        }
      } catch (error) {
        this.$message.error('分配失败')
      } finally {
        this.actionLoading = false
      }
    },

    // 标记为已完成
    handleResolve() {
      this.resolveForm = {
        resolution: this.orderInfo.resolution || '',
        remarks: this.orderInfo.remarks || ''
      }
      this.resolveDialogVisible = true
    },

    // 确认处理
    async confirmResolve() {
      if (!this.resolveForm.resolution || !this.resolveForm.resolution.trim()) {
        this.$message.warning('请输入处理描述')
        return
      }

      this.actionLoading = true
      try {
        const res = await updateFaultRecord(this.orderId, {
          status: '已完成',
          resolved: true,
          resolution: this.resolveForm.resolution,
          remarks: this.resolveForm.remarks,
          resolvedAt: new Date()
        })
        if (res.success) {
          this.$message.success('标记成功')
          this.resolveDialogVisible = false
          this.loadOrderDetail()
        } else {
          this.$message.error(res.message || '操作失败')
        }
      } catch (error) {
        this.$message.error('操作失败')
      } finally {
        this.actionLoading = false
      }
    },

    // 删除工单
    async handleDelete() {
      try {
        await this.$confirm('确定要删除这个工单吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        this.actionLoading = true
        try {
          const res = await deleteFaultRecord(this.orderId)
          if (res.success) {
            this.$message.success('删除成功')
            this.goBack()
          } else {
            this.$message.error(res.message || '删除失败')
          }
        } catch (error) {
          this.$message.error('删除失败')
        } finally {
          this.actionLoading = false
        }
      } catch (err) {
        // 用户取消
      }
    },

    // 返回列表
    goBack() {
      this.$router.push({ name: 'FaultWorkOrder' })
    }
  }
}
</script>

<style scoped>
.fault-order-detail-page {
  background: #f5f7fa;
  min-height: 100vh;
  padding: 24px;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 32px 40px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15);
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
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24px;
}

.page-icon i {
  font-size: 28px;
  color: white;
}

.title-info h1 {
  color: white;
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.title-info p {
  color: rgba(255, 255, 255, 0.85);
  font-size: 16px;
  margin: 0;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-section,
.fault-section,
.resolution-section,
.progress-section,
.action-section {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.card-header i {
  margin-right: 8px;
  color: #3b82f6;
}

.info-item {
  margin-bottom: 20px;
}

.info-item label {
  display: inline-block;
  width: 120px;
  color: #64748b;
  font-weight: 500;
  margin-right: 12px;
}

.info-item span {
  color: #1e293b;
}

.content-text {
  color: #1e293b;
  line-height: 1.6;
  margin-top: 8px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.photo-section {
  margin-top: 20px;
}

.photo-section label {
  display: block;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 12px;
}

.photo-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.photo-item {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  padding: 20px;
}
</style>
