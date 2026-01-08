<template>
  <div class="fault-report-page">
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
      <h1 class="report-title">故障维修记录报告</h1>
      <div class="report-subtitle">
        <span>项目名称：{{ faultData.projectName || '未设置' }}</span>
        <span>上报时间：{{ formatDateTime(faultData.createdAt) }}</span>
      </div>

      <!-- 一、基本信息 -->
      <section class="report-section">
        <h2>一、基本信息</h2>
        <table class="info-table">
          <tr>
            <td class="label">业主单位</td>
            <td>{{ faultData.ownerCompany || '未设置' }}</td>
            <td class="label">项目名称</td>
            <td>{{ faultData.projectName || '未设置' }}</td>
          </tr>
          <tr>
            <td class="label">工单来源</td>
            <td>{{ faultData.source || '未设置' }}</td>
            <td class="label">工单状态</td>
            <td>{{ faultData.status || '未设置' }}</td>
          </tr>
          <tr>
            <td class="label">上报时间</td>
            <td>{{ formatDateTime(faultData.createdAt) }}</td>
            <td class="label">预计完成时间</td>
            <td>{{ formatDateTime(faultData.expectedCompletionTime) }}</td>
          </tr>
          <tr>
            <td class="label">上报人员</td>
            <td>{{ reporterName }}</td>
            <td class="label">联系方式</td>
            <td>{{ reporterPhone || '未设置' }}</td>
          </tr>
          <tr>
            <td class="label">当前负责人</td>
            <td>{{ ownerName || '未分配' }}</td>
            <td class="label">报告生成时间</td>
            <td>{{ now }}</td>
          </tr>
        </table>
      </section>

      <!-- 二、故障信息 -->
      <section class="report-section">
        <h2>二、故障信息</h2>
        <table class="info-table">
          <tr>
            <td class="label">消防系统/设施</td>
            <td>{{ faultData.fireSystem || '未设置' }}</td>
            <td class="label">维保项目</td>
            <td>{{ faultData.maintenanceItem || '未设置' }}</td>
          </tr>
          <tr>
            <td class="label">检测内容</td>
            <td colspan="3">{{ faultData.detectionContent || '未设置' }}</td>
          </tr>
          <tr>
            <td class="label">故障描述</td>
            <td colspan="3">{{ faultData.description || '未设置' }}</td>
          </tr>
        </table>
      </section>

      <!-- 三、故障照片 -->
      <section v-if="faultData.problemphotoUrls && faultData.problemphotoUrls.length > 0" class="report-section">
        <h2>三、故障照片</h2>
        <div class="photo-grid">
          <div
            v-for="(url, index) in faultData.problemphotoUrls"
            :key="index"
            class="photo-item"
          >
            <img :src="url" alt="故障照片" />
          </div>
        </div>
      </section>

      <!-- 四、处理情况 -->
      <section v-if="faultData.resolved" class="report-section">
        <h2>四、处理情况</h2>
        <table class="info-table">
          <tr>
            <td class="label">处理人员</td>
            <td>{{ resolvedByName || '未设置' }}</td>
            <td class="label">处理时间</td>
            <td>{{ formatDateTime(faultData.resolvedAt) }}</td>
          </tr>
          <tr>
            <td class="label">处理描述</td>
            <td colspan="3">{{ faultData.resolution || '未设置' }}</td>
          </tr>
          <tr>
            <td class="label">备注信息</td>
            <td colspan="3">{{ faultData.remarks || '无' }}</td>
          </tr>
        </table>
      </section>

      <!-- 五、处理照片 -->
      <section v-if="faultData.solutionphotoUrls && faultData.solutionphotoUrls.length > 0" class="report-section">
        <h2>五、处理照片</h2>
        <div class="photo-grid">
          <div
            v-for="(url, index) in faultData.solutionphotoUrls"
            :key="index"
            class="photo-item"
          >
            <img :src="url" alt="处理照片" />
          </div>
        </div>
      </section>

      <!-- 六、处理进度 -->
      <section class="report-section">
        <h2>六、处理进度</h2>
        <table class="detail-table">
          <thead>
            <tr>
              <th style="width: 120px;">步骤</th>
              <th style="width: 100px;">状态</th>
              <th>时间</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>故障上报</td>
              <td>已完成</td>
              <td>{{ formatDateTime(faultData.createdAt) }}</td>
            </tr>
            <tr v-if="faultData.status === '处置中' || faultData.status === '处理中' || faultData.resolved">
              <td>开始处理</td>
              <td>已完成</td>
              <td>{{ formatDateTime(faultData.updatedAt) }}</td>
            </tr>
            <tr v-if="faultData.resolved">
              <td>处理完成</td>
              <td>已完成</td>
              <td>{{ formatDateTime(faultData.resolvedAt) }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<script>
import { getFaultRecord } from '@/api/faultRecord'

export default {
  name: 'FaultReportPage',
  data() {
    return {
      faultId: null,
      loading: false,
      faultData: {},
      now: new Date().toLocaleString('zh-CN')
    }
  },
  computed: {
    reporterName() {
      if (this.faultData.reporter) {
        if (typeof this.faultData.reporter === 'object' && this.faultData.reporter.name) {
          return this.faultData.reporter.name
        }
        return '已上报'
      }
      return '未设置'
    },
    reporterPhone() {
      if (this.faultData.reporter && typeof this.faultData.reporter === 'object') {
        return this.faultData.reporter.phone || ''
      }
      return ''
    },
    ownerName() {
      if (this.faultData.owner) {
        if (typeof this.faultData.owner === 'object' && this.faultData.owner.name) {
          return this.faultData.owner.name
        }
        return '已分配'
      }
      return '未分配'
    },
    resolvedByName() {
      if (this.faultData.resolvedBy) {
        if (typeof this.faultData.resolvedBy === 'object' && this.faultData.resolvedBy.name) {
          return this.faultData.resolvedBy.name
        }
        return '已处理'
      }
      return '未设置'
    }
  },
  mounted() {
    this.faultId = this.$route.params.id
    if (!this.faultId) {
      this.$message.error('故障记录ID不存在')
      return
    }
    this.loadData()
  },
  methods: {
    async loadData() {
      this.loading = true
      try {
        const res = await getFaultRecord(this.faultId)
        if (res.success) {
          const data = res.data
          // 处理数据映射
          this.faultData = {
            ...data,
            projectName: data.project || 
                         (data.task && (data.task.projectName || (data.task.project && typeof data.task.project === 'object' ? data.task.project.name : ''))) || 
                         '未设置',
            fireSystem: (data.taskItem && data.taskItem.category) || '未设置',
            maintenanceItem: (data.taskItem && data.taskItem.device) || '未设置',
            detectionContent: (data.taskItem && (data.taskItem.maintainContent || data.taskItem.maintaSlim)) || '未设置'
          }
        } else {
          this.$message.error(res.message || '获取故障记录详情失败')
        }
      } catch (e) {
        console.error('获取故障记录详情失败:', e)
        this.$message.error('获取故障记录详情失败: ' + (e.message || '未知错误'))
      }
      this.loading = false
    },
    formatDateTime(date) {
      if (!date) return '未设置'
      const d = new Date(date)
      if (isNaN(d.getTime())) return '未设置'
      return d.toLocaleString('zh-CN')
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
      `

      printWindow.document.open()
      printWindow.document.write(`
        <html>
          <head>
            <title>故障维修记录报告</title>
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
.fault-report-page {
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

@media print {
  .no-print {
    display: none !important;
  }
  .fault-report-page {
    background: #ffffff;
    padding: 0;
  }
}
</style>
