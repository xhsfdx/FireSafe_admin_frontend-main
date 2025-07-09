<template>
  <div class="unit-detail-page">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator=">" class="breadcrumb-bar">
      <el-breadcrumb-item>业主单位管理</el-breadcrumb-item>
      <el-breadcrumb-item>单位项目管理</el-breadcrumb-item>
      <el-breadcrumb-item>项目详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 返回按钮 -->
    <el-button class="back-btn" icon="el-icon-back" @click="$router.back()">返回</el-button>

    <el-card v-loading="loading">
      <!-- 项目基本信息 -->
      <div class="section-title">项目基本信息</div>
      <el-descriptions :column="3" border>
        <el-descriptions-item label="项目名称">{{ projectDetail.projectName }}</el-descriptions-item>
        <el-descriptions-item label="项目ID">{{ projectDetail.projectId }}</el-descriptions-item>
        <el-descriptions-item label="合同状态">
          <el-tag :type="getStatusType(projectDetail.status)" size="small">
            {{ projectDetail.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="业主单位">{{ projectDetail.ownerName }}</el-descriptions-item>
        <el-descriptions-item label="委托单位">{{ projectDetail.entrustName }}</el-descriptions-item>
        <el-descriptions-item label="合同金额">{{ projectDetail.contractAmount }}</el-descriptions-item>
        <el-descriptions-item label="服务开始日期">{{ projectDetail.startDate }}</el-descriptions-item>
        <el-descriptions-item label="服务结束日期">{{ projectDetail.endDate }}</el-descriptions-item>
        <el-descriptions-item label="剩余天数">
          <span style="color: #409eff; font-weight: bold">{{ projectDetail.remainingDays }}天</span>
        </el-descriptions-item>
        <el-descriptions-item label="续签状态">
          <el-tag :type="getRenewStatusType(projectDetail.renewStatus)" size="small">
            {{ projectDetail.renewStatus }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ projectDetail.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ projectDetail.updateTime }}</el-descriptions-item>
      </el-descriptions>

      <!-- 项目详细信息表格 -->
      <div class="section-title" style="margin-top: 24px;">详细信息</div>
      <el-table
        :data="[projectDetail]"
        border
        style="width: 100%; margin-top: 16px"
        :header-cell-style="{ fontWeight: 'bold', fontSize: '15px' }"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="projectName" label="项目名称" align="center" />
        <el-table-column prop="projectId" label="项目ID" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="ownerName" label="业主单位名称" align="center" />
        <el-table-column prop="entrustName" label="委托单位" align="center" />
        <el-table-column prop="status" label="当前服务状态" align="center">
          <template slot-scope="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="serviceDate" label="合同服务日期" align="center" />
        <el-table-column prop="remainingDays" label="剩余天数" align="center">
          <template slot-scope="{ row }">
            <span style="color: #409eff; font-weight: bold">{{ row.remainingDays }}天</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="{ row }">
            <el-link type="primary" @click="viewMoreDetail(row)">更多详情</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 悬浮设置按钮 -->
    <el-button class="setting-btn" type="primary" icon="el-icon-setting" circle title="设置" @click="onSetting" />
  </div>
</template>

<script>
import { fetchProjectDetail } from '@/api/contract'

export default {
  name: 'UnitDetail',
  data() {
    return {
      projectDetail: {
        projectName: '',
        projectId: '',
        ownerName: '',
        entrustName: '',
        status: '',
        serviceDate: '',
        contractAmount: '',
        startDate: '',
        endDate: '',
        remainingDays: 0,
        renewStatus: '',
        createTime: '',
        updateTime: ''
      },
      loading: false,
      contractId: null
    }
  },
  mounted() {
    this.loadDetail()
  },
  methods: {
    // 获取状态标签类型
    getStatusType(status) {
      const statusMap = {
        '服务中': 'success',
        '已到期': 'danger',
        '待开始': 'warning',
        '已终止': 'info'
      }
      return statusMap[status] || 'info'
    },
    // 获取续签状态标签类型
    getRenewStatusType(status) {
      const statusMap = {
        '待续签': 'warning',
        '可续签': 'primary',
        '已续签': 'success',
        '未续签': 'info'
      }
      return statusMap[status] || 'info'
    },
    // 计算剩余天数
    getRemainingDays(endDate) {
      if (!endDate) return 0
      const end = new Date(endDate)
      const now = new Date()
      const diff = Math.ceil((end - now) / (1000 * 3600 * 24))
      return diff > 0 ? diff : 0
    },
    // 格式化日期
    formatDate(dateString) {
      if (!dateString) return ''
      return dateString.slice(0, 10)
    },
    // 查看更多详情
    viewMoreDetail(row) {
      this.$router.push({
        name: 'ContractDetailView',
        query: { id: this.contractId }
      })
    },
    // 加载详情数据
    async loadDetail() {
      const id = this.$route.query.id
      if (!id) {
        this.$message.error('未传入项目ID')
        setTimeout(() => {
          this.$router.back()
        }, 1000)
        return
      }
      
      this.contractId = id
      this.loading = true
      try {
        const res = await fetchProjectDetail(id)
        if (res.success && res.data) {
          const item = res.data
          
          // 计算剩余天数
          const remainingDays = this.getRemainingDays(item.endDate)
          
          this.projectDetail = {
            projectName: item.project?.name || item.name || '未知项目',
            projectId: item.project?._id || item._id || '',
            ownerName: item.project?.ownerCompany || item.ownerName || '',
            entrustName: item.clientCompany || '',
            status: item.status || '未知状态',
            serviceDate: item.startDate && item.endDate
              ? `${this.formatDate(item.startDate)} 至 ${this.formatDate(item.endDate)}`
              : '',
            contractAmount: item.amount ? `￥${item.amount.toLocaleString()}` : '未设置',
            startDate: this.formatDate(item.startDate) || '',
            endDate: this.formatDate(item.endDate) || '',
            remainingDays: remainingDays,
            renewStatus: item.renewStatus || '未续签',
            createTime: this.formatDate(item.createdAt) || '',
            updateTime: this.formatDate(item.updatedAt) || ''
          }
        } else {
          this.$message.error(res.message || '获取详情失败')
          // 如果获取失败，显示默认数据
          this.projectDetail = {
            projectName: '数据获取失败',
            projectId: '',
            ownerName: '',
            entrustName: '',
            status: '未知',
            serviceDate: '',
            contractAmount: '',
            startDate: '',
            endDate: '',
            remainingDays: 0,
            renewStatus: '未知',
            createTime: '',
            updateTime: ''
          }
        }
      } catch (e) {
        console.error('加载详情失败:', e)
        this.$message.error('网络异常或接口出错')
        // 显示错误状态的数据
        this.projectDetail = {
          projectName: '网络错误',
          projectId: '',
          ownerName: '',
          entrustName: '',
          status: '错误',
          serviceDate: '',
          contractAmount: '',
          startDate: '',
          endDate: '',
          remainingDays: 0,
          renewStatus: '错误',
          createTime: '',
          updateTime: ''
        }
      }
      this.loading = false
    },
    // 设置按钮
    onSetting() {
      this.$message.info('设置功能开发中...')
    }
  }
}
</script>

<style scoped>
.unit-detail-page {
  min-height: 100vh;
  background: #fff;
  padding: 24px 24px 0 24px;
  position: relative;
}

.breadcrumb-bar {
  margin-bottom: 18px;
}

.back-btn {
  position: absolute;
  right: 48px;
  top: 22px;
  z-index: 5;
}

.setting-btn {
  position: fixed;
  right: 32px;
  top: 320px;
  z-index: 10;
  box-shadow: 0 2px 8px #87b7fd33;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 16px;
  padding-left: 8px;
  border-left: 4px solid #409eff;
}

/* 描述列表样式优化 */
:deep(.el-descriptions__label) {
  font-weight: bold;
  color: #606266;
}

:deep(.el-descriptions__content) {
  color: #303133;
}
</style>
