<template>
  <div class="work-report-report-page">
    <!-- 顶部工具栏：打印按钮 -->
    <div class="report-toolbar no-print">
      <el-button icon="el-icon-arrow-left" @click="$router.back()">返回</el-button>
      <el-button type="primary" icon="el-icon-printer" @click="handlePrint">
        打印 / 导出 PDF
      </el-button>
    </div>

    <!-- 报告内容 -->
    <div class="report-container">
      <!-- 标题 -->
      <h1 class="report-title">工作上报报告</h1>
      <div class="report-subtitle">
        <span>上报类型：{{ workReportData.reportType || '未设置' }}</span>
        <span>上报时间：{{ formatDateTime(workReportData.createdAt) }}</span>
      </div>

      <!-- 一、基本信息 -->
      <section class="report-section">
        <h2>一、基本信息</h2>
        <table class="info-table">
          <tr>
            <td class="label">上报类型</td>
            <td>{{ workReportData.reportType || '未设置' }}</td>
            <td class="label">状态</td>
            <td>{{ workReportData.status || '未设置' }}</td>
          </tr>
          <tr>
            <td class="label">业主单位</td>
            <td>{{ workReportData.ownerUnitName || '未设置' }}</td>
            <td class="label">项目名称</td>
            <td>{{ workReportData.projectName || '未设置' }}</td>
          </tr>
          <tr>
            <td class="label">上报人</td>
            <td>{{ reporterName }}</td>
            <td class="label">上报时间</td>
            <td>{{ formatDateTime(workReportData.createdAt) }}</td>
          </tr>
          <tr v-if="workReportData.reviewedBy">
            <td class="label">审核人</td>
            <td>{{ reviewedByName }}</td>
            <td class="label">审核时间</td>
            <td>{{ formatDateTime(workReportData.reviewedAt) }}</td>
          </tr>
          <tr>
            <td class="label">报告生成时间</td>
            <td colspan="3">{{ now }}</td>
          </tr>
        </table>
      </section>

      <!-- 二、工作内容 -->
      <section class="report-section">
        <h2>二、工作内容</h2>
        
        <!-- 故障处理 -->
        <template v-if="workReportData.reportType === '故障处理'">
          <table class="info-table">
            <tr>
              <td class="label">故障位置</td>
              <td>{{ workReportData.faultLocation || '未设置' }}</td>
              <td class="label">处理时间</td>
              <td>{{ formatDateTime(workReportData.processTime) }}</td>
            </tr>
            <tr>
              <td class="label">工作时长</td>
              <td>{{ workReportData.workHours || 0 }}小时{{ workReportData.workMinutes || 0 }}分钟</td>
              <td class="label">工作日期</td>
              <td>{{ formatDateTime(workReportData.workDate) }}</td>
            </tr>
            <tr>
              <td class="label">故障描述</td>
              <td colspan="3">{{ workReportData.faultDescription || '未设置' }}</td>
            </tr>
            <tr>
              <td class="label">处理描述</td>
              <td colspan="3">{{ workReportData.processDescription || '未设置' }}</td>
            </tr>
            <tr v-if="workReportData.remark">
              <td class="label">备注</td>
              <td colspan="3">{{ workReportData.remark }}</td>
            </tr>
          </table>
          
          <!-- 故障照片 -->
          <div v-if="workReportData.faultPhotos && workReportData.faultPhotos.length > 0" class="photo-section">
            <h3>故障照片</h3>
            <div class="photo-grid">
              <div v-for="(photo, index) in workReportData.faultPhotos" :key="index" class="photo-item">
                <img :src="getImageUrl(photo)" alt="故障照片" />
              </div>
            </div>
          </div>
          
          <!-- 处理照片 -->
          <div v-if="workReportData.processPhotos && workReportData.processPhotos.length > 0" class="photo-section">
            <h3>处理照片</h3>
            <div class="photo-grid">
              <div v-for="(photo, index) in workReportData.processPhotos" :key="index" class="photo-item">
                <img :src="getImageUrl(photo)" alt="处理照片" />
              </div>
            </div>
          </div>
        </template>

        <!-- 维保抽查 -->
        <template v-if="workReportData.reportType === '维保抽查'">
          <table class="info-table">
            <tr>
              <td class="label">检测时间</td>
              <td>{{ formatDateTime(workReportData.checkTime) }}</td>
              <td class="label">工作日期</td>
              <td>{{ formatDateTime(workReportData.workDate) }}</td>
            </tr>
            <tr>
              <td class="label">检测情况说明</td>
              <td colspan="3">{{ workReportData.checkDescription || '未设置' }}</td>
            </tr>
          </table>
          
          <!-- 检测项 -->
          <div v-if="workReportData.checkItems && workReportData.checkItems.length > 0" class="check-items-section">
            <h3>检测项</h3>
            <table class="detail-table">
              <thead>
                <tr>
                  <th style="width: 40px;">序号</th>
                  <th>检测项名称</th>
                  <th>检测结果</th>
                  <th>检测说明</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in workReportData.checkItems" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.name || '未设置' }}</td>
                  <td>{{ item.result || '未设置' }}</td>
                  <td>{{ item.description || '' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- 现场照片 -->
          <div v-if="workReportData.sitePhotos && workReportData.sitePhotos.length > 0" class="photo-section">
            <h3>现场照片</h3>
            <div class="photo-grid">
              <div v-for="(photo, index) in workReportData.sitePhotos" :key="index" class="photo-item">
                <img :src="getImageUrl(photo)" alt="现场照片" />
              </div>
            </div>
          </div>
        </template>

        <!-- 培训演练 -->
        <template v-if="workReportData.reportType === '培训演练'">
          <table class="info-table">
            <tr>
              <td class="label">培训日期</td>
              <td>{{ formatDateTime(workReportData.trainingDate) }}</td>
              <td class="label">培训地点</td>
              <td>{{ workReportData.trainingLocation || '未设置' }}</td>
            </tr>
            <tr>
              <td class="label">培训情况说明</td>
              <td colspan="3">{{ workReportData.trainingDescription || '未设置' }}</td>
            </tr>
          </table>
          
          <!-- 培训照片 -->
          <div v-if="workReportData.trainingPhotos && workReportData.trainingPhotos.length > 0" class="photo-section">
            <h3>培训照片</h3>
            <div class="photo-grid">
              <div v-for="(photo, index) in workReportData.trainingPhotos" :key="index" class="photo-item">
                <img :src="getImageUrl(photo)" alt="培训照片" />
              </div>
            </div>
          </div>
        </template>

        <!-- 其他事项 -->
        <template v-if="workReportData.reportType === '其他事项'">
          <table class="info-table">
            <tr>
              <td class="label">工作日期</td>
              <td>{{ formatDateTime(workReportData.workDate) }}</td>
              <td class="label">工作地点</td>
              <td>{{ workReportData.workLocation || '未设置' }}</td>
            </tr>
            <tr>
              <td class="label">工作情况说明</td>
              <td colspan="3">{{ workReportData.workDescription || '未设置' }}</td>
            </tr>
          </table>
          
          <!-- 现场照片 -->
          <div v-if="workReportData.sitePhotos && workReportData.sitePhotos.length > 0" class="photo-section">
            <h3>现场照片</h3>
            <div class="photo-grid">
              <div v-for="(photo, index) in workReportData.sitePhotos" :key="index" class="photo-item">
                <img :src="getImageUrl(photo)" alt="现场照片" />
              </div>
            </div>
          </div>
        </template>
      </section>

      <!-- 三、签名信息 -->
      <section v-if="workReportData.signatures" class="report-section">
        <h2>三、签名信息</h2>
        <div class="signatures-section">
          <div v-if="workReportData.signatures.ownerSignature" class="signature-item">
            <h3>项目单位人员签字</h3>
            <img :src="getImageUrl(workReportData.signatures.ownerSignature)" alt="业主签名" />
          </div>
          <div v-if="workReportData.signatures.maintainerSignature" class="signature-item">
            <h3>维保人员签字</h3>
            <img :src="getImageUrl(workReportData.signatures.maintainerSignature)" alt="维保人员签名" />
          </div>
          <div v-if="workReportData.signatures.inspectorSignature" class="signature-item">
            <h3>检测人员签字</h3>
            <img :src="getImageUrl(workReportData.signatures.inspectorSignature)" alt="检测人员签名" />
          </div>
        </div>
      </section>

      <!-- 四、审核信息 -->
      <section v-if="workReportData.reviewComment" class="report-section">
        <h2>四、审核意见</h2>
        <p>{{ workReportData.reviewComment }}</p>
      </section>
    </div>
  </div>
</template>

<script>
import { getWorkReport } from '@/api/workReport'

export default {
  name: 'WorkReportReportPage',
  data() {
    return {
      workReportId: null,
      loading: false,
      workReportData: {},
      now: new Date().toLocaleString('zh-CN')
    }
  },
  computed: {
    reporterName() {
      if (this.workReportData.reporter) {
        return this.workReportData.reporter.phone
          ? `${this.workReportData.reporter.name}（${this.workReportData.reporter.phone}）`
          : this.workReportData.reporter.name
      }
      return '未知'
    },
    reviewedByName() {
      if (this.workReportData.reviewedBy) {
        return this.workReportData.reviewedBy.username || '未知'
      }
      return '未审核'
    }
  },
  mounted() {
    this.workReportId = this.$route.params.id
    if (!this.workReportId) {
      this.$message.error('工作上报ID不存在')
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
    formatDateTime(date) {
      if (!date) return '未设置'
      return new Date(date).toLocaleString('zh-CN')
    },
    getImageUrl(path) {
      if (!path) return ''
      if (path.startsWith('http')) return path
      const baseUrl = process.env.VUE_APP_BASE_API || ''
      return `${baseUrl}/uploads${path}`
    },
    handlePrint() {
      // 只打印报告区域：克隆 report-container 到新窗口再打印
      const reportEl = this.$el.querySelector('.report-container')
      if (!reportEl) {
        window.print()
        return
      }

      const printContents = reportEl.innerHTML
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        this.$message.error('无法打开打印窗口，请检查浏览器弹窗设置')
        return
      }

      // 基础样式，保证打印效果
      const style = `
        * { box-sizing: border-box; }
        body {
          margin: 0;
          padding: 16px 24px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
            Arial, 'Noto Sans', sans-serif;
          color: #333;
        }
        .report-title {
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        .report-subtitle {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #666;
          margin-bottom: 24px;
        }
        .report-section {
          margin-bottom: 24px;
        }
        .report-section h2 {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
          border-left: 4px solid #409eff;
          padding-left: 8px;
        }
        .report-section h3 {
          font-size: 14px;
          font-weight: bold;
          margin: 16px 0 8px 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        td, th {
          border: 1px solid #ddd;
          padding: 6px 8px;
        }
        th {
          background: #f5f7fa;
          font-weight: bold;
        }
        .info-table .label {
          width: 80px;
          background: #f5f7fa;
          font-weight: bold;
        }
        .photo-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .photo-item {
          width: 120px;
          height: 90px;
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
        }
        .photo-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .signatures-section {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        .signature-item {
          flex: 1;
          min-width: 200px;
        }
        .signature-item h3 {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        .signature-item img {
          width: 100%;
          max-width: 300px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
      `

      printWindow.document.open()
      printWindow.document.write(`
        <html>
          <head>
            <title>工作上报报告</title>
            <meta charset="utf-8" />
            <style>${style}</style>
          </head>
          <body>
            ${printContents}
          </body>
        </html>
      `)
      printWindow.document.close()

      // 等待渲染完成再打印
      printWindow.onload = () => {
        printWindow.focus()
        printWindow.print()
        printWindow.close()
      }
    }
  }
}
</script>

<style scoped>
.work-report-report-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding: 16px;
}

.report-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.report-container {
  max-width: 900px;
  margin: 0 auto;
  background: #ffffff;
  padding: 32px 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: #333;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
    Arial, 'Noto Sans', sans-serif;
}

.report-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.report-subtitle {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #666;
  margin-bottom: 24px;
}

.report-section {
  margin-bottom: 24px;
}

.report-section h2 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  border-left: 4px solid #409eff;
  padding-left: 8px;
}

.report-section h3 {
  font-size: 14px;
  font-weight: bold;
  margin: 16px 0 8px 0;
}

.info-table,
.detail-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.info-table td {
  border: 1px solid #ddd;
  padding: 6px 8px;
}

.info-table .label {
  width: 80px;
  background: #f5f7fa;
  font-weight: bold;
}

.detail-table th,
.detail-table td {
  border: 1px solid #ddd;
  padding: 6px 8px;
}

.detail-table th {
  background: #f5f7fa;
  font-weight: bold;
}

.photo-section {
  margin-top: 20px;
}

.photo-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.photo-item {
  width: 120px;
  height: 90px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.signatures-section {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.signature-item {
  flex: 1;
  min-width: 200px;
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

@media print {
  .no-print {
    display: none !important;
  }
  .work-report-report-page {
    background: #ffffff;
    padding: 0;
  }
}
</style>
