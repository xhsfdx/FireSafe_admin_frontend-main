<template>
  <div class="fault-list-detail-page">
    <!-- 悬浮设置按钮 -->
    <el-button
      class="setting-btn"
      type="primary"
      icon="el-icon-setting"
      circle
      @click="onSetting"
    />
    <el-table
      :data="tableData"
      border
      style="width: 100%; margin-top: 12px;"
      :header-cell-style="{fontWeight:'bold',fontSize:'15px'}"
      empty-text="暂无数据"
    >
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="reportTime" label="上报时间" align="center" />
      <el-table-column prop="system" label="消防系统/设施" align="center" />
      <el-table-column prop="project" label="项目" align="center" />
      <el-table-column prop="reporter.name" label="上报人员" align="center" />
      <el-table-column label="操作" align="center" width="120">
        <template slot-scope="{ row }">
          <el-link type="primary" @click="viewDetail(row)">详情</el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getFaultRecords } from '@/api/faultRecord'

export default {
  name: 'FaultListDetailPage',
  data() {
    return {
      // 为空数组即“暂无数据”效果
      taskId: null,
      tableData: [],
      loading: false,
      pagination: {
        page: 1,
        limit: 10,
        total: 0
      }
    }
  },
  mounted() {
    this.taskId = this.$route.query.taskId
    this.loadData()
  },
  methods: {
    // 加载数据
    async loadData() {
      this.loading = true
      try {
        const params = {
          page: this.pagination.page,
          limit: this.pagination.limit,
          taskId: this.taskId
        }

        const res = await getFaultRecords(params)
        if (res.success) {
          this.tableData = res.data || []
          if (res.pagination) {
            this.pagination.total = res.pagination.total
            this.pagination.page = res.pagination.page
            this.pagination.limit = res.pagination.limit
          }
        } else {
          this.tableData = []
          this.pagination.total = 0
          this.$message.error(res.message || '获取数据失败')
        }
      } catch (e) {
        this.tableData = []
        this.pagination.total = 0
        this.$message.error('网络异常或接口出错')
      }
      this.loading = false
    },
    viewDetail(row) {
      this.$router.push({
        name: 'FaultOrderDetail',
        params: { id: row._id }
      })
    },
    onSetting() {
      this.$message.info('设置')
    }
  }
}
</script>

<style scoped>
.fault-list-detail-page {
  background: #fff;
  min-height: 80vh;
  position: relative;
}
.setting-btn {
  position: fixed;
  right: 32px;
  top: 320px;
  z-index: 10;
  box-shadow: 0 2px 8px #87b7fd33;
}
</style>
