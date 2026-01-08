<template>
  <div class="additional-maintenance-detail-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <div class="page-icon">
            <i class="el-icon-s-cooperation" />
          </div>
          <div class="title-info">
            <h1 class="page-title">附加维保详情</h1>
            <p class="page-subtitle">查看附加维保任务的详细信息</p>
          </div>
        </div>
        <div class="header-actions">
          <el-button icon="el-icon-arrow-left" @click="goBack">
            返回列表
          </el-button>
          <el-button
            v-if="additionalMaintenanceData.status === '待审批'"
            type="success"
            icon="el-icon-check"
            :loading="actionLoading"
            @click="approveAdditionalMaintenance"
          >
            审批
          </el-button>
          <el-button
            v-if="additionalMaintenanceData.status === '待处理' || additionalMaintenanceData.status === '处理中'"
            type="warning"
            icon="el-icon-edit"
            :loading="actionLoading"
            @click="updateStatus"
          >
            更新状态
          </el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="editAdditionalMaintenance"
          >
            编辑
          </el-button>
        </div>
      </div>
    </div>

    <!-- 基本信息卡片 -->
    <div class="info-card">
      <div class="card-header">
        <h3 class="card-title">基本信息</h3>
      </div>
      <div class="card-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="标题">
            {{ additionalMaintenanceData.title || '未设置' }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusTagType(additionalMaintenanceData.status)">
              {{ additionalMaintenanceData.status || '未设置' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="业主单位">
            {{ additionalMaintenanceData.ownerUnitName || '未设置' }}
          </el-descriptions-item>
          <el-descriptions-item label="项目名称">
            {{ additionalMaintenanceData.projectName || '未设置' }}
          </el-descriptions-item>
          <el-descriptions-item label="来源类型">
            <el-tag :type="getSourceTypeTag(additionalMaintenanceData.sourceType)">
              {{ additionalMaintenanceData.sourceType || '手动创建' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ formatDateTime(additionalMaintenanceData.createdAt) }}
          </el-descriptions-item>
          <el-descriptions-item label="创建人">
            {{ (additionalMaintenanceData.createdBy && additionalMaintenanceData.createdBy.username) || '未知' }}
          </el-descriptions-item>
          <el-descriptions-item v-if="additionalMaintenanceData.approvedBy" label="审批人">
            {{ (additionalMaintenanceData.approvedBy && additionalMaintenanceData.approvedBy.username) || '未知' }}
          </el-descriptions-item>
          <el-descriptions-item v-if="additionalMaintenanceData.approvedAt" label="审批时间">
            {{ formatDateTime(additionalMaintenanceData.approvedAt) }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>

    <!-- 描述信息卡片 -->
    <div v-if="additionalMaintenanceData.description" class="info-card">
      <div class="card-header">
        <h3 class="card-title">描述信息</h3>
      </div>
      <div class="card-content">
        <p>{{ additionalMaintenanceData.description }}</p>
      </div>
    </div>

    <!-- 时间信息卡片 -->
    <div class="info-card">
      <div class="card-header">
        <h3 class="card-title">时间信息</h3>
      </div>
      <div class="card-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="预计开始时间">
            {{ formatDateTime(additionalMaintenanceData.expectedStartDate) }}
          </el-descriptions-item>
          <el-descriptions-item label="预计完成时间">
            {{ formatDateTime(additionalMaintenanceData.expectedCompletionDate) }}
          </el-descriptions-item>
          <el-descriptions-item label="实际开始时间">
            {{ formatDateTime(additionalMaintenanceData.actualStartDate) }}
          </el-descriptions-item>
          <el-descriptions-item label="实际完成时间">
            {{ formatDateTime(additionalMaintenanceData.actualCompletionDate) }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>

    <!-- 费用信息卡片 -->
    <div class="info-card">
      <div class="card-header">
        <h3 class="card-title">费用信息</h3>
      </div>
      <div class="card-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="预计费用">
            <span v-if="additionalMaintenanceData.estimatedCost">
              ¥{{ additionalMaintenanceData.estimatedCost.toLocaleString() }}
            </span>
            <span v-else>-</span>
          </el-descriptions-item>
          <el-descriptions-item label="实际费用">
            <span v-if="additionalMaintenanceData.actualCost">
              ¥{{ additionalMaintenanceData.actualCost.toLocaleString() }}
            </span>
            <span v-else>-</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>

    <!-- 维保人员信息卡片 -->
    <div v-if="hasMaintainPersons" class="info-card">
      <div class="card-header">
        <h3 class="card-title">维保人员信息</h3>
      </div>
      <div class="card-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item v-if="additionalMaintenanceData.maintainPersons && additionalMaintenanceData.maintainPersons.leader" label="项目负责人">
            {{ (additionalMaintenanceData.maintainPersons.leader && additionalMaintenanceData.maintainPersons.leader.name) || '未设置' }}
            <span v-if="additionalMaintenanceData.maintainPersons.leader && additionalMaintenanceData.maintainPersons.leader.phone">
              （{{ additionalMaintenanceData.maintainPersons.leader.phone }}）
            </span>
          </el-descriptions-item>
          <el-descriptions-item v-if="additionalMaintenanceData.maintainPersons && additionalMaintenanceData.maintainPersons.technical" label="技术负责人">
            {{ (additionalMaintenanceData.maintainPersons.technical && additionalMaintenanceData.maintainPersons.technical.name) || '未设置' }}
            <span v-if="additionalMaintenanceData.maintainPersons.technical && additionalMaintenanceData.maintainPersons.technical.phone">
              （{{ additionalMaintenanceData.maintainPersons.technical.phone }}）
            </span>
          </el-descriptions-item>
          <el-descriptions-item v-if="additionalMaintenanceData.maintainPersons && additionalMaintenanceData.maintainPersons.maintainers && additionalMaintenanceData.maintainPersons.maintainers.length > 0" label="现场维保人员" :span="2">
            <span v-for="(maintainer, index) in additionalMaintenanceData.maintainPersons.maintainers" :key="index">
              {{ (maintainer && maintainer.name) || '未知' }}
              <span v-if="maintainer && maintainer.phone">（{{ maintainer.phone }}）</span>
              <span v-if="index < additionalMaintenanceData.maintainPersons.maintainers.length - 1">、</span>
            </span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>

    <!-- 维保内容卡片 -->
    <div v-if="additionalMaintenanceData.maintenanceItems && additionalMaintenanceData.maintenanceItems.length > 0" class="info-card">
      <div class="card-header">
        <h3 class="card-title">维保内容</h3>
      </div>
      <div class="card-content">
        <el-table :data="additionalMaintenanceData.maintenanceItems" border>
          <el-table-column prop="itemName" label="维保项名称" />
          <el-table-column prop="itemDescription" label="描述" />
          <el-table-column prop="quantity" label="数量" width="100" />
          <el-table-column prop="unit" label="单位" width="100" />
          <el-table-column label="照片" width="150">
            <template slot-scope="scope">
              <div v-if="scope.row.photos && scope.row.photos.length > 0" class="photo-grid">
                <img
                  v-for="(photo, index) in scope.row.photos"
                  :key="index"
                  :src="getImageUrl(photo)"
                  alt="维保照片"
                  class="photo-thumbnail"
                  @click="previewImage(scope.row.photos, index)"
                />
              </div>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 进度信息卡片 -->
    <div v-if="additionalMaintenanceData.progress && additionalMaintenanceData.progress.length > 0" class="info-card">
      <div class="card-header">
        <h3 class="card-title">任务进度</h3>
      </div>
      <div class="card-content">
        <el-steps :active="getActiveStepIndex" align-center>
          <el-step
            v-for="(step, index) in additionalMaintenanceData.progress"
            :key="index"
            :title="step.name"
            :status="step.status === 'done' ? 'success' : 'wait'"
            :description="step.timestamp ? formatDateTime(step.timestamp) : ''"
          />
        </el-steps>
      </div>
    </div>

    <!-- 来源信息卡片 -->
    <div v-if="hasSourceInfo" class="info-card">
      <div class="card-header">
        <h3 class="card-title">来源信息</h3>
      </div>
      <div class="card-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item v-if="additionalMaintenanceData.sourceWorkReport" label="来源工作上报">
            <el-link type="primary" @click="viewSourceWorkReport">
              {{ (additionalMaintenanceData.sourceWorkReport && additionalMaintenanceData.sourceWorkReport.reportType) || '工作上报' }}
            </el-link>
          </el-descriptions-item>
          <el-descriptions-item v-if="additionalMaintenanceData.sourceFaultRecord" label="来源故障记录">
            <el-link type="primary" @click="viewSourceFaultRecord">
              {{ (additionalMaintenanceData.sourceFaultRecord && additionalMaintenanceData.sourceFaultRecord.description) || '故障记录' }}
            </el-link>
          </el-descriptions-item>
          <el-descriptions-item v-if="additionalMaintenanceData.sourceMaintainTask" label="来源例行维保">
            <el-link type="primary" @click="viewSourceMaintainTask">
              {{ (additionalMaintenanceData.sourceMaintainTask && additionalMaintenanceData.sourceMaintainTask.projectName) || '例行维保' }}
            </el-link>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>

    <!-- 审批信息卡片 -->
    <div v-if="additionalMaintenanceData.approvalComment" class="info-card">
      <div class="card-header">
        <h3 class="card-title">审批意见</h3>
      </div>
      <div class="card-content">
        <p>{{ additionalMaintenanceData.approvalComment }}</p>
      </div>
    </div>

    <!-- 完成信息卡片 -->
    <div v-if="additionalMaintenanceData.completionNote || (additionalMaintenanceData.completionPhotos && additionalMaintenanceData.completionPhotos.length > 0)" class="info-card">
      <div class="card-header">
        <h3 class="card-title">完成信息</h3>
      </div>
      <div class="card-content">
        <el-descriptions :column="1" border>
          <el-descriptions-item v-if="additionalMaintenanceData.completionNote" label="完成说明">
            {{ additionalMaintenanceData.completionNote }}
          </el-descriptions-item>
          <el-descriptions-item v-if="additionalMaintenanceData.completionPhotos && additionalMaintenanceData.completionPhotos.length > 0" label="完成照片">
            <div class="photo-grid">
              <img
                v-for="(photo, index) in additionalMaintenanceData.completionPhotos"
                :key="index"
                :src="getImageUrl(photo)"
                alt="完成照片"
                class="photo-thumbnail"
                @click="previewImage(additionalMaintenanceData.completionPhotos, index)"
              />
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getAdditionalMaintenance,
  approveAdditionalMaintenance,
  updateAdditionalMaintenanceStatus
} from '@/api/additionalMaintenance'

export default {
  name: 'AdditionalMaintenanceDetail',
  data() {
    return {
      additionalMaintenanceId: null,
      loading: false,
      actionLoading: false,
      additionalMaintenanceData: {}
    }
  },
  computed: {
    hasMaintainPersons() {
      const persons = this.additionalMaintenanceData.maintainPersons
      return persons && (persons.leader || persons.technical || (persons.maintainers && persons.maintainers.length > 0))
    },
    hasSourceInfo() {
      return this.additionalMaintenanceData.sourceWorkReport ||
             this.additionalMaintenanceData.sourceFaultRecord ||
             this.additionalMaintenanceData.sourceMaintainTask
    },
    getActiveStepIndex() {
      if (!this.additionalMaintenanceData.progress) return 0
      const statusMap = {
        '待处理': 0,
        '处理中': 1,
        '待审批': 2,
        '已完成': 3
      }
      return statusMap[this.additionalMaintenanceData.status] || 0
    }
  },
  mounted() {
    this.additionalMaintenanceId = this.$route.params.id
    if (!this.additionalMaintenanceId) {
      this.$message.error('附加维保ID不存在')
      this.goBack()
      return
    }
    this.loadData()
  },
  methods: {
    async loadData() {
      this.loading = true
      try {
        const res = await getAdditionalMaintenance(this.additionalMaintenanceId)
        if (res.success) {
          this.additionalMaintenanceData = res.data
        } else {
          this.$message.error(res.message || '获取附加维保详情失败')
        }
      } catch (error) {
        console.error('获取附加维保详情失败:', error)
        this.$message.error('获取附加维保详情失败')
      } finally {
        this.loading = false
      }
    },
    goBack() {
      this.$router.back()
    },
    async approveAdditionalMaintenance() {
      try {
        const { value } = await this.$prompt('请输入审批意见', '审批附加维保', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入审批意见（可选）',
          inputType: 'textarea'
        })

        this.actionLoading = true
        const res = await approveAdditionalMaintenance(this.additionalMaintenanceId, {
          approvalComment: value || ''
        })

        if (res.success) {
          this.$message.success('审批成功')
          this.loadData()
        } else {
          this.$message.error(res.message || '审批失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('审批失败:', error)
          this.$message.error('审批失败')
        }
      } finally {
        this.actionLoading = false
      }
    },
    async updateStatus() {
      const statusOptions = []
      if (this.additionalMaintenanceData.status === '待处理') {
        statusOptions.push('处理中')
      }
      if (this.additionalMaintenanceData.status === '处理中') {
        statusOptions.push('待审批', '已完成')
      }
      if (this.additionalMaintenanceData.status === '待审批') {
        statusOptions.push('已完成')
      }
      statusOptions.push('已取消')

      if (statusOptions.length === 0) {
        this.$message.warning('当前状态无法更新')
        return
      }

      try {
        const { value } = await this.$prompt(
          `请选择新状态（可选：${statusOptions.join('、')}）`,
          '更新状态',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPlaceholder: statusOptions[0]
          }
        )

        const selectedStatus = statusOptions.find(s => s === value) || statusOptions[0]

        this.actionLoading = true
        const res = await updateAdditionalMaintenanceStatus(this.additionalMaintenanceId, {
          status: selectedStatus
        })

        if (res.success) {
          this.$message.success('状态更新成功')
          this.loadData()
        } else {
          this.$message.error(res.message || '状态更新失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('更新状态失败:', error)
          this.$message.error('更新状态失败')
        }
      } finally {
        this.actionLoading = false
      }
    },
    editAdditionalMaintenance() {
      this.$router.push({
        name: 'AdditionalMaintenanceEdit',
        params: { id: this.additionalMaintenanceId }
      })
    },
    viewSourceWorkReport() {
      if (this.additionalMaintenanceData.sourceWorkReport && this.additionalMaintenanceData.sourceWorkReport._id) {
        this.$router.push({
          name: 'WorkReportDetail',
          params: { id: this.additionalMaintenanceData.sourceWorkReport._id }
        })
      }
    },
    viewSourceFaultRecord() {
      if (this.additionalMaintenanceData.sourceFaultRecord && this.additionalMaintenanceData.sourceFaultRecord._id) {
        this.$router.push({
          name: 'FaultListDetail',
          query: { faultId: this.additionalMaintenanceData.sourceFaultRecord._id }
        })
      }
    },
    viewSourceMaintainTask() {
      if (this.additionalMaintenanceData.sourceMaintainTask && this.additionalMaintenanceData.sourceMaintainTask._id) {
        this.$router.push({
          name: 'TaskDetail',
          params: { id: this.additionalMaintenanceData.sourceMaintainTask._id }
        })
      }
    },
    formatDateTime(date) {
      if (!date) return '未设置'
      return new Date(date).toLocaleString('zh-CN')
    },
    getSourceTypeTag(type) {
      const typeMap = {
        '工作上报': 'success',
        '故障工单': 'danger',
        '例行维保': 'warning',
        '手动创建': 'info'
      }
      return typeMap[type] || 'info'
    },
    getStatusTagType(status) {
      const statusMap = {
        '待处理': 'info',
        '处理中': 'warning',
        '待审批': 'primary',
        '已完成': 'success',
        '已取消': 'danger'
      }
      return statusMap[status] || 'info'
    },
    getImageUrl(path) {
      if (!path) return ''
      if (path.startsWith('http')) return path
      const baseUrl = process.env.VUE_APP_BASE_API || ''
      return `${baseUrl}/uploads${path}`
    },
    previewImage(urls, index) {
      const images = urls.map(url => this.getImageUrl(url))
      // 使用 Element UI 的图片预览
      this.$preview && this.$preview({
        images,
        index
      })
    }
  }
}
</script>

<style scoped>
.additional-maintenance-detail-page {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  background: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  font-size: 32px;
  color: #409eff;
  margin-right: 16px;
}

.title-info {
  display: flex;
  flex-direction: column;
}

.page-title {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
}

.page-subtitle {
  margin: 4px 0 0 0;
  color: #666;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.info-card {
  background: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.card-title {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.card-content {
  margin-top: 16px;
}

.photo-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.photo-thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #ddd;
}
</style>
