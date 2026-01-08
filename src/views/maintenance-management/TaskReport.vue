<template>
  <div class="task-report-page">
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
      <h1 class="report-title">消防维保服务报告</h1>
      <div class="report-subtitle">
        <span>项目名称：{{ taskData.projectName || '未设置' }}</span>
        <span>任务月份：{{ taskData.taskMonth || '未设置' }}</span>
      </div>

      <!-- 一、基本信息 -->
      <section class="report-section">
        <h2>一、基本信息</h2>
        <table class="info-table">
          <tr>
            <td class="label">项目名称</td>
            <td>{{ taskData.projectName || '未设置' }}</td>
            <td class="label">项目地址</td>
            <td>{{ taskData.projectAddress || (project && project.address) || '未设置' }}</td>
          </tr>
          <tr>
            <td class="label">业主单位</td>
            <td>{{ ownerName }}</td>
            <td class="label">任务月份</td>
            <td>{{ taskData.taskMonth || '未设置' }}</td>
          </tr>
          <tr>
            <td class="label">计划类型</td>
            <td>{{ taskData.planType || '未设置' }}</td>
            <td class="label">任务状态</td>
            <td>{{ taskData.status || '未设置' }}</td>
          </tr>
          <tr>
            <td class="label">创建时间</td>
            <td>{{ formatDateTime(taskData.createdAt) }}</td>
            <td class="label">报告生成时间</td>
            <td>{{ now }}</td>
          </tr>
        </table>
      </section>

      <!-- 二、维保人员信息 -->
      <section class="report-section">
        <h2>二、维保人员信息</h2>
        <table class="info-table">
          <tr>
            <td class="label">项目负责人</td>
            <td>
              {{ (leader && leader.name) || '未设置' }}
              <span v-if="leader && leader.phone">（{{ leader.phone }}）</span>
            </td>
            <td class="label">技术负责人</td>
            <td>
              {{ (technical && technical.name) || '未设置' }}
              <span v-if="technical && technical.phone">（{{ technical.phone }}）</span>
            </td>
          </tr>
          <tr>
            <td class="label">现场维保人员</td>
            <td colspan="3">
              <span v-if="maintainers && maintainers.length">
                {{ maintainersText }}
              </span>
              <span v-else>未设置</span>
            </td>
          </tr>
        </table>
      </section>

      <!-- 三、检测统计 -->
      <section class="report-section">
        <h2>三、检测统计</h2>
        <table class="info-table">
          <tr>
            <td class="label">检测总数</td>
            <td>{{ stats.total }}</td>
            <td class="label">合格数量</td>
            <td>{{ stats.passed }}</td>
          </tr>
          <tr>
            <td class="label">异常数量</td>
            <td>{{ stats.abnormal }}</td>
            <td class="label">未检数量</td>
            <td>{{ stats.unchecked }}</td>
          </tr>
          <tr>
            <td class="label">更换设备</td>
            <td>{{ stats.replaced }}</td>
            <td class="label">维保结果</td>
            <td>{{ taskData.maintainResult || '未完成' }}</td>
          </tr>
        </table>
      </section>

      <!-- 四、检测详情 -->
      <section v-if="groupedDetails && Object.keys(groupedDetails).length" class="report-section">
        <h2>四、检测详情</h2>
        <div v-for="(items, category) in groupedDetails" :key="category" class="category-block">
          <h3 class="category-title">{{ category }}</h3>
          <table class="detail-table">
            <thead>
              <tr>
                <th style="width: 40px;">序号</th>
                <th style="width: 120px;">设备名称</th>
                <th>检测内容</th>
                <th style="width: 80px;">检测结果</th>
                <th style="width: 180px;">备注</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="item._id || index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.device || '未设置' }}</td>
                <td>{{ item.maintainContent || '未设置' }}</td>
                <td>{{ formatResult(item.result) }}</td>
                <td>{{ item.remark || '' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- 五、故障记录 -->
      <section v-if="taskData.faultList && taskData.faultList.length" class="report-section">
        <h2>五、故障记录</h2>
        <table class="detail-table">
          <thead>
            <tr>
              <th style="width: 40px;">序号</th>
              <th>故障描述</th>
              <th style="width: 100px;">状态</th>
              <th style="width: 180px;">解决时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(fault, index) in taskData.faultList" :key="fault._id || index">
              <td>{{ index + 1 }}</td>
              <td>{{ fault.description || '未设置' }}</td>
              <td>{{ fault.status || '未处理' }}</td>
              <td>{{ formatDateTime(fault.resolvedAt) }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- 六、现场照片 -->
      <section v-if="taskData.onsitePhotos && taskData.onsitePhotos.length" class="report-section">
        <h2>六、现场照片</h2>
        <div class="photo-grid">
          <div
            v-for="(url, index) in taskData.onsitePhotos"
            :key="index"
            class="photo-item"
          >
            <img :src="url" alt="现场照片" />
          </div>
        </div>
      </section>

      <!-- 七、评价信息 -->
      <section v-if="taskData.rating || taskData.ratingComment" class="report-section">
        <h2>七、评价信息</h2>
        <table class="info-table">
          <tr v-if="taskData.rating">
            <td class="label">评分</td>
            <td colspan="3">{{ taskData.rating }} 分</td>
          </tr>
          <tr v-if="taskData.ratingComment">
            <td class="label">评价内容</td>
            <td colspan="3">{{ taskData.ratingComment }}</td>
          </tr>
        </table>
      </section>

      <!-- 八、任务进度 -->
      <section v-if="taskData.progress && taskData.progress.length" class="report-section">
        <h2>八、任务进度</h2>
        <table class="detail-table">
          <thead>
            <tr>
              <th style="width: 120px;">步骤</th>
              <th style="width: 80px;">状态</th>
              <th>时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(step, index) in taskData.progress" :key="index">
              <td>{{ step.name }}</td>
              <td>{{ step.status === 'done' ? '已完成' : '未完成' }}</td>
              <td>{{ formatDateTime(step.timestamp) }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<script>
import { getMaintainTask } from '@/api/maintainTask'

export default {
  name: 'TaskReportPage',
  data() {
    return {
      taskId: null,
      loading: false,
      taskData: {},
      project: null,
      leader: null,
      technical: null,
      maintainers: [],
      stats: {
        total: 0,
        passed: 0,
        abnormal: 0,
        unchecked: 0,
        replaced: 0
      },
      groupedDetails: {},
      now: new Date().toLocaleString('zh-CN')
    }
  },
  computed: {
    ownerName() {
      const d = this.taskData
      return (
        d.ownerName ||
        (d.contract && d.contract.clientCompany) ||
        (d.project && d.project.ownerCompany) ||
        (d.project && d.project.name) ||
        '未知业主单位'
      )
    },
    maintainersText() {
      if (!this.maintainers || !this.maintainers.length) return ''
      return this.maintainers
        .map(m => (m.phone ? `${m.name}（${m.phone}）` : m.name))
        .join('、')
    }
  },
  mounted() {
    this.taskId = this.$route.params.id
    if (!this.taskId) {
      this.$message.error('任务ID不存在')
      return
    }
    this.loadData()
  },
  methods: {
    async loadData() {
      this.loading = true
      try {
        const res = await getMaintainTask(this.taskId)
        if (res.success) {
          const data = res.data
          this.taskData = data
          this.project = data.project || null
          this.leader = (data.maintainPersons && data.maintainPersons.leader) || null
          this.technical = (data.maintainPersons && data.maintainPersons.technical) || null
          this.maintainers = (data.maintainPersons && data.maintainPersons.maintainers) || []

          this.computeStats(data)
          this.groupDetailsByCategory(data.details || [])
        } else {
          this.$message.error(res.message || '获取任务详情失败')
        }
      } catch (e) {
        console.error('获取任务详情失败:', e)
        this.$message.error('获取任务详情失败: ' + (e.message || '未知错误'))
      }
      this.loading = false
    },
    computeStats(data) {
      let total = 0
      let passed = 0
      let abnormal = 0
      let unchecked = 0

      if (data.details && Array.isArray(data.details) && data.details.length > 0) {
        const first = data.details[0]
        if (typeof first === 'object' && first.result !== undefined) {
          data.details.forEach(item => {
            total++
            if (item.result === '正常') {
              passed++
            } else if (item.result === '异常') {
              abnormal++
            } else if (item.result === '未检') {
              unchecked++
            }
          })
        } else {
          total = data.totalCheckCount || 0
          passed = data.passedCount || 0
          abnormal = data.abnormalCount || 0
          unchecked = total - passed - abnormal
        }
      } else {
        total = data.totalCheckCount || 0
        passed = data.passedCount || 0
        abnormal = data.abnormalCount || 0
        unchecked = total - passed - abnormal
      }

      this.stats = {
        total,
        passed,
        abnormal,
        unchecked: Math.max(0, unchecked || 0),
        replaced: data.replacedCount || 0
      }
    },
    groupDetailsByCategory(details) {
      const grouped = {}
      if (!Array.isArray(details)) {
        this.groupedDetails = grouped
        return
      }
      details.forEach(item => {
        if (!item || typeof item !== 'object') return
        const category = item.category || '其他'
        if (!grouped[category]) {
          grouped[category] = []
        }
        grouped[category].push(item)
      })
      this.groupedDetails = grouped
    },
    formatResult(result) {
      if (result === '正常') return '合格'
      if (result === '异常') return '不合格'
      return '未检'
    },
    formatDateTime(date) {
      if (!date) return ''
      return new Date(date).toLocaleString('zh-CN')
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
            <title>维保任务报告</title>
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
.task-report-page {
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

.category-block {
  margin-bottom: 16px;
}

.category-title {
  font-size: 14px;
  font-weight: bold;
  margin: 8px 0;
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
  .task-report-page {
    background: #ffffff;
    padding: 0;
  }
}
</style>

