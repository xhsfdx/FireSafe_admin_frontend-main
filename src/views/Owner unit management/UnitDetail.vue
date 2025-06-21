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
      <!-- 只展示一条数据 -->
      <el-table
        :data="[tableData]"
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
            <span style="color:#409eff">{{ row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="serviceDate" label="合同服务日期" align="center" />
        <!-- 新增操作列 -->
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="{ row }">
            <el-link type="primary" @click="viewDetail(row)">详情</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 悬浮设置按钮 -->
    <el-button class="setting-btn" type="primary" icon="el-icon-setting" circle title="设置" @click="onSetting" />
  </div>
</template>

<script>
import { fetchProjectDetail } from '@/api/contract' // 路径按实际调整

export default {
  name: 'UnitDetail',
  data() {
    return {
      tableData: {
        projectName: '',
        projectId: '',
        ownerName: '',
        entrustName: '',
        status: '',
        serviceDate: ''
      },
      loading: false
    }
  },
  mounted() {
    this.loadDetail()
  },
  methods: {
    viewDetail(row) {
      this.$router.push({
        name: 'Detail',
        query: { id: row.projectId }
      })
    },
    async loadDetail() {
      const id = this.$route.query.id
      if (!id) {
        this.$message.error('未传入项目ID')
        setTimeout(() => {
          this.$router.back()
        }, 1000)
        return
      }
      this.loading = true
      try {
        const res = await fetchProjectDetail(id)
        if (res.success && res.data) {
          const item = res.data
          this.tableData = {
            projectName: item.project?.name || item.name || '',
            projectId: item.project?._id || item._id || '',
            ownerName: item.project?.ownerCompany || item.ownerName || '',
            entrustName: item.clientCompany || '',
            status: item.status || '',
            serviceDate: item.startDate && item.endDate
              ? `${item.startDate.slice(0,10)}至${item.endDate.slice(0,10)}`
              : ''
          }
        } else {
          this.$message.error(res.message || '获取详情失败')
        }
      } catch (e) {
        this.$message.error('网络异常或接口出错')
      }
      this.loading = false
    },
    onSetting() {
      this.$message.info('设置')
    },
    handleDetail(row) {
      // 这里自定义操作，比如弹窗、跳转等
      this.$message.info(`点击详情：${row.projectName}`)
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
</style>
