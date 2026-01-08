<template>
  <div class="work-report-detail-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <div class="page-icon">
            <i class="el-icon-upload2" />
          </div>
          <div class="title-info">
            <h1 class="page-title">工作上报详情</h1>
            <p class="page-subtitle">查看工作上报的详细信息</p>
          </div>
        </div>
        <div class="header-actions">
          <el-button icon="el-icon-arrow-left" @click="goBack">
            返回列表
          </el-button>
          <el-button
            v-if="workReportData.status === '已上报'"
            type="warning"
            icon="el-icon-check"
            :loading="actionLoading"
            @click="reviewReport"
          >
            审核
          </el-button>
          <el-button
            v-if="workReportData.status === '已审核' && !workReportData.convertedToAdditionalMaintenance"
            type="info"
            icon="el-icon-refresh"
            :loading="actionLoading"
            @click="convertToAdditional"
          >
            转换为附加维保
          </el-button>
          <el-button
            type="success"
            icon="el-icon-document"
            @click="generateReport"
          >
            生成报告
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
          <el-descriptions-item label="上报类型">
            <el-tag :type="getTypeTagType(workReportData.reportType)">
              {{ workReportData.reportType }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusTagType(workReportData.status)">
              {{ workReportData.status }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="业主单位">
            {{ workReportData.ownerUnitName || '未设置' }}
          </el-descriptions-item>
          <el-descriptions-item label="项目名称">
            {{ workReportData.projectName || '未设置' }}
          </el-descriptions-item>
          <el-descriptions-item label="上报时间">
            {{ formatDateTime(workReportData.createdAt) }}
          </el-descriptions-item>
          <el-descriptions-item label="上报人">
            {{ (workReportData.reporter && workReportData.reporter.name) || '未知' }}
            <span v-if="workReportData.reporter && workReportData.reporter.phone">（{{ workReportData.reporter.phone }}）</span>
          </el-descriptions-item>
          <el-descriptions-item v-if="workReportData.reviewedBy" label="审核人">
            {{ (workReportData.reviewedBy && workReportData.reviewedBy.username) || '未知' }}
          </el-descriptions-item>
          <el-descriptions-item v-if="workReportData.reviewedAt" label="审核时间">
            {{ formatDateTime(workReportData.reviewedAt) }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>

    <!-- 工作内容卡片 -->
    <div class="info-card">
      <div class="card-header">
        <h3 class="card-title">工作内容</h3>
      </div>
      <div class="card-content">
        <!-- 故障处理 -->
        <template v-if="workReportData.reportType === '故障处理'">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="故障位置">
              {{ workReportData.faultLocation || '未设置' }}
            </el-descriptions-item>
            <el-descriptions-item label="处理时间">
              {{ formatDateTime(workReportData.processTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="工作时长">
              {{ workReportData.workHours || 0 }}小时{{ workReportData.workMinutes || 0 }}分钟
            </el-descriptions-item>
            <el-descriptions-item label="工作日期">
              {{ formatDateTime(workReportData.workDate) }}
            </el-descriptions-item>
            <el-descriptions-item label="故障描述" :span="2">
              {{ workReportData.faultDescription || '未设置' }}
            </el-descriptions-item>
            <el-descriptions-item label="处理描述" :span="2">
              {{ workReportData.processDescription || '未设置' }}
            </el-descriptions-item>
            <el-descriptions-item v-if="workReportData.remark" label="备注" :span="2">
              {{ workReportData.remark }}
            </el-descriptions-item>
          </el-descriptions>
          
          <!-- 故障照片 -->
          <div v-if="workReportData.faultPhotos && workReportData.faultPhotos.length > 0" class="photo-section">
            <h4>故障照片</h4>
            <div class="photos-grid">
              <div v-for="(photo, index) in workReportData.faultPhotos" :key="index" class="photo-item">
                <img :src="getImageUrl(photo)" alt="故障照片" @click="previewImage(workReportData.faultPhotos, index)" />
              </div>
            </div>
          </div>
          
          <!-- 处理照片 -->
          <div v-if="workReportData.processPhotos && workReportData.processPhotos.length > 0" class="photo-section">
            <h4>处理照片</h4>
            <div class="photos-grid">
              <div v-for="(photo, index) in workReportData.processPhotos" :key="index" class="photo-item">
                <img :src="getImageUrl(photo)" alt="处理照片" @click="previewImage(workReportData.processPhotos, index)" />
              </div>
            </div>
          </div>
        </template>

        <!-- 维保抽查 -->
        <template v-if="workReportData.reportType === '维保抽查'">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="检测时间">
              {{ formatDateTime(workReportData.checkTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="工作日期">
              {{ formatDateTime(workReportData.workDate) }}
            </el-descriptions-item>
            <el-descriptions-item label="检测情况说明" :span="2">
              {{ workReportData.checkDescription || '未设置' }}
            </el-descriptions-item>
          </el-descriptions>
          
          <!-- 检测项 -->
          <div v-if="workReportData.checkItems && workReportData.checkItems.length > 0" class="check-items-section">
            <h4>检测项</h4>
            <el-table :data="workReportData.checkItems" border>
              <el-table-column prop="name" label="检测项名称" />
              <el-table-column prop="result" label="检测结果" />
              <el-table-column prop="description" label="检测说明" />
            </el-table>
          </div>
          
          <!-- 现场照片 -->
          <div v-if="workReportData.sitePhotos && workReportData.sitePhotos.length > 0" class="photo-section">
            <h4>现场照片</h4>
            <div class="photos-grid">
              <div v-for="(photo, index) in workReportData.sitePhotos" :key="index" class="photo-item">
                <img :src="getImageUrl(photo)" alt="现场照片" @click="previewImage(workReportData.sitePhotos, index)" />
              </div>
            </div>
          </div>
        </template>

        <!-- 培训演练 -->
        <template v-if="workReportData.reportType === '培训演练'">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="培训日期">
              {{ formatDateTime(workReportData.trainingDate) }}
            </el-descriptions-item>
            <el-descriptions-item label="培训地点">
              {{ workReportData.trainingLocation || '未设置' }}
            </el-descriptions-item>
            <el-descriptions-item label="培训情况说明" :span="2">
              {{ workReportData.trainingDescription || '未设置' }}
            </el-descriptions-item>
          </el-descriptions>
          
          <!-- 培训照片 -->
          <div v-if="workReportData.trainingPhotos && workReportData.trainingPhotos.length > 0" class="photo-section">
            <h4>培训照片</h4>
            <div class="photos-grid">
              <div v-for="(photo, index) in workReportData.trainingPhotos" :key="index" class="photo-item">
                <img :src="getImageUrl(photo)" alt="培训照片" @click="previewImage(workReportData.trainingPhotos, index)" />
              </div>
            </div>
          </div>
        </template>

        <!-- 其他事项 -->
        <template v-if="workReportData.reportType === '其他事项'">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="工作日期">
              {{ formatDateTime(workReportData.workDate) }}
            </el-descriptions-item>
            <el-descriptions-item label="工作地点">
              {{ workReportData.workLocation || '未设置' }}
            </el-descriptions-item>
            <el-descriptions-item label="工作情况说明" :span="2">
              {{ workReportData.workDescription || '未设置' }}
            </el-descriptions-item>
          </el-descriptions>
          
          <!-- 现场照片 -->
          <div v-if="workReportData.sitePhotos && workReportData.sitePhotos.length > 0" class="photo-section">
            <h4>现场照片</h4>
            <div class="photos-grid">
              <div v-for="(photo, index) in workReportData.sitePhotos" :key="index" class="photo-item">
                <img :src="getImageUrl(photo)" alt="现场照片" @click="previewImage(workReportData.sitePhotos, index)" />
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- 签名信息卡片 -->
    <div v-if="workReportData.signatures" class="info-card">
      <div class="card-header">
        <h3 class="card-title">签名信息</h3>
      </div>
      <div class="card-content">
        <div class="signatures-grid">
          <div v-if="workReportData.signatures.ownerSignature" class="signature-item">
            <h4>项目单位人员签字</h4>
            <img :src="getImageUrl(workReportData.signatures.ownerSignature)" alt="业主签名" />
          </div>
          <div v-if="workReportData.signatures.maintainerSignature" class="signature-item">
            <h4>维保人员签字</h4>
            <img :src="getImageUrl(workReportData.signatures.maintainerSignature)" alt="维保人员签名" />
          </div>
          <div v-if="workReportData.signatures.inspectorSignature" class="signature-item">
            <h4>检测人员签字</h4>
            <img :src="getImageUrl(workReportData.signatures.inspectorSignature)" alt="检测人员签名" />
          </div>
        </div>
      </div>
    </div>

    <!-- 审核信息卡片 -->
    <div v-if="workReportData.reviewComment" class="info-card">
      <div class="card-header">
        <h3 class="card-title">审核意见</h3>
      </div>
      <div class="card-content">
        <p>{{ workReportData.reviewComment }}</p>
      </div>
    </div>

    <!-- 附加维保关联卡片 -->
    <div v-if="workReportData.convertedToAdditionalMaintenance" class="info-card">
      <div class="card-header">
        <h3 class="card-title">附加维保关联</h3>
      </div>
      <div class="card-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="附加维保ID">
            {{ (workReportData.convertedToAdditionalMaintenance && workReportData.convertedToAdditionalMaintenance._id) || '未知' }}
          </el-descriptions-item>
          <el-descriptions-item label="附加维保状态">
            <el-tag :type="getStatusTagType((workReportData.convertedToAdditionalMaintenance && workReportData.convertedToAdditionalMaintenance.status) || '')">
              {{ (workReportData.convertedToAdditionalMaintenance && workReportData.convertedToAdditionalMaintenance.status) || '未知' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item v-if="workReportData.convertReason" label="转换原因" :span="2">
            {{ workReportData.convertReason }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
  </div>
</template>

<script>
import { getWorkReport, reviewWorkReport, convertToAdditionalMaintenance } from '@/api/workReport'

export default {
  name: 'WorkReportDetail',
  data() {
    return {
      workReportId: null,
      loading: false,
      actionLoading: false,
      workReportData: {}
    }
  },
  mounted() {
    this.workReportId = this.$route.params.id
    if (!this.workReportId) {
      this.$message.error('工作上报ID不存在')
      this.goBack()
      return
    }
    this.loadData()
  },
  methods: {
    async loadData() {
      this.loading = true
      try {
        const res = await getWorkReport(this.workReportId)
        if (res.success) {
          this.workReportData = res.data
        } else {
          this.$message.error(res.message || '获取工作上报详情失败')
        }
      } catch (error) {
        console.error('获取工作上报详情失败:', error)
        this.$message.error('获取工作上报详情失败')
      } finally {
        this.loading = false
      }
    },
    goBack() {
      this.$router.back()
    },
    async reviewReport() {
      try {
        const { value } = await this.$prompt('请输入审核意见', '审核工作上报', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入审核意见（可选）',
          inputType: 'textarea'
        })
        
        this.actionLoading = true
        const res = await reviewWorkReport(this.workReportId, {
          status: '已审核',
          reviewComment: value || ''
        })
        
        if (res.success) {
          this.$message.success('审核成功')
          this.loadData()
        } else {
          this.$message.error(res.message || '审核失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('审核失败:', error)
          this.$message.error('审核失败')
        }
      } finally {
        this.actionLoading = false
      }
    },
    async convertToAdditional() {
      try {
        const { value } = await this.$prompt('请输入转换原因', '转换为附加维保', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入转换原因',
          inputType: 'textarea'
        })
        
        this.actionLoading = true
        const res = await convertToAdditionalMaintenance(this.workReportId, {
          convertReason: value || ''
        })
        
        if (res.success) {
          this.$message.success('转换成功')
          this.loadData()
        } else {
          this.$message.error(res.message || '转换失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('转换失败:', error)
          this.$message.error('转换失败')
        }
      } finally {
        this.actionLoading = false
      }
    },
    generateReport() {
      const route = this.$router.resolve({
        name: 'WorkReportReport',
        params: { id: this.workReportId }
      })
      window.open(route.href, '_blank')
    },
    formatDateTime(date) {
      if (!date) return '未设置'
      return new Date(date).toLocaleString('zh-CN')
    },
    getTypeTagType(type) {
      const typeMap = {
        '故障处理': 'danger',
        '维保抽查': 'warning',
        '培训演练': 'success',
        '其他事项': 'info'
      }
      return typeMap[type] || 'info'
    },
    getStatusTagType(status) {
      const statusMap = {
        '已上报': 'info',
        '已审核': 'success',
        '已转换为附加维保': 'warning',
        '已完成': 'success'
      }
      return statusMap[status] || 'info'
    },
    getImageUrl(path) {
      if (!path) return ''
      if (path.startsWith('http')) return path
      // 假设后端提供静态文件服务
      const baseUrl = process.env.VUE_APP_BASE_API || ''
      return `${baseUrl}/uploads${path}`
    },
    previewImage(urls, index) {
      // 使用浏览器原生预览
      const images = urls.map(url => this.getImageUrl(url))
      // 在新窗口中打开图片
      window.open(images[index], '_blank')
    }
  }
}
</script>

<style scoped>
.work-report-detail-page {
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

.photo-section {
  margin-top: 20px;
}

.photo-section h4 {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: bold;
}

.photos-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.photo-item {
  width: 150px;
  height: 150px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.signatures-grid {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.signature-item {
  flex: 1;
  min-width: 200px;
}

.signature-item h4 {
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: bold;
}

.signature-item img {
  width: 100%;
  max-width: 300px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.check-items-section {
  margin-top: 20px;
}

.check-items-section h4 {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: bold;
}
</style>
