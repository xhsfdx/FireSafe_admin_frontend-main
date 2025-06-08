<template>
  <div class="work-order-page">
    <!-- 查询栏 -->
    <div class="search-bar">
      <el-input
        v-model="filters.projectName"
        placeholder="输入项目名称搜索"
        style="width: 220px; margin-right: 10px"
        clearable
      />
      <el-input v-model="filters.owner" placeholder="输入当前所属人搜索" style="width: 220px; margin-right: 10px" clearable />
      <el-input v-model="filters.reporter" placeholder="输入上报人员" style="width: 180px; margin-right: 10px" clearable />
      <el-select v-model="filters.source" placeholder="选择故障来源" style="width: 180px; margin-right: 10px" clearable>
        <el-option label="例行转故障" value="例行转故障" />
        <el-option label="人工上报" value="人工上报" />
      </el-select>
      <el-select v-model="filters.status" placeholder="选择工单状态" style="width: 180px; margin-right: 10px" clearable>
        <el-option label="已完成" value="已完成" />
        <el-option label="未完成" value="未完成" />
      </el-select>
      <el-select v-model="filters.timeliness" placeholder="选择工单时效" style="width: 180px; margin-right: 10px" clearable>
        <el-option label="已逾期" value="已逾期" />
        <el-option label="正常" value="正常" />
      </el-select>
      <el-button type="primary" icon="el-icon-search" style="margin-right:8px" @click="onSearch">查询</el-button>
      <el-button icon="el-icon-refresh" @click="onReset">重置</el-button>
    </div>

    <!-- 表格 -->
    <el-table
      :data="pagedData"
      border
      style="width: 100%; margin-top: 12px;"
      :header-cell-style="{ fontWeight: 'bold', fontSize: '15px' }"
    >
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="projectName" label="项目名称" align="center" />
      <el-table-column prop="reportTime" label="上报时间" align="center" />
      <el-table-column prop="source" label="工单来源" align="center" />
      <el-table-column prop="reporter" label="上报人员" align="center" />
      <el-table-column label="工单时效" align="center">
        <template slot-scope="{ row }">
          <span :style="row.timeliness === '已逾期' ? 'color:#ff4d1a;font-weight:bold' : 'color:#39c271;font-weight:bold'">
            {{ row.timeliness }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="工单状态" align="center">
        <template slot-scope="{ row }">
          <span :style="row.status === '已完成' ? 'color:#39c271;font-weight:bold' : 'color:#ff4d1a;font-weight:bold'">
            {{ row.status }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="owner" label="当前所属人" align="center" />
      <el-table-column label="操作" width="190" align="center">
        <template slot-scope="{ row }">
          <el-link type="primary" @click="viewDetail(row)">详情</el-link>
          <el-link style="margin-left:10px;color:#18b7fc" @click="viewFaultOrderReport(row)">报告预览</el-link>
          <el-link style="margin-left:10px;color:#ff4d1a" @click="onDelete(row)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 底部统计和分页 -->
    <div class="footer-bar">
      <span>共查询到 {{ filteredData.length }} 条</span>
      <el-pagination
        small
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :current-page.sync="currentPage"
        :total="filteredData.length"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 悬浮设置按钮（可注释掉） -->
    <el-button class="setting-btn" type="primary" icon="el-icon-setting" circle @click="onSetting" />
  </div>
</template>

<script>
export default {
  name: 'WorkOrderPage',
  data() {
    return {
      filters: {
        projectName: '',
        owner: '',
        reporter: '',
        source: '',
        status: '',
        timeliness: ''
      },
      tableData: [
        {
          projectName: '高坪汽车站',
          reportTime: '2025-04-20 14:50:38',
          source: '例行转故障',
          reporter: '邱峰',
          timeliness: '已逾期',
          status: '已完成',
          owner: '邱峰'
        }
      ],
      filteredData: [],
      pagedData: [],
      currentPage: 1,
      pageSize: 10
    }
  },
  watch: {
    currentPage() {
      this.updatePagedData()
    }
  },
  created() {
    this.filteredData = this.tableData
    this.updatePagedData()
  },
  methods: {
    onSearch() {
      // 这里只做演示过滤，你可以改成实际接口
      this.filteredData = this.tableData.filter(item => {
        return (!this.filters.projectName || item.projectName.includes(this.filters.projectName)) &&
          (!this.filters.owner || item.owner.includes(this.filters.owner)) &&
          (!this.filters.reporter || item.reporter.includes(this.filters.reporter)) &&
          (!this.filters.source || item.source === this.filters.source) &&
          (!this.filters.status || item.status === this.filters.status) &&
          (!this.filters.timeliness || item.timeliness === this.filters.timeliness)
      })
      this.currentPage = 1
      this.updatePagedData()
    },
    onReset() {
      this.filters = { projectName: '', owner: '', reporter: '', source: '', status: '', timeliness: '' }
      this.filteredData = this.tableData
      this.currentPage = 1
      this.updatePagedData()
    },
    updatePagedData() {
      const start = (this.currentPage - 1) * this.pageSize
      this.pagedData = this.filteredData.slice(start, start + this.pageSize)
    },
    handlePageChange(page) {
      this.currentPage = page
      this.updatePagedData()
    },
    viewDetail(row) {
      // 跳转并携带工单id（这里假设 row 里有 orderId 或 id 字段）
      this.$router.push({
        name: 'FaultOrderDetail',
        params: { id: row.taskId } // 或 row.id，看你的实际字段名
      })
    },
    viewFaultOrderReport(row) {
      // 你可以让 row 里提前配置 reportUrl，也可以写死
      const url = row.reportUrl || '/FaultOrderReports/高坪汽车站消防维保服务故障维修记录表668939350289752064.pdf'
      window.open(url, '_blank')
    },
    onDelete(row) {
      this.$message.warning('删除')
    },
    onSetting() {
      this.$message.info('设置')
    }
  }
}
</script>

<style scoped>
.work-order-page {
  min-height: 100vh;
  background: #fff;
  padding: 10px 12px 0 10px;
  position: relative;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.footer-bar {
  height: 48px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  background: #fff;
  padding: 0 36px 0 0;
  box-shadow: 0 -2px 6px -4px #eee;
  z-index: 10;
  margin-top: 16px;
}

.setting-btn {
  position: fixed;
  right: 32px;
  top: 320px;
  z-index: 10;
  box-shadow: 0 2px 8px #87b7fd33;
}
</style>
